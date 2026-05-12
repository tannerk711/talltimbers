// State-to-broker routing map
// Note: HI, NY, NM, OH, MI, LA, ND, SD, AK, MS, MO, UT, MT excluded from form (2026-04-27).
const STATE_TO_BROKER: Record<string, string> = {
  AL: 'broker_a', AR: 'broker_a', CT: 'broker_a',
  DE: 'broker_a', ID: 'broker_a', IN: 'broker_a',
  IA: 'broker_a', KS: 'broker_a', KY: 'broker_a', ME: 'broker_a',
  MN: 'broker_a',
  NE: 'broker_a', NH: 'broker_a', OR: 'broker_a',
  RI: 'broker_a', VT: 'broker_a', WI: 'broker_a',
  WY: 'broker_a',
  AZ: 'broker_b', CA: 'broker_b', CO: 'broker_b', NV: 'broker_b',
  WA: 'broker_b',
  FL: 'broker_c', GA: 'broker_c', NC: 'broker_c', SC: 'broker_c',
  TN: 'broker_c', VA: 'broker_c',
  TX: 'broker_d', OK: 'broker_d',
  MD: 'broker_d',
  NJ: 'broker_e', PA: 'broker_e', MA: 'broker_e',
  IL: 'broker_e', DC: 'broker_e', WV: 'broker_e',
};

// States excluded from the form (broker network does not currently cover).
const EXCLUDED_STATES = new Set(['HI', 'NY', 'NM', 'OH', 'MI', 'LA', 'ND', 'SD', 'AK', 'MS', 'MO', 'UT', 'MT']);

// Broker config with webhook URLs from env vars
interface BrokerConfig {
  webhookUrl: string;
  apiKey: string;
  fallbackEmail: string;
}

const BROKER_ENV_MAP: Record<string, { webhook: string; apiKey: string; email: string }> = {
  broker_a: { webhook: 'WEBHOOK_BROKER_A', apiKey: 'API_KEY_BROKER_A', email: 'EMAIL_BROKER_A' },
  broker_b: { webhook: 'WEBHOOK_BROKER_B', apiKey: 'API_KEY_BROKER_B', email: 'EMAIL_BROKER_B' },
  broker_c: { webhook: 'WEBHOOK_BROKER_C', apiKey: 'API_KEY_BROKER_C', email: 'EMAIL_BROKER_C' },
  broker_d: { webhook: 'WEBHOOK_BROKER_D', apiKey: 'API_KEY_BROKER_D', email: 'EMAIL_BROKER_D' },
  broker_e: { webhook: 'WEBHOOK_BROKER_E', apiKey: 'API_KEY_BROKER_E', email: 'EMAIL_BROKER_E' },
};

export function getBrokerForState(stateAbbr: string): string {
  return STATE_TO_BROKER[stateAbbr.toUpperCase()] || 'broker_a';
}

export function getBrokerConfig(brokerKey: string): BrokerConfig {
  const envMap = BROKER_ENV_MAP[brokerKey];
  if (!envMap) {
    return { webhookUrl: '', apiKey: '', fallbackEmail: '' };
  }
  return {
    webhookUrl: (typeof import.meta !== 'undefined' && (import.meta as any).env?.[envMap.webhook]) || '',
    apiKey: (typeof import.meta !== 'undefined' && (import.meta as any).env?.[envMap.apiKey]) || '',
    fallbackEmail: (typeof import.meta !== 'undefined' && (import.meta as any).env?.[envMap.email]) || '',
  };
}

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
