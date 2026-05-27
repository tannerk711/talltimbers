// Georgia DSCR Landing Page FAQ for Tall Timbers RFS.
// First-person "we" voice (rule #9 lifted 2026-05-26 for single-broker clients).
// Hard rules enforced: zero rate language, no "soft pull" / "hard pull" language at form stage,
// no specific close-day counts, no insurance pre-quoting claims.

export interface FAQItem {
  question: string;
  answer: string;
}

export const georgiaFAQ: FAQItem[] = [
  {
    question: 'Are you a lender, a broker, or a lead-gen site?',
    answer:
      "Tall Timbers Realty and Financial Services is a licensed real estate and mortgage shop. We run the pre-qualification ourselves, structure the file, and place it with the right lender in our network of 70+ lenders. We do not sell your information to multiple lenders or hand you off to a call center.",
  },
  {
    question: 'Do I need tax returns for a DSCR loan?',
    answer:
      "No. DSCR loans qualify on the property's rental income, not your personal income or tax returns. We run the DSCR ratio (rent divided by PITIA) on your specific deal and match it to the right lender. This is why DSCR works for self-employed, LLC-held, and depreciation-heavy investors who get squeezed by conventional underwriting.",
  },
  {
    question: 'How does short-term rental zoning affect my Georgia DSCR deal?',
    answer:
      "It is the issue we talk through on the first call. Short-term rental rules vary by city and county in Georgia. Atlanta requires a short-term rental license and restricts it largely to a host's primary residence, which is a problem for a pure investment STR. Savannah, Blue Ridge, and other tourist markets have their own permit zones and caps. You confirm the local rule with the city or county before you write an offer. Once the property is permit-eligible, we match your file to an STR-friendly lender that accepts AirDNA-based income, typically at a 75% factor.",
  },
  {
    question: 'Can I finance an Atlanta-metro condo on DSCR?',
    answer:
      "Often yes, but condo financing comes down to whether the building is warrantable. A building can be non-warrantable for reasons like low owner-occupancy, pending litigation, thin reserves, or a high concentration of investor-owned units. The lender determines warrantability from the condo questionnaire and budget. We flag the buildings that tend to be a problem before you go under contract, and we know which lenders in our network fund non-warrantable condos under DSCR or Non-QM.",
  },
  {
    question: 'What does this actually cost me? Are there points and fees?',
    answer:
      "Nothing to check your eligibility and nothing to talk your deal through with us. From the lender side, Georgia DSCR loans typically run 1-2 points origination plus standard third-party costs such as appraisal, title, and the Georgia intangible recording tax. We walk you through the full breakdown after we see your scenario, before anything goes to underwriting. No application fee and no junk fees.",
  },
  {
    question: 'Can I close in my LLC?',
    answer:
      "Yes. Most DSCR programs in our network are LLC-friendly and many prefer the property to vest in an entity. Single-member LLC, multi-member LLC, or holding company structures are all standard on DSCR. A personal guarantee may apply depending on the program. We walk through the entity structure on the call so the vesting is clean before you go under contract.",
  },
  {
    question: 'What credit score do I need for a DSCR loan?',
    answer:
      "Most DSCR programs in our network require 660 or higher, with the strongest terms at 700 and up. Some Foreign National and Bridge-to-DSCR programs accept lower. We run your scenario across multiple programs and match you to the right one. Checking your eligibility does not pull your credit. Any credit check is run later, only after you submit a formal application and give consent.",
  },
  {
    question: 'I was declined by another DSCR lender. Can you still close my deal?',
    answer:
      "Often, yes. This is where a specialist with a 70+ lender network beats a single-lender broker. Declines usually trace back to one issue: the condo turned out to be non-warrantable, the short-term rental zoning did not permit the use, or the lender's overlay simply did not fit your scenario. We talk through what actually killed the deal, address the underwriting issue, and route the file to a lender whose program fits. We close deals every month that someone else already declined.",
  },
];
