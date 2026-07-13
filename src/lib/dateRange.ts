import { format, parseISO, subDays } from 'date-fns';
import type { DailyMetric } from '../types';

/** First ISO date of an N-day window ending at (and including) anchor. */
export function rangeStart(days: number, anchor: string): string {
  return format(subDays(parseISO(anchor), days - 1), 'yyyy-MM-dd');
}

/** Metrics inside the N-day window ending at anchor. ISO strings compare lexicographically. */
export function rangeWindow(metrics: DailyMetric[], days: number, anchor: string): DailyMetric[] {
  const start = rangeStart(days, anchor);
  return metrics.filter((m) => m.date >= start && m.date <= anchor);
}

/** The N-day window immediately before the current one. */
export function previousWindow(metrics: DailyMetric[], days: number, anchor: string): DailyMetric[] {
  const prevAnchor = format(subDays(parseISO(anchor), days), 'yyyy-MM-dd');
  return rangeWindow(metrics, days, prevAnchor);
}
