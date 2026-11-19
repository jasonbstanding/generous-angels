# Design

## Context

Greenfield Vue 3 app. No existing codebase to integrate with. External data source is a WordPress REST API returning 442 records; ~155 have `date_bought` (dates tracked from March 2024). See proposal.md for motivation and API shape.

## Goals / Non-Goals

**Goals:**
- Single-page app with three route-based views (Timeline, Gantt, Rankings)
- Filter state fully in URL query params; no separate state layer
- Data fetched once per session and shared across all views
- No chart library dependencies — the trend and Gantt are simple enough to render with CSS/SVG

**Non-Goals:**
- Write operations to the API
- Authentication
- Offline / PWA support
- Cask type or flavour analysis
- Pagination (load all 442 records upfront)

## Decisions

### 1. Data layer: module-level singleton composable

`useWhiskyData()` exposes a module-level `ref<WhiskyBottle[]>` (not component-scoped). First caller triggers the fetch; subsequent callers share the same reactive ref. Returns `{ bottles, loading, error }`.

**Why not Pinia:** PLAN.md explicitly excludes it. A module-level ref delivers the same singleton behaviour with zero boilerplate.

**Why load all records upfront:** The data is read-only and nonvolatile (changes at most every few days). With 442 records the payload is small. Upfront loading enables client-side filtering with no round trips and makes the URL-shareable filter state trivial.

### 2. Routing: Vue Router in hash mode

Routes: `#/` (Timeline), `#/gantt` (Gantt), `#/rankings` (Rankings).

Filter state lives in query params on each route, e.g. `#/?year=2025&event=bought&distillery=Springbank`.

**Why hash mode:** The app will be served as static files from GitHub Pages via a custom subdomain. Hash mode requires no server-side URL rewriting — `index.html` is served and the router handles everything client-side. No `base` path configuration is needed since the app serves from the subdomain root (`/`).

**Upgrade path:** Switching to history mode later requires only changing `createWebHashHistory` to `createWebHistory` in the router and configuring the server to rewrite `/whisky/*` → `/whisky/index.html`.

### 3. Filter state: read from `route.query`, write via `router.replace`

Components never hold local filter state. They read `useRoute().query` and mutate via `router.replace({ query: { ...route.query, year: '2025' } })`. Clearing a filter removes its key from the query object.

**Why:** This is the minimal implementation that satisfies the URL-addressable requirement — no sync layer, no watcher, no store entry for filters.

### 4. Gantt rendering: CSS absolute positioning, no library

The Gantt time axis is a shared date range (min observed date to today). Each bottle row is a `position: relative` container; bar segments are `position: absolute` divs with `left` and `width` computed as percentages of the total span.

Two segment classes: `.shelf` (muted, bought→opened) and `.drinking` (warm amber, opened→finished or today). A `.ongoing` modifier adds a visual pulse or arrow on bars extending to today.

**Why not a chart library:** A two-segment percentage bar is ~20 lines of computed CSS. Adding a library for this is the opposite of lazy.

**Risk:** With 155+ rows the list can get tall. Virtualization (only rendering visible rows) can be added if scrolling performance is an issue — the structure supports it without a redesign.

### 5. Trend chart: CSS bar chart

A monthly bar chart is rendered as a flex row of `<div>` bars with height set as a CSS custom property (`--pct: 72%`). No SVG, no library.

**Why:** The trend chart answers one question (buying frequency over time) with a small dataset (~30 months of data). A CSS bar chart is readable, accessible as a `role="img"` group, and requires no dependencies.

### 6. TypeScript: one interface for the API shape, derived computed types

```ts
interface WhiskyBottle {
  id: number
  title: string
  distillery: string   // empty string, not null
  bottler: string      // empty string, not null
  date_bought: string | null
  date_opened: string | null
  date_finished: string | null
  state: 'in' | 'open' | 'finished'
  image_sml: string
  image_lg: string
}
```

Computed values (shelf days, drinking days, bar percentages) are derived in composables rather than stored on the object.

### 7. CSS: design tokens on `:root`, scoped styles per component

All colours, spacing, and typographic scale defined as CSS custom properties on `:root`. Each SFC uses `<style scoped>`. No utility-class framework.

## Risks / Trade-offs

**CORS** → The API at `jasonbstanding.com` must allow the app's origin. If the app is served from a different domain or subdomain, CORS headers must be added to the WordPress REST API responses. Mitigation: host on the same origin where possible, or confirm WordPress CORS config before deployment.

**Null date coverage** → ~65% of records have at least one null date. The Gantt shows partial bars for these; the Rankings metrics exclude bottles with missing dates. The trend chart is limited to the ~155 records with `date_bought`. This is accepted: the user will not backfill historical dates.

**Gantt row count** → 155+ rows is manageable without virtualization, but scrolling through all of them may feel unwieldy. Mitigation: the time window filter (year + event type) reduces visible rows significantly in practice.

## Migration / Deployment

1. `npm run build` produces `dist/`
2. `git subtree push --prefix dist origin gh-pages` publishes to the `gh-pages` branch (use the force-push variant — `git push origin $(git subtree split --prefix dist HEAD):gh-pages --force` — when the branch history diverges after a dist clean)
3. Configure the GitHub repo to serve from `gh-pages` and point the custom subdomain at it
4. The `dist/` directory must not be in `.gitignore` for subtree push to track it
5. CORS: the production API at `jasonbstanding.com` must allow the subdomain origin; the dev proxy sidesteps CORS locally

The `"deploy"` npm script wraps steps 1–2: `npm run build && git subtree push --prefix dist origin gh-pages`.
