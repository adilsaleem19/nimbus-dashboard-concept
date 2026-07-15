import { NavLink, Outlet, useLocation } from 'react-router-dom';
import type { DateRange } from '../types';
import DateRangePicker from './DateRangePicker';

const NAV = [
  { label: 'Overview', to: '/', end: true },
  { label: 'Customers', to: '/customers', end: false },
  { label: 'Transactions', to: '/transactions', end: false },
  { label: 'Reports', to: '/reports', end: false },
  { label: 'Settings', to: '/settings', end: false },
];

function CloudLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-accent dark:fill-accent-dark" aria-hidden="true">
      <path d="M7 18a5 5 0 0 1-.58-9.97 6.5 6.5 0 0 1 12.67 1.52A4.5 4.5 0 0 1 17.5 18H7z" />
    </svg>
  );
}

const sidebarLink = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'rounded-lg bg-accent/10 px-3 py-2 text-sm font-semibold text-accent dark:bg-accent-dark/15 dark:text-accent-dark'
    : 'rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-ink/5 dark:text-ink-2-dark dark:hover:bg-white/5';

const mobileLink = ({ isActive }: { isActive: boolean }) =>
  `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent-dark ${
    isActive
      ? 'bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark'
      : 'text-ink-2 dark:text-ink-2-dark'
  }`;

export default function DashboardLayout({
  dark,
  toggleDark,
  dateRange,
  setDateRange,
  isLoading,
}: {
  dark: boolean;
  toggleDark: () => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  isLoading: boolean;
}) {
  const { pathname } = useLocation();
  const active = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to))) ?? NAV[0];
  const showDatePicker = pathname !== '/settings';

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
    <div className="flex h-dvh overflow-hidden">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-ink/10 bg-paper md:flex dark:border-white/10 dark:bg-paper-dark">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <CloudLogo />
          <span className="font-display text-lg font-bold tracking-tight">Nimbus</span>
        </div>
        <nav className="flex flex-col gap-0.5 px-3" aria-label="Main">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={sidebarLink}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-ink/10 px-5 py-4 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent dark:bg-accent-dark/20 dark:text-accent-dark">
              DR
            </div>
            <div className="text-xs">
              <div className="font-medium">Dana Reyes</div>
              <div className="text-muted">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/10 bg-page px-4 py-3 md:px-6 dark:border-white/10 dark:bg-page-dark">
          <div className="flex items-center gap-2.5">
            <span className="md:hidden">
              <CloudLogo />
            </span>
            <h1 className="font-display text-base font-semibold">{active.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            {showDatePicker && <DateRangePicker value={dateRange} onChange={setDateRange} />}
            {darkToggle}
          </div>
        </header>

        <nav
          className="flex gap-1 overflow-x-auto border-b border-ink/10 px-3 py-2 md:hidden dark:border-white/10"
          aria-label="Main"
        >
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={mobileLink}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ dark, dateRange, isLoading }} />
        </main>
      </div>
    </div>
  );
}
