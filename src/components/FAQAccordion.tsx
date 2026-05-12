import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-100/50"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span className="pr-4 text-sm font-semibold text-navy md:text-base">
              {item.question}
            </span>
            <svg
              className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
            }`}
          >
            <p className="px-6 text-sm leading-relaxed text-gray-500">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
