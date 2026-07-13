import type { DailyMetric } from '../types';

export interface Kpi {
  value: number;
  deltaPercent: number | null;
}

export interface KpiSet {
  mrr: Kpi;
  activeUsers: Kpi;
  churnRate: Kpi;
  newSignups: Kpi;
}

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);
const avg = (ns: number[]) => (ns.length ? sum(ns) / ns.length : 0);
const last = <T,>(arr: T[]): T | undefined => arr[arr.length - 1];

function pctChange(cur: number, prev: number | undefined): number | null {
  if (prev === undefined || prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}

/** Churned users over the window as a % of average active users. */
function churnRate(win: DailyMetric[]): number {
  const active = avg(win.map((m) => m.activeUsers));
  if (active === 0) return 0;
  return (sum(win.map((m) => m.churnedUsers)) / active) * 100;
}

export function computeKpis(current: DailyMetric[], previous: DailyMetric[]): KpiSet {
  const curMrr = last(current)?.mrr ?? 0;
  const curActive = last(current)?.activeUsers ?? 0;
  const curSignups = sum(current.map((m) => m.newSignups));
  const curChurn = churnRate(current);
  const hasPrev = previous.length > 0;
  return {
    mrr: { value: curMrr, deltaPercent: pctChange(curMrr, last(previous)?.mrr) },
    activeUsers: { value: curActive, deltaPercent: pctChange(curActive, last(previous)?.activeUsers) },
    newSignups: { value: curSignups, deltaPercent: hasPrev ? pctChange(curSignups, sum(previous.map((m) => m.newSignups))) : null },
    churnRate: { value: curChurn, deltaPercent: hasPrev ? pctChange(curChurn, churnRate(previous)) : null },
  };
}
