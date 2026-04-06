# Zorvyn Finance 💸

> A production-grade personal finance dashboard built with React — featuring live animated backgrounds, role-based access, multi-currency support, and a full suite of financial management tools.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.x-22B5BF)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-live-brightgreen)

---

## 🔗 Links

| | |
|---|---|
| **Live Demo** | [zorvyn-finance.vercel.app](https://finance-tracker-wjoe.vercel.app/) |
| **Repository** | [github.com/aditiranjan/zorvyn-finance](https://github.com/Aditi0004/FinanceTracker) |

---

## Overview

Zorvyn Finance is a fully client-side personal finance dashboard. It covers every required feature — and several beyond — including a hand-crafted 52-week spending heatmap, an aurora animated canvas background, multi-currency conversion, bill reminders with overdue alerts, saving goal tracker, and recurring transaction templates.

Everything runs in the browser. No backend, no API keys required. Data persists across sessions using `localStorage`.

---

## Features

### Dashboard Overview
- Animated count-up stat cards — Total Balance, Income, Expenses with month-over-month % change
- Balance Trend area chart (cumulative balance over time)
- Upcoming Bills widget with overdue, due-today, and upcoming status alerts
- Saving Goals preview with animated progress bars and deadline countdown
- Spending Breakdown donut chart (top 6 categories)
- Recent 6 transactions with category color indicators
- Quick Actions bar (Admin only) — add transaction, bill, or goal from dashboard

### Transactions
- Full table with Date, Description, Category, Type, Amount
- Search by description or category
- Filter by type (All / Income / Expense) and by category
- Sort by date, amount, or category (ascending / descending toggle)
- Pagination — 15 rows per page
- Admin CRUD — Add, Edit, Delete with modal forms
- Export filtered view as CSV

### Insights
- 52-week Spending Heatmap — GitHub-style calendar grid showing daily expense intensity with hover tooltips
- Monthly Comparison — Income vs Expenses bar chart for the last 3 months
- Top Spending Categories — animated progress bars with transaction counts and percentages
- 6 Auto-generated Observations — top category, savings rate, largest transaction, most frequent category, MoM change, net balance summary

### Bill Reminders
- Add, Edit, Delete bills with name, amount, due date, category, frequency, and notes
- Status badges — Overdue (red), Due Today (amber), Upcoming (blue), Paid (green)
- Mark as paid toggle
- Recurring frequency — weekly / monthly / yearly / once
- Total unpaid amount shown at page header

### Goal Tracker
- Create savings goals with emoji, name, target amount, deadline, and custom color
- Animated progress bars per goal
- Add Savings modal to increment the saved amount toward any goal
- Deadline countdown and remaining amount display
- Completion banner when a goal reaches 100%

### Recurring Transactions
- Set up income or expense templates with category, amount, frequency, and next date
- Active / Inactive grouping with toggle per item
- Generate Now — instantly creates a transaction and advances the next due date
- Monthly net estimate displayed across all active recurring items

### Multi-Currency Support
- 10 currencies — INR ₹, USD $, EUR €, GBP £, JPY ¥, AED, SGD, CAD, AUD, CNY
- All amounts, charts, and stat cards update instantly on currency switch
- Static rate fallback derived from real-world values

### Notifications
- Bell icon with unread count badge
- Slide-out panel listing all active alerts
- Auto-generated for: overdue bills, bills due within 3 days, goals completed, goals with deadline within 7 days, large expenses (>₹5,000)

### UI / UX
- Deep navy dark mode (`#090d1a`) with indigo accent
- Aurora animated background — 5 breathing gradient blobs + 90 twinkling particles via Canvas API at 60fps
- Role-based UI — Admin (full CRUD) and Viewer (read-only), switchable from topbar
- Collapsible sidebar with user profile
- Smooth animations — staggered card entrances, animated progress bars, count-up numbers
- Toast notifications for all actions
- `localStorage` persistence across sessions

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework, functional components + hooks |
| **Context API** | Global state (transactions, bills, goals, recurring, role, currency) |
| **Recharts** | AreaChart, BarChart, PieChart, Tooltip |
| **Canvas API** | Aurora animated background + 52-week heatmap |
| **Lucide React** | Icon library |
| **localStorage** | Client-side data persistence |
| **Vite** | Build tooling and dev server |

---

## Project Structure

```
zorvyn-finance/
├── src/
│   ├── App.jsx        # All components, state, pages — single-file architecture
│   └── main.jsx       # React entry point
├── public/
│   └── index.html
├── package.json
├── vite.config.js
└── README.md
```

> The entire app lives in one well-structured `App.jsx` (~1,500 lines) divided into clearly labelled sections: constants → context/state → hooks → utilities → UI primitives → page components → app shell.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/aditiranjan/zorvyn-finance.git
cd zorvyn-finance

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to Vercel (recommended)

Connect the GitHub repo at [vercel.com/new](https://vercel.com/new) — zero configuration needed. Or via CLI:

```bash
npm install -g vercel
vercel --prod
```

---

## Design Decisions

**Single-file architecture** — Keeps the codebase readable in one scroll for reviewers. Production code would use a standard `components/pages/store/` structure.

**Context API over Zustand** — The state shape (arrays of transactions, bills, goals, recurring + UI toggles) is simple enough that Context covers all needs without an extra dependency.

**Canvas for background animation** — The aurora background runs entirely on `<canvas>` with `requestAnimationFrame`, off the React render tree. This means it never causes component re-renders and holds 60fps regardless of app state.

**Heatmap from scratch** — No library renders a GitHub-style 52-week calendar well out of the box. Built manually: 52 columns of 7 cells, intensity mapped from `Math.ceil((amount / maxDay) * 4)` to 5 color stops.

**Static currency rates** — Using `frankfurter.app` for live rates adds async complexity and network failure risk for a demo. Static rates give the same UX reliably.

**Pagination over infinite scroll** — Gives users explicit control over 70+ rows; simpler to keep correct when combined with sort + filter state.

---

## 🗂 Data Model

```js
// Transaction
{ id, date, description, category, type: 'income' | 'expense', amount }

// Bill  
{ id, name, amount, dueDate, category, frequency, notes, paid }

// Goal
{ id, name, emoji, target, saved, deadline, color }

// Recurring
{ id, name, category, type, amount, frequency, nextDate, active }
```

---

## Future Improvements

- Live exchange rates via `frankfurter.app` with 6-hour client cache
- TypeScript migration with strict types for all data models
- Framer Motion page transitions and stagger animations
- Backend sync (Supabase or Firebase) for multi-device support
- PDF / Excel export for monthly reports
- Budget limits per category with threshold alerts
- Light / Dark / System theme toggle with `next-themes`
- PWA support — installable, offline-capable

---

## Author

**Aditi Ranjan**

---

<p align="center">Made with ❤️ by Aditi</p>
