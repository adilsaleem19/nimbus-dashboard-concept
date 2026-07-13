/** Downsample a series to at most n evenly spaced points (always keeps the last). */
export function sampleSeries(values: number[], n = 12): number[] {
  if (values.length <= n) return values;
  const step = (values.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => values[Math.round(i * step)]);
}
