import { useState, useEffect } from 'react';
import { STATES_LIST, STATE_NAMES } from '../../utils/brokerRouting';

interface StepLocationProps {
  value: string;
  onSelect: (value: string) => void;
}

export default function StepLocation({ value, onSelect }: StepLocationProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (value) {
      setShowConfirmation(true);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      setShowConfirmation(false);
      // Small delay to show the confirmation before auto-advance
      setTimeout(() => {
        onSelect(selected);
      }, 50);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-navy mb-1">Where is the property located?</h3>
      <p className="text-sm text-navy/55 mb-6">We structure DSCR loans for investors across the states we cover.</p>

      <select
        value={value}
        onChange={handleChange}
        aria-label="Select state"
        className="w-full bg-navy/[0.03] border border-navy/15 rounded px-4 py-3 text-navy text-sm focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-colors duration-150 appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(7,38,15,0.5)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        <option value="" disabled className="bg-white text-navy/50">Select a state...</option>
        {STATES_LIST.map((state) => (
          <option key={state.value} value={state.value} className="bg-white text-navy">
            {state.label}
          </option>
        ))}
      </select>

      {value && showConfirmation && (
        <div className="flex items-center gap-2 bg-green/10 border border-green/20 text-green-400 rounded-lg p-3 text-sm mt-4 animate-[fadeIn_200ms_ease-out]">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>We structure DSCR loans in {STATE_NAMES[value]}.</span>
        </div>
      )}
    </div>
  );
}
