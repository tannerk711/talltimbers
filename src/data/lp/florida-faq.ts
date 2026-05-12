// Florida DSCR Landing Page FAQ
// IMPORTANT: zero rate language. No "rates from X%", no "compare rates", no "lowest rate".
// All licensed-broker activity (pre-qualify, structure, lock, pull credit) attributed to "your matched specialist".

export interface FAQItem {
  question: string;
  answer: string;
}

export const floridaFAQ: FAQItem[] = [
  {
    question: 'Do I need tax returns for a Florida DSCR loan?',
    answer:
      "No. DSCR loans qualify on the property's rental income, not your personal income or tax returns. Your matched Florida specialist runs the DSCR ratio (rent ÷ PITIA) on your specific deal and routes it to the right FL lender. This is why DSCR works for self-employed, LLC-held, and depreciation-heavy investors who get squeezed by conventional underwriting.",
  },
  {
    question: 'How does Florida insurance affect my DSCR ratio?',
    answer:
      "Heavily. FL homeowner premiums on investment SFRs run $250-$500+/month and are 3-4x the national average. A bad insurance quote can drop your DSCR below 1.0 and kill your deal at underwriting. Your matched specialist pulls multiple FL carrier quotes, applies wind-mitigation credits, and confirms your property won't get shoved into Citizens before submitting your file. We've rebuilt deals from a 0.94 DSCR to 1.11 just by re-shopping the carrier.",
  },
  {
    question: 'Can I finance a non-warrantable Florida condo on DSCR?',
    answer:
      "Often yes. After HB 913 and the post-Surfside Fannie/Freddie guideline updates, many older FL condos became non-warrantable: building <50% owner-occupied, pending litigation, low reserves, deferred structural inspections. Conventional financing dies. Your matched specialist routes non-warrantable condo deals to the lenders in our network that fund them at up to 70% LTV under DSCR/Non-QM programs. Miami Beach, Sunny Isles, Naples, and Surfside-aftermath buildings are the typical use cases.",
  },
  {
    question: 'Will lenders accept AirDNA projections for my Disney-area Airbnb?',
    answer:
      "Yes, at the right lender, typically at a 75% factor. But your matched specialist verifies STR zoning first, because that's what kills most Disney-area deals. Orange County (Orlando proper) prohibits short-term rentals in most residential zones; Osceola County (Kissimmee, Four Corners, Davenport, Celebration) permits them. Destin and 30A have permit-zoned STR districts. Your specialist confirms the property is in a permit-eligible zone before submitting AirDNA-based income to a STR-friendly lender.",
  },
  {
    question: 'What credit score do I need for a Florida DSCR loan?',
    answer:
      "Most Florida DSCR programs in our specialist network require 660+, with the strongest terms at 700+. Some Foreign National and Bridge-to-DSCR programs accept lower. Your matched specialist runs your scenario across multiple programs and matches you to the right one. Not one rate from one lender, but the right structure for your file. Soft pull only at the qualification stage. No credit impact from getting matched.",
  },
  {
    question: 'I was declined by another DSCR lender. Can John still close my deal?',
    answer:
      "Often, yes. This is where a specialist beats a single-lender broker. Declines usually come from one of four FL-specific issues: insurance quote killed the DSCR ratio, condo turned out to be non-warrantable, STR zoning didn't permit short-term rental use, or the lender's overlay didn't fit your scenario. Your matched specialist re-runs the file, fixes the underwriting issue, and routes it to a lender whose program fits. We close declined-deals all the time.",
  },
];
