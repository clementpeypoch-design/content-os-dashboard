# CLAUDE.md — ContentOS Dashboard

## Overview

ContentOS is a dark-themed content management dashboard with 5 fully functional sections:
Instagram Manager, Analytics, Content Calendar, Competitor Tracker, and News Aggregator.
Built with Next.js 14 App Router, deployed on Netlify.

---

## Tech Stack

| Layer       | Tech                                |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Language    | TypeScript (relaxed for components) |
| Styling     | Tailwind CSS 3.4 + inline styles    |
| Charts      | Chart.js 4                          |
| Icons       | Lucide React                        |
| Font        | Manrope (Google Fonts)              |
| Deploy      | Netlify (@netlify/plugin-nextjs)    |

---

## Folder Structure

```
content-os-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (dark mode, sidebar, font)
│   │   ├── page.tsx            # Redirects to /instagram
│   │   ├── globals.css         # Tailwind + design tokens
│   │   ├── instagram/page.tsx  # → InstagramBoard
│   │   ├── analytics/page.tsx  # → AnalyticsDashboard
│   │   ├── calendar/page.tsx   # → ContentCalendar
│   │   ├── competitors/page.tsx # → CompetitorTracker
│   │   └── news/page.tsx       # → NewsAggregator
│   ├── components/
│   │   ├── layout/sidebar.tsx  # Shared sidebar navigation
│   │   └── pages/              # Full-page components
│   │       ├── instagram-board.tsx
│   │       ├── analytics-dashboard.tsx
│   │       ├── content-calendar.tsx
│   │       ├── competitor-tracker.tsx
│   │       └── news-aggregator.tsx
│   └── lib/
│       ├── utils.ts            # cn() helper
│       └── navigation.ts      # Sidebar nav config
├── netlify.toml                # Netlify deploy config
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Pages

### /instagram — Instagram Manager
Kanban board with 4 columns (Backlog, Drafts, Scheduled, Published).
Cards with captions, type badges, tags, date countdown.
Add/edit modal, move between columns, delete. Filter by type + search.

### /analytics — Analytics Dashboard
4 KPI cards, 4 Chart.js graphs (bar + line), top posts table,
platform breakdown with progress bars. Date range picker (7/14/30/90 days + custom).

### /calendar — Content Calendar
Monthly grid with colored platform labels per day.
Filters by platform (6) and status (3). Day detail sidebar.
Add/edit/delete content via modal. Navigation month-by-month.

### /competitors — Competitor Tracker
Sortable table with aggregated metrics per competitor.
SVG sparklines for growth trends. Multi-platform tracking.
Detail panel with per-platform breakdown. Add/remove competitors.
Activity feed showing recent posts across all competitors.

### /news — News Aggregator
RSS feed reader with 8 configured sources. Topic filtering (7 categories).
Card-based feed with source badges, dates, summaries.
Sidebar with source list, topic breakdown charts, feed status.

---

## Deployment on Netlify

1. Push to GitHub
2. Connect repo in Netlify
3. Build settings are auto-detected from netlify.toml:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs`

Or deploy via CLI:
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## Adding a New Section

1. Create component in `src/components/pages/new-section.tsx`
2. Create route at `src/app/new-section/page.tsx`
3. Add entry to `src/lib/navigation.ts`
4. The sidebar picks it up automatically

---

## Conventions

- Page components are self-contained in `src/components/pages/`
- Each uses inline styles (no external CSS dependencies)
- All components are client-side ("use client")
- Colors follow the dark theme palette: #07070a (bg) → #eaeaf0 (fg)
- Accent color: #a78bfa (purple)
