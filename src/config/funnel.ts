// ============================================================
// FUNNEL CONFIG: Tall Timbers Realty and Financial Services.
// Everything brandable, legal, or client-specific lives here.
// Locked numbers (per clients/tall-timbers/CLAUDE.md, 2026-05-25):
// 250+ DSCR/non-QM loans closed, 70+ lender network, phone
// (888) 931-0211, Adam C. Cunningham NMLS #312817. No close-day
// counts, no rate-shopping language, no "soft pull" claims.
// ============================================================

export const brand = {
  // Company
  name: 'Tall Timbers Realty and Financial Services',
  shortName: 'Tall Timbers',
  nmls: 'NMLS #312817',
  phone: '(888) 931-0211',
  phoneHref: 'tel:+18889310211',
  address: 'Atlanta, GA',
  licensingUrl: 'https://www.nmlsconsumeraccess.org',
  logo: '/images/tall-timbers-logo.png',

  // Social proof (locked numbers, do not inflate)
  loansClosed: '250+',
  lenderCount: '70+',

  // Where the form submits (server-side forward target).
  // Set LEAD_WEBHOOK_URL in the environment; this is just the doc pointer.

  // Thank-you page booking embed: Adam's GHL booking calendar.
  bookingEmbedUrl: 'https://api.leadconnectorhq.com/widget/booking/9CBi2dkCfuszehuLkyA1',

  // Google Ads conversion (fires on thank-you for real leads and ?demo=1).
  gtagId: 'AW-18132955750',
  gtagConversion: 'AW-18132955750/Tbu1CMmLkrUcEObku8ZD',

  // Hotjar site id (loaded site-wide in Layout.astro).
  hotjarId: 6725186,

  // Loan officer / specialist shown on thank-you page
  specialist: {
    name: 'Adam C. Cunningham',
    title: 'Mortgage Loan Originator',
    nmls: 'NMLS #312817',
    headshot: '/images/adam-cunningham.webp',
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

// TCPA consent copy (shown at the phone step; keep legal team happy).
// The "automated technology / prerecorded" clause is load-bearing: it is what
// qualifies this as prior express written consent for automated marketing SMS.
export const tcpaCopy =
  `By continuing you expressly consent to having ${brand.name} contact you about your inquiry by email, text message, or phone call at the number you provided, including via automated technology, autodialer, or prerecorded or artificial voice messages, even if your number is on a Do Not Call registry. Message and data rates may apply; message frequency varies; reply STOP to opt out. Consent is not a condition of purchase or of receiving services and can be revoked at any time.`;

// Deal-story ticker. Every line is drawn from the approved Tall Timbers deal
// stories (FL testimonial carousel) or generic capability claims. No invented
// dollar amounts, no "funded $X" transaction claims, no close-day counts.
export const fundedDeals = [
  { deal: 'Tampa, FL duplex', note: 'Declined elsewhere, closed at 75% LTV' },
  { deal: 'Kissimmee, FL pool home', note: 'First STR, qualified on AirDNA' },
  { deal: 'Cape Coral, FL SFR', note: 'Foreign national, no US credit' },
  { deal: 'Jacksonville, FL SFR', note: 'Bridge to DSCR refi at 75% of ARV' },
  { deal: 'Atlanta, GA 4-plex', note: 'Qualified on rents, not W-2s' },
  { deal: 'Blue Ridge, GA cabin', note: 'STR income at market rent' },
];

// Deal stories: approved Tall Timbers testimonial copy (FL carousel,
// clients/tall-timbers). Outcome framing, no rates, no day counts.
export const reviews = [
  {
    quote:
      "First lender walked away on my Tampa duplex two weeks in. Tall Timbers actually got on the phone, walked through what went wrong, and matched the file to a lender whose overlays fit. Closed at 75% LTV. Felt like working with people who'd seen this scenario a hundred times.",
    name: 'Marcus T.',
    detail: 'Declined elsewhere, closed at 75% LTV',
  },
  {
    quote:
      'Bought a 5-bedroom pool home in Four Corners with zero rental history. Most lenders ghosted me. The Tall Timbers team walked me through what Osceola County permits for STR up front, then matched me with a lender that took AirDNA at a 75% factor. First STR in the books.',
    name: 'Lauren K.',
    detail: 'Disney STR financed on AirDNA, no rental history',
  },
  {
    quote:
      'I live in Toronto and own two FL rentals. Getting a third was supposed to be impossible. No SSN, no US credit history. Tall Timbers walked me through Foreign National DSCR, used my Canadian credit reference letter, and closed the canal-front.',
    name: 'Carlos V.',
    detail: 'Canadian buyer, no US credit, canal-front SFR',
  },
];

export const faqs = [
  {
    q: 'Is it harder to get approved as a real estate investor?',
    a: 'Not with a DSCR loan. Traditional lenders underwrite your personal income; DSCR lenders underwrite the property. If the rent covers the mortgage payment, you qualify, no W-2s, pay stubs, or tax returns required.',
  },
  {
    q: 'What credit score do I need?',
    a: 'Most DSCR programs start at 620, and more of the lender network opens up at 680 and again at 740. If you are below 620, a few months of focused credit work usually gets you there.',
  },
  {
    q: 'How is the DSCR calculated?',
    a: 'Monthly rent divided by the full monthly payment (principal, interest, taxes, insurance, and any HOA). A ratio of 1.0 means the rent exactly covers the payment; most lenders want 1.0–1.25 or better. Below break-even, no-ratio programs still give your deal a path.',
  },
  {
    q: 'Can I close in an LLC?',
    a: 'Yes, many investors do. DSCR loans are built for LLC vesting, and with most programs closing in an entity does not affect your rate.',
  },
  {
    q: 'How fast can I close?',
    a: 'Fast closings on clean files. There is no income documentation to verify, so the appraisal with a rent schedule is usually the longest step. You get a real timeline for your file on the first call, not a marketing number.',
  },
  {
    q: 'Do short-term rentals qualify?',
    a: 'Yes. Many programs will qualify Airbnb and VRBO properties using either market rent or documented short-term rental income, and we flag the local permitting questions to ask before you write the offer.',
  },
  {
    q: 'I am not a US citizen. Can I still qualify?',
    a: 'Yes. Foreign national DSCR programs exist for exactly this. Many lenders in our network do not require US credit history; a credit reference letter from your home bank often does the job.',
  },
];
