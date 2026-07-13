import { describe, expect, it } from 'vitest';
import { sampleSeries } from './sample';

const series = (len: number) => Array.from({ length: len }, (_, i) => i);

describe('sampleSeries', () => {
  it('returns the input as-is when length <= n', () => {
    const short = series(12);
    expect(sampleSeries(short)).toBe(short);
    expect(sampleSeries([])).toEqual([]);
    expect(sampleSeries([5])).toEqual([5]);
  });

  it('caps a 90-length input at 12 points and keeps the first and last elements', () => {
    const out = sampleSeries(series(90));
    expect(out).toHaveLength(12);
    expect(out[0]).toBe(0);
    expect(out[out.length - 1]).toBe(89);
  });

  it('never produces out-of-bounds or undefined entries', () => {
    for (const len of [13, 30, 90]) {
      const out = sampleSeries(series(len));
      expect(out).toHaveLength(12);
      for (const v of out) {
        expect(v).toBeDefined();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(len - 1);
      }
    }
  });

  it('n=2 on a long array returns [first, last]', () => {
    expect(sampleSeries(series(90), 2)).toEqual([0, 89]);
  });
});
