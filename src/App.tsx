import DashboardLayout from './components/DashboardLayout';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
  const [dark, toggleDark] = useDarkMode();
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
      <div className="text-sm text-ink-2 dark:text-ink-2-dark">Dashboard content lands here.</div>
    </DashboardLayout>
  );
}
