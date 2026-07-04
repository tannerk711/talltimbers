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
  firstName?: string;
  dealVerdict?: DealVerdict;
  program?: ProgramRecommendation;
  isFake?: boolean;
  isDemo?: boolean;
}

// Per-tier top accent bar color for the deal verdict card. The tier pill is the
// one sanctioned place a status color other than emerald appears (it encodes info).
const TIER_STYLES: Record<DealVerdict['tier'], { accent: string; pill: string; pillText: string }> = {
  strong: { accent: 'bg-green/60', pill: 'bg-green/10 border-green/40', pillText: 'text-green-700' },
  workable: { accent: 'bg-blue/60', pill: 'bg-blue/10 border-blue/40', pillText: 'text-blue-dark' },
  structuring: { accent: 'bg-amber/60', pill: 'bg-amber/10 border-amber/40', pillText: 'text-amber' },
  review: { accent: 'bg-amber/60', pill: 'bg-amber/10 border-amber/40', pillText: 'text-amber' },
};

const SPECIALIST = {
  name: 'Adam C. Cunningham',
  title: 'Mortgage Loan Originator',
  nmls: '312817',
  company: 'Tall Timbers Realty and Financial Services',
  headshot: '/images/adam-cunningham-headshot.png',
  message:
    'I have spent my career structuring DSCR and non-QM deals for investors, including the ones other lenders walk away from. The questionnaire you filled out gives me a real starting point, but every deal has nuance that does not fit in a form. That is what the call is for. I will have already reviewed your file, so we skip the runaround and get straight to what we can actually do for your deal. No call center, no script. Just two people who buy real estate talking through the numbers.',
};

const WHAT_HAPPENS_NEXT = [
  'Adam personally reviews your file and runs it against our 70+ lender network to pin down the structure your deal needs.',
  'He reaches out the same business day to walk through your scenario and confirm a few details, whether or not you book above.',
  'Once your deal is clear, we take it to the lender in our network that fits your file and get you to a clean close.',
];

const BOOKING_WIDGET_ID = '9CBi2dkCfuszehuLkyA1';
const BOOKING_WIDGET_SRC = `https://api.leadconnectorhq.com/widget/booking/${BOOKING_WIDGET_ID}`;
const BOOKING_EMBED_SCRIPT = 'https://link.msgsndr.com/js/form_embed.js';

// The win headline is intentionally the same across purchase/refinance/flip: composed
// capability framing, no rate, no exclamation, "looks like" per pre-qualification reality.
function getThankYouCopy(firstName: string | undefined): { headline: string; body: string } {
  const headline = firstName
    ? `${firstName}, your file looks like one we can close.`
    : 'Your file looks like one we can close.';
  return {
    headline,
    body: 'Based on what you shared, your scenario fits the way we structure DSCR deals. The next move is a short call with Adam. He reviews your file first, then walks you through exactly how it gets done. Grab a time below and Adam will have your file reviewed before you get on the call.',
  };
}

// Shared checkmark path so every check on the page is byte-identical (the one
// success-green check is the top eligibility pill; every other check is emerald).
function Check({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function ThankYou() {
  const [data, setData] = useState<SubmissionPayload | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [bookingLoaded, setBookingLoaded] = useState(false);
  const [bookingHeight, setBookingHeight] = useState(0);
  const confettiRef = useRef(false);
  const conversionRef = useRef(false);
  const bookingScriptRef = useRef(false);

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
          isDemo: true,
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

  // Fire the Google Ads New Lead conversion. Fires for real submissions AND the ?demo=1
  // preview (so Google Tag Assistant can verify the tag on /thank-you/?demo=1), but never
  // for the honeypot/bot path, which sets isFake WITHOUT isDemo.
  useEffect(() => {
    if (!data || conversionRef.current) return;
    const isBot = data.isFake && !data.isDemo;
    if (isBot) return;
    conversionRef.current = true;
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: 'AW-18132955750/Tbu1CMmLkrUcEObku8ZD' });
    }
  }, [data]);

  // Load the GHL booking-widget resize script once, after a real submission has
  // rendered the booking iframe. The script reads the iframe's id and posts height
  // messages so the widget auto-sizes. Guarded so it never loads twice and never
  // loads on the bot/honeypot path (which never renders the widget).
  useEffect(() => {
    if (!data || data.isFake || bookingScriptRef.current) return;
    if (typeof document === 'undefined') return;
    bookingScriptRef.current = true;
    if (document.querySelector(`script[src="${BOOKING_EMBED_SCRIPT}"]`)) return;
    const script = document.createElement('script');
    script.src = BOOKING_EMBED_SCRIPT;
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);
  }, [data]);

  // GHL's form_embed.js owns the iframe's own height: it finds the iframe by id and
  // writes iframe.style.height directly whenever the widget content resizes (e.g. the
  // calendar swaps to the taller contact form after a time is picked). We must NOT set a
  // React-controlled height on the iframe or we fight that and clip the submit button on
  // mobile. Instead we let GHL size the iframe, and just MIRROR the iframe's live height
  // into our wrapper's min-height so the card/well grows with it (no double scrollbar).
  useEffect(() => {
    if (!data || typeof window === 'undefined') return;
    const iframeId = `${BOOKING_WIDGET_ID}_1783124236181`;
    const readHeight = () => {
      const el = document.getElementById(iframeId) as HTMLIFrameElement | null;
      const h = el?.style.height ? parseInt(el.style.height, 10) : 0;
      if (h > 200) setBookingHeight(h);
    };
    // GHL posts a colon-delimited "id:height:width:type" string; catching it lets us
    // react instantly instead of waiting for the next poll tick.
    const onMessage = (e: MessageEvent) => {
      const origin = e.origin || '';
      if (!/leadconnectorhq\.com|msgsndr\.com/.test(origin)) return;
      if (typeof e.data === 'string' && e.data.includes(BOOKING_WIDGET_ID)) {
        const parts = e.data.split(':');
        const h = parseInt(parts[1], 10);
        if (!Number.isNaN(h) && h > 200) setBookingHeight(h);
      }
      // Nudge a read on the next frame in case GHL wrote the style right after posting.
      window.requestAnimationFrame(readHeight);
    };
    window.addEventListener('message', onMessage);
    const poll = window.setInterval(readHeight, 750);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearInterval(poll);
    };
  }, [data]);

  // Confetti: one tuned-down brand-palette burst on a real submission. Gated behind
  // prefers-reduced-motion (skipped entirely when the user opts out of motion).
  useEffect(() => {
    if (!data || data.isFake || confettiRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    confettiRef.current = true;
    import('canvas-confetti').then((mod) => {
      mod.default({
        particleCount: 55,
        spread: 80,
        origin: { x: 0.5, y: 0.3 },
        colors: ['#1E9E6E', '#3FC793', '#C8932C', '#07260F'],
        ticks: 200,
        gravity: 1.2,
        scalar: 1,
      });
    }).catch(() => {});
  }, [data]);

  // Card fade-up: the one scroll reveal. A single IntersectionObserver adds
  // 'is-visible' to each [data-reveal] card so the page reads as one designed
  // system unfolding. Skipped (cards shown at rest) when reduced-motion is set.
  useEffect(() => {
    if (!data || typeof window === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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

  const { dealVerdict, program, state, propertyType, firstName } = data;
  const copy = getThankYouCopy(firstName);
  const stateFullName = state ? STATE_NAMES[state] || state : '';
  const propertyTypeName = propertyType ? PROPERTY_TYPE_NAMES[propertyType] || propertyType : '';
  const tierStyle = dealVerdict ? TIER_STYLES[dealVerdict.tier] : TIER_STYLES.workable;

  return (
    <div className="max-w-3xl mx-auto">
      <style>{`
        [data-reveal]{opacity:0;transform:translateY(12px);transition:opacity 400ms ease-out,transform 400ms ease-out;}
        [data-reveal].is-visible{opacity:1;transform:none;}
      `}</style>

      {/* ===== 1. WIN BLOCK ===== */}
      <div className="text-center">
        {/* Eligible banner. The ONLY success-green on the page, earned once. */}
        <div className="mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/40" style={{ width: 'fit-content' }}>
          <Check className="w-4 h-4 text-green-700" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700" style={{ fontFamily: 'var(--font-sans)' }}>
            Eligibility Confirmed
          </span>
        </div>

        {/* Animated checkmark */}
        <div className="mx-auto w-16 h-16 rounded-full bg-blue flex items-center justify-center ring-8 ring-blue/10 animate-[scaleIn_300ms_ease-out] mt-6">
          <Check className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-[30px] md:text-[38px] font-bold text-navy mt-6 leading-[1.1] tracking-[-0.02em]" style={{ fontFamily: 'var(--font-sans)' }}>
          {copy.headline}
        </h1>

        <p className="text-base md:text-lg text-navy/70 mt-4 max-w-xl mx-auto leading-relaxed">
          {copy.body}
        </p>
      </div>

      {/* ===== 2. BOOKING CARD (sits right under the subheader). Breaks out of the
          max-w-3xl column to the full max-w-7xl width on desktop so GHL's date-grid +
          time-slot layout is fully visible and never clips. The one shadowed, pure-white
          element on the page. ===== */}
      <div
        data-reveal
        className="mt-8 lg:w-[calc(100%+32rem)] lg:-ml-64 rounded-2xl border border-navy/10 bg-white overflow-hidden shadow-[0_1px_3px_rgba(7,38,15,0.06),0_10px_30px_-15px_rgba(7,38,15,0.15)]"
      >
        {/* First-party chrome header. This IS the transitional label above the calendar. */}
        <div className="flex items-start gap-3 px-6 py-4 border-b border-navy/10 bg-blue/[0.04]">
          <span className="w-2.5 h-2.5 rounded-full bg-blue ring-4 ring-blue/15 flex-shrink-0 mt-1.5" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber" style={{ fontFamily: 'var(--font-sans)' }}>
              Schedule Your Call
            </p>
            <p className="text-lg md:text-xl font-bold text-navy tracking-[-0.01em] mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
              Grab a time with Adam
            </p>
            <p className="text-sm text-navy/60 mt-1 leading-relaxed">
              Pick a time that works for you. It is a short, no-pressure call where Adam walks through your deal, answers your questions, and lays out the path to closing.
            </p>
          </div>
        </div>

        {/* Iframe well. GHL's form_embed.js owns the iframe's height (see resize listener
            above); we only mirror that height onto this wrapper's min-height so the card
            grows with the content and the taller post-time-select contact form is never
            clipped. Placeholder fades out on iframe load. Falls back to 900px until GHL
            reports a height. The iframe height is set once via ref (uncontrolled) so React
            never re-asserts a fixed height and fights GHL's resize. */}
        <div
          className="relative px-2 md:px-4 pb-3 pt-1"
          style={{ minHeight: bookingHeight ? `${bookingHeight + 20}px` : '900px' }}
        >
          <div
            className={`absolute inset-0 flex items-center justify-center text-navy/40 text-sm pointer-events-none transition-opacity duration-300 ${bookingLoaded ? 'opacity-0' : 'opacity-100'}`}
          >
            Loading available times...
          </div>
          <iframe
            ref={(el) => { if (el && !el.style.height) el.style.height = '900px'; }}
            src={BOOKING_WIDGET_SRC}
            id={`${BOOKING_WIDGET_ID}_1783124236181`}
            title="Schedule a call with Adam"
            scrolling="no"
            onLoad={() => setBookingLoaded(true)}
            className="relative z-10 bg-white"
            style={{ width: '100%', border: 'none', overflow: 'hidden', display: 'block' }}
          />
        </div>
      </div>

      {/* ===== 3. DEAL VERDICT CARD ===== */}
      {dealVerdict && (
        <div data-reveal className="bg-off-white border border-navy/10 rounded-xl p-6 md:p-8 mt-8 overflow-hidden">
          <div className={`h-1 -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-5 ${tierStyle.accent}`} />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/50 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
                What Adam Will Work On
              </p>
              <ul className="space-y-2">
                {dealVerdict.specialistFocus.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm md:text-base text-navy/80">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue" />
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

      {/* ===== 4. RECOMMENDED-PROGRAM BADGE ===== */}
      {program && (
        <div data-reveal className="mt-8 text-center">
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border ${
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

      {/* ===== 5. SPECIALIST CARD (Adam's face + message) ===== */}
      <div data-reveal className="bg-off-white border border-navy/10 rounded-2xl p-6 md:p-8 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={SPECIALIST.headshot}
              alt={`${SPECIALIST.name}, ${SPECIALIST.title}`}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover object-top ring-2 ring-blue/25"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue flex items-center justify-center ring-2 ring-white">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber" style={{ fontFamily: 'var(--font-sans)' }}>
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/50 mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
            A Message From Adam
          </p>
          <div className="border-l-2 border-blue/30 pl-4">
            <p className="text-sm md:text-base text-navy/80 leading-relaxed">
              {SPECIALIST.message}
            </p>
          </div>
        </div>
      </div>

      {/* ===== 6. WHAT HAPPENS NEXT (safety net for the non-booker) ===== */}
      <div data-reveal className="bg-off-white border border-navy/10 rounded-xl p-6 md:p-8 mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
          What Happens Next
        </p>
        <ul className="space-y-3">
          {WHAT_HAPPENS_NEXT.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-navy/80">
              <span className="text-[11px] font-semibold tracking-[0.12em] text-amber flex-shrink-0 mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm md:text-base">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== 7. LEGAL DISCLAIMER ===== */}
      <p className="mt-12 pt-8 border-t border-navy/10 text-navy/40 text-xs max-w-xl mx-auto text-center leading-relaxed">
        Pre-qualification is based on the information you provided. Final approval is subject to underwriting, appraisal, and lender guidelines. This is not a loan offer or commitment to lend. {SPECIALIST.name} is a licensed Mortgage Loan Originator with {SPECIALIST.company} (NMLS #{SPECIALIST.nmls}).
      </p>
    </div>
  );
}
