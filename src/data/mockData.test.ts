import { describe, expect, it } from 'vitest';
import {
  ANCHOR_DATE,
  PLAN_PRICES,
  dailyMetrics,
  derivePlanBreakdown,
  generateData,
  transactions,
} from './mockData';

describe('mock data generator', () => {
  it('is deterministic — two runs produce identical data', () => {
    const a = generateData();
    const b = generateData();
    expect(a.dailyMetrics).toEqual(b.dailyMetrics);
    expect(a.transactions).toEqual(b.transactions);
  });

  it('generates 180 daily metrics ending at the anchor date', () => {
    expect(dailyMetrics).toHaveLength(180);
    expect(dailyMetrics[179].date).toBe(ANCHOR_DATE);
    expect(dailyMetrics[0].date < dailyMetrics[179].date).toBe(true);
  });

  it('has no negative values anywhere', () => {
    for (const m of dailyMetrics) {
      expect(m.mrr).toBeGreaterThanOrEqual(0);
      expect(m.activeUsers).toBeGreaterThanOrEqual(0);
      expect(m.newSignups).toBeGreaterThanOrEqual(0);
      expect(m.churnedUsers).toBeGreaterThanOrEqual(0);
    }
  });

  it('shows an overall growth trend (last 30d avg MRR > first 30d avg MRR)', () => {
    const avg = (ms: { mrr: number }[]) =>
      ms.reduce((s, m) => s + m.mrr, 0) / ms.length;
    expect(avg(dailyMetrics.slice(-30))).toBeGreaterThan(avg(dailyMetrics.slice(0, 30)));
  });

  it('generates ~60 transactions dated within the last 90 days', () => {
    expect(transactions).toHaveLength(60);
    const windowStart = dailyMetrics[90].date; // day 91 of 180
    for (const t of transactions) {
      expect(t.date >= windowStart && t.date <= ANCHOR_DATE).toBe(true);
    }
  });

  it('every transaction amount matches its plan price', () => {
    for (const t of transactions) {
      expect(t.amount).toBe(PLAN_PRICES[t.plan]);
    }
  });

  it('derives plan breakdown consistent with transactions', () => {
    const breakdown = derivePlanBreakdown(transactions);
    expect(breakdown.map((b) => b.plan)).toEqual(['Starter', 'Growth', 'Scale']);
    for (const b of breakdown) {
      const distinct = new Set(
        transactions.filter((t) => t.plan === b.plan).map((t) => t.customerName),
      );
      expect(b.userCount).toBe(distinct.size);
      expect(b.mrr).toBe(distinct.size * PLAN_PRICES[b.plan]);
    }
  });
});
