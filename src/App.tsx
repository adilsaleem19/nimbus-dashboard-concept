import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import KPICard from './components/KPICard';
import { sampleSeries } from './components/Sparkline';
import { ANCHOR_DATE, dailyMetrics } from './data/mockData';
import { useDarkMode } from './hooks/useDarkMode';
import { previousWindow, rangeWindow } from './lib/dateRange';
import { formatCurrency, formatNumber, formatPercent } from './lib/format';
import { computeKpis } from './lib/kpis';

export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const dateRange = 30; // becomes state in Task 10

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
    <DashboardLayout topBarContent={darkToggle}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Monthly recurring revenue" value={formatCurrency(kpis.mrr.value)} deltaPercent={kpis.mrr.deltaPercent} deltaLabel={deltaLabel} spark={spark((m) => m.mrr)} isLoading={isLoading} />
        <KPICard label="Active users" value={formatNumber(kpis.activeUsers.value)} deltaPercent={kpis.activeUsers.deltaPercent} deltaLabel={deltaLabel} spark={spark((m) => m.activeUsers)} isLoading={isLoading} />
        <KPICard label="Churn rate" value={formatPercent(kpis.churnRate.value)} deltaPercent={kpis.churnRate.deltaPercent} deltaLabel={deltaLabel} invertColor spark={spark((m) => m.churnedUsers)} isLoading={isLoading} />
        <KPICard label="New signups" value={formatNumber(kpis.newSignups.value)} deltaPercent={kpis.newSignups.deltaPercent} deltaLabel={deltaLabel} spark={spark((m) => m.newSignups)} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
