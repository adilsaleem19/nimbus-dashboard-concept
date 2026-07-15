import type { ReactNode } from 'react';

const NAV = [
  { label: 'Overview', active: true },
  { label: 'Customers', active: false },
  { label: 'Transactions', active: false },
  { label: 'Reports', active: false },
  { label: 'Settings', active: false },
];

function CloudLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-accent dark:fill-accent-dark" aria-hidden="true">
      <path d="M7 18a5 5 0 0 1-.58-9.97 6.5 6.5 0 0 1 12.67 1.52A4.5 4.5 0 0 1 17.5 18H7z" />
    </svg>
  );
}

export default function DashboardLayout({
  topBarContent,
  children,
}: {
  topBarContent: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-ink/10 bg-paper md:flex dark:border-white/10 dark:bg-paper-dark">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <CloudLogo />
          <span className="font-display text-lg font-bold tracking-tight">Nimbus</span>
        </div>
        <nav className="flex flex-col gap-0.5 px-3" aria-label="Main">
          {NAV.map((item) => (
            <a
              key={item.label}
              href="#"
              aria-current={item.active ? 'page' : undefined}
              onClick={(e) => e.preventDefault()}
              className={
                item.active
                  ? 'rounded-lg bg-accent/10 px-3 py-2 text-sm font-semibold text-accent dark:bg-accent-dark/15 dark:text-accent-dark'
                  : 'rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-ink/5 dark:text-ink-2-dark dark:hover:bg-white/5'
              }
            >
              {item.label}
            </a>
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
            <h1 className="font-display text-base font-semibold md:hidden">Nimbus</h1>
            <h1 className="hidden font-display text-base font-semibold md:block">Overview</h1>
          </div>
          <div className="flex items-center gap-2">{topBarContent}</div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
