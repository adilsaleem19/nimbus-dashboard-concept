import type { Plan, Transaction, TransactionStatus } from '../types';
import type { SortDirection } from './sort';

export interface Customer {
  name: string;
  /** Plan on the customer's most recent transaction. */
  plan: Plan;
  /** Sum of amounts on paid transactions only (realized revenue). */
  totalSpend: number;
  transactionCount: number;
  latestStatus: TransactionStatus;
  latestDate: string; // ISO yyyy-MM-dd
}

export type CustomerSortColumn =
  | 'name'
  | 'plan'
  | 'totalSpend'
  | 'transactionCount'
  | 'latestStatus'
  | 'latestDate';

const PLAN_ORDER: Record<Plan, number> = { Starter: 0, Growth: 1, Scale: 2 };

/**
 * Rolls a (possibly range-filtered) transaction list up to one row per customer.
 * Identity is keyed on `customerName` — the only stable customer id in the mock
 * data. A customer's `plan` / `latestStatus` reflect their most recent
 * transaction; `totalSpend` counts paid amounts only.
 */
export function deriveCustomers(rows: Transaction[]): Customer[] {
  const byName = new Map<string, Transaction[]>();
  for (const t of rows) {
    const list = byName.get(t.customerName);
    if (list) list.push(t);
    else byName.set(t.customerName, [t]);
  }

  const customers: Customer[] = [];
  for (const [name, txns] of byName) {
    // latest by ISO date; tie-break on id so the pick is deterministic
    const latest = txns.reduce((a, b) =>
      b.date > a.date || (b.date === a.date && b.id > a.id) ? b : a,
    );
    const totalSpend = txns.reduce((s, t) => s + (t.status === 'paid' ? t.amount : 0), 0);
    customers.push({
      name,
      plan: latest.plan,
      totalSpend,
      transactionCount: txns.length,
      latestStatus: latest.status,
      latestDate: latest.date,
    });
  }
  return customers;
}

export function sortCustomers(
  rows: Customer[],
  column: CustomerSortColumn,
  direction: SortDirection,
): Customer[] {
  const sorted = [...rows].sort((a, b) => {
    let cmp: number;
    if (column === 'totalSpend') cmp = a.totalSpend - b.totalSpend;
    else if (column === 'transactionCount') cmp = a.transactionCount - b.transactionCount;
    else if (column === 'plan') cmp = PLAN_ORDER[a.plan] - PLAN_ORDER[b.plan];
    else if (column === 'name') cmp = a.name.localeCompare(b.name);
    else if (column === 'latestStatus') cmp = a.latestStatus.localeCompare(b.latestStatus);
    else cmp = a.latestDate.localeCompare(b.latestDate); // ISO → chronological
    // deterministic tie-break by name so equal keys never reorder between renders
    if (cmp === 0 && column !== 'name') cmp = a.name.localeCompare(b.name);
    return direction === 'asc' ? cmp : -cmp;
  });
  return sorted;
}
