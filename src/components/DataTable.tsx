import { useState, type ReactNode } from 'react';
import type { Plan, Transaction, TransactionStatus } from '../types';
import { formatCurrency, formatDate } from '../lib/format';
import { sortTransactions, type SortColumn, type SortDirection } from '../lib/sort';

const COLUMNS: Array<{ key: SortColumn; label: string; numeric?: boolean }> = [
  { key: 'customerName', label: 'Customer' },
  { key: 'plan', label: 'Plan' },
  { key: 'amount', label: 'Amount', numeric: true },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const STATUS_STYLES: Record<TransactionStatus, { dot: string; pill: string; label: string }> = {
  paid: {
    dot: 'bg-[#0ca30c]',
    pill: 'bg-[#0ca30c]/10 text-good dark:text-good-dark',
    label: 'Paid',
  },
  pending: {
    dot: 'bg-[#fab219]',
    pill: 'bg-[#fab219]/15 text-[#8a5a00] dark:text-[#fab219]',
    label: 'Pending',
  },
  failed: {
    dot: 'bg-[#d03b3b]',
    pill: 'bg-[#d03b3b]/10 text-bad dark:text-bad-dark',
    label: 'Failed',
  },
};

const PLAN_DOTS: Record<Plan, string> = {
  Starter: 'bg-accent dark:bg-accent-dark',
  Growth: 'bg-[#1baf7a] dark:bg-[#199e70]',
  Scale: 'bg-[#eda100] dark:bg-[#c98500]',
};

function StatusPill({ status }: { status: TransactionStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

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
}: {
  transactions: Transaction[];
  isLoading: boolean;
  header?: ReactNode;
  emptyState?: ReactNode;
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
    <section className="mt-4 rounded-xl border border-ink/10 bg-paper shadow-xs dark:border-white/10 dark:bg-paper-dark">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 px-4 py-3 dark:border-white/10">
        <div>
          <h2 className="font-display text-sm font-semibold">Transactions</h2>
          <p className="text-xs text-muted">{rows.length} in the selected range</p>
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
                      className={`inline-flex items-center gap-1 text-xs uppercase tracking-wide hover:text-ink focus-visible:ring-2 focus-visible:ring-accent dark:hover:text-ink-dark ${col.numeric ? 'flex-row-reverse' : ''}`}
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
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-ink-2 dark:text-ink-2-dark">
                      <span className={`h-1.5 w-1.5 rounded-full ${PLAN_DOTS[t.plan]}`} aria-hidden="true" />
                      {t.plan}
                    </span>
                  </td>
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
