/** 12-point sparkline: muted line, accent end-dot with a 2px surface ring. */
export default function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  // must match the h-7 w-24 (28x96px) class on the <svg> below
  const w = 96;
  const h = 28;
  const pad = 4;
  const min = Math.min(...points);
  const span = Math.max(...points) - min || 1;
  const step = (w - pad * 2) / (points.length - 1);
  const coords = points.map((p, i) => [
    pad + i * step,
    h - pad - ((p - min) / span) * (h - pad * 2),
  ]);
  const d = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const [ex, ey] = coords[coords.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-24" aria-hidden="true">
      <path
        d={d}
        fill="none"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="stroke-baseline dark:stroke-baseline-dark"
      />
      <circle cx={ex} cy={ey} r="3.5" className="fill-paper dark:fill-paper-dark" />
      <circle cx={ex} cy={ey} r="2.5" className="fill-accent dark:fill-accent-dark" />
    </svg>
  );
}
