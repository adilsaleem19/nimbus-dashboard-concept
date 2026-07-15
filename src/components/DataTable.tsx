import { useState, type ReactNode, type Ref } from 'react';
import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../lib/format';
import { sortTransactions, type SortColumn, type SortDirection } from '../lib/sort';
import { PlanTag, StatusPill } from './pills';

const COLUMNS: Array<{ key: SortColumn; label: string; numeric?: boolean }> = [
  { key: 'customerName', label: 'Customer' },
  { key: 'plan', label: 'Plan' },
  { key: 'amount', label: 'Amount', numeric: true },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

function SortIndicator({ direction }: { direction: SortDirection | null }) {
  return (
    <span aria-hidden="true" className="inline-block w-3 text-[10px]">
      {direction === 'asc' ? '▲' : direction === 'desc' ? '▼' : ''}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-9 animate-pulse rounded bg-ink/5 motion-reduce:animate-none dark:bg-white/10" />
      ))}
    </div>
  );
}

export default function DataTable({
  transactions,
  isLoading,
  header,
  emptyState,
  headingRef,
}: {
  transactions: Transaction[];
  isLoading: boolean;
  header?: ReactNode;
  emptyState?: ReactNode;
  // focus lands here after a drill-down filter is cleared, so keyboard users keep their place
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  const [sort, setSort] = useState<{ column: SortColumn; direction: SortDirection }>({
    column: 'date',
    direction: 'desc',
  });

  const toggleSort = (column: SortColumn) =>
    setSort((s) =>
      s.column === column
        ? { column, direction: s.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: column === 'date' ? 'desc' : 'asc' },
    );

  const rows = sortTransactions(transactions, sort.column, sort.direction);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-xs dark:border-white/10 dark:bg-paper-dark">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 px-4 py-3 dark:border-white/10">
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="font-display text-sm font-semibold outline-none">Transactions</h2>
          <p className="text-xs text-muted">{isLoading ? 'Loading…' : `${rows.length} in the selected range`}</p>
        </div>
        {header}
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : rows.length === 0 ? (
        emptyState ?? (
          <div className="px-4 py-12 text-center text-sm text-muted">No transactions in this range.</div>
        )
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left dark:border-white/10">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      sort.column === col.key
                        ? sort.direction === 'asc' ? 'ascending' : 'descending'
                        : undefined
                    }
                    className={`px-4 py-2.5 font-medium text-ink-2 dark:text-ink-2-dark ${col.numeric ? 'text-right' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      aria-label={`Sort by ${col.label}`}
                      className={`inline-flex items-center gap-1 text-xs uppercase tracking-wide hover:text-ink focus-visible:ring-2 focus-visible:ring-accent dark:hover:text-ink-dark dark:focus-visible:ring-accent-dark ${col.numeric ? 'flex-row-reverse' : ''}`}
                    >
                      {col.label}
                      <SortIndicator direction={sort.column === col.key ? sort.direction : null} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02] dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-2.5 font-medium">{t.customerName}</td>
                  <td className="px-4 py-2.5"><PlanTag plan={t.plan} /></td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatCurrency(t.amount)}</td>
                  <td className="px-4 py-2.5 tabular-nums text-ink-2 dark:text-ink-2-dark">{formatDate(t.date)}</td>
                  <td className="px-4 py-2.5"><StatusPill status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
