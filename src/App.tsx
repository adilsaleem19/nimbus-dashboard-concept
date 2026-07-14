import { useEffect, useMemo, useRef, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import DataTable from './components/DataTable';
import DateRangePicker from './components/DateRangePicker';
import FilterChip from './components/FilterChip';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import SegmentChart from './components/SegmentChart';
import { ANCHOR_DATE, dailyMetrics, derivePlanBreakdown, transactions } from './data/mockData';
import { useDarkMode } from './hooks/useDarkMode';
import { previousWindow, rangeStart, rangeWindow } from './lib/dateRange';
import { formatCurrency, formatNumber, formatPercent } from './lib/format';
import { computeKpis } from './lib/kpis';
import { chartThemes } from './lib/palette';
import { sampleSeries } from './lib/sample';
import type { DateRange, Plan } from './types';

export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>(30);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const currentMetrics = useMemo(() => rangeWindow(dailyMetrics, dateRange, ANCHOR_DATE), [dateRange]);
  const previousMetrics = useMemo(() => previousWindow(dailyMetrics, dateRange, ANCHOR_DATE), [dateRange]);
  const kpis = useMemo(() => computeKpis(currentMetrics, previousMetrics), [currentMetrics, previousMetrics]);
  const deltaLabel = `vs previous ${dateRange} days`;

  const spark = (pick: (m: (typeof dailyMetrics)[number]) => number) =>
    sampleSeries(currentMetrics.map(pick));

  const rangeTransactions = useMemo(() => {
    const start = rangeStart(dateRange, ANCHOR_DATE);
    return transactions.filter((t) => t.date >= start);
  }, [dateRange]);

  const [planFilter, setPlanFilter] = useState<Plan | null>(null);
  const planBreakdown = useMemo(() => derivePlanBreakdown(rangeTransactions), [rangeTransactions]);
  const handleSegmentClick = (plan: Plan) => setPlanFilter((p) => (p === plan ? null : plan));
  const visibleTransactions = useMemo(
    () => (planFilter ? rangeTransactions.filter((t) => t.plan === planFilter) : rangeTransactions),
    [rangeTransactions, planFilter],
  );
  // clearing unmounts the chip / empty-state button that had focus; move focus to the
  // (always-present) table heading so keyboard and screen-reader users keep their place
  const tableHeadingRef = useRef<HTMLHeadingElement>(null);
  const clearFilter = () => {
    setPlanFilter(null);
    tableHeadingRef.current?.focus();
  };
  const planHex = chartThemes[dark ? 'dark' : 'light'].plans;

  const darkToggle = (
    <button
      type="button"
      onClick={toggleDark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-lg border border-ink/10 bg-paper p-2 text-ink-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent-dark dark:border-white/10 dark:bg-paper-dark dark:text-ink-2-dark dark:hover:text-ink-dark"
    >
      {dark ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
  return (
    <DashboardLayout
      topBarContent={
        <>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          {darkToggle}
        </>
      }
    >
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KPICard label="Monthly recurring revenue" value={formatCurrency(kpis.mrr.value)} deltaPercent={kpis.mrr.deltaPercent} deltaLabel={deltaLabel} spark={spark((m) => m.mrr)} isLoading={isLoading} />
          <KPICard label="Active users" value={formatNumber(kpis.activeUsers.value)} deltaPercent={kpis.activeUsers.deltaPercent} deltaLabel={deltaLabel} spark={spark((m) => m.activeUsers)} isLoading={isLoading} />
          {/* churn sparkline plots raw daily churned counts — shape, not the normalized headline rate */}
          <KPICard label="Churn rate" value={formatPercent(kpis.churnRate.value)} deltaPercent={kpis.churnRate.deltaPercent} deltaLabel={deltaLabel} invertColor spark={spark((m) => m.churnedUsers)} isLoading={isLoading} />
          <KPICard label="New signups" value={formatNumber(kpis.newSignups.value)} deltaPercent={kpis.newSignups.deltaPercent} deltaLabel={deltaLabel} spark={spark((m) => m.newSignups)} isLoading={isLoading} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueChart data={currentMetrics} dark={dark} isLoading={isLoading} />
          </div>
          <SegmentChart
            data={planBreakdown}
            activePlan={planFilter}
            onSegmentClick={handleSegmentClick}
            dark={dark}
            isLoading={isLoading}
          />
        </div>
        <DataTable
          transactions={visibleTransactions}
          isLoading={isLoading}
          headingRef={tableHeadingRef}
          header={
            planFilter && (
              <FilterChip plan={planFilter} colorHex={planHex[planFilter]} onClear={clearFilter} />
            )
          }
          emptyState={
            planFilter ? (
              <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
                <div className="text-sm font-medium">No {planFilter} transactions in this range</div>
                <p className="max-w-xs text-xs text-muted">
                  Try a longer date range, or clear the plan filter to see all transactions.
                </p>
                <button
                  type="button"
                  onClick={clearFilter}
                  className="rounded-lg border border-ink/10 bg-paper px-3 py-1.5 text-xs font-semibold hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-accent dark:border-white/10 dark:bg-paper-dark dark:hover:bg-white/5 dark:focus-visible:ring-accent-dark"
                >
                  Clear filter
                </button>
              </div>
            ) : undefined
          }
        />
      </>
    </DashboardLayout>
  );
}
