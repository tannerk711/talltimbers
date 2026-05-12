/**
 * Vercel Edge Function: Property URL analyzer.
 * Accepts a Zillow/Redfin/Realtor URL or address string.
 * Uses RentCast API to fetch property data and rent estimates.
 *
 * POST /api/analyze-property
 * Body: { url: string } or { address: string }
 * Returns: { address, price, beds, baths, sqft, estimatedRent, propertyType, state, city, photo }
 */

export const prerender = false;

import type { APIRoute } from 'astro';

interface PropertyData {
  address: string;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  estimatedRent: number | null;
  propertyType: string | null;
  state: string | null;
  city: string | null;
  photo: string | null;
}

// Extract address from common real estate URLs
function extractAddressFromURL(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    // Zillow: /homedetails/123-Main-St-City-ST-12345/12345_zpid/
    if (hostname.includes('zillow.com')) {
      const match = parsed.pathname.match(/\/homedetails\/([^/]+)\//);
      if (match) {
        return match[1]
          .replace(/-/g, ' ')
          .replace(/\s+\d+\s*zpid.*$/i, '')
          .trim();
      }
    }

    // Redfin: /STATE/City/Address-12345
    if (hostname.includes('redfin.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length >= 3) {
        return parts.slice(1).join(' ').replace(/-/g, ' ').trim();
      }
    }

    // Realtor.com: /realestateandhomes-detail/123-Main-St_City_ST_12345
    if (hostname.includes('realtor.com')) {
      const match = parsed.pathname.match(/\/realestateandhomes-detail\/([^/]+)/);
      if (match) {
        return match[1].replace(/[_-]/g, ' ').trim();
      }
    }

    // Trulia: /p/STATE/City/Address-12345
    if (hostname.includes('trulia.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length >= 3) {
        return parts.slice(1).join(' ').replace(/-/g, ' ').trim();
      }
    }
  } catch {
    // Invalid URL
  }
  return null;
}

// Fetch property data from RentCast API
async function fetchFromRentCast(address: string, apiKey: string): Promise<PropertyData | null> {
  try {
    // RentCast property records endpoint
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.rentcast.io/v1/properties?address=${encodedAddress}`,
      {
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`RentCast property API returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    const property = Array.isArray(data) ? data[0] : data;

    if (!property) return null;

    // Now fetch rent estimate
    let estimatedRent: number | null = null;
    try {
      const rentResponse = await fetch(
        `https://api.rentcast.io/v1/avm/rent/long-term?address=${encodedAddress}`,
        {
          headers: {
            'X-Api-Key': apiKey,
            'Accept': 'application/json',
          },
        }
      );

      if (rentResponse.ok) {
        const rentData = await rentResponse.json();
        estimatedRent = rentData.rent ?? rentData.rentRangeLow ?? null;
      }
    } catch {
      // Rent estimate failed, continue without it
    }

    return {
      address: property.formattedAddress || property.addressLine1 || address,
      price: property.price || property.lastSalePrice || null,
      beds: property.bedrooms ?? null,
      baths: property.bathrooms ?? null,
      sqft: property.squareFootage ?? null,
      estimatedRent,
      propertyType: mapRentCastPropertyType(property.propertyType),
      state: property.state ?? null,
      city: property.city ?? null,
      photo: null, // RentCast doesn't provide photos
    };
  } catch (error) {
    console.error('RentCast API error:', error);
    return null;
  }
}

function mapRentCastPropertyType(type: string | undefined): string | null {
  if (!type) return null;
  const lower = type.toLowerCase();
  if (lower.includes('single') || lower === 'sfr') return 'single_family';
  if (lower.includes('multi') || lower.includes('duplex') || lower.includes('triplex')) return 'multi_family_small';
  if (lower.includes('condo') || lower.includes('townhouse')) return 'condo';
  return 'single_family';
}

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
  };

  try {
    const body = await request.json();
    const { url, address: directAddress } = body as { url?: string; address?: string };

    if (!url && !directAddress) {
      return new Response(
        JSON.stringify({ error: 'Either url or address is required' }),
        { status: 400, headers }
      );
    }

    const apiKey = import.meta.env.RENTCAST_API_KEY;

    // If no API key, return a helpful error so the client can fall back to Quick Analyze
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API_KEY_MISSING', message: 'Property lookup is not configured. Use manual entry.' }),
        { status: 503, headers }
      );
    }

    // Extract address from URL or use direct address
    let address = directAddress;
    if (url) {
      address = extractAddressFromURL(url);
      if (!address) {
        return new Response(
          JSON.stringify({ error: 'Could not extract address from URL. Try pasting the property address instead.' }),
          { status: 400, headers }
        );
      }
    }

    if (!address) {
      return new Response(
        JSON.stringify({ error: 'No address provided' }),
        { status: 400, headers }
      );
    }

    const propertyData = await fetchFromRentCast(address, apiKey);

    if (!propertyData) {
      return new Response(
        JSON.stringify({ error: 'PROPERTY_NOT_FOUND', message: 'Could not find property data. Try entering details manually.' }),
        { status: 404, headers }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: propertyData }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Analyze property error:', error);
    return new Response(
      JSON.stringify({ error: 'INTERNAL_ERROR', message: 'Something went wrong. Try entering details manually.' }),
      { status: 500, headers }
    );
  }
};
