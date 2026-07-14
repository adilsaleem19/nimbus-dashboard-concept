import type { DateRange } from '../types';

const OPTIONS: DateRange[] = [7, 30, 90];

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Date range"
      className="flex rounded-lg border border-ink/10 bg-paper p-0.5 dark:border-white/10 dark:bg-paper-dark"
    >
      {OPTIONS.map((days) => {
        const active = value === days;
        return (
          <button
            key={days}
            type="button"
            onClick={() => onChange(days)}
            aria-pressed={active}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent-dark ${
              active
                ? 'bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark'
                : 'text-ink-2 hover:text-ink dark:text-ink-2-dark dark:hover:text-ink-dark'
            }`}
          >
            {days}d
          </button>
        );
      })}
    </div>
  );
}
