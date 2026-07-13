import { format, parseISO } from 'date-fns';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
});
const compact = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat('en-US');
const percent = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1, maximumFractionDigits: 1,
});

export const formatCurrency = (n: number) => currency.format(n);
export const formatCompactCurrency = (n: number) => compact.format(n);
export const formatNumber = (n: number) => number.format(n);
export const formatPercent = (n: number) => `${percent.format(n)}%`;
export const formatDelta = (n: number | null) =>
  n === null ? '—' : `${n >= 0 ? '+' : ''}${percent.format(n)}%`;
export const formatDate = (iso: string) => format(parseISO(iso), 'MMM d, yyyy');
export const formatDateShort = (iso: string) => format(parseISO(iso), 'MMM d');
