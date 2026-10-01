# Tasks

## 1. Project Scaffold

- [x] 1.1 Scaffold Vue 3 + TypeScript + Vite project from scratch (`npm create vue@latest`, select TypeScript, Vue Router, no Pinia) and verify `npm run dev` starts without errors
- [x] 1.2 Remove generated boilerplate (HelloWorld component, default CSS, example content) — verify `src/` contains only the entry point, App.vue, and router
- [x] 1.3 Define CSS design tokens (colour palette for shelf/drinking phases, spacing scale, type scale) as custom properties on `:root` in a global stylesheet — verify tokens are accessible in scoped component styles

## 2. Types and Data Layer

- [x] 2.1 Define `WhiskyBottle` TypeScript interface in `src/types.ts` matching the API shape exactly — verify TypeScript compiles without errors
- [x] 2.2 Implement `src/composables/useWhiskyData.ts` — module-level `ref<WhiskyBottle[]>` with loading and error state; first caller fetches from the API, subsequent callers return the same ref without re-fetching — verify by mounting two components that both call `useWhiskyData()` and confirming only one network request fires
- [x] 2.3 Verify `useWhiskyData()` sets an error message when the API request fails (e.g. network offline) without throwing

## 3. App Shell and Routing

- [x] 3.1 Configure Vue Router in hash mode with three routes: `/` → TimelineView, `/gantt` → GanttView, `/rankings` → RankingsView — verify `router-link` navigation and browser back/forward work correctly
- [x] 3.2 Create `App.vue` with a top navigation bar linking to all three routes, using `router-link-active` to highlight the current route — verify active class applies correctly on each route
- [x] 3.3 Create stub components for GanttView and RankingsView — verify routing renders the correct view for each hash path

## 4. Shared Filter Components

- [x] 4.1 Implement `FilterYear.vue` — dropdown of distinct years derived from all bottle date fields, plus a "All years" clear option; reads/writes `year` URL query param via `router.replace` — verify selection updates the URL and reload restores the selection
- [x] 4.2 Implement `FilterEventType.vue` — selector for bought / opened / finished plus a clear option; reads/writes `event` URL query param — verify selection updates the URL
- [x] 4.3 Implement `FilterDistillery.vue` — dropdown of distinct non-empty distillery values plus a clear option; reads/writes `distillery` URL query param — verify selection updates the URL
- [x] 4.4 Implement `FilterBottler.vue` — dropdown of distinct non-empty bottler values plus a clear option; reads/writes `bottler` URL query param — verify selection updates the URL
- [x] 4.5 Verify that all four filters coexist: applying year + event type + distillery simultaneously produces the correct intersection, and clearing any one filter individually removes only that constraint

## 5. Timeline View

- [x] 5.1 Implement the buying trend bar chart in the Timeline header — flex row of divs, one per calendar month from earliest `date_bought` to today, bar height proportional to purchase count that month — verify bars render for all months with counts, and months with zero purchases render as a flat baseline
- [x] 5.2 Verify the trend chart shows the full date range regardless of which year filter is active (trend is always unfiltered)
- [x] 5.3 Implement the event stream list — bottles sorted by the active event-type date descending; each card shows thumbnail, title, distillery, bottler, and all available dates; bottles with no date for the active event type are excluded when an event type filter is set — verify default (no filter) shows all bottles with any date
- [x] 5.4 Wire all four filter components (year, event type, distillery, bottler) into the Timeline and verify that the displayed bottle count changes correctly for each filter combination
- [x] 5.5 Verify Timeline filter state round-trips: set year=2025, event=bought, copy the URL, open it fresh, and confirm the same filtered list appears

## 6. Gantt View

- [x] 6.1 Implement time axis computation — `useGanttScale()` composable returning the min and max date across all bottles that have at least one date, used to compute bar offsets as percentages — verify the range covers the full observed date span
- [x] 6.2 Implement `GanttRow.vue` — `position: relative` container with up to two `position: absolute` segment divs (`.shelf`, `.drinking`), left and width as percentage of total span; handle all four cases: full bar, no date_bought (drinking only), no date_opened (shelf only extending to today), no date_finished (drinking extending to today with ongoing indicator) — verify each case visually
- [x] 6.3 Implement the full Gantt list — bottles sorted ascending by `date_bought` (fallback to `date_opened`), bottles with no dates excluded — verify sort order and exclusion with the actual API data
- [x] 6.4 Wire year and event type filter components into the Gantt — verify the visible row set changes correctly; verify "no bottles match" state is shown gracefully
- [x] 6.5 Verify Gantt filter state round-trips via URL (same approach as 5.5)

## 7. Rankings View

- [x] 7.1 Implement the entity toggle (distillery / bottler) reading/writing `entity` URL query param, defaulting to distillery; verify clear option removes the param and reverts to distillery
- [x] 7.2 Implement the metric selector (count / throughput / shelf-time / recency) reading/writing `metric` URL query param, defaulting to count; verify clear option removes the param and reverts to count
- [x] 7.3 Implement count metric — group bottles by entity, exclude empty field values, sort by count descending — verify the top entry for distillery and bottler match expected values from the API data
- [x] 7.4 Implement throughput metric — average days from `date_opened` to `date_finished` per entity; exclude bottles without both dates; display `"N days (n=K)"` per row; sort ascending (fastest first) — verify entities with no qualifying bottles are absent from the list
- [x] 7.5 Implement shelf time metric — average days from `date_bought` to `date_opened` per entity; exclude bottles without both dates; display `"N days (n=K)"` per row; sort descending (longest wait first) — verify entities with no qualifying bottles are absent
- [x] 7.6 Implement recency metric — most recent `date_bought` per entity; exclude entities with no `date_bought`; sort descending (most recently acquired first) — verify correct ordering
- [x] 7.7 Verify Rankings URL round-trip: set entity=bottler, metric=throughput, copy URL, open fresh, confirm correct view; verify clear on both selectors removes params and shows distillery/count defaults
