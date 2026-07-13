import { describe, expect, it } from 'vitest';
import { sortTransactions } from './sort';
import type { Transaction } from '../types';

const t = (id: string, customerName: string, plan: Transaction['plan'], amount: number, date: string, status: Transaction['status']): Transaction =>
  ({ id, customerName, plan, amount, date, status });

const rows: Transaction[] = [
  t('TXN-1', 'Zoe Chen', 'Scale', 99, '2026-07-01', 'paid'),
  t('TXN-2', 'Ava Silva', 'Starter', 19, '2026-07-10', 'failed'),
  t('TXN-3', 'Liam Okafor', 'Growth', 49, '2026-07-05', 'pending'),
];

describe('sortTransactions', () => {
  it('sorts by date desc (the default)', () => {
    expect(sortTransactions(rows, 'date', 'desc').map((r) => r.id)).toEqual(['TXN-2', 'TXN-3', 'TXN-1']);
  });

  it('sorts by customer name asc', () => {
    expect(sortTransactions(rows, 'customerName', 'asc').map((r) => r.customerName)).toEqual(['Ava Silva', 'Liam Okafor', 'Zoe Chen']);
  });

  it('sorts by amount asc', () => {
    expect(sortTransactions(rows, 'amount', 'asc').map((r) => r.amount)).toEqual([19, 49, 99]);
  });

  it('sorts plan by tier order, not alphabetically', () => {
    expect(sortTransactions(rows, 'plan', 'asc').map((r) => r.plan)).toEqual(['Starter', 'Growth', 'Scale']);
  });

  it('sorts by status asc alphabetically', () => {
    expect(sortTransactions(rows, 'status', 'asc').map((r) => r.status)).toEqual(['failed', 'paid', 'pending']);
  });

  it('does not mutate the input array', () => {
    const before = rows.map((r) => r.id);
    sortTransactions(rows, 'amount', 'desc');
    expect(rows.map((r) => r.id)).toEqual(before);
  });
});
