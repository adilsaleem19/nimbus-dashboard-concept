import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import { useDarkMode } from './hooks/useDarkMode';
import CustomersView from './views/CustomersView';
import OverviewView from './views/OverviewView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import TransactionsView from './views/TransactionsView';
import type { DateRange } from './types';

export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const [dateRange, setDateRange] = useState<DateRange>(30);
  const [isLoading, setIsLoading] = useState(true);

  // one-shot skeleton on first paint; navigating between views afterwards is instant
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <Routes>
      <Route
        element={
          <DashboardLayout
            dark={dark}
            toggleDark={toggleDark}
            dateRange={dateRange}
            setDateRange={setDateRange}
            isLoading={isLoading}
          />
        }
      >
        <Route index element={<OverviewView />} />
        <Route path="customers" element={<CustomersView />} />
        <Route path="transactions" element={<TransactionsView />} />
        <Route path="reports" element={<ReportsView />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
