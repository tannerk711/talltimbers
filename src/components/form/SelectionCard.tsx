import type { ReactNode } from 'react';

interface SelectionCardProps {
  value: string;
  label: string;
  selected: boolean;
  onSelect: (value: string) => void;
  icon?: ReactNode;
  compact?: boolean;
  horizontal?: boolean;
}

export default function SelectionCard({ value, label, selected, onSelect, icon, compact, horizontal }: SelectionCardProps) {
  if (compact) {
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={() => onSelect(value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(value); } }}
        className={`
          px-4 py-2.5 text-sm rounded border cursor-pointer transition-all duration-150 text-center font-semibold
          ${selected
            ? 'bg-blue/10 border-blue text-navy'
            : 'bg-navy/[0.03] border-navy/15 text-navy hover:bg-blue/10 hover:border-blue'
          }
        `}
      >
        {label}
      </button>
    );
  }

  if (horizontal) {
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={() => onSelect(value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(value); } }}
        className={`
          group flex items-center gap-4 w-full px-5 py-4 rounded-lg border cursor-pointer transition-all duration-200
          ${selected
            ? 'bg-blue/10 border-blue ring-1 ring-blue/30'
            : 'bg-navy/[0.03] border-navy/[0.12] hover:bg-blue/10 hover:border-blue hover:ring-1 hover:ring-blue/30'
          }
        `}
      >
        {icon && (
          <div className="w-10 h-10 flex-shrink-0 text-blue">
            {icon}
          </div>
        )}
        <div className="text-left">
          <span className="text-[15px] font-semibold block text-navy">
            {label}
          </span>
        </div>
        {/* Selection indicator */}
        <div className={`ml-auto w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          selected
            ? 'border-blue bg-blue'
            : 'border-navy/25 group-hover:border-blue group-hover:bg-blue'
        }`}>
          <svg className={`w-3 h-3 text-white transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(value)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(value); } }}
      className={`
        group flex flex-col items-center gap-3 p-6 rounded-md border cursor-pointer transition-all duration-200
        ${selected
          ? 'bg-blue/10 border-2 border-blue ring-1 ring-blue/30'
          : 'bg-navy/[0.03] border border-navy/15 hover:bg-blue/10 hover:border-blue hover:ring-1 hover:ring-blue/30'
        }
      `}
    >
      {icon && (
        <div className="w-12 h-12 text-blue">
          {icon}
        </div>
      )}
      <span
        className="text-[13px] font-semibold uppercase tracking-wider text-navy"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {label}
      </span>
    </button>
  );
}
