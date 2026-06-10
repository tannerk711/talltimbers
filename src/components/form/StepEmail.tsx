import { useState } from 'react';

interface StepEmailProps {
  email: string;
  onEmailChange: (v: string) => void;
  onContinue: () => void;
}

// Light client-side email shape check. Real validation happens at submit via the
// shared contactSchema; this just stops obvious typos before advancing a step.
function looksLikeEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function StepEmail({ email, onEmailChange, onContinue }: StepEmailProps) {
  const [error, setError] = useState('');

  const handleAdvance = () => {
    if (!looksLikeEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    onContinue();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdvance();
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-navy text-center mb-6">What's the best email to send your eligibility to?</h3>

      <input
        type="email"
        value={email}
        onChange={(e) => {
          onEmailChange(e.target.value);
          if (error) setError('');
        }}
        onKeyDown={handleKeyDown}
        placeholder="Email address"
        autoFocus
        aria-label="Email address"
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
