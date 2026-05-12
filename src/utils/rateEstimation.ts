// Deal Verdict utility. Replaces former rate estimation logic.
// We do not display rates anywhere on the site. Instead, we communicate
// the strength of the deal scenario and what the specialist will work on.

export interface DealVerdict {
  tier: 'strong' | 'workable' | 'structuring' | 'review';
  label: string;
  headline: string;
  specialistFocus: string[];
}

const CREDIT_LABELS_INTERNAL: Record<string, string> = {
  '740_plus': '740+ FICO',
  '700_739': '700–739 FICO',
  '640_699': '640–699 FICO',
  'below_640': 'Below 640 FICO',
};

/**
 * Score a deal scenario based on FICO and (optional) cash flow.
 * Returns a tier + headline + specialist value-add bullets.
 */
export function getDealVerdict(creditScore: string, cashFlowOrDown?: string): DealVerdict {
  const creditLabel = CREDIT_LABELS_INTERNAL[creditScore] || creditScore;
  const negativeCashFlow = cashFlowOrDown === 'negative';

  if (negativeCashFlow) {
    return {
      tier: 'workable',
      label: 'No-Ratio Path',
      headline: "Negative cash flow works on a No-Ratio DSCR program at 30%+ down.",
      specialistFocus: [
        'Routing your file to lenders that fund No-Ratio DSCR deals',
        'Structuring around the cash flow gap with appropriate down payment',
        'Confirming reserve and credit overlays for No-Ratio underwriting',
      ],
    };
  }

  if (creditScore === '740_plus') {
    return {
      tier: 'strong',
      label: 'Strong File',
      headline: "You qualify for our network's most flexible programs.",
      specialistFocus: [
        `Matching ${creditLabel} to lenders with the deepest program access`,
        'Structuring for the most flexible terms across the lender network',
        'Targeting lenders whose overlays favor strong-file investors',
      ],
    };
  }

  if (creditScore === '700_739') {
    return {
      tier: 'workable',
      label: 'Workable File',
      headline: 'Solid scenario. Your specialist will compare program fits.',
      specialistFocus: [
        `Mapping ${creditLabel} against current lender overlays`,
        'Identifying which lenders give favorable terms for this profile',
        'Reviewing structuring options that strengthen the file',
      ],
    };
  }

  if (creditScore === '640_699') {
    return {
      tier: 'structuring',
      label: 'Needs Structuring',
      headline: 'Your file works. It just takes the right lender match.',
      specialistFocus: [
        `Targeting lenders whose overlays accept ${creditLabel}`,
        'Structuring compensating factors to strengthen the file',
        'Comparing program eligibility (Standard, No-Ratio at higher down, etc.)',
      ],
    };
  }

  if (creditScore === 'below_640') {
    return {
      tier: 'review',
      label: 'Specialist Review Required',
      headline: 'Below-640 deals close, but require careful lender selection.',
      specialistFocus: [
        'Identifying the small subset of lenders that go below 640',
        'Reviewing recent credit events for compensating-factor strategies',
        'Structuring the file presentation to fit non-standard underwriting',
      ],
    };
  }

  return {
    tier: 'review',
    label: 'Specialist Review',
    headline: 'Your specialist will review your scenario and structure the deal.',
    specialistFocus: [
      'Mapping your scenario to the right lender programs',
      'Structuring the file for approval',
      'Comparing program fits across the lender network',
    ],
  };
}

export interface ProgramRecommendation {
  program: string;
  badge: string;
  color: 'green' | 'blue';
}

export function getRecommendedProgram(formData: {
  loanGoal?: string;
  cashFlow?: string;
  usCitizen?: string;
  propertyType?: string;
}): ProgramRecommendation {
  const { loanGoal, cashFlow, usCitizen, propertyType } = formData;

  if (loanGoal === 'flip') {
    return { program: 'Bridge / Fix & Flip', badge: 'BRIDGE LOAN', color: 'blue' };
  }

  if (usCitizen === 'foreign_national') {
    return { program: 'Foreign National DSCR Program', badge: 'FOREIGN NATIONAL', color: 'green' };
  }

  if (cashFlow === 'negative') {
    return { program: 'No-Ratio DSCR Eligible', badge: 'NO-RATIO ELIGIBLE', color: 'green' };
  }

  if (propertyType === 'multi_family_large') {
    return { program: 'Multi-Family DSCR (5+ Units)', badge: 'MULTI-FAMILY', color: 'blue' };
  }

  if (propertyType === 'non_warrantable_condo') {
    return { program: 'Non-Warrantable Condo DSCR', badge: 'NON-WARRANTABLE', color: 'blue' };
  }

  if (loanGoal === 'refinance') {
    return { program: 'DSCR Cash-Out Refinance', badge: 'CASH-OUT REFI', color: 'blue' };
  }

  return { program: 'Standard DSCR', badge: 'STANDARD DSCR', color: 'blue' };
}

// Backwards-compat re-exports
export type RateEstimate = DealVerdict;
export const getEstimatedRate = getDealVerdict;
