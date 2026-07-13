import { describe, expect, it } from 'vitest';
import { previousWindow, rangeStart, rangeWindow } from './dateRange';
import type { DailyMetric } from '../types';

const metric = (date: string): DailyMetric => ({
  date, mrr: 0, activeUsers: 0, newSignups: 0, churnedUsers: 0,
});

// 14 consecutive days ending 2026-07-13
const days = [
  '2026-06-30', '2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04',
  '2026-07-05', '2026-07-06', '2026-07-07', '2026-07-08', '2026-07-09',
  '2026-07-10', '2026-07-11', '2026-07-12', '2026-07-13',
].map(metric);

describe('rangeWindow', () => {
  it('returns the last N days inclusive of the anchor', () => {
    const win = rangeWindow(days, 7, '2026-07-13');
    expect(win).toHaveLength(7);
    expect(win[0].date).toBe('2026-07-07');
    expect(win[6].date).toBe('2026-07-13');
  });
});

describe('previousWindow', () => {
  it('returns the window of equal length immediately before', () => {
    const prev = previousWindow(days, 7, '2026-07-13');
    expect(prev).toHaveLength(7);
    expect(prev[0].date).toBe('2026-06-30');
    expect(prev[6].date).toBe('2026-07-06');
  });
});

describe('rangeStart', () => {
  it('returns the first ISO date of the window', () => {
    expect(rangeStart(7, '2026-07-13')).toBe('2026-07-07');
    expect(rangeStart(30, '2026-07-13')).toBe('2026-06-14');
  });
});
