// ============================================================
// FUNNEL CONFIG — the single file you edit per client.
// Everything brandable, legal, or client-specific lives here.
// ============================================================

export const brand = {
  // Company
  name: 'Meridian Capital Lending',        // client company name
  shortName: 'Meridian',                    // used in tight spots
  nmls: 'NMLS #0000000',                    // company NMLS line
  phone: '(866) 555-0140',
  phoneHref: 'tel:+18665550140',
  address: '100 Main Street, Suite 400, Anytown, USA',
  licensingUrl: 'https://www.nmlsconsumeraccess.org',

  // Social proof (verify per client before launch)
  googleRating: '4.9',
  googleReviewCount: '106',
  investorsChecked: '2,800+',
  fundedVolume: '$180M+',
  avgDaysToClose: 14,
  lenderCount: '100+',

  // Where the form submits (server-side forward target).
  // Set LEAD_WEBHOOK_URL in the environment; this is just the doc pointer.

  // Thank-you page booking embed. Leave '' to hide calendar and show phone CTA.
  bookingEmbedUrl: '',

  // Google Ads conversion (fires on thank-you). Leave '' to disable.
  gtagId: '',            // e.g. 'AW-XXXXXXXXXX'
  gtagConversion: '',    // e.g. 'AW-XXXXXXXXXX/AbC-D_efGhIjKlMnOp'

  // Loan officer / specialist shown on thank-you page
  specialist: {
    name: 'Your Loan Specialist',
    title: 'DSCR Loan Advisor',
    nmls: 'NMLS #000000',
  },
};

// ---------- form option sets ----------

export const goals = [
  {
    value: 'purchase',
    label: 'Buy a rental',
    sub: 'Purchase an investment property',
    icon: ['M3 10.5 12 3l9 7.5', 'M5 9.5V21h14V9.5', 'M9.5 21v-6h5v6'],
  },
  {
    value: 'refinance',
    label: 'Refinance',
    sub: 'Improve my rate or terms',
    icon: ['M21 2v6h-6', 'M3 12a9 9 0 0 1 15-6.7L21 8', 'M3 22v-6h6', 'M21 12a9 9 0 0 1-15 6.7L3 16'],
  },
  {
    value: 'cashout',
    label: 'Pull cash out',
    sub: 'Tap equity for the next deal',
    icon: ['M12 2v20', 'M17 6.5H9.5a3.25 3.25 0 0 0 0 6.5h5a3.25 3.25 0 0 1 0 6.5H6'],
  },
  {
    value: 'bridge',
    label: 'Fix & flip / bridge',
    sub: 'Short-term or rehab money',
    icon: ['m14 6 8 8-2.5 2.5-8-8z', 'M12.5 7.5 10 5C8 3 5 3 3 5l4.5 4.5', 'm2 22 7.5-7.5'],
  },
] as const;

export const propertyTypes = [
  { value: 'sfr', label: 'Single family' },
  { value: '2-4', label: '2–4 units' },
  { value: '5-9', label: '5–9 units' },
  { value: '10+', label: '10+ units' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
] as const;

export const creditBands = [
  { value: '740+', label: '740+', note: 'Excellent' },
  { value: '700-739', label: '700–739', note: 'Great' },
  { value: '660-699', label: '660–699', note: 'Good' },
  { value: '620-659', label: '620–659', note: 'Fair' },
  { value: '<620', label: 'Below 620', note: '' },
] as const;

// Minimum credit gate. Selecting below this shows the soft-stop screen.
export const MIN_CREDIT = 620;

export const usStates = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

// TCPA consent copy (shown at the phone step; keep legal team happy)
export const tcpaCopy =
  `By continuing you expressly consent to having ${brand.name} contact you about your inquiry by email, text message, or phone call to the number you provided, even if it is on a Do Not Call registry. Message and data rates may apply. Consent is not a condition of receiving services and can be revoked at any time.`;

// Deal ticker — recently funded strip (edit per client, or leave generic)
export const fundedDeals = [
  { amount: '$412,000', type: 'SFR', where: 'Tampa, FL', dscr: '1.34×', days: 16 },
  { amount: '$1.28M', type: '8-unit', where: 'Columbus, OH', dscr: '1.21×', days: 21 },
  { amount: '$267,500', type: 'Duplex', where: 'Kansas City, MO', dscr: '1.42×', days: 12 },
  { amount: '$730,000', type: 'STR cabin', where: 'Sevierville, TN', dscr: '1.55×', days: 18 },
  { amount: '$389,000', type: 'SFR', where: 'Phoenix, AZ', dscr: '1.18×', days: 15 },
  { amount: '$952,000', type: '4-plex', where: 'Charlotte, NC', dscr: '1.29×', days: 19 },
];

export const reviews = [
  {
    quote: 'They qualified me on the rent, not my W-2. Three properties financed in nine months and every close hit the date they promised.',
    name: 'Marcus T.',
    detail: 'Portfolio investor · 7 doors',
  },
  {
    quote: 'The entire process was incredibly efficient. I had term sheets in hours, not weeks.',
    name: 'Sarah K.',
    detail: 'First rental property',
  },
  {
    quote: 'Refinanced with much better rates than my bank offered. No tax returns, no circus.',
    name: 'Sergey R.',
    detail: 'Cash-out refinance',
  },
];

export const faqs = [
  {
    q: 'Is it harder to get approved as a real estate investor?',
    a: 'Not with a DSCR loan. Traditional lenders underwrite your personal income; DSCR lenders underwrite the property. If the rent covers the mortgage payment, you qualify, no W-2s, pay stubs, or tax returns required.',
  },
  {
    q: 'What credit score do I need?',
    a: 'Most programs start at 620, and pricing improves meaningfully at 680 and again at 740. A 680+ score with 20–25% down puts you in the most competitive tier.',
  },
  {
    q: 'How is the DSCR calculated?',
    a: 'Monthly rent divided by the full monthly payment (principal, interest, taxes, insurance, and any HOA). A ratio of 1.0 means the rent exactly covers the payment; most lenders want 1.0–1.25 or better, and stronger ratios earn better rates.',
  },
  {
    q: 'Can I close in an LLC?',
    a: 'Yes, most investors do. DSCR loans are built for LLC vesting, and closing in an entity does not affect your rate.',
  },
  {
    q: 'How fast can I close?',
    a: 'Two to three weeks is typical because there is no income documentation to verify. An appraisal with a rent schedule is usually the longest step.',
  },
  {
    q: 'Do short-term rentals qualify?',
    a: 'Yes. Many programs will qualify Airbnb and VRBO properties using either market rent or documented short-term rental income.',
  },
];
