import { describe, expect, it } from 'vitest';
import { deriveCustomers, sortCustomers } from './customers';
import type { Transaction } from '../types';

const tx = (over: Partial<Transaction>): Transaction => ({
  id: 'TXN-0',
  customerName: 'Ava Chen',
  plan: 'Starter',
  amount: 19,
  date: '2026-01-01',
  status: 'paid',
  ...over,
});

describe('deriveCustomers', () => {
  it('groups transactions by customer name', () => {
    const rows = [
      tx({ id: 'TXN-1', customerName: 'Ava Chen' }),
      tx({ id: 'TXN-2', customerName: 'Ava Chen' }),
      tx({ id: 'TXN-3', customerName: 'Liam Silva' }),
    ];
    const customers = deriveCustomers(rows);
    expect(customers).toHaveLength(2);
    expect(customers.find((c) => c.name === 'Ava Chen')?.transactionCount).toBe(2);
    expect(customers.find((c) => c.name === 'Liam Silva')?.transactionCount).toBe(1);
  });

  it('sums only paid amounts into totalSpend', () => {
    const rows = [
      tx({ id: 'TXN-1', amount: 49, status: 'paid' }),
      tx({ id: 'TXN-2', amount: 49, status: 'pending' }),
      tx({ id: 'TXN-3', amount: 49, status: 'failed' }),
    ];
    expect(deriveCustomers(rows)[0].totalSpend).toBe(49);
  });

  it('takes plan and status from the most recent transaction', () => {
    const rows = [
      tx({ id: 'TXN-1', plan: 'Starter', status: 'paid', date: '2026-01-01' }),
      tx({ id: 'TXN-2', plan: 'Scale', status: 'failed', date: '2026-03-15' }),
    ];
    const [c] = deriveCustomers(rows);
    expect(c.plan).toBe('Scale');
    expect(c.latestStatus).toBe('failed');
    expect(c.latestDate).toBe('2026-03-15');
  });

  it('breaks a same-date tie deterministically by id', () => {
    const rows = [
      tx({ id: 'TXN-1', plan: 'Starter', date: '2026-05-01' }),
      tx({ id: 'TXN-2', plan: 'Scale', date: '2026-05-01' }),
    ];
    expect(deriveCustomers(rows)[0].plan).toBe('Scale'); // TXN-2 > TXN-1
  });
});

describe('sortCustomers', () => {
  const base = deriveCustomers([
    tx({ id: 'TXN-1', customerName: 'Ava Chen', amount: 19, status: 'paid' }),
    tx({ id: 'TXN-2', customerName: 'Zoe Byrne', plan: 'Scale', amount: 99, status: 'paid' }),
    tx({ id: 'TXN-3', customerName: 'Ava Chen', amount: 19, status: 'paid' }),
  ]);

  it('sorts by totalSpend ascending and descending', () => {
    const asc = sortCustomers(base, 'totalSpend', 'asc').map((c) => c.totalSpend);
    expect(asc).toEqual([38, 99]);
    const desc = sortCustomers(base, 'totalSpend', 'desc').map((c) => c.totalSpend);
    expect(desc).toEqual([99, 38]);
  });

  it('sorts by name', () => {
    expect(sortCustomers(base, 'name', 'asc').map((c) => c.name)).toEqual([
      'Ava Chen',
      'Zoe Byrne',
    ]);
  });

  it('does not mutate the input array', () => {
    const snapshot = base.map((c) => c.name);
    sortCustomers(base, 'name', 'desc');
    expect(base.map((c) => c.name)).toEqual(snapshot);
  });
});
