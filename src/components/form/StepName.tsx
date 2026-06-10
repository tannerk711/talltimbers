import { useState } from 'react';

interface StepNameProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onContinue: () => void;
}

export default function StepName({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onContinue,
}: StepNameProps) {
  const [error, setError] = useState('');

  const handleAdvance = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.');
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

  const inputClass = `w-full bg-navy/[0.03] border rounded px-4 py-3 text-navy placeholder-navy/40 text-sm focus:outline-none focus:ring-1 transition-colors duration-150 ${
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
      : 'border-navy/15 focus:border-blue focus:ring-blue/30'
  }`;

  return (
    <div>
      <h3 className="text-2xl font-bold text-navy text-center mb-6">What's your name?</h3>

      <input
        type="text"
        value={firstName}
        onChange={(e) => {
          onFirstNameChange(e.target.value);
          if (error) setError('');
        }}
        onKeyDown={handleKeyDown}
        placeholder="First name"
        autoFocus
        aria-label="First name"
        className={`${inputClass} mb-3`}
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => {
          onLastNameChange(e.target.value);
          if (error) setError('');
        }}
        onKeyDown={handleKeyDown}
        placeholder="Last name"
        aria-label="Last name"
        className={inputClass}
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
