import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { Plan, PlanBreakdown } from '../types';
import { chartThemes } from '../lib/palette';
import { formatNumber, formatPercent } from '../lib/format';

function DonutSkeleton() {
  return (
    <>
      <div className="flex h-[180px] items-center justify-center">
        <div className="h-40 w-40 animate-pulse rounded-full border-[16px] border-ink/5 motion-reduce:animate-none dark:border-white/10" />
      </div>
      {/* legend placeholders keep the card height stable when data loads */}
      <ul className="mt-3 space-y-1">
        {Array.from({ length: 3 }, (_, i) => (
          <li key={i} className="px-2 py-1.5">
            <div className="h-4 animate-pulse rounded bg-ink/5 motion-reduce:animate-none dark:bg-white/10" />
          </li>
        ))}
      </ul>
    </>
  );
}

export default function SegmentChart({
  data,
  activePlan,
  onSegmentClick,
  dark,
  isLoading,
}: {
  data: PlanBreakdown[];
  activePlan: Plan | null;
  onSegmentClick: (plan: Plan) => void;
  dark: boolean;
  isLoading: boolean;
}) {
  const c = chartThemes[dark ? 'dark' : 'light'];
  const total = data.reduce((s, b) => s + b.userCount, 0);
  const visible = data.filter((b) => b.userCount > 0);

  return (
    <section className="rounded-xl border border-ink/10 bg-paper p-4 shadow-xs dark:border-white/10 dark:bg-paper-dark">
      <h2 className="font-display text-sm font-semibold">Users by plan</h2>
      <p className="mb-1 text-xs text-muted">Click a segment to filter transactions</p>
      {isLoading ? (
        <DonutSkeleton />
      ) : (
        <>
          {/* the donut duplicates the legend for pointer users; the legend below is the
              keyboard/SR-accessible equivalent, so hide the SVG from assistive tech */}
          <div className="relative h-[180px]" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visible}
                  dataKey="userCount"
                  nameKey="plan"
                  innerRadius="68%"
                  outerRadius="96%"
                  startAngle={90}
                  endAngle={-270}
                  stroke={c.surface}
                  strokeWidth={2}
                  isAnimationActive={false}
                  onClick={(_, index) => onSegmentClick(visible[index].plan)}
                >
                  {visible.map((b) => (
                    <Cell
                      key={b.plan}
                      fill={c.plans[b.plan]}
                      fillOpacity={activePlan && activePlan !== b.plan ? 0.35 : 1}
                      cursor="pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-xl font-semibold">{formatNumber(total)}</div>
              <div className="text-xs text-muted">users</div>
            </div>
          </div>
          <ul className="mt-3 space-y-1">
            {data.map((b) => {
              const active = activePlan === b.plan;
              const dimmed = activePlan !== null && !active;
              // a 0-row plan can't be filtered INTO, but if it's already the active
              // filter (e.g. after a range switch emptied it) keep it clickable to clear
              const disabled = b.userCount === 0 && !active;
              return (
                <li key={b.plan}>
                  <button
                    type="button"
                    onClick={() => onSegmentClick(b.plan)}
                    disabled={disabled}
                    aria-pressed={active}
                    aria-label={`Filter transactions by ${b.plan} plan`}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent-dark ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-ink/5 dark:hover:bg-white/5'} ${dimmed ? 'opacity-50' : ''}`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: c.plans[b.plan] }}
                      aria-hidden="true"
                    />
                    <span className="font-medium">{b.plan}</span>
                    <span className="ml-auto tabular-nums text-ink-2 dark:text-ink-2-dark">
                      {formatNumber(b.userCount)}
                    </span>
                    <span className="w-12 text-right tabular-nums text-xs text-muted">
                      {total > 0 ? formatPercent((b.userCount / total) * 100) : '—'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
