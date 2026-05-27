// Florida DSCR Landing Page FAQ for Tall Timbers RFS.
// First-person "we" voice (rule #9 lifted 2026-05-26 for single-broker clients).
// Hard rules enforced: zero rate language. No "rates from X%", no "compare rates", no "lowest rate".
// No insurance pre-quoting claims. We do not pre-run insurance.
// FL legislative cites verified: SB 4-D (2022), SB 154 (2023) for post-Surfside condo reform.

export interface FAQItem {
  question: string;
  answer: string;
}

export const floridaFAQ: FAQItem[] = [
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
    question: 'Can I finance a non-warrantable Florida condo on DSCR?',
    answer:
      "Often yes. After SB 4-D (2022), SB 154 (2023), and the post-Surfside Fannie/Freddie guideline updates, a lot of older FL condos became non-warrantable: building under 50% owner-occupied, pending litigation, low reserves, deferred structural inspections, milestone inspection failures. Conventional financing dies on those. We know which lenders in our network fund non-warrantable FL condos under DSCR or Non-QM, typically up to 70% LTV, and which buildings are flat dead even on Non-QM. Miami Beach, Sunny Isles, Naples, and Surfside-aftermath buildings are the typical use cases.",
  },
  {
    question: 'Will lenders accept AirDNA projections for my Disney-area Airbnb?',
    answer:
      "Yes, at the right lender, typically at a 75% factor. But STR zoning is the bigger issue, and we talk through that on the first call. Orange County (Orlando proper) prohibits short-term rentals in most residential zones. Osceola County (Kissimmee, Four Corners, Davenport, Celebration) permits them. Destin and 30A have permit-zoned STR districts. The county is what you confirm with the city or county clerk before you write an offer. Once it's permit-eligible, we match your file to an STR-friendly lender that accepts AirDNA-based income.",
  },
  {
    question: 'What does this actually cost me? Are there points and fees?',
    answer:
      "Nothing to check your eligibility and nothing to talk your deal through with us. From the lender side, FL DSCR loans typically run 1-2 points origination plus standard third-party costs (appraisal, title, FL doc stamps, intangible tax). We walk you through the full breakdown after we see your scenario, before anything goes to underwriting. No application fee, no junk fees, no charge to talk through your deal first.",
  },
  {
    question: 'Can I close in my LLC?',
    answer:
      "Yes. Most DSCR programs in our network are LLC-friendly and many actually prefer the property to vest in an entity. Single-member LLC, multi-member LLC, or holding company structures are all standard on DSCR. Personal guarantee may apply depending on the program. We walk through the entity structure on the call so the vesting is clean before you go under contract.",
  },
  {
    question: 'What credit score do I need for a DSCR loan?',
    answer:
      "Most DSCR programs in our network require 660+, with the strongest terms at 700+. Some Foreign National and Bridge-to-DSCR programs accept lower. We run your scenario across multiple programs and match you to the right one. Checking your eligibility does not pull your credit. Any credit check is run by us later, only after you submit a formal application and give consent.",
  },
  {
    question: 'I was declined by another DSCR lender. Can you still close my deal?',
    answer:
      "Often, yes. This is where a specialist with a 70+ lender network beats a single-lender broker. Declines usually come from one of a few FL-specific issues: condo turned out to be non-warrantable, STR zoning didn't permit short-term rental use, coastal or flood-zone exposure tripped the program, or the lender's overlay didn't fit your scenario. We talk through what actually killed the deal, address the underwriting issue, and route it to a lender whose program fits. We close deals every month that someone else already declined.",
  },
];
