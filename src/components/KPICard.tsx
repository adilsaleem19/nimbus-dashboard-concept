import Sparkline from './Sparkline';
import { formatDelta } from '../lib/format';

interface KPICardProps {
  label: string;
  value: string;
  deltaPercent: number | null;
  deltaLabel: string;
  invertColor?: boolean;
  spark: number[];
  isLoading: boolean;
}

function DeltaArrow({ up }: { up: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current" aria-hidden="true">
      {up ? <path d="M6 2l4 5H2z" /> : <path d="M6 10L2 5h8z" />}
    </svg>
  );
}

export default function KPICard({
  label,
  value,
  deltaPercent,
  deltaLabel,
  invertColor = false,
  spark,
  isLoading,
}: KPICardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-ink/10 bg-paper p-4 shadow-xs dark:border-white/10 dark:bg-paper-dark">
        <div className="h-3.5 w-20 animate-pulse rounded bg-ink/5 motion-reduce:animate-none dark:bg-white/10" />
        <div className="mt-1 h-8 w-28 animate-pulse rounded bg-ink/5 motion-reduce:animate-none dark:bg-white/10" />
        <div className="mt-1.5 h-3.5 w-32 animate-pulse rounded bg-ink/5 motion-reduce:animate-none dark:bg-white/10" />
      </div>
    );
  }

  const up = (deltaPercent ?? 0) >= 0;
  const good = invertColor ? !up : up;
  const isNeutral = deltaPercent === null || deltaPercent === 0;
  const deltaColor = isNeutral
    ? 'text-muted'
    : good
      ? 'text-good dark:text-good-dark'
      : 'text-bad dark:text-bad-dark';

  return (
    <div className="rounded-xl border border-ink/10 bg-paper p-4 shadow-xs dark:border-white/10 dark:bg-paper-dark">
      <div className="text-xs font-medium text-ink-2 dark:text-ink-2-dark">{label}</div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="font-display text-2xl font-semibold tracking-tight">{value}</div>
        <Sparkline points={spark} />
      </div>
      <div className="mt-1.5 flex items-center gap-1 text-xs">
        <span className={`flex items-center gap-0.5 font-semibold ${deltaColor}`}>
          {deltaPercent !== null && deltaPercent !== 0 && <DeltaArrow up={up} />}
          {formatDelta(deltaPercent)}
        </span>
        <span className="text-muted">{deltaLabel}</span>
      </div>
    </div>
  );
}
