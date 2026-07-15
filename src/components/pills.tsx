import type { Plan, TransactionStatus } from '../types';

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
    // darker text than the #d03b3b dot so 12px pill text clears AA on the light tint
    dot: 'bg-[#d03b3b]',
    pill: 'bg-[#d03b3b]/10 text-[#a51f1f] dark:text-bad-dark',
    label: 'Failed',
  },
};

const PLAN_DOTS: Record<Plan, string> = {
  Starter: 'bg-accent dark:bg-accent-dark',
  Growth: 'bg-[#1baf7a] dark:bg-[#199e70]',
  Scale: 'bg-[#eda100] dark:bg-[#c98500]',
};

export function StatusPill({ status }: { status: TransactionStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

export function PlanTag({ plan }: { plan: Plan }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-2 dark:text-ink-2-dark">
      <span className={`h-1.5 w-1.5 rounded-full ${PLAN_DOTS[plan]}`} aria-hidden="true" />
      {plan}
    </span>
  );
}
