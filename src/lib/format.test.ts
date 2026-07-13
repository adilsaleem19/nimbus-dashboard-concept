import { describe, expect, it } from 'vitest';
import { formatCompactCurrency, formatCurrency, formatDate, formatDelta, formatNumber, formatPercent } from './format';

describe('format helpers', () => {
  it('formats currency with no decimals', () => {
    expect(formatCurrency(54321)).toBe('$54,321');
    expect(formatCurrency(1234.5)).toBe('$1,235');
  });

  it('formats compact currency for axis ticks', () => {
    expect(formatCompactCurrency(54321)).toBe('$54K');
    expect(formatCompactCurrency(950)).toBe('$950');
  });

  it('formats numbers with grouping', () => {
    expect(formatNumber(1284)).toBe('1,284');
  });

  it('formats percentages to one decimal', () => {
    expect(formatPercent(3.15789)).toBe('3.2%');
  });

  it('formats signed deltas and em-dash for null', () => {
    expect(formatDelta(4.25)).toBe('+4.3%');
    expect(formatDelta(-1.8)).toBe('-1.8%');
    expect(formatDelta(null)).toBe('—');
  });

  it('formats ISO dates for display', () => {
    expect(formatDate('2026-07-13')).toBe('Jul 13, 2026');
  });
});
