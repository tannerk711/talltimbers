import { useEffect, useRef } from 'react';
import type { DealVerdict, ProgramRecommendation } from '../../utils/rateEstimation';

interface StepVerdictProps {
  verdict: DealVerdict;
  program: ProgramRecommendation;
  firstName: string;
  onContinue: () => void;
}

const TIER_STYLES: Record<DealVerdict['tier'], { ring: string; pill: string; pillText: string; pillLabel: string }> = {
  strong: { ring: 'ring-green/40', pill: 'bg-green/10 border-green/40', pillText: 'text-green-700', pillLabel: 'Strong' },
  workable: { ring: 'ring-blue/40', pill: 'bg-blue/10 border-blue/40', pillText: 'text-blue-dark', pillLabel: 'Workable' },
  structuring: { ring: 'ring-amber/40', pill: 'bg-amber/10 border-amber/40', pillText: 'text-amber', pillLabel: 'Specialist' },
  review: { ring: 'ring-amber/40', pill: 'bg-amber/10 border-amber/40', pillText: 'text-amber', pillLabel: 'Specialist' },
};

function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
}

export default function StepVerdict({ verdict, program, firstName, onContinue }: StepVerdictProps) {
  const viewedRef = useRef(false);
  const tierStyle = TIER_STYLES[verdict.tier] || TIER_STYLES.workable;
  const greeting = firstName ? `${firstName}, based on your answers` : 'Based on your answers';

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackEvent('verdict_view', {
      deal_tier: verdict.tier,
      program: program.program,
    });
  }, [verdict.tier, program.program]);

  return (
    <div className="animate-[fadeIn_250ms_ease-out]">
      {/* Result-unlocked eyebrow */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green/10 border border-green/40 mb-5">
        <svg className="w-3.5 h-3.5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700" style={{ fontFamily: 'var(--font-sans)' }}>
          Eligibility Result Ready
        </span>
      </div>

      <h3 className="text-lg font-semibold text-navy mb-2">
        {greeting}, you look like a fit for {program.program}.
      </h3>
      <p className="text-sm text-navy/60 mb-6 leading-relaxed">
        Here is where your file lands before we get on the phone. The contact step is the last one.
      </p>

      {/* Deal verdict card. Matches the ThankYou verdict card visual language. */}
      <div className={`bg-off-white border border-navy/10 rounded-xl p-5 md:p-6 ring-1 ${tierStyle.ring}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/50 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
              Your Deal at a Glance
            </p>
            <p className="text-xl font-bold text-navy" style={{ fontFamily: 'var(--font-sans)' }}>
              {verdict.label}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider ${tierStyle.pill} ${tierStyle.pillText}`}>
            {tierStyle.pillLabel}
          </span>
        </div>

        <p className="text-sm md:text-base text-navy/70 mt-3 leading-relaxed">
          {verdict.headline}
        </p>

        {verdict.specialistFocus.length > 0 && (
          <div className="mt-5 pt-5 border-t border-navy/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-amber mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
              What We'll Work On
            </p>
            <ul className="space-y-2">
              {verdict.specialistFocus.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-sm md:text-base text-navy/80">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommended program badge. Matches the ThankYou program chip. */}
      <div className="mt-4 flex items-center gap-3">
        <span
          className={`inline-block text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full border ${
            program.color === 'green'
              ? 'bg-green/10 text-green-700 border-green/30'
              : 'bg-blue/10 text-blue-dark border-blue/30'
          }`}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {program.badge}
        </span>
        <p className="text-sm text-navy/60">{program.program}</p>
      </div>

      {/* Continue to contact */}
      <button
        type="button"
        onClick={onContinue}
        className="w-full mt-7 py-4 rounded text-sm font-semibold uppercase tracking-wider bg-blue hover:bg-blue/90 text-white cursor-pointer transition-colors duration-150"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        See My Full Eligibility
      </button>

      <p className="text-navy/45 text-xs text-center mt-3">
        One last step. Tell us where to send it and we'll review your file same business day.
      </p>
    </div>
  );
}
