// Tall Timbers is single-broker: Adam Cunningham handles every lead regardless of state.
// There is no per-state routing. This file only holds display names, the covered-states
// list, and form formatting helpers.
//
// States excluded from the form (network does not currently cover). Set 2026-04-27.
const EXCLUDED_STATES = new Set(['HI', 'NY', 'NM', 'OH', 'MI', 'LA', 'ND', 'SD', 'AK', 'MS', 'MO', 'UT', 'MT']);

// Full state names for display
export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

// States list for dropdown (sorted by full name, excludes states the network doesn't cover)
export const STATES_LIST = Object.entries(STATE_NAMES)
  .filter(([abbr]) => !EXCLUDED_STATES.has(abbr))
  .map(([abbr, name]) => ({ value: abbr, label: name }))
  .sort((a, b) => a.label.localeCompare(b.label));

// Property type display names
export const PROPERTY_TYPE_NAMES: Record<string, string> = {
  single_family: 'Single-Family Rental',
  warrantable_condo: 'Warrantable Condo',
  non_warrantable_condo: 'Non-Warrantable Condo',
  multi_family_small: 'Multi-Family Property (2-4 Units)',
  multi_family_large: 'Multi-Family Property (5+ Units)',
  // Legacy types still referenced by program pages and historic submissions:
  str: 'Short-Term Rental',
  mixed_use: 'Mixed-Use Property',
  portfolio: 'Portfolio (Multiple Properties)',
};

// Phone formatting
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function formatPhoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+1${digits}`;
}

// Device type detection
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
