# Generous Angels — Whisky Collection App

A Vue 3 single-page app for visualising a personal whisky collection. Replaces the plugin-rendered page at `/whisky/` on jasonbstanding.com; WordPress remains the data store only.

## Views

### Timeline
Chronological event stream of bottle lifecycle events (bought, opened, finished). A buying-trend bar chart in the header shows purchase counts per month across the full date range, always unfiltered. The event list is filterable by year, event type (bought / opened / finished), distillery, and bottler.

### Gantt
Each bottle rendered as a two-tone horizontal bar across a shared time axis. The muted segment is the shelf phase (date_bought → date_opened); the warm amber segment is the drinking phase (date_opened → date_finished, or today if still open). Bottles with partial date coverage show partial bars. Filterable by year and event type.

### Rankings
Distillery and bottler ranking tables, toggled by entity. Four metrics:
- **Count** — bottles per entity
- **Throughput** — average days from opened to finished (bottles with both dates only)
- **Shelf time** — average days from bought to opened (bottles with both dates only)
- **Recency** — most recent date_bought per entity

All filter and metric state is encoded in URL query params so every view is directly linkable.

## Architecture

```
src/
  composables/
    useWhiskyData.ts    singleton fetch; first caller loads, rest share the ref
    useGanttScale.ts    time axis math (min/max dates, toPercent(), yearMarkers)
  components/
    FilterYear.vue      reads/writes ?year=
    FilterEventType.vue reads/writes ?event=
    FilterDistillery.vue reads/writes ?distillery=
    FilterBottler.vue   reads/writes ?bottler=
    TrendChart.vue      CSS flex bar chart, always unfiltered
    BottleCard.vue      thumbnail + metadata card
    GanttRow.vue        two absolute-positioned segment divs
    RankingTable.vue    <table> for one metric
  views/
    TimelineView.vue
    GanttView.vue
    RankingsView.vue
  router/index.ts       hash mode; Timeline eager, Gantt + Rankings lazy
  types.ts              WhiskyBottle interface
  style.css             design tokens on :root
  main.ts
```

**Data layer:** `useWhiskyData()` exposes a module-level `ref<WhiskyBottle[]>`. One fetch fires per session; all components share the same reactive ref. No Pinia.

**URL-as-state:** components never hold local filter state — they read `useRoute().query` and write via `router.replace()`. Clearing a filter removes its key from the query object.

**CSS charts:** the trend chart and Gantt bars are pure CSS — no chart library. Gantt bars use `position: absolute` with `left` / `width` as percentages of the total date span.

**Routing:** hash mode (`#/`, `#/gantt`, `#/rankings`) so the static host needs no URL rewriting.

## Development

```bash
npm install
npm run dev
```

Dev traffic proxies `/wp-json` → `http://192.168.0.48:9988` (local dev API with consolidated date data). Production builds fetch directly from `https://www.jasonbstanding.com/wp-json/jbs/v2/whisky`.

## Deployment

The app is deployed to GitHub Pages with a custom subdomain.

### 1. Add a CNAME file

Create `public/CNAME` containing your subdomain (one line, no protocol):

```
whisky.jasonbstanding.com
```

This file is copied to `dist/` on every build so GitHub Pages knows which domain to serve.

### 2. Deploy

```bash
npm run deploy
```

This runs `npm run build` then pushes `dist/` to the `gh-pages` branch via `git subtree push`. If the push is rejected due to a diverged history (e.g. after cleaning dist):

```bash
git push origin $(git subtree split --prefix dist HEAD):gh-pages --force
```

### 3. Configure GitHub Pages

In the repository settings at `Settings → Pages`:
- Source: **Deploy from branch**
- Branch: `gh-pages` / `/(root)`
- Custom domain: your subdomain (e.g. `whisky.jasonbstanding.com`)

### 4. Configure DNS

Add a CNAME record at your DNS provider:

| Type  | Name    | Value                      |
|-------|---------|----------------------------|
| CNAME | whisky  | jasonbstanding.github.io   |

### 5. Configure CORS

The production API at `jasonbstanding.com` must allow the subdomain origin. Add the following to WordPress (e.g. via `functions.php` or a plugin):

```php
header('Access-Control-Allow-Origin: https://whisky.jasonbstanding.com');
```

Or use a wildcard for all subdomains:

```php
header('Access-Control-Allow-Origin: https://*.jasonbstanding.com');
```
