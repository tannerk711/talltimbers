import { useEffect, useRef, useState } from 'react';
import { STATE_NAMES, PROPERTY_TYPE_NAMES } from '../../utils/brokerRouting';
import type { DealVerdict, ProgramRecommendation } from '../../utils/rateEstimation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface SubmissionPayload {
  loanGoal?: string;
  state?: string;
  propertyType?: string;
  creditScore?: string;
  cashFlow?: string;
  matchedBroker?: string;
  firstName?: string;
  dealVerdict?: DealVerdict;
  program?: ProgramRecommendation;
  isFake?: boolean;
}

const TIER_STYLES: Record<DealVerdict['tier'], { ring: string; pill: string; pillText: string }> = {
  strong: { ring: 'ring-green/40', pill: 'bg-green/10 border-green/40', pillText: 'text-green-700' },
  workable: { ring: 'ring-blue/40', pill: 'bg-blue/10 border-blue/40', pillText: 'text-blue-dark' },
  structuring: { ring: 'ring-amber/40', pill: 'bg-amber/10 border-amber/40', pillText: 'text-amber' },
  review: { ring: 'ring-amber/40', pill: 'bg-amber/10 border-amber/40', pillText: 'text-amber' },
};

const SPECIALIST = {
  name: 'Adam C. Cunningham',
  title: 'Mortgage Loan Originator',
  nmls: '312817',
  company: 'Tall Timbers Realty and Financial Services',
  headshot: '/images/adam-cunningham-headshot.png',
  message:
    "I've spent my career structuring DSCR and non-QM deals for real estate investors, including the ones other lenders walk away from. The questionnaire you just filled out gives me a real starting point, but every deal has nuance that doesn't fit in a form. I'll personally review your file, reach out the same business day, and walk you through exactly what we can do. No call center, no runaround.",
};

function getThankYouCopy(loanGoal: string | undefined, firstName: string | undefined): { headline: string; body: string } {
  const greeting = firstName ? `Thanks, ${firstName}.` : 'Thanks.';
  if (loanGoal === 'refinance') {
    return {
      headline: `${greeting} It looks like you're eligible.`,
      body: 'Based on the info you provided, your file looks like a fit for a cash-out refinance. Adam will personally review your scenario, reach out the same business day, and walk you through what works before anything goes to underwriting.',
    };
  }
  if (loanGoal === 'flip') {
    return {
      headline: `${greeting} It looks like you're eligible.`,
      body: "Based on the info you provided, your file looks like a fit for a fix & flip. Adam will personally review your scenario, reach out the same business day, and walk you through what works before anything goes to underwriting.",
    };
  }
  return {
    headline: `${greeting} It looks like you're eligible.`,
    body: 'Based on the info you provided, your file looks like a fit for a DSCR purchase loan. Adam will personally review your scenario, reach out the same business day, and walk you through what works before issuing a formal pre-approval.',
  };
}

export default function ThankYou() {
  const [data, setData] = useState<SubmissionPayload | null>(null);
  const [loaded, setLoaded] = useState(false);
  const confettiRef = useRef(false);
  const conversionRef = useRef(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('tall_timbers_submission');
      if (raw) {
        setData(JSON.parse(raw));
      } else if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === '1') {
        setData({
          loanGoal: 'purchase',
          state: 'FL',
          propertyType: 'single_family',
          firstName: 'Marcus',
          isFake: true,
          dealVerdict: {
            tier: 'strong',
            label: 'Strong Deal',
            headline: "Your file is in great shape. Adam will move quickly to formalize the pre-approval and surface the right lender.",
            specialistFocus: [
              'Confirm rental comp on subject property',
              'Verify reserves and entity setup',
              'Match to the lender with the strongest DSCR overlays for your scenario',
            ],
          } as DealVerdict,
        });
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!data || data.isFake || conversionRef.current) return;
    conversionRef.current = true;
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: 'AW-18132955750/Tbu1CMmLkrUcEObku8ZD' });
    }
  }, [data]);

  useEffect(() => {
    if (!data || data.isFake || confettiRef.current) return;
    confettiRef.current = true;
    import('canvas-confetti').then((mod) => {
      mod.default({
        particleCount: 80,
        spread: 80,
        origin: { x: 0.5, y: 0.3 },
        colors: ['#1E9E6E', '#3FC793', '#C8932C', '#07260F'],
        ticks: 200,
        gravity: 1.2,
        scalar: 1,
      });
    }).catch(() => {});
  }, [data]);

  if (!loaded) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-navy/50 text-sm">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-navy mb-3">No submission found.</h2>
        <p className="text-navy/60 mb-6">It looks like you landed on this page without filling out the form.</p>
        <a
          href="/#lead-form"
          className="inline-block bg-blue hover:bg-blue-dark text-white px-6 py-3 rounded text-sm font-semibold uppercase tracking-wider transition-colors"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Check Your Eligibility
        </a>
      </div>
    );
  }

  const { dealVerdict, program, state, propertyType, loanGoal, firstName } = data;
  const copy = getThankYouCopy(loanGoal, firstName);
  const stateFullName = state ? STATE_NAMES[state] || state : '';
  const propertyTypeName = propertyType ? PROPERTY_TYPE_NAMES[propertyType] || propertyType : '';
  const tierStyle = dealVerdict ? TIER_STYLES[dealVerdict.tier] : TIER_STYLES.workable;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Eligible banner */}
      <div className="mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/40 mx-auto" style={{ display: 'flex', width: 'fit-content' }}>
        <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700" style={{ fontFamily: 'var(--font-sans)' }}>
          Eligibility Confirmed
        </span>
      </div>

      {/* Animated checkmark */}
      <div className="mx-auto w-16 h-16 rounded-full bg-blue flex items-center justify-center animate-[scaleIn_300ms_ease-out] mt-6">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-center text-[32px] md:text-[40px] font-bold text-navy mt-6 leading-tight" style={{ fontFamily: 'var(--font-sans)' }}>
        {copy.headline}
      </h1>

      <p className="text-center text-base md:text-lg text-navy/70 mt-4 max-w-xl mx-auto leading-relaxed">
        {copy.body}
      </p>

      {/* What happens next bullets */}
      <div className="bg-off-white border border-navy/10 rounded-xl p-6 md:p-8 mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-amber mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
          What Happens Next
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-navy/80">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm md:text-base">Adam personally reviews your file and runs it against our 70+ lender network.</span>
          </li>
          <li className="flex items-start gap-3 text-navy/80">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm md:text-base">He reaches out{stateFullName ? ` to walk through your ${stateFullName} scenario` : ''} the same business day to verify a few details.</span>
          </li>
          <li className="flex items-start gap-3 text-navy/80">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm md:text-base">Once verified, your file goes to the right lender in our network for approval.</span>
          </li>
        </ul>
      </div>

      {/* Specialist Card: Adam's face leads here */}
      <div className="bg-off-white border border-navy/10 rounded-2xl p-6 md:p-8 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={SPECIALIST.headshot}
              alt={`${SPECIALIST.name}, ${SPECIALIST.title}`}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover object-top ring-2 ring-navy/15"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue flex items-center justify-center ring-2 ring-white">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-amber" style={{ fontFamily: 'var(--font-sans)' }}>
              Your DSCR Specialist
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-navy mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
              {SPECIALIST.name}
            </h2>
            <p className="text-sm text-navy/60 mt-0.5">
              {SPECIALIST.title} · NMLS #{SPECIALIST.nmls}
            </p>
            <p className="text-sm text-navy/60 mt-0.5">
              {SPECIALIST.company}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-navy/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/50 mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
            A Message From Adam
          </p>
          <p className="text-sm md:text-base text-navy/80 leading-relaxed">
            {SPECIALIST.message}
          </p>
        </div>
      </div>

      {/* Deal verdict card */}
      {dealVerdict && (
        <div className={`bg-off-white border border-navy/10 rounded-xl p-6 md:p-8 mt-8 ring-1 ${tierStyle.ring}`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/50 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Your Deal at a Glance
              </p>
              <p className="text-xl font-bold text-navy" style={{ fontFamily: 'var(--font-sans)' }}>
                {dealVerdict.label}
              </p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider ${tierStyle.pill} ${tierStyle.pillText}`}>
              {dealVerdict.tier === 'strong' ? 'Strong' : dealVerdict.tier === 'workable' ? 'Workable' : 'Specialist'}
            </span>
          </div>

          <p className="text-sm md:text-base text-navy/70 mt-3 leading-relaxed">
            {dealVerdict.headline}
          </p>

          {dealVerdict.specialistFocus.length > 0 && (
            <div className="mt-5 pt-5 border-t border-navy/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-amber mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
                What Adam Will Work On
              </p>
              <ul className="space-y-2">
                {dealVerdict.specialistFocus.map((bullet, i) => (
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

          {(propertyTypeName || stateFullName) && (
            <p className="text-xs text-navy/40 mt-5">
              {[propertyTypeName, stateFullName].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>
      )}

      {program && (
        <div className="mt-6 text-center">
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
          <p className="text-sm text-navy/60 mt-2">{program.program}</p>
        </div>
      )}

      <p className="text-navy/40 text-xs mt-10 max-w-xl mx-auto text-center leading-relaxed">
        Pre-qualification is based on the information you provided. Final approval is subject to underwriting, appraisal, and lender guidelines. This is not a loan offer or commitment to lend. {SPECIALIST.name} is a licensed Mortgage Loan Originator with {SPECIALIST.company} (NMLS #{SPECIALIST.nmls}).
      </p>
    </div>
  );
}
