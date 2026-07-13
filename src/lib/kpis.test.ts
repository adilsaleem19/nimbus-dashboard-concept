import { describe, expect, it } from 'vitest';
import { computeKpis } from './kpis';
import type { DailyMetric } from '../types';

const d = (date: string, mrr: number, activeUsers: number, newSignups: number, churnedUsers: number): DailyMetric =>
  ({ date, mrr, activeUsers, newSignups, churnedUsers });

const previous = [d('2026-07-09', 900, 140, 8, 2), d('2026-07-10', 1000, 160, 8, 2)];
const current = [d('2026-07-11', 1050, 180, 10, 4), d('2026-07-12', 1100, 200, 14, 2)];

describe('computeKpis', () => {
  const k = computeKpis(current, previous);

  it('MRR: last-day value, delta vs previous last day', () => {
    expect(k.mrr.value).toBe(1100);
    expect(k.mrr.deltaPercent).toBeCloseTo(10, 5); // (1100-1000)/1000
  });

  it('Active users: last-day value and delta', () => {
    expect(k.activeUsers.value).toBe(200);
    expect(k.activeUsers.deltaPercent).toBeCloseTo(25, 5); // (200-160)/160
  });

  it('New signups: sum over window, delta vs previous sum', () => {
    expect(k.newSignups.value).toBe(24);
    expect(k.newSignups.deltaPercent).toBeCloseTo(50, 5); // (24-16)/16
  });

  it('Churn rate: churned / avg active, normalized to a 30-day rate, relative delta', () => {
    // current: (6 / avg(180,200)) * 100 * (30/2) = (6/190) * 100 * 15 = 47.36842
    expect(k.churnRate.value).toBeCloseTo(47.36842, 4);
    // relative delta unchanged by normalization (30/N factor cancels):
    // ((6/190) - (4/150)) / (4/150) = 18.42105
    expect(k.churnRate.deltaPercent).toBeCloseTo(18.42105, 4);
  });

  it('returns null deltas when previous window is empty', () => {
    const k2 = computeKpis(current, []);
    expect(k2.mrr.deltaPercent).toBeNull();
    expect(k2.churnRate.deltaPercent).toBeNull();
  });

  it('returns zero churn rate when active users are all zero', () => {
    const zeroActive = [d('2026-07-11', 0, 0, 0, 3), d('2026-07-12', 0, 0, 0, 5)];
    const k3 = computeKpis(zeroActive, previous);
    expect(k3.churnRate.value).toBe(0);
  });

  it('returns null MRR delta when previous last-day MRR is 0', () => {
    const zeroMrrPrev = [d('2026-07-09', 500, 140, 8, 2), d('2026-07-10', 0, 160, 8, 2)];
    const k4 = computeKpis(current, zeroMrrPrev);
    expect(k4.mrr.deltaPercent).toBeNull();
  });
});
