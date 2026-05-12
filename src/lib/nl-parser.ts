/**
 * Natural language parser for Deal Analyzer.
 * Extracts property details from free-text input like:
 * - "400K duplex in Phoenix, rents $3200/mo"
 * - "3BR in Atlanta, $350K, rents for $2,600"
 * - "$500K condo in Miami, 25% down, rent $3000"
 */

export interface ParsedProperty {
  propertyValue: number | null;
  monthlyRent: number | null;
  downPaymentPercent: number | null;
  propertyType: string | null;
  state: string | null;
  city: string | null;
  bedrooms: number | null;
  confidence: 'high' | 'medium' | 'low';
}

// State name/abbreviation lookup
const STATE_MAP: Record<string, string> = {
  'alabama': 'AL', 'al': 'AL',
  'alaska': 'AK', 'ak': 'AK',
  'arizona': 'AZ', 'az': 'AZ',
  'arkansas': 'AR', 'ar': 'AR',
  'california': 'CA', 'ca': 'CA',
  'colorado': 'CO', 'co': 'CO',
  'connecticut': 'CT', 'ct': 'CT',
  'delaware': 'DE', 'de': 'DE',
  'florida': 'FL', 'fl': 'FL',
  'georgia': 'GA', 'ga': 'GA',
  'hawaii': 'HI', 'hi': 'HI',
  'idaho': 'ID', 'id': 'ID',
  'illinois': 'IL', 'il': 'IL',
  'indiana': 'IN', 'in': 'IN',
  'iowa': 'IA', 'ia': 'IA',
  'kansas': 'KS', 'ks': 'KS',
  'kentucky': 'KY', 'ky': 'KY',
  'louisiana': 'LA', 'la': 'LA',
  'maine': 'ME', 'me': 'ME',
  'maryland': 'MD', 'md': 'MD',
  'massachusetts': 'MA', 'ma': 'MA',
  'michigan': 'MI', 'mi': 'MI',
  'minnesota': 'MN', 'mn': 'MN',
  'mississippi': 'MS', 'ms': 'MS',
  'missouri': 'MO', 'mo': 'MO',
  'montana': 'MT', 'mt': 'MT',
  'nebraska': 'NE', 'ne': 'NE',
  'nevada': 'NV', 'nv': 'NV',
  'new hampshire': 'NH', 'nh': 'NH',
  'new jersey': 'NJ', 'nj': 'NJ',
  'new mexico': 'NM', 'nm': 'NM',
  'new york': 'NY', 'ny': 'NY',
  'north carolina': 'NC', 'nc': 'NC',
  'north dakota': 'ND', 'nd': 'ND',
  'ohio': 'OH', 'oh': 'OH',
  'oklahoma': 'OK', 'ok': 'OK',
  'oregon': 'OR', 'or': 'OR',
  'pennsylvania': 'PA', 'pa': 'PA',
  'rhode island': 'RI', 'ri': 'RI',
  'south carolina': 'SC', 'sc': 'SC',
  'south dakota': 'SD', 'sd': 'SD',
  'tennessee': 'TN', 'tn': 'TN',
  'texas': 'TX', 'tx': 'TX',
  'utah': 'UT', 'ut': 'UT',
  'vermont': 'VT', 'vt': 'VT',
  'virginia': 'VA', 'va': 'VA',
  'washington': 'WA', 'wa': 'WA',
  'west virginia': 'WV', 'wv': 'WV',
  'wisconsin': 'WI', 'wi': 'WI',
  'wyoming': 'WY', 'wy': 'WY',
  'district of columbia': 'DC', 'dc': 'DC',
  'washington dc': 'DC', 'washington d.c.': 'DC',
};

// Major cities to state mapping (top 200+ cities)
const CITY_TO_STATE: Record<string, string> = {
  'phoenix': 'AZ', 'tucson': 'AZ', 'scottsdale': 'AZ', 'mesa': 'AZ', 'chandler': 'AZ', 'tempe': 'AZ', 'gilbert': 'AZ',
  'los angeles': 'CA', 'san francisco': 'CA', 'san diego': 'CA', 'san jose': 'CA', 'sacramento': 'CA', 'fresno': 'CA', 'oakland': 'CA', 'long beach': 'CA', 'anaheim': 'CA', 'irvine': 'CA', 'riverside': 'CA',
  'denver': 'CO', 'colorado springs': 'CO', 'aurora': 'CO', 'boulder': 'CO',
  'miami': 'FL', 'orlando': 'FL', 'tampa': 'FL', 'jacksonville': 'FL', 'fort lauderdale': 'FL', 'st petersburg': 'FL', 'naples': 'FL', 'sarasota': 'FL', 'cape coral': 'FL', 'west palm beach': 'FL',
  'atlanta': 'GA', 'savannah': 'GA', 'augusta': 'GA',
  'honolulu': 'HI',
  'boise': 'ID',
  'chicago': 'IL', 'naperville': 'IL',
  'indianapolis': 'IN',
  'des moines': 'IA',
  'louisville': 'KY', 'lexington': 'KY',
  'new orleans': 'LA', 'baton rouge': 'LA',
  'baltimore': 'MD',
  'boston': 'MA', 'cambridge': 'MA',
  'detroit': 'MI', 'grand rapids': 'MI', 'ann arbor': 'MI',
  'minneapolis': 'MN', 'st paul': 'MN',
  'kansas city': 'MO', 'st louis': 'MO',
  'las vegas': 'NV', 'reno': 'NV', 'henderson': 'NV',
  'newark': 'NJ', 'jersey city': 'NJ',
  'albuquerque': 'NM', 'santa fe': 'NM',
  'new york': 'NY', 'nyc': 'NY', 'brooklyn': 'NY', 'manhattan': 'NY', 'queens': 'NY', 'bronx': 'NY', 'buffalo': 'NY', 'rochester': 'NY',
  'charlotte': 'NC', 'raleigh': 'NC', 'durham': 'NC', 'asheville': 'NC', 'greensboro': 'NC',
  'columbus': 'OH', 'cleveland': 'OH', 'cincinnati': 'OH', 'dayton': 'OH',
  'oklahoma city': 'OK', 'tulsa': 'OK',
  'portland': 'OR', 'eugene': 'OR',
  'philadelphia': 'PA', 'pittsburgh': 'PA',
  'charleston': 'SC', 'columbia': 'SC', 'greenville': 'SC', 'myrtle beach': 'SC',
  'nashville': 'TN', 'memphis': 'TN', 'knoxville': 'TN', 'chattanooga': 'TN',
  'austin': 'TX', 'houston': 'TX', 'dallas': 'TX', 'san antonio': 'TX', 'fort worth': 'TX', 'el paso': 'TX', 'plano': 'TX', 'arlington': 'TX', 'irving': 'TX', 'mckinney': 'TX', 'frisco': 'TX',
  'salt lake city': 'UT', 'provo': 'UT',
  'richmond': 'VA', 'virginia beach': 'VA', 'norfolk': 'VA', 'arlington va': 'VA',
  'seattle': 'WA', 'tacoma': 'WA', 'spokane': 'WA', 'bellevue': 'WA',
  'milwaukee': 'WI', 'madison': 'WI',
};

// Property type keywords
const PROPERTY_TYPE_PATTERNS: { pattern: RegExp; type: string }[] = [
  { pattern: /\b(sfr|single[\s-]?family|single[\s-]?fam|house)\b/i, type: 'single_family' },
  { pattern: /\b(duplex|2[\s-]?unit|two[\s-]?unit|2[\s-]?plex)\b/i, type: 'multi_family_small' },
  { pattern: /\b(triplex|3[\s-]?unit|three[\s-]?unit|3[\s-]?plex)\b/i, type: 'multi_family_small' },
  { pattern: /\b(fourplex|quadplex|4[\s-]?unit|four[\s-]?unit|4[\s-]?plex)\b/i, type: 'multi_family_small' },
  { pattern: /\b(multi[\s-]?family|multi[\s-]?unit|apartment|5\+?\s*unit|6\+?\s*unit|7\+?\s*unit|8\+?\s*unit)\b/i, type: 'multi_family_large' },
  { pattern: /\b(condo|condominium|condo[\s-]?unit)\b/i, type: 'condo' },
  { pattern: /\b(townhouse|townhome|town[\s-]?home)\b/i, type: 'condo' },
  { pattern: /\b(short[\s-]?term|str|airbnb|vrbo|vacation[\s-]?rental)\b/i, type: 'str' },
  { pattern: /\b(mixed[\s-]?use|commercial[\s-]?residential)\b/i, type: 'mixed_use' },
];

/**
 * Detect if input is a property URL.
 */
export function isPropertyURL(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  return (
    trimmed.includes('zillow.com') ||
    trimmed.includes('redfin.com') ||
    trimmed.includes('realtor.com') ||
    trimmed.includes('trulia.com')
  );
}

/**
 * Parse a dollar amount from text.
 * Handles: $400K, $400k, $400,000, 400000, 400K, $1.2M, $1.2m, 1.2 million
 */
function parseDollarAmount(text: string): number | null {
  // Match patterns like $400K, $400,000, 400K, $1.2M, etc.
  const patterns = [
    /\$\s*([\d,.]+)\s*m(?:illion)?/i,    // $1.2M, $1.2 million
    /\$\s*([\d,.]+)\s*k/i,                // $400K, $400k
    /\$\s*([\d,.]+)/,                      // $400,000 or $400000
    /([\d,.]+)\s*m(?:illion)?/i,           // 1.2M, 1.2 million (no $)
    /([\d,.]+)\s*k\b/i,                    // 400K, 400k (no $)
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ''));
      if (isNaN(num)) continue;
      if (/m(?:illion)?/i.test(match[0])) return num * 1_000_000;
      if (/k\b/i.test(match[0])) return num * 1_000;
      return num;
    }
  }
  return null;
}

/**
 * Extract property value from input.
 * Looks for contextual clues like "worth", "price", "listed at", "asking", or
 * the first/largest dollar amount in the string.
 */
function extractPropertyValue(input: string): number | null {
  // Try contextual patterns first
  const contextPatterns = [
    /(?:worth|price[d]?|list(?:ed)?|asking|valued?\s*(?:at)?|purchase|buy(?:ing)?)\s*(?:at|for|of|:)?\s*\$?\s*([\d,.]+)\s*([kmKM](?:illion)?)?/i,
    /\$\s*([\d,.]+)\s*([kmKM](?:illion)?)?\s*(?:home|house|property|condo|duplex|triplex|fourplex|unit)/i,
  ];

  for (const pattern of contextPatterns) {
    const match = input.match(pattern);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ''));
      if (isNaN(num)) continue;
      if (match[2] && /m/i.test(match[2])) return num * 1_000_000;
      if (match[2] && /k/i.test(match[2])) return num * 1_000;
      return num;
    }
  }

  // Find all dollar amounts and pick the largest (likely property value)
  const amounts: number[] = [];
  const dollarRegex = /\$\s*([\d,.]+)\s*([kmKM](?:illion)?)?/g;
  let match;
  while ((match = dollarRegex.exec(input)) !== null) {
    const num = parseFloat(match[1].replace(/,/g, ''));
    if (isNaN(num)) continue;
    let val = num;
    if (match[2] && /m/i.test(match[2])) val = num * 1_000_000;
    else if (match[2] && /k/i.test(match[2])) val = num * 1_000;
    amounts.push(val);
  }

  // Also check for amounts without $ sign followed by K/M
  const noSignRegex = /([\d,.]+)\s*([kKmM])\b/g;
  while ((match = noSignRegex.exec(input)) !== null) {
    const num = parseFloat(match[1].replace(/,/g, ''));
    if (isNaN(num)) continue;
    let val = num;
    if (/m/i.test(match[2])) val = num * 1_000_000;
    else if (/k/i.test(match[2])) val = num * 1_000;
    // Only add if not already captured by dollar regex
    if (!amounts.includes(val)) amounts.push(val);
  }

  if (amounts.length === 0) return null;

  // The largest amount is likely the property value (rent is always smaller)
  return Math.max(...amounts);
}

/**
 * Extract monthly rent from input.
 */
function extractRent(input: string): number | null {
  // Contextual patterns for rent
  const rentPatterns = [
    /(?:rent(?:s|ing|al)?|income|cash\s*flow|rev(?:enue)?)\s*(?:for|at|of|:|\s)\s*\$?\s*([\d,.]+)\s*([kK])?\s*(?:\/?\s*(?:mo(?:nth)?|per\s*month|monthly|pm|pcm))?/i,
    /\$\s*([\d,.]+)\s*([kK])?\s*\/?\s*(?:mo(?:nth)?|per\s*month|monthly|pm|pcm)/i,
    /(?:mo(?:nthly)?|per\s*month)\s*(?:rent(?:al)?|income)?\s*(?:of|:|\s)\s*\$?\s*([\d,.]+)\s*([kK])?/i,
  ];

  for (const pattern of rentPatterns) {
    const match = input.match(pattern);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ''));
      if (isNaN(num)) continue;
      if (match[2] && /k/i.test(match[2])) return num * 1_000;
      return num;
    }
  }

  return null;
}

/**
 * Extract down payment percentage.
 */
function extractDownPayment(input: string): number | null {
  const patterns = [
    /(\d{1,2})\s*%\s*down/i,
    /down\s*(?:payment)?\s*(?:of|:|\s)\s*(\d{1,2})\s*%/i,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const pct = parseInt(match[1], 10);
      if (pct >= 5 && pct <= 50) return pct;
    }
  }
  return null;
}

/**
 * Extract property type from input.
 */
function extractPropertyType(input: string): string | null {
  for (const { pattern, type } of PROPERTY_TYPE_PATTERNS) {
    if (pattern.test(input)) return type;
  }

  // Infer from bedroom count
  const brMatch = input.match(/(\d)\s*(?:br|bed(?:room)?s?|bd)\b/i);
  if (brMatch) {
    const beds = parseInt(brMatch[1], 10);
    if (beds <= 6) return 'single_family';
  }

  return null;
}

/**
 * Extract bedroom count.
 */
function extractBedrooms(input: string): number | null {
  const match = input.match(/(\d)\s*(?:br|bed(?:room)?s?|bd)\b/i);
  if (match) {
    const beds = parseInt(match[1], 10);
    if (beds >= 1 && beds <= 10) return beds;
  }
  return null;
}

/**
 * Extract location (city and/or state) from input.
 */
function extractLocation(input: string): { city: string | null; state: string | null } {
  const lower = input.toLowerCase();

  // Check for "in [City], [State]" or "in [City] [State]" patterns
  const inCityState = lower.match(/\bin\s+([a-z\s]+?),?\s+([a-z]{2})\b/);
  if (inCityState) {
    const potentialCity = inCityState[1].trim();
    const potentialState = inCityState[2].trim();
    if (STATE_MAP[potentialState]) {
      return {
        city: potentialCity.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        state: STATE_MAP[potentialState],
      };
    }
  }

  // Check for full state names
  for (const [name, abbr] of Object.entries(STATE_MAP)) {
    if (name.length > 2 && lower.includes(name)) {
      return { city: null, state: abbr };
    }
  }

  // Check for known cities
  // Sort by length (longest first) to match "salt lake city" before "lake city"
  const sortedCities = Object.entries(CITY_TO_STATE).sort((a, b) => b[0].length - a[0].length);
  for (const [city, stateAbbr] of sortedCities) {
    if (lower.includes(city)) {
      return {
        city: city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        state: stateAbbr,
      };
    }
  }

  // Check for 2-letter state abbreviation at end or after comma
  const stateAbbrMatch = lower.match(/,\s*([a-z]{2})\s*(?:\d{5})?$/);
  if (stateAbbrMatch && STATE_MAP[stateAbbrMatch[1]]) {
    return { city: null, state: STATE_MAP[stateAbbrMatch[1]] };
  }

  return { city: null, state: null };
}

/**
 * Main parser: extract property details from natural language input.
 */
export function parseNaturalLanguage(input: string): ParsedProperty {
  const propertyValue = extractPropertyValue(input);
  const monthlyRent = extractRent(input);
  const downPaymentPercent = extractDownPayment(input);
  const propertyType = extractPropertyType(input);
  const bedrooms = extractBedrooms(input);
  const { city, state } = extractLocation(input);

  // Determine confidence
  let fieldsFound = 0;
  if (propertyValue) fieldsFound++;
  if (monthlyRent) fieldsFound++;
  if (state) fieldsFound++;

  let confidence: ParsedProperty['confidence'];
  if (fieldsFound >= 3) confidence = 'high';
  else if (fieldsFound >= 2) confidence = 'medium';
  else confidence = 'low';

  return {
    propertyValue,
    monthlyRent,
    downPaymentPercent,
    propertyType,
    state,
    city,
    bedrooms,
    confidence,
  };
}

/**
 * Check if we have enough data to calculate DSCR.
 * Needs at minimum: property value + rent.
 */
export function hasEnoughData(parsed: ParsedProperty): boolean {
  return parsed.propertyValue !== null && parsed.monthlyRent !== null;
}
