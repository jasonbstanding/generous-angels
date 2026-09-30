# Proposal

## Why

The existing whisky collection page at `/whisky/` is driven by a WordPress plugin that is too limiting to support richer timeline and analytics views. A purpose-built Vue 3 app will replace it and directly answer the motivating question: has buying frequency slowed down over time?

## What Changes

- New standalone Vue 3 + TypeScript + Vite single-page application, reading from the existing WordPress REST API (`/wp-json/jbs/v2/whisky`) — one fetch per session via a singleton composable
- Three route-based views: Timeline, Gantt, Rankings
- Timeline view includes a buying-trend sparkline in the header
- All filter/sort state encoded in URL query params; every filtered view is directly linkable
- Replaces the WordPress plugin-rendered page entirely; WordPress remains the data store only

## Capabilities

### New Capabilities

- `whisky/timeline`: Chronological event stream of bottle lifecycle events (bought, opened, finished), filterable by year and event type, with a buying-trend bar chart in the header showing purchase counts per month
- `whisky/gantt`: Lifecycle Gantt chart — each bottle as a two-tone horizontal bar (muted shelf phase: bought→opened; warm drinking phase: opened→finished or today), sorted by date_bought, with partial bars for bottles missing one or more dates
- `whisky/rankings`: Distillery and bottler ranking tables toggled by entity type, sortable by count, throughput (days opened→finished), shelf time (days bought→opened), and recency

### Modified Capabilities

*(none — this is a new app with no existing specs)*

## Impact

- New repo: blank Vue 3 project scaffolded from scratch (no existing package.json)
- External API dependency: `https://www.jasonbstanding.com/wp-json/jbs/v2/whisky` — read-only, 442 records, ~155 with date_bought (dates tracked from March 2024 onward; older records have null dates)
- No changes to WordPress, the REST API, or any other system
- Deployment target TBD; the app will eventually serve at or near `/whisky/`
