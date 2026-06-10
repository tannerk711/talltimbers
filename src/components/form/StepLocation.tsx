import { useState } from 'react';
import { STATE_NAMES } from '../../utils/brokerRouting';

interface StepLocationProps {
  value: string;
  onSelect: (value: string) => void;
}

// Build a name->code lookup once. Accepts full state name ("Georgia") or
// the 2-letter abbreviation ("GA"), case-insensitive, ignoring surrounding
// whitespace. Tall Timbers never blocks a lead on state: anything the investor
// types is accepted, resolved to a 2-letter code when we recognize it, and
// passed straight through to Adam. If we cannot resolve it, we send the raw
// typed text uppercased so the lead still reaches GHL.
const NAME_TO_CODE: Record<string, string> = Object.entries(STATE_NAMES).reduce(
  (acc, [code, name]) => {
    acc[name.toLowerCase()] = code;
    acc[code.toLowerCase()] = code;
    return acc;
  },
  {} as Record<string, string>,
);

function resolveState(raw: string): string {
  const cleaned = raw.trim();
  if (!cleaned) return '';
  const hit = NAME_TO_CODE[cleaned.toLowerCase()];
  if (hit) return hit;
  // Unrecognized: keep what they typed (uppercased) so the lead is not lost.
  return cleaned.toUpperCase();
}

export default function StepLocation({ value, onSelect }: StepLocationProps) {
  // Show the friendly full name back in the box if we already have a code.
  const initialText = value ? STATE_NAMES[value] || value : '';
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');

  const handleAdvance = () => {
    if (!text.trim()) {
      setError('Please enter your state.');
      return;
    }
    onSelect(resolveState(text));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdvance();
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-navy text-center mb-6">What state are you looking to do this in?</h3>

      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError('');
        }}
        onKeyDown={handleKeyDown}
        placeholder="State"
        autoFocus
        aria-label="State"
        className={`w-full bg-navy/[0.03] border rounded px-4 py-3 text-navy placeholder-navy/40 text-sm focus:outline-none focus:ring-1 transition-colors duration-150 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
            : 'border-navy/15 focus:border-blue focus:ring-blue/30'
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1 animate-[fadeIn_150ms_ease-out]">{error}</p>}

      <button
        type="button"
        onClick={handleAdvance}
        className="w-full mt-4 py-4 rounded text-sm font-semibold uppercase tracking-wider bg-blue hover:bg-blue/90 text-white cursor-pointer transition-colors duration-150"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        Next
      </button>
    </div>
  );
}
