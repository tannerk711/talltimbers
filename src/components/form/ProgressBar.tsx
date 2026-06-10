interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div
      className="h-5 bg-navy/[0.08] rounded-full overflow-hidden relative"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Form progress: ${percent}% complete`}
    >
      <div
        className="h-full bg-blue rounded-full transition-all duration-500 ease-out flex items-center justify-center"
        style={{ width: `${percent}%`, minWidth: '2.5rem' }}
      >
        <span className="text-[11px] font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-sans)' }}>
          {percent}%
        </span>
      </div>
    </div>
  );
}
