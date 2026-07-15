# Nimbus — Analytics Dashboard

Analytics dashboard for a fictional subscription business — surfaces MRR, churn,
and plan mix at a glance, with a date-range filter driving the whole view and a
click-to-drill-down from plan breakdown into the underlying transactions. Built
with React, TypeScript, and Recharts; focus was on making the data interaction
feel like a real product, not a static report.

**Live demo:** https://analytics-dashboard-mu-murex.vercel.app/

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Recharts · date-fns · Vitest

## Highlights

- Five routed views (Overview, Customers, Transactions, Reports, Settings) with
  real URLs, back/forward, and refresh-safe deep links (react-router + SPA rewrite)
- Seeded mock data (mulberry32 PRNG, fixed anchor date) — 180 days of metrics with
  weekend dips, a growth trend, and churn spikes; identical on every reload
- A global `dateRange` filter scopes every data view — KPI deltas, the revenue
  chart, the plan donut, the customers roll-up, and the transactions table
- Donut segment click drills into the table with a clearable filter chip and a
  considered empty state; Transactions adds plan/status filters; Reports exports
  the visible transactions to CSV client-side
- Customers view rolls transactions up per account (plan, total spend, activity)
  with the same sortable-table treatment
- Dark mode (persisted, no flash-of-wrong-theme), loading skeletons,
  Intl-formatted currency/percent values, churn KPI normalized to a 30-day rate
- Unit-tested data generation, KPI math, range windows, and sorting (`npm test`)

## Develop

    npm install
    npm run dev        # http://localhost:5173

## Test & build

    npm test           # vitest, 41 tests
    npm run build      # tsc --noEmit && vite build

## Project shape

- `src/data/mockData.ts` — seeded generator (metrics, transactions, plan breakdown)
- `src/lib/` — pure, tested logic: range windows, KPI computation, customer roll-up, Intl formatters, sorting
- `src/components/` — presentational components (charts, table, KPI tiles, controls)
- `src/views/` — one component per route (Overview, Customers, Transactions, Reports, Settings)
- `src/App.tsx` — owns `dateRange` / dark-mode state and the route table; views read shared
  state from the layout's `<Outlet>` context and derive the rest
