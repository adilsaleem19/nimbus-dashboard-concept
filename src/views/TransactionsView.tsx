import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import { ANCHOR_DATE, PLANS, transactions } from '../data/mockData';
import { useDashboardContext } from '../hooks/useDashboardContext';
import { rangeStart } from '../lib/dateRange';
import type { Plan, TransactionStatus } from '../types';

const STATUSES: TransactionStatus[] = ['paid', 'pending', 'failed'];
const STATUS_LABELS: Record<TransactionStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
};

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | 'all';
  options: Array<{ value: T | 'all'; label: string }>;
  onChange: (v: T | 'all') => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap rounded-lg border border-ink/10 bg-paper p-0.5 dark:border-white/10 dark:bg-paper-dark"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent-dark ${
              active
                ? 'bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark'
                : 'text-ink-2 hover:text-ink dark:text-ink-2-dark dark:hover:text-ink-dark'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function TransactionsView() {
  const { dateRange, isLoading } = useDashboardContext();
  const [planFilter, setPlanFilter] = useState<Plan | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');

  const rangeTransactions = useMemo(() => {
    const start = rangeStart(dateRange, ANCHOR_DATE);
    return transactions.filter((t) => t.date >= start);
  }, [dateRange]);

  const filtered = useMemo(
    () =>
      rangeTransactions.filter(
        (t) =>
          (planFilter === 'all' || t.plan === planFilter) &&
          (statusFilter === 'all' || t.status === statusFilter),
      ),
    [rangeTransactions, planFilter, statusFilter],
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted">Plan</span>
          <Segmented
            label="Filter by plan"
            value={planFilter}
            onChange={setPlanFilter}
            options={[{ value: 'all', label: 'All' }, ...PLANS.map((p) => ({ value: p, label: p }))]}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted">Status</span>
          <Segmented
            label="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All' },
              ...STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
            ]}
          />
        </div>
      </div>
      <DataTable
        transactions={filtered}
        isLoading={isLoading}
        emptyState={
          <div className="px-4 py-12 text-center text-sm text-muted">
            No transactions match these filters.
          </div>
        }
      />
    </>
  );
}
