# Build Prompt — Analytics Dashboard (Portfolio Project)

## 1. Goal & context

Build a polished analytics dashboard for a fictional subscription business. This is a portfolio piece meant to signal "I can build the data-heavy internal tools businesses pay for." It must look like a real product, not a mockup — that means realistic data, working interactions, and considered empty/loading states.

**Fictional company:** `Nimbus` — a mid-market SaaS product on a monthly subscription model. Plans: Starter ($19/mo), Growth ($49/mo), Scale ($99/mo).

**The single most important interaction:** clicking a segment in the "users by plan" chart filters the transactions table below it. This drill-down is what makes it read as a real product. Don't skip it.

## 2. Tech stack

- React (Vite) + TypeScript
- Tailwind CSS for styling
- Recharts for charts
- `date-fns` for date handling
- Deployed to Vercel

If any of these conflict with a preference I state later, ask before switching.

## 3. Data model

Generate mock data in a single `src/data/mockData.ts` module. No backend — everything is seeded client-side, but it must look plausible (weekend dips, gradual growth trend, occasional churn spikes).

```ts
type Plan = 'Starter' | 'Growth' | 'Scale';

interface DailyMetric {
  date: string;        // ISO date
  mrr: number;         // monthly recurring revenue that day
  activeUsers: number;
  newSignups: number;
  churnedUsers: number;
}

interface Transaction {
  id: string;
  customerName: string;
  plan: Plan;
  amount: number;
  date: string;        // ISO date
  status: 'paid' | 'pending' | 'failed';
}

interface PlanBreakdown {
  plan: Plan;
  userCount: number;
  mrr: number;
}
```

Generate ~90 days of `DailyMetric`, ~60 `Transaction` rows, and derive `PlanBreakdown` from the transactions. Use a fixed seed so the data is stable across reloads (a simple seeded PRNG is fine — don't use `Math.random()` directly or the numbers jump every render).

## 4. Features (in priority order)

**KPI cards (top row, 4 cards):** MRR, Active Users, Churn Rate, New Signups. Each shows the current value, and a percentage change vs. the previous period of equal length, with an up/down arrow and green/red color. Churn going *down* is green (invert the logic for that one card).

**Date-range filter:** segmented control with 7 / 30 / 90 days. Changing it recomputes KPI deltas, the revenue chart, and the table. This is the backbone — wire everything to a single `dateRange` state.

**Revenue chart:** area chart of MRR over the selected range. Smooth curve, subtle gradient fill, tooltip on hover showing date + formatted currency.

**Segment chart:** donut (or horizontal bar) of users by plan. Each segment is clickable.

**Transactions table:** sortable columns (customer, plan, amount, date, status). Status shown as a colored pill. Sensible default sort (date desc).

**Drill-down:** clicking a plan segment filters the table to that plan and shows an active-filter chip with an "x" to clear it. Clearing restores the full table.

## 5. Component breakdown

- `DashboardLayout` — sidebar (logo + nav links, links can be non-functional) + top bar with the date-range filter
- `KPICard` — props: label, value, deltaPercent, invertColor?
- `DateRangePicker` — segmented 7/30/90 control
- `RevenueChart` — Recharts AreaChart
- `SegmentChart` — Recharts donut/bar with onSegmentClick
- `DataTable` — sortable, receives an optional `planFilter`
- `FilterChip` — shows the active drill-down filter

## 6. Styling / polish

- Clean, modern, slightly dense (this is a tool, not a marketing page). Light theme; consider a dark-mode toggle only if you have time.
- Consistent spacing scale, rounded-xl cards, subtle borders and shadows — avoid heavy drop shadows.
- **Loading skeletons** for cards, chart, and table on first mount (fake a 600ms delay). This one detail makes it feel production-grade.
- **Empty state** for the table when a drill-down filter matches nothing.
- Format all currency and percentages properly (`Intl.NumberFormat`). Never show a raw `1234.5`.

## 7. Build order (do these as checkpoints)

1. Scaffold Vite + Tailwind + Recharts; blank `DashboardLayout` shell.
2. Write `mockData.ts` with the seeded generator. **Verify the data looks realistic before building UI on top of it.**
3. KPI cards with hardcoded range = 30 days.
4. Revenue area chart.
5. Transactions table with sorting.
6. Segment donut chart.
7. Wire the date-range filter to cards + chart + table.
8. Wire the drill-down (segment click → table filter → clear chip).
9. Add loading skeletons + empty states.
10. Deploy to Vercel.

## 8. Acceptance criteria (definition of done)

- [ ] Changing the date range visibly updates KPIs, revenue chart, and table.
- [ ] KPI deltas are computed against the correct previous period; churn delta color is inverted.
- [ ] Clicking a plan segment filters the table and shows a clearable chip.
- [ ] Table sorting works on every column.
- [ ] Skeletons show on load; empty state shows when a filter matches nothing.
- [ ] All money/percent values are formatted.
- [ ] Data is stable across reloads (seeded).
- [ ] Deployed and reachable at a live URL.

## 9. Portfolio framing (write this once it's built)

Two-sentence case study to display beside the live link:

> *Analytics dashboard for a subscription business — surfaces MRR, churn, and plan mix at a glance, with a date-range filter driving the whole view and a click-to-drill-down from plan breakdown into the underlying transactions. Built with React, TypeScript, and Recharts; focus was on making the data interaction feel like a real product, not a static report.*# Build Prompt — Analytics Dashboard (Portfolio Project)

> Paste this whole file into Claude / Claude Code as your build brief. Work through it in the staged order at the bottom so you always have something demoable.

---

## 1. Goal & context

Build a polished analytics dashboard for a fictional subscription business. This is a portfolio piece meant to signal "I can build the data-heavy internal tools businesses pay for." It must look like a real product, not a mockup — that means realistic data, working interactions, and considered empty/loading states.

**Fictional company:** `Nimbus` — a mid-market SaaS product on a monthly subscription model. Plans: Starter ($19/mo), Growth ($49/mo), Scale ($99/mo).

**The single most important interaction:** clicking a segment in the "users by plan" chart filters the transactions table below it. This drill-down is what makes it read as a real product. Don't skip it.

## 2. Tech stack

- React (Vite) + TypeScript
- Tailwind CSS for styling
- Recharts for charts
- `date-fns` for date handling
- Deployed to Vercel

If any of these conflict with a preference I state later, ask before switching.

## 3. Data model

Generate mock data in a single `src/data/mockData.ts` module. No backend — everything is seeded client-side, but it must look plausible (weekend dips, gradual growth trend, occasional churn spikes).

```ts
type Plan = 'Starter' | 'Growth' | 'Scale';

interface DailyMetric {
  date: string;        // ISO date
  mrr: number;         // monthly recurring revenue that day
  activeUsers: number;
  newSignups: number;
  churnedUsers: number;
}

interface Transaction {
  id: string;
  customerName: string;
  plan: Plan;
  amount: number;
  date: string;        // ISO date
  status: 'paid' | 'pending' | 'failed';
}

interface PlanBreakdown {
  plan: Plan;
  userCount: number;
  mrr: number;
}
```

Generate ~90 days of `DailyMetric`, ~60 `Transaction` rows, and derive `PlanBreakdown` from the transactions. Use a fixed seed so the data is stable across reloads (a simple seeded PRNG is fine — don't use `Math.random()` directly or the numbers jump every render).

## 4. Features (in priority order)

**KPI cards (top row, 4 cards):** MRR, Active Users, Churn Rate, New Signups. Each shows the current value, and a percentage change vs. the previous period of equal length, with an up/down arrow and green/red color. Churn going *down* is green (invert the logic for that one card).

**Date-range filter:** segmented control with 7 / 30 / 90 days. Changing it recomputes KPI deltas, the revenue chart, and the table. This is the backbone — wire everything to a single `dateRange` state.

**Revenue chart:** area chart of MRR over the selected range. Smooth curve, subtle gradient fill, tooltip on hover showing date + formatted currency.

**Segment chart:** donut (or horizontal bar) of users by plan. Each segment is clickable.

**Transactions table:** sortable columns (customer, plan, amount, date, status). Status shown as a colored pill. Sensible default sort (date desc).

**Drill-down:** clicking a plan segment filters the table to that plan and shows an active-filter chip with an "x" to clear it. Clearing restores the full table.

## 5. Component breakdown

- `DashboardLayout` — sidebar (logo + nav links, links can be non-functional) + top bar with the date-range filter
- `KPICard` — props: label, value, deltaPercent, invertColor?
- `DateRangePicker` — segmented 7/30/90 control
- `RevenueChart` — Recharts AreaChart
- `SegmentChart` — Recharts donut/bar with onSegmentClick
- `DataTable` — sortable, receives an optional `planFilter`
- `FilterChip` — shows the active drill-down filter

## 6. Styling / polish

- Clean, modern, slightly dense (this is a tool, not a marketing page). Light theme; consider a dark-mode toggle only if you have time.
- Consistent spacing scale, rounded-xl cards, subtle borders and shadows — avoid heavy drop shadows.
- **Loading skeletons** for cards, chart, and table on first mount (fake a 600ms delay). This one detail makes it feel production-grade.
- **Empty state** for the table when a drill-down filter matches nothing.
- Format all currency and percentages properly (`Intl.NumberFormat`). Never show a raw `1234.5`.

## 7. Build order (do these as checkpoints)

1. Scaffold Vite + Tailwind + Recharts; blank `DashboardLayout` shell.
2. Write `mockData.ts` with the seeded generator. **Verify the data looks realistic before building UI on top of it.**
3. KPI cards with hardcoded range = 30 days.
4. Revenue area chart.
5. Transactions table with sorting.
6. Segment donut chart.
7. Wire the date-range filter to cards + chart + table.
8. Wire the drill-down (segment click → table filter → clear chip).
9. Add loading skeletons + empty states.
10. Deploy to Vercel.

## 8. Acceptance criteria (definition of done)

- [ ] Changing the date range visibly updates KPIs, revenue chart, and table.
- [ ] KPI deltas are computed against the correct previous period; churn delta color is inverted.
- [ ] Clicking a plan segment filters the table and shows a clearable chip.
- [ ] Table sorting works on every column.
- [ ] Skeletons show on load; empty state shows when a filter matches nothing.
- [ ] All money/percent values are formatted.
- [ ] Data is stable across reloads (seeded).
- [ ] Deployed and reachable at a live URL.

## 9. Portfolio framing (write this once it's built)

Two-sentence case study to display beside the live link:

> *Analytics dashboard for a subscription business — surfaces MRR, churn, and plan mix at a glance, with a date-range filter driving the whole view and a click-to-drill-down from plan breakdown into the underlying transactions. Built with React, TypeScript, and Recharts; focus was on making the data interaction feel like a real product, not a static report.*