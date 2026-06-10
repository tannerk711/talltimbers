import { useState } from 'react';
import { formatPhoneDisplay } from '../../utils/brokerRouting';

interface StepPhoneProps {
  phone: string;
  honeypot: string;
  isSubmitting: boolean;
  submitError: string | null;
  onPhoneChange: (v: string) => void;
  onHoneypotChange: (v: string) => void;
  onSubmit: () => void;
  onRetry: () => void;
}

function phoneIsValid(val: string): boolean {
  const digits = val.replace(/\D/g, '');
  if (digits.length !== 10 && digits.length !== 11) return false;
  if (/(\d)\1{4,}/.test(digits)) return false;
  return true;
}

export default function StepPhone({
  phone,
  honeypot,
  isSubmitting,
  submitError,
  onPhoneChange,
  onHoneypotChange,
  onSubmit,
  onRetry,
}: StepPhoneProps) {
  const [error, setError] = useState('');

  const handlePhoneChange = (val: string) => {
    onPhoneChange(formatPhoneDisplay(val));
    if (error) setError('');
  };

  const handleSubmit = () => {
    if (!phoneIsValid(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = phone && !isSubmitting;

  return (
    <div>
      <h3 className="text-2xl font-bold text-navy text-center mb-1">What's the best number to reach you?</h3>
      <p className="text-sm font-semibold text-blue text-center mb-6">We do not sell your information. No games, no spam.</p>

      <input
        type="tel"
        value={phone}
        onChange={(e) => handlePhoneChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="(555) 555-5555"
        autoFocus
        aria-label="Phone number"
        className={`w-full bg-navy/[0.03] border rounded px-4 py-3 text-navy placeholder-navy/40 text-sm focus:outline-none focus:ring-1 transition-colors duration-150 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
            : 'border-navy/15 focus:border-blue focus:ring-blue/30'
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1 animate-[fadeIn_150ms_ease-out]">{error}</p>}

      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          value={honeypot}
          onChange={(e) => onHoneypotChange(e.target.value)}
        />
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 text-sm mt-4">
          <p>{submitError}</p>
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={onRetry}
              className="bg-navy/10 hover:bg-navy/20 text-navy text-sm px-6 py-2 rounded uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Try Again
            </button>
            <a href="tel:+18889310211" className="text-blue hover:underline text-sm">
              Call (888) 931-0211
            </a>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`
          w-full mt-4 py-4 rounded text-sm font-semibold uppercase tracking-wider transition-colors duration-150
          ${isSubmitting
            ? 'bg-blue/80 text-white/80 cursor-wait'
            : canSubmit
              ? 'bg-blue hover:bg-blue/90 text-white cursor-pointer'
              : 'bg-blue/40 text-white/50 cursor-not-allowed'
          }
        `}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Calculating Eligibility...
          </span>
        ) : (
          'Submit'
        )}
      </button>

      {/* Consent lives below the button, no checkbox. Submitting the phone number
          IS the agreement (auto-consent), worded to satisfy TCPA. */}
      <p className="text-navy/45 text-[11px] leading-relaxed mt-3">
        By submitting your phone number, you agree to receive calls, texts, and emails from Tall Timbers
        at the number provided, including by automated means. Consent is not a condition of any purchase.
        Standard message and data rates may apply. Reply STOP to opt out. We do not sell your information.
      </p>
    </div>
  );
}
