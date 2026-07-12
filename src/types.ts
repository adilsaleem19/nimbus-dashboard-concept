export type Plan = 'Starter' | 'Growth' | 'Scale';

export interface DailyMetric {
  date: string; // ISO yyyy-MM-dd
  mrr: number;
  activeUsers: number;
  newSignups: number;
  churnedUsers: number;
}

export type TransactionStatus = 'paid' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  customerName: string;
  plan: Plan;
  amount: number;
  date: string; // ISO yyyy-MM-dd
  status: TransactionStatus;
}

export interface PlanBreakdown {
  plan: Plan;
  userCount: number;
  mrr: number;
}

export type DateRange = 7 | 30 | 90;
