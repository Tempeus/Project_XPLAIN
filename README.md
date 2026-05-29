# XPLAIN

**Explain Like I'm 5** — a social-media-style learning app for finance topics.

XPLAIN turns dense concepts in Treasury, Risk Management, and Accounting into bite-sized ELI5 cards, delivered through an Instagram-style vertical scroll feed with Duolingo-inspired gamification (XP, streaks, quizzes).

---

## Features

- **Feed** — infinite scroll of topic cards, filterable by category
- **Daily Read** — one deterministic 5-minute ELI5 card per day
- **Quiz Hub** — topic quizzes with adaptive review (wrong answers resurface)
- **Saved** — bookmark cards for later
- **Profile** — XP, streak, level, and per-topic mastery progress
- **AI-generated content** — Claude generates ELI5 explanations and quiz questions, cached in Supabase to avoid redundant API calls

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Auth + DB | Supabase (SSR auth + PostgreSQL) |
| AI | Anthropic Claude `claude-sonnet-4-6` |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

### 3. Set up the database

In your Supabase project's SQL editor, run:

```
supabase/schema.sql
```

This creates five tables — `cards`, `quiz_questions`, `user_progress`, `user_streaks`, `bookmarks` — with Row Level Security policies.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  (auth)/          # Login + Signup (no nav shell)
  (app)/           # Protected shell — TopBar + BottomNav
    feed/          # Infinite scroll feed
    daily/         # Daily 5-min ELI5 read
    quiz/          # Quiz hub + [topicId] quiz pages
    saved/         # Bookmarked topics
    profile/       # XP, streak, mastery
  api/
    generate/      # POST — generate ELI5 card via Claude, cache in Supabase
    quiz/generate/ # POST — generate quiz questions via Claude, cache
    daily/         # GET  — deterministic daily topic by day-of-year
    progress/      # POST — update XP, streak, mastery
    bookmarks/     # POST/DELETE — manage saved topics

components/
  nav/             # TopBar (XP/streak) + BottomNav (5-tab)
  cards/TopicCard  # Hero feed card: gradient header, ELI5 content, inline quiz
  quiz/QuizCard    # Reusable quiz component
  feed/Feed        # Category filter pills + card list

lib/
  topics/index.ts  # 20 pre-defined topics — source of truth
  types.ts         # Shared TypeScript interfaces
  utils.ts         # cn(), category colors/gradients, XP/level helpers
  supabase/        # client.ts (browser) + server.ts (RSC/API routes)
  claude/generate.ts # generateELI5Content() + generateQuizQuestions()
```

---

## Topics

20 pre-defined topics across three categories:

**Treasury** (blue) — What is the Dept of Finance Canada, Government of Canada Bonds, T-Bills/Bonds/Real Return Bonds, Bank of Canada vs Dept of Finance, Yield Curve, Federal Debt, Cash Management

**Risk Management** (red) — Financial Risk, Credit Risk, Market Risk, Liquidity Risk, Hedging, Value at Risk, Stress Testing, Foreign Exchange (FX), FX Swaps, Futures, Options, Hedge Management

**Accounting** (green) — What is Accounting, Balance Sheet, Income Statement, Cash Flow Statement, Debits & Credits, Assets/Liabilities/Equity

---

## Commands

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```

---

## Database Schema

| Table | Purpose |
|---|---|
| `cards` | Cached Claude-generated ELI5 content per topic |
| `quiz_questions` | Cached quiz questions per topic |
| `user_progress` | Per-user, per-topic mastery score and activity counts |
| `user_streaks` | Daily streak and total XP per user |
| `bookmarks` | Saved topics per user |

All tables use Row Level Security. Users can only read/write their own progress, streaks, and bookmarks. Card and quiz caches are shared across all authenticated users.
