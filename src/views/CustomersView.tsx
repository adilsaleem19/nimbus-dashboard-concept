import { useMemo, useState } from 'react';
import { PlanTag, StatusPill } from '../components/pills';
import { ANCHOR_DATE, transactions } from '../data/mockData';
import { useDashboardContext } from '../hooks/useDashboardContext';
import {
  deriveCustomers,
  sortCustomers,
  type CustomerSortColumn,
} from '../lib/customers';
import { rangeStart } from '../lib/dateRange';
import { formatCurrency, formatDate, formatNumber } from '../lib/format';
import type { SortDirection } from '../lib/sort';

const COLUMNS: Array<{ key: CustomerSortColumn; label: string; numeric?: boolean }> = [
  { key: 'name', label: 'Customer' },
  { key: 'plan', label: 'Plan' },
  { key: 'transactionCount', label: 'Transactions', numeric: true },
  { key: 'totalSpend', label: 'Total spend', numeric: true },
  { key: 'latestDate', label: 'Last activity' },
  { key: 'latestStatus', label: 'Status' },
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

export default function CustomersView() {
  const { dateRange, isLoading } = useDashboardContext();

  const customers = useMemo(() => {
    const start = rangeStart(dateRange, ANCHOR_DATE);
    return deriveCustomers(transactions.filter((t) => t.date >= start));
  }, [dateRange]);

  const [sort, setSort] = useState<{ column: CustomerSortColumn; direction: SortDirection }>({
    column: 'totalSpend',
    direction: 'desc',
  });

  const toggleSort = (column: CustomerSortColumn) =>
    setSort((s) =>
      s.column === column
        ? { column, direction: s.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: column === 'name' || column === 'plan' ? 'asc' : 'desc' },
    );

  const rows = sortCustomers(customers, sort.column, sort.direction);

  return (
    <section className="overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-xs dark:border-white/10 dark:bg-paper-dark">
      <div className="border-b border-ink/10 px-4 py-3 dark:border-white/10">
        <h2 className="font-display text-sm font-semibold">Customers</h2>
        <p className="text-xs text-muted">
          {isLoading ? 'Loading…' : `${rows.length} with activity in the selected range`}
        </p>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : rows.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-muted">No customers in this range.</div>
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
              {rows.map((c) => (
                <tr
                  key={c.name}
                  className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02] dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-2.5 font-medium">{c.name}</td>
                  <td className="px-4 py-2.5"><PlanTag plan={c.plan} /></td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-ink-2 dark:text-ink-2-dark">
                    {formatNumber(c.transactionCount)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatCurrency(c.totalSpend)}</td>
                  <td className="px-4 py-2.5 tabular-nums text-ink-2 dark:text-ink-2-dark">{formatDate(c.latestDate)}</td>
                  <td className="px-4 py-2.5"><StatusPill status={c.latestStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
