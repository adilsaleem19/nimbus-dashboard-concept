import { useOutletContext } from 'react-router-dom';
import type { DateRange } from '../types';

export interface DashboardContext {
  dark: boolean;
  dateRange: DateRange;
  isLoading: boolean;
}

/** Shared state provided by DashboardLayout's <Outlet> to every routed view. */
export function useDashboardContext() {
  return useOutletContext<DashboardContext>();
}
