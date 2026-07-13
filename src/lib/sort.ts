import type { Plan, Transaction } from '../types';

export type SortColumn = 'customerName' | 'plan' | 'amount' | 'date' | 'status';
export type SortDirection = 'asc' | 'desc';

const PLAN_ORDER: Record<Plan, number> = { Starter: 0, Growth: 1, Scale: 2 };

export function sortTransactions(
  rows: Transaction[],
  column: SortColumn,
  direction: SortDirection,
): Transaction[] {
  const sorted = [...rows].sort((a, b) => {
    let cmp: number;
    if (column === 'amount') cmp = a.amount - b.amount;
    else if (column === 'plan') cmp = PLAN_ORDER[a.plan] - PLAN_ORDER[b.plan];
    else cmp = a[column].localeCompare(b[column]); // date is ISO → lexicographic = chronological
    return direction === 'asc' ? cmp : -cmp;
  });
  return sorted;
}
