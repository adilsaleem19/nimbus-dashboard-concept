import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DailyMetric } from '../types';
import { chartThemes } from '../lib/palette';
import { formatCompactCurrency, formatCurrency, formatDate, formatDateShort } from '../lib/format';

function RevenueTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DailyMetric }> }) {
  if (!active || !payload?.length) return null;
  const m = payload[0].payload;
  return (
    <div className="rounded-lg border border-ink/10 bg-paper px-3 py-2 shadow-sm dark:border-white/10 dark:bg-paper-dark">
      <div className="font-display text-sm font-semibold">{formatCurrency(m.mrr)}</div>
      <div className="text-xs text-muted">{formatDate(m.date)}</div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex h-[280px] items-end gap-2 px-2 pb-2">
      {[45, 55, 50, 62, 58, 70, 66, 78, 74, 85, 80, 90].map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%` }}
          className="flex-1 animate-pulse rounded bg-ink/5 motion-reduce:animate-none dark:bg-white/10"
        />
      ))}
    </div>
  );
}

export default function RevenueChart({
  data,
  dark,
  isLoading,
}: {
  data: DailyMetric[];
  dark: boolean;
  isLoading: boolean;
}) {
  const c = chartThemes[dark ? 'dark' : 'light'];
  return (
    <section className="rounded-xl border border-ink/10 bg-paper p-4 shadow-xs dark:border-white/10 dark:bg-paper-dark">
      <h2 className="font-display text-sm font-semibold">Monthly recurring revenue</h2>
      <p className="mb-3 text-xs text-muted">Daily MRR over the selected range</p>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.accent} stopOpacity={0.16} />
                <stop offset="100%" stopColor={c.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={c.grid} strokeWidth={1} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              tick={{ fill: c.tick, fontSize: 11 }}
              axisLine={{ stroke: c.axis }}
              tickLine={false}
              minTickGap={32}
            />
            <YAxis
              tickFormatter={formatCompactCurrency}
              tick={{ fill: c.tick, fontSize: 11, style: { fontVariantNumeric: 'tabular-nums' } }}
              axisLine={false}
              tickLine={false}
              width={52}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ stroke: c.axis, strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="mrr"
              stroke={c.accent}
              strokeWidth={2}
              fill="url(#mrrFill)"
              activeDot={{ r: 4, fill: c.accent, stroke: c.surface, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
