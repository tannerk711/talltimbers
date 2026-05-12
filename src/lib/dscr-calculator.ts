/**
 * Shared DSCR calculation functions.
 * Used by: MultistepForm, DSCRCalculator, DealAnalyzer
 */

export interface PITIABreakdown {
  principal: number;
  interest: number;
  monthlyPI: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalPITIA: number;
}

export interface DSCRResult {
  dscr: number;
  pitia: PITIABreakdown;
  monthlyCashFlow: number;
  annualCashFlow: number;
  verdict: 'strong' | 'positive' | 'breakeven' | 'negative' | 'review';
  verdictLabel: string;
  programEligibility: string;
  /**
   * Specialist value-add bullets shown on results cards.
   * Replaces former rateEstimate field. We do not display rates anywhere.
   */
  specialistFocus: string[];
}

/**
 * Calculate monthly P&I payment using standard amortization formula.
 */
export function calculateMonthlyPI(
  loanAmount: number,
  annualRate: number,
  termYears: number = 30
): number {
  if (loanAmount <= 0) return 0;
  if (annualRate <= 0) return loanAmount / (termYears * 12);

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  const payment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return Math.round(payment * 100) / 100;
}

/**
 * Calculate full PITIA breakdown.
 */
export function calculatePITIA(params: {
  propertyValue: number;
  downPaymentPercent: number;
  annualRate: number;
  termYears?: number;
  monthlyTax?: number;
  monthlyInsurance?: number;
  monthlyHOA?: number;
}): PITIABreakdown {
  const {
    propertyValue,
    downPaymentPercent,
    annualRate,
    termYears = 30,
    monthlyTax,
    monthlyInsurance = 150,
    monthlyHOA = 0,
  } = params;

  const downPayment = propertyValue * (downPaymentPercent / 100);
  const loanAmount = propertyValue - downPayment;
  const monthlyPI = calculateMonthlyPI(loanAmount, annualRate, termYears);

  // Default tax estimate: 1.25% of property value annually
  const tax = monthlyTax ?? Math.round((propertyValue * 0.0125) / 12);

  const totalPITIA = monthlyPI + tax + monthlyInsurance + monthlyHOA;

  return {
    principal: loanAmount,
    interest: annualRate,
    monthlyPI: Math.round(monthlyPI),
    monthlyTax: Math.round(tax),
    monthlyInsurance: Math.round(monthlyInsurance),
    monthlyHOA: Math.round(monthlyHOA),
    totalPITIA: Math.round(totalPITIA),
  };
}

/**
 * Calculate DSCR ratio and full result.
 */
export function calculateDSCR(params: {
  monthlyRent: number;
  propertyValue: number;
  downPaymentPercent: number;
  annualRate: number;
  termYears?: number;
  monthlyTax?: number;
  monthlyInsurance?: number;
  monthlyHOA?: number;
}): DSCRResult {
  const pitia = calculatePITIA(params);
  const { monthlyRent, downPaymentPercent } = params;

  const dscr = pitia.totalPITIA > 0 ? monthlyRent / pitia.totalPITIA : 0;
  const roundedDSCR = Math.round(dscr * 100) / 100;
  const monthlyCashFlow = monthlyRent - pitia.totalPITIA;
  const annualCashFlow = monthlyCashFlow * 12;

  let verdict: DSCRResult['verdict'];
  let verdictLabel: string;
  let programEligibility: string;
  let specialistFocus: string[];

  if (roundedDSCR >= 1.25) {
    verdict = 'strong';
    verdictLabel = 'Strong Deal';
    programEligibility = 'Qualifies for the full range of DSCR programs across our lender network.';
    specialistFocus = [
      'Matching this scenario to lenders with the most flexible terms',
      'Confirming the strongest program fit for your goals',
      'Locking in fast. Strong files close quickly',
    ];
  } else if (roundedDSCR >= 1.0) {
    verdict = 'positive';
    verdictLabel = 'Workable Deal';
    programEligibility = 'Qualifies for Standard DSCR programs across the lender network.';
    specialistFocus = [
      'Matching to lenders whose Standard DSCR programs fit your file',
      'Comparing program structures (30-yr fixed vs interest-only) for cash flow',
      'Verifying rent comps to confirm the qualifying ratio',
    ];
  } else if (roundedDSCR >= 0.75) {
    verdict = 'negative';
    verdictLabel = 'Needs Structuring';
    programEligibility =
      downPaymentPercent >= 30
        ? 'Qualifies for No-Ratio DSCR. Cash flow is not a factor at 30%+ down.'
        : 'No-Ratio DSCR opens up at 30%+ down. Below that, structuring is required.';
    specialistFocus = [
      downPaymentPercent >= 30
        ? 'Routing to No-Ratio DSCR lenders where cash flow is not a factor'
        : 'Reviewing whether moving to 30% down opens No-Ratio DSCR programs',
      'Identifying lenders with overlays that accept tighter cash flow',
      'Structuring compensating factors (reserves, rent comps) to strengthen the file',
    ];
  } else if (roundedDSCR > 0) {
    verdict = 'review';
    verdictLabel = 'Specialist Review Required';
    programEligibility = 'Tight cash flow scenarios still close, but require careful lender selection.';
    specialistFocus = [
      'Mapping the scenario to the small subset of lenders that fit',
      'Reviewing No-Ratio options at higher down payments',
      'Structuring the file presentation around the cash flow profile',
    ];
  } else {
    verdict = 'review';
    verdictLabel = 'Enter rental income to calculate';
    programEligibility = '';
    specialistFocus = [];
  }

  return {
    dscr: roundedDSCR,
    pitia,
    monthlyCashFlow: Math.round(monthlyCashFlow),
    annualCashFlow: Math.round(annualCashFlow),
    verdict,
    verdictLabel,
    programEligibility,
    specialistFocus,
  };
}

/**
 * Format a number as currency.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage.
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format DSCR ratio.
 */
export function formatDSCR(value: number): string {
  return `${value.toFixed(2)}x`;
}
