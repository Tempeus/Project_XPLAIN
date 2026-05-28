# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**XPLAIN** — an "Explain Like I'm 5" social-media-style learning app for finance topics (Treasury, Risk Management, Accounting). Dark theme with Duolingo-style gamification (XP, streaks, quizzes) and an Instagram-style vertical scroll feed.

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```

## Stack

- **Next.js 15** with App Router + TypeScript (strict)
- **Tailwind CSS v3** — custom design tokens in `tailwind.config.ts`; design system in `app/globals.css`
- **Framer Motion** — all animations; use `motion.*` components in client components only
- **Supabase** — auth (`@supabase/ssr`) + PostgreSQL database
- **Anthropic SDK** — Claude `claude-sonnet-4-6` via server-side API routes only (never client-side)

## Architecture

```
app/
  (auth)/          # Login + Signup — no nav shell
  (app)/           # Protected app shell (TopBar + BottomNav)
    feed/          # Infinite scroll feed of TopicCards
    daily/         # Daily 5-min ELI5 read
    quiz/          # Quiz hub + [topicId] quiz pages
    saved/         # Bookmarked topics
    profile/       # XP, streak, mastery progress
  api/
    generate/      # POST — generates ELI5 card via Claude, caches in Supabase
    quiz/generate/ # POST — generates quiz questions via Claude, caches
    daily/         # GET — deterministic daily topic by day-of-year
    progress/      # POST — updates XP, streak, mastery
    bookmarks/     # POST/DELETE — manage saved topics

components/
  nav/             # TopBar (XP/streak display) + BottomNav (5-tab)
  cards/TopicCard  # Hero feed card: gradient header, ELI5 content, inline quiz
  quiz/QuizCard    # Reusable quiz component used inline + in quiz pages
  feed/Feed        # Category filter pills + card list

lib/
  topics/index.ts  # 20 pre-defined topics (treasury/risk/accounting) — source of truth
  types.ts         # Shared TypeScript interfaces
  utils.ts         # cn(), category colors/gradients, XP/level helpers
  supabase/        # client.ts (browser) + server.ts (RSC/API routes)
  claude/generate.ts # generateELI5Content() + generateQuizQuestions()
```

## Key Patterns

- **Server vs Client components**: API routes and data fetching use `lib/supabase/server.ts`. Interactive UI uses `lib/supabase/client.ts` with `'use client'`.
- **Content caching**: Claude-generated content is cached in Supabase `cards` and `quiz_questions` tables to avoid redundant API calls.
- **Category system**: Treasury (blue `#3B82F6`), Risk (red `#EF4444`), Accounting (green `#10B981`). Helpers in `lib/utils.ts`.
- **Adaptive quiz**: Wrong answers decrease `mastery_score` in `user_progress`, surfacing those topics for review in the quiz hub.
- **Auth**: Supabase SSR auth. `middleware.ts` protects `/feed`, `/daily`, `/quiz`, `/saved`, `/profile`.

## Database Setup

Run `supabase/schema.sql` in your Supabase project's SQL editor before first use.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```
