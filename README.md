# Jason B. Drammin' — Whisky Collection App

A Vue 3 single-page app for visualising a personal whisky collection. Replaces the plugin-rendered page at `/whisky/` on jasonbstanding.com; WordPress remains the data store only.

## Views

### Timeline
Chronological event stream of bottle lifecycle events (bought, opened, finished). A buying-trend bar chart in the header shows purchase counts per month across the full date range, always unfiltered; each bar displays its count as a label when wide enough, and a year axis marks each January below the chart. The event list is filterable by year, event type (All / Bought / Opened / Finished — four pill buttons), distillery, and bottler.

### Progress
Each bottle rendered as a two-tone horizontal bar across a shared time axis. The muted segment is the shelf phase (date_bought → date_opened); the warm amber segment is the drinking phase (date_opened → date_finished, or today if still open). Bottles with partial date coverage show partial bars. Filterable by year and event type. Rows are sorted most-recent-first using the filter-relevant date (bought / opened / finished, or finished-then-bought for All).

### Rankings
Distillery and bottler ranking tables, toggled by entity. Four metrics:
- **Count** — bottles per entity; expanded list shows each bottle's current status (on shelf / open / finished)
- **Throughput** — average days from opened to finished (bottles with both dates only); expanded list shows individual durations, fastest first
- **Shelf time** — average days from bought to opened (bottles with both dates only); expanded list shows individual durations, longest first
- **Last Acquired** — most recent date_bought per entity; expanded list shows all bottles with purchase dates, newest first

Clicking a row expands it to show the per-bottle detail for the active metric. Clicking again (or clicking a different row) collapses it. All filter and metric state is encoded in URL query params so every view is directly linkable.

## Architecture

```
src/
  composables/
    useWhiskyData.ts    singleton fetch; first caller loads, rest share the ref
    useGanttScale.ts    time axis math (min/max dates, toPercent(), yearMarkers)
  components/
    FilterYear.vue      reads/writes ?year=
    FilterEventType.vue 4 pill buttons; reads/writes ?event=
    FilterDistillery.vue reads/writes ?distillery=
    FilterBottler.vue   reads/writes ?bottler=
    TrendChart.vue      CSS flex bar chart with count labels and year axis
    BottleCard.vue      thumbnail + metadata card
    GanttRow.vue        two absolute-positioned segment divs
    RankingTable.vue    <table> for one metric; expandable rows
  views/
    TimelineView.vue
    GanttView.vue
    RankingsView.vue
  router/index.ts       hash mode; Timeline eager, Progress + Rankings lazy
  types.ts              WhiskyBottle interface
  style.css             design tokens on :root
  main.ts
```

**Data layer:** `useWhiskyData()` exposes a module-level `ref<WhiskyBottle[]>`. One fetch fires per session; all components share the same reactive ref. No Pinia.

**URL-as-state:** components never hold local filter state — they read `useRoute().query` and write via `router.replace()`. Clearing a filter removes its key from the query object.

**CSS charts:** the trend chart and Progress bars are pure CSS — no chart library. Progress bars use `position: absolute` with `left` / `width` as percentages of the total date span.

**Routing:** hash mode (`#/`, `#/gantt`, `#/rankings`) so the static host needs no URL rewriting.

## Development

```bash
npm install
npm run dev
```

Dev traffic proxies `/wp-json` → `http://192.168.0.48:9988` (local dev API). Production builds fetch directly from `https://www.jasonbstanding.com/wp-json/jbs/v2/whisky`. The `base` path in `vite.config.ts` only affects production builds; dev always serves from `/`.

## Deployment

The app deploys to GitHub Pages via a `dist/` subtree on the `gh-pages` branch.

```bash
npm run deploy
```

This runs `npm run build` then pushes `dist/` to `gh-pages` via `git subtree push`. If the push is rejected due to a diverged history:

```bash
git push origin $(git subtree split --prefix dist HEAD):gh-pages --force
```

### Without a custom domain

The app is served at `https://jasonbstanding.github.io/generous-angels/`. `vite.config.ts` sets `base: '/generous-angels/'` so built assets resolve correctly under the subpath.

### With a custom domain

When a custom domain is configured in GitHub Pages settings, the app is served from the domain root. Change `vite.config.ts` to `base: '/'` before building, then:

1. Add a `CNAME` file to `public/` containing the subdomain (one line, no protocol):
   ```
   whisky.jasonbstanding.com
   ```
2. Add a CNAME DNS record:

   | Type  | Name    | Value                    |
   |-------|---------|--------------------------|
   | CNAME | whisky  | jasonbstanding.github.io |

3. Enable the custom domain in `Settings → Pages` in the GitHub repository.

4. Ensure the production API allows the subdomain origin (add to WordPress `functions.php` or a plugin):
   ```php
   header('Access-Control-Allow-Origin: https://whisky.jasonbstanding.com');
   ```
