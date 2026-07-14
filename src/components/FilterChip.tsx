import type { Plan } from '../types';

export default function FilterChip({
  plan,
  colorHex,
  onClear,
}: {
  plan: Plan;
  colorHex: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 py-1 pl-2.5 pr-1 text-xs font-medium text-accent dark:border-accent-dark/30 dark:bg-accent-dark/15 dark:text-accent-dark">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colorHex }} aria-hidden="true" />
      Plan: {plan}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Clear ${plan} filter`}
        className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-accent dark:hover:bg-accent-dark/25 dark:focus-visible:ring-accent-dark"
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}
