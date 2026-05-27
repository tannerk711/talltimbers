import { useEffect, useCallback, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import {
  $loanGoal, $propertyType, $state, $propertyValue, $downPayment, $loanBalance,
  $rehabBudget, $cashFlow, $creditScore, $usCitizen, $timeline,
  $firstName, $lastName, $phone, $email, $utmParams,
  $currentStep, $direction, $consent, $honeypot, $isSubmitting, $submitError,
  $submittedData, $matchedBroker, captureUTMParams, clearFormData, processURLParams,
} from '../../stores/formStore';
import { getBrokerForState, getBrokerConfig, formatPhoneE164, getDeviceType, STATE_NAMES, PROPERTY_TYPE_NAMES } from '../../utils/brokerRouting';
import { getDealVerdict, getRecommendedProgram } from '../../utils/rateEstimation';

// Human-readable labels for each multiple-choice field. Mirrors the option
// labels rendered in the Step* components so Adam sees readable values in GHL
// instead of raw codes like "700_739" or "25_pct".
const LOAN_GOAL_LABELS: Record<string, string> = {
  purchase: 'Purchase a Property',
  refinance: 'Refinance',
  flip: 'Fix & Flip',
};
const CASH_FLOW_LABELS: Record<string, string> = {
  positive: 'Positive Cash Flow',
  break_even: 'Break-Even',
  negative: 'Negative Cash Flow',
};
const CREDIT_LABELS: Record<string, string> = {
  '740_plus': '740+',
  '700_739': '700-739',
  '640_699': '640-699',
  below_640: 'Below 640',
};
const CITIZENSHIP_LABELS: Record<string, string> = {
  yes: 'US Citizen',
  permanent_resident: 'Permanent Resident',
  foreign_national: 'Non-Permanent / Foreign National',
};
const TIMELINE_LABELS: Record<string, string> = {
  ready_now: 'Ready Now',
  within_30_days: 'Within 30 Days',
  within_90_days: 'Within 90 Days',
  just_researching: 'Just Researching',
};
const DOWN_PAYMENT_LABELS: Record<string, string> = {
  '20': '20%',
  '25': '25%',
  '30': '30%',
  '35_plus': '35%+',
};

function formatCurrency(raw: string): string {
  if (!raw) return '';
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return raw;
  return `$${n.toLocaleString('en-US')}`;
}
import ProgressBar from './ProgressBar';
import StepLoanGoal from './StepLoanGoal';
import StepPropertyType from './StepPropertyType';
import StepLocation from './StepLocation';
import StepPropertyValue from './StepPropertyValue';
import StepDownPayment from './StepDownPayment';
import StepLoanBalance from './StepLoanBalance';
import StepRehabBudget from './StepRehabBudget';
import StepCashFlow from './StepCashFlow';
import StepCreditScore from './StepCreditScore';
import StepCitizenship from './StepCitizenship';
import StepTimeline from './StepTimeline';
import StepContact from './StepContact';

function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
}

// Path step definitions. Each entry is a logical question. The router renders
// step N (1-indexed) for the current path. `loan_goal` is always step 1 and
// chooses the path; from step 2 onward, the path determines what shows.
type StepKey =
  | 'loan_goal'
  | 'property_type'
  | 'state'
  | 'property_value'
  | 'down_payment'
  | 'loan_balance'
  | 'rehab_budget'
  | 'cash_flow'
  | 'credit'
  | 'citizenship'
  | 'timeline'
  | 'contact';

const PATHS: Record<string, StepKey[]> = {
  // Purchase: type → state → value → down → cash flow → credit → citizenship → timeline → contact
  purchase: [
    'loan_goal', 'property_type', 'state', 'property_value', 'down_payment',
    'cash_flow', 'credit', 'citizenship', 'timeline', 'contact',
  ],
  // Refinance / Cash-Out: type → state → value → balance → cash flow → credit → timeline → contact
  refinance: [
    'loan_goal', 'property_type', 'state', 'property_value', 'loan_balance',
    'cash_flow', 'credit', 'timeline', 'contact',
  ],
  // Fix & Flip: type → state → purchase price → rehab → credit → citizenship → timeline → contact
  flip: [
    'loan_goal', 'property_type', 'state', 'property_value', 'rehab_budget',
    'credit', 'citizenship', 'timeline', 'contact',
  ],
};

function getPathSteps(loanGoal: string): StepKey[] {
  return PATHS[loanGoal] || PATHS.purchase;
}

export default function DSCRForm() {
  const currentStep = useStore($currentStep);
  const direction = useStore($direction);
  const loanGoal = useStore($loanGoal);
  const propertyType = useStore($propertyType);
  const state = useStore($state);
  const propertyValue = useStore($propertyValue);
  const downPayment = useStore($downPayment);
  const loanBalance = useStore($loanBalance);
  const rehabBudget = useStore($rehabBudget);
  const cashFlow = useStore($cashFlow);
  const creditScore = useStore($creditScore);
  const usCitizen = useStore($usCitizen);
  const timeline = useStore($timeline);
  const firstName = useStore($firstName);
  const lastName = useStore($lastName);
  const phone = useStore($phone);
  const email = useStore($email);
  const consent = useStore($consent);
  const honeypot = useStore($honeypot);
  const isSubmitting = useStore($isSubmitting);
  const submitError = useStore($submitError);

  const steps = useMemo(() => getPathSteps(loanGoal || 'purchase'), [loanGoal]);
  const totalSteps = steps.length;
  const stepKey = steps[Math.min(currentStep - 1, totalSteps - 1)];

  // Initialize on mount. Always start at step 1 unless we're on /qualify and the user has resumable state.
  useEffect(() => {
    processURLParams();
    captureUTMParams();
    $currentStep.set(1);
    trackEvent('form_view', { step: 1, page: window.location.pathname });
  }, []);

  const goForward = useCallback(() => {
    $direction.set('forward');
    $currentStep.set($currentStep.get() + 1);
    trackEvent('form_step', { step: $currentStep.get() - 1, page: window.location.pathname });
  }, []);

  const goBack = useCallback(() => {
    if ($currentStep.get() > 1) {
      $direction.set('backward');
      $currentStep.set($currentStep.get() - 1);
      trackEvent('form_back', { from_step: $currentStep.get() + 1, to_step: $currentStep.get() });
    }
  }, []);

  // Step 1: Loan Goal, auto-advance and set path
  const handleLoanGoalSelect = useCallback((value: string) => {
    $loanGoal.set(value);
    setTimeout(() => {
      $direction.set('forward');
      $currentStep.set(2);
      trackEvent('form_step', { step: 1, value, page: window.location.pathname });
    }, 300);
  }, []);

  // Property Type, auto-advance
  const handlePropertyTypeSelect = useCallback((value: string) => {
    $propertyType.set(value);
    setTimeout(() => {
      $direction.set('forward');
      $currentStep.set($currentStep.get() + 1);
    }, 300);
  }, []);

  // Location, auto-advance with confirmation delay
  const handleLocationSelect = useCallback((value: string) => {
    $state.set(value);
    const broker = getBrokerForState(value);
    $matchedBroker.set(broker);
    setTimeout(() => {
      $direction.set('forward');
      $currentStep.set($currentStep.get() + 1);
    }, 500);
  }, []);

  // Down payment, auto-advance after a beat (so user sees the qualifier message)
  const handleDownPaymentSelect = useCallback((value: string) => {
    $downPayment.set(value);
    setTimeout(() => {
      $direction.set('forward');
      $currentStep.set($currentStep.get() + 1);
    }, 450);
  }, []);

  // Cash flow, auto-advance
  const handleCashFlowSelect = useCallback((value: string) => {
    $cashFlow.set(value);
    setTimeout(() => {
      $direction.set('forward');
      $currentStep.set($currentStep.get() + 1);
    }, 450);
  }, []);

  // Credit, auto-advance
  const handleCreditSelect = useCallback((value: string) => {
    $creditScore.set(value);
    setTimeout(() => {
      $direction.set('forward');
      $currentStep.set($currentStep.get() + 1);
    }, 450);
  }, []);

  // Citizenship, auto-advance
  const handleCitizenshipSelect = useCallback((value: string) => {
    $usCitizen.set(value);
    setTimeout(() => {
      $direction.set('forward');
      $currentStep.set($currentStep.get() + 1);
    }, 450);
  }, []);

  // Timeline, auto-advance
  const handleTimelineSelect = useCallback((value: string) => {
    $timeline.set(value);
    setTimeout(() => {
      $direction.set('forward');
      $currentStep.set($currentStep.get() + 1);
    }, 450);
  }, []);

  // Submit
  const handleSubmit = useCallback(async () => {
    trackEvent('form_submit_click', { step: currentStep });

    // Honeypot check. Silently route to thank-you with fake data.
    if ($honeypot.get()) {
      const fakeVerdict = getDealVerdict('700_739');
      const fakeProgram = getRecommendedProgram({
        loanGoal: $loanGoal.get(),
        cashFlow: $cashFlow.get(),
        usCitizen: $usCitizen.get() || 'yes',
        propertyType: $propertyType.get() || 'single_family',
      });
      const payload = {
        loanGoal: $loanGoal.get() || 'purchase',
        state: $state.get() || 'TX',
        propertyType: $propertyType.get() || 'single_family',
        creditScore: '700_739',
        cashFlow: 'positive',
        dealVerdict: fakeVerdict,
        program: fakeProgram,
        isFake: true,
      };
      sessionStorage.setItem('tall_timbers_submission', JSON.stringify(payload));
      window.location.href = '/thank-you/';
      return;
    }

    $isSubmitting.set(true);
    $submitError.set(null);

    const brokerKey = $matchedBroker.get() || getBrokerForState($state.get());
    // Use cashFlow as the second arg for the verdict (negative = no-ratio path)
    const dealVerdict = getDealVerdict($creditScore.get(), $cashFlow.get());
    const programRec = getRecommendedProgram({
      loanGoal: $loanGoal.get(),
      cashFlow: $cashFlow.get(),
      usCitizen: $usCitizen.get(),
      propertyType: $propertyType.get(),
    });

    let utmParsed: Record<string, string | null> = {};
    try { utmParsed = JSON.parse($utmParams.get()); } catch {}

    const firstName = $firstName.get().trim();
    const lastName = $lastName.get().trim();
    const stateCode = $state.get();
    const propertyTypeCode = $propertyType.get();
    const loanGoalCode = $loanGoal.get();
    const downPaymentCode = $downPayment.get();
    const cashFlowCode = $cashFlow.get();
    const creditCode = $creditScore.get();
    const citizenshipCode = $usCitizen.get();
    const timelineCode = $timeline.get();
    const propertyValueRaw = $propertyValue.get();
    const loanBalanceRaw = $loanBalance.get();
    const rehabBudgetRaw = $rehabBudget.get();

    // Flat payload. Every field at the top level so Adam can map each one
    // directly in Zapier/GHL without traversing nested objects. Each
    // multiple-choice field is sent as both a raw code (for logic) and a
    // human-readable label (for the GHL contact record and notification emails).
    const payload = {
      // Contact
      firstName,
      lastName,
      fullName: [firstName, lastName].filter(Boolean).join(' '),
      email: $email.get().trim().toLowerCase(),
      phone: formatPhoneE164($phone.get()),
      phoneDisplay: $phone.get(),

      // Loan goal
      loanGoal: loanGoalCode,
      loanGoalLabel: LOAN_GOAL_LABELS[loanGoalCode] || loanGoalCode,

      // Property
      propertyType: propertyTypeCode,
      propertyTypeLabel: PROPERTY_TYPE_NAMES[propertyTypeCode] || propertyTypeCode,
      state: stateCode,
      stateName: STATE_NAMES[stateCode] || stateCode,

      // Money
      propertyValue: propertyValueRaw,
      propertyValueFormatted: formatCurrency(propertyValueRaw),
      downPayment: downPaymentCode,
      downPaymentLabel: DOWN_PAYMENT_LABELS[downPaymentCode] || downPaymentCode,
      loanBalance: loanBalanceRaw,
      loanBalanceFormatted: formatCurrency(loanBalanceRaw),
      rehabBudget: rehabBudgetRaw,
      rehabBudgetFormatted: formatCurrency(rehabBudgetRaw),

      // Borrower profile
      cashFlow: cashFlowCode,
      cashFlowLabel: CASH_FLOW_LABELS[cashFlowCode] || cashFlowCode,
      creditScore: creditCode,
      creditScoreLabel: CREDIT_LABELS[creditCode] || creditCode,
      usCitizen: citizenshipCode,
      usCitizenLabel: CITIZENSHIP_LABELS[citizenshipCode] || citizenshipCode,
      timeline: timelineCode,
      timelineLabel: TIMELINE_LABELS[timelineCode] || timelineCode,

      // Deal verdict (computed)
      dealTier: dealVerdict.tier,
      dealLabel: dealVerdict.label,
      dealHeadline: dealVerdict.headline,
      recommendedProgram: programRec.program,
      recommendedProgramBadge: programRec.badge,

      // Attribution (flat, not nested under "source")
      utmSource: utmParsed.utm_source || '',
      utmMedium: utmParsed.utm_medium || '',
      utmCampaign: utmParsed.utm_campaign || '',
      utmTerm: utmParsed.utm_term || '',
      utmContent: utmParsed.utm_content || '',
      gclid: utmParsed.gclid || '',
      fbclid: utmParsed.fbclid || '',
      landingPageUrl: window.location.href,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      deviceType: getDeviceType(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',

      // Routing (still useful for downstream automation)
      matchedBroker: brokerKey,

      // Timestamp
      submittedAt: new Date().toISOString(),
    };

    // Send Adam's GHL webhook (Zapier) on every submit. Tall Timbers is single-broker;
    // Adam gets every lead regardless of state routing. Sent as a CORS-safe "simple
    // request" (text/plain body containing JSON) so the browser does not fire a
    // preflight OPTIONS that Zapier's catch hook rejects, which was silently
    // dropping submissions from the live site.
    const ADAM_GHL_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/7361629/4ovjjmn/';
    try {
      await fetch(ADAM_GHL_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
        keepalive: true,
      });
    } catch (err) {
      console.warn('[GHL webhook] failed:', err);
    }

    const config = getBrokerConfig(brokerKey);
    let success = false;

    if (config.webhookUrl) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(config.apiKey ? { 'x-api-key': config.apiKey } : {}),
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000),
          });
          if (response.ok) {
            success = true;
            break;
          }
        } catch {
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 2000));
          }
        }
      }
    } else {
      // No webhook configured. Treat as success for development.
      success = true;
    }

    $isSubmitting.set(false);

    if (success) {
      trackEvent('generate_lead', {
        broker: brokerKey,
        state: payload.state,
        property_type: payload.propertyType,
        loan_goal: payload.loanGoal,
        credit_tier: payload.creditScore,
        deal_tier: payload.dealTier,
      });

      // Persist submission for the thank-you page to render the verdict + broker context.
      const successPayload = { ...payload, dealVerdict, program: programRec };
      sessionStorage.setItem('tall_timbers_submission', JSON.stringify(successPayload));
      $submittedData.set(successPayload);
      clearFormData();

      // Redirect to dedicated thank-you page (which can host a per-broker video).
      window.location.href = '/thank-you/';
    } else {
      trackEvent('form_error', { error_type: 'webhook_failed', step: currentStep });
      $submitError.set('Something went wrong. Your information has been saved. Please try again or call us.');
    }
  }, [currentStep]);

  const handleRetry = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <div className="min-h-[400px]">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      {currentStep > 1 && (
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-1 text-white/70 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors duration-150 mb-4"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}

      <div
        key={`${loanGoal}-${currentStep}`}
        style={{
          animation: `${direction === 'forward' ? 'slideLeft' : 'slideRight'} 300ms ease-out`,
        }}
      >
        {stepKey === 'loan_goal' && (
          <StepLoanGoal value={loanGoal} onSelect={handleLoanGoalSelect} />
        )}
        {stepKey === 'property_type' && (
          <StepPropertyType value={propertyType} onSelect={handlePropertyTypeSelect} />
        )}
        {stepKey === 'state' && (
          <StepLocation value={state} onSelect={handleLocationSelect} />
        )}
        {stepKey === 'property_value' && (
          <StepPropertyValue
            value={propertyValue}
            onChange={(v) => $propertyValue.set(v)}
            onContinue={goForward}
            headline={
              loanGoal === 'flip'
                ? 'What is the purchase price?'
                : loanGoal === 'refinance'
                  ? 'What is the property value?'
                  : 'What is the estimated property value?'
            }
            ariaLabel={loanGoal === 'flip' ? 'Purchase price' : 'Property value'}
          />
        )}
        {stepKey === 'down_payment' && (
          <StepDownPayment value={downPayment} onSelect={handleDownPaymentSelect} />
        )}
        {stepKey === 'loan_balance' && (
          <StepLoanBalance
            value={loanBalance}
            propertyValue={propertyValue}
            onChange={(v) => $loanBalance.set(v)}
            onContinue={goForward}
          />
        )}
        {stepKey === 'rehab_budget' && (
          <StepRehabBudget
            value={rehabBudget}
            onChange={(v) => $rehabBudget.set(v)}
            onContinue={goForward}
          />
        )}
        {stepKey === 'cash_flow' && (
          <StepCashFlow value={cashFlow} onSelect={handleCashFlowSelect} />
        )}
        {stepKey === 'credit' && (
          <StepCreditScore value={creditScore} onSelect={handleCreditSelect} />
        )}
        {stepKey === 'citizenship' && (
          <StepCitizenship value={usCitizen} onSelect={handleCitizenshipSelect} />
        )}
        {stepKey === 'timeline' && (
          <StepTimeline value={timeline} onSelect={handleTimelineSelect} />
        )}
        {stepKey === 'contact' && (
          <StepContact
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            consent={consent}
            honeypot={honeypot}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onFirstNameChange={(v) => $firstName.set(v)}
            onLastNameChange={(v) => $lastName.set(v)}
            onEmailChange={(v) => $email.set(v)}
            onPhoneChange={(v) => $phone.set(v)}
            onConsentChange={(v) => $consent.set(v)}
            onHoneypotChange={(v) => $honeypot.set(v)}
            onSubmit={handleSubmit}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}
