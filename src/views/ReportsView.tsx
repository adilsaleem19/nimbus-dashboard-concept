import { useMemo } from 'react';
import RevenueChart from '../components/RevenueChart';
import { ANCHOR_DATE, dailyMetrics, derivePlanBreakdown, transactions } from '../data/mockData';
import { useDashboardContext } from '../hooks/useDashboardContext';
import { rangeStart, rangeWindow } from '../lib/dateRange';
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from '../lib/format';
import { chartThemes } from '../lib/palette';
import { sortTransactions } from '../lib/sort';

function StatTile({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-paper p-4 shadow-xs dark:border-white/10 dark:bg-paper-dark">
      <div className="text-xs font-medium text-muted">{label}</div>
      {isLoading ? (
        <div className="mt-2 h-7 w-24 animate-pulse rounded bg-ink/5 motion-reduce:animate-none dark:bg-white/10" />
      ) : (
        <div className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</div>
      )}
    </div>
  );
}

export default function ReportsView() {
  const { dark, dateRange, isLoading } = useDashboardContext();

  const currentMetrics = useMemo(
    () => rangeWindow(dailyMetrics, dateRange, ANCHOR_DATE),
    [dateRange],
  );
  const rangeTransactions = useMemo(() => {
    const start = rangeStart(dateRange, ANCHOR_DATE);
    return transactions.filter((t) => t.date >= start);
  }, [dateRange]);

  const summary = useMemo(() => {
    const collected = rangeTransactions
      .filter((t) => t.status === 'paid')
      .reduce((s, t) => s + t.amount, 0);
    const newSignups = currentMetrics.reduce((s, m) => s + m.newSignups, 0);
    const churned = currentMetrics.reduce((s, m) => s + m.churnedUsers, 0);
    const avgActive = currentMetrics.length
      ? Math.round(currentMetrics.reduce((s, m) => s + m.activeUsers, 0) / currentMetrics.length)
      : 0;
    return { collected, newSignups, churned, avgActive };
  }, [rangeTransactions, currentMetrics]);

  const breakdown = useMemo(() => derivePlanBreakdown(rangeTransactions), [rangeTransactions]);
  const totalMrr = breakdown.reduce((s, b) => s + b.mrr, 0);
  const planHex = chartThemes[dark ? 'dark' : 'light'].plans;

  const handleExport = () => {
    const header = ['Transaction ID', 'Customer', 'Plan', 'Amount', 'Date', 'Status'];
    const rows = sortTransactions(rangeTransactions, 'date', 'desc').map((t) => [
      t.id,
      t.customerName,
      t.plan,
      String(t.amount),
      t.date,
      t.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nimbus-transactions-${dateRange}d.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Summary for the last {dateRange} days.</p>
        <button
          type="button"
          onClick={handleExport}
          disabled={isLoading || rangeTransactions.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-ink/10 bg-paper px-3 py-1.5 text-xs font-semibold hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-paper-dark dark:hover:bg-white/5 dark:focus-visible:ring-accent-dark"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Revenue collected" value={formatCurrency(summary.collected)} isLoading={isLoading} />
        <StatTile label="New signups" value={formatNumber(summary.newSignups)} isLoading={isLoading} />
        <StatTile label="Users churned" value={formatNumber(summary.churned)} isLoading={isLoading} />
        <StatTile label="Avg. active users" value={formatNumber(summary.avgActive)} isLoading={isLoading} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart data={currentMetrics} dark={dark} isLoading={isLoading} />
        </div>
        <section className="rounded-xl border border-ink/10 bg-paper p-4 shadow-xs dark:border-white/10 dark:bg-paper-dark">
          <h2 className="font-display text-sm font-semibold">Revenue by plan</h2>
          <p className="mb-4 text-xs text-muted">Gross monthly recurring revenue</p>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-ink/5 motion-reduce:animate-none dark:bg-white/10" />
              ))}
            </div>
          ) : (
            <ul className="space-y-4">
              {breakdown.map((b) => {
                const share = totalMrr > 0 ? (b.mrr / totalMrr) * 100 : 0;
                return (
                  <li key={b.plan}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: planHex[b.plan] }}
                          aria-hidden="true"
                        />
                        {b.plan}
                      </span>
                      <span className="tabular-nums">{formatCompactCurrency(b.mrr)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/5 dark:bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${share}%`, backgroundColor: planHex[b.plan] }}
                      />
                    </div>
                    <div className="mt-1 text-right text-xs text-muted tabular-nums">
                      {formatPercent(share)} · {formatNumber(b.userCount)} users
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
