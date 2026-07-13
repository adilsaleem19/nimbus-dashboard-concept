import { addDays, format, isWeekend, subDays } from 'date-fns';
import { mulberry32 } from '../lib/prng';
import type { DailyMetric, Plan, PlanBreakdown, Transaction, TransactionStatus } from '../types';

/** Fixed anchor so data is identical across reloads AND across days. */
export const ANCHOR_DATE = '2026-07-13';
export const PLAN_PRICES: Record<Plan, number> = { Starter: 19, Growth: 49, Scale: 99 };
export const PLANS: Plan[] = ['Starter', 'Growth', 'Scale'];

const SEED = 20260713;
const DAYS = 180;

const FIRST_NAMES = [
  'Ava', 'Liam', 'Maya', 'Noah', 'Zoe', 'Ethan', 'Priya', 'Marcus', 'Elena', 'Tomas',
  'Ingrid', 'Kenji', 'Fatima', 'Diego', 'Sasha', 'Omar', 'Lucia', 'Felix', 'Nadia', 'Jonas',
];
const LAST_NAMES = [
  'Chen', 'Okafor', 'Silva', 'Novak', 'Haddad', 'Kowalski', 'Tanaka', 'Moreau', 'Lindqvist', 'Reyes',
  'Osei', 'Petrov', 'Nakamura', 'Fischer', 'Costa', 'Ali', 'Johansson', 'Duarte', 'Kaur', 'Byrne',
];

function generateDailyMetrics(rand: () => number): DailyMetric[] {
  const anchor = new Date(`${ANCHOR_DATE}T00:00:00`);
  const start = subDays(anchor, DAYS - 1);
  // Three churn-spike episodes (indices into the 180-day series).
  const spikeDays = new Set([52, 53, 96, 97, 98, 141]);
  let subscribers = 980;
  const metrics: DailyMetric[] = [];
  for (let i = 0; i < DAYS; i++) {
    const date = addDays(start, i);
    const weekend = isWeekend(date);
    const growthPhase = 1 + (i / DAYS) * 0.3; // signups drift gently upward over the half-year
    const newSignups = Math.round((weekend ? 3 : 7) * growthPhase + rand() * 4);
    const churnedUsers = Math.round(
      spikeDays.has(i) ? 18 + rand() * 10 : 1 + rand() * 3,
    );
    subscribers = Math.max(0, subscribers + newSignups - churnedUsers);
    const engagement = (weekend ? 0.44 : 0.61) + (rand() - 0.5) * 0.04;
    const activeUsers = Math.round(subscribers * engagement);
    const arpu = 46 + (rand() - 0.5) * 1.6;
    metrics.push({
      date: format(date, 'yyyy-MM-dd'),
      mrr: Math.round(subscribers * arpu),
      activeUsers,
      newSignups,
      churnedUsers,
    });
  }
  return metrics;
}

function pickPlan(r: number): Plan {
  if (r < 0.45) return 'Starter';
  if (r < 0.8) return 'Growth';
  return 'Scale';
}

function pickStatus(r: number): TransactionStatus {
  if (r < 0.8) return 'paid';
  if (r < 0.92) return 'pending';
  return 'failed';
}

function generateTransactions(rand: () => number): Transaction[] {
  const anchor = new Date(`${ANCHOR_DATE}T00:00:00`);
  const rows: Transaction[] = [];
  for (let i = 0; i < 60; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const plan = pickPlan(rand());
    const daysAgo = Math.floor(rand() * 90); // 0..89 → within last 90 days
    rows.push({
      id: `TXN-${1000 + i}`,
      customerName: `${first} ${last}`,
      plan,
      amount: PLAN_PRICES[plan],
      date: format(subDays(anchor, daysAgo), 'yyyy-MM-dd'),
      status: pickStatus(rand()),
    });
  }
  return rows;
}

export function derivePlanBreakdown(rows: Transaction[]): PlanBreakdown[] {
  return PLANS.map((plan) => {
    const distinct = new Set(rows.filter((t) => t.plan === plan).map((t) => t.customerName));
    return { plan, userCount: distinct.size, mrr: distinct.size * PLAN_PRICES[plan] };
  });
}

export function generateData() {
  const rand = mulberry32(SEED);
  const metrics = generateDailyMetrics(rand);
  const txns = generateTransactions(rand);
  return { dailyMetrics: metrics, transactions: txns };
}

const data = generateData();
export const dailyMetrics = data.dailyMetrics;
export const transactions = data.transactions;
