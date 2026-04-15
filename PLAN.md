# Whisky Timeline — Spiritual Journey

## Context
Build a Vue 3 read-only visualisation over the whisky collection API at `https://www.jasonbstanding.com/wp-json/jbs/v2/whisky`. The app surfaces 150+ records chronologically, shows each bottle's lifecycle journey (bought → opened → finished), provides distillery/bottler rankings, and filters by time window and specific distillery/bottler. Starting from a blank repo (no package.json).

---

## Tech Stack
- **Vue 3** + Composition API + TypeScript
- **Vite** (build tool)
- **Vanilla CSS** with CSS custom properties (design tokens) + `<style scoped>` per SFC
- **@phosphor-icons/vue** (icons)
- **GSAP** (scroll reveal animations via IntersectionObserver)
- **No Pinia** — singleton composables handle shared state
- **Theme:** Dark-only, amber accent, Satoshi font (via Fontshare CDN)

### Install Command
```bash
npm install
npm install @phosphor-icons/vue gsap
npm install -D @types/node
```

---

## CSS Design System (no Tailwind)
All design tokens live in `src/assets/main.css` as CSS custom properties. Components use `var(--token)` in `<style scoped>`.

```css
:root {
  --color-bg:           #09090b;   /* zinc-950 */
  --color-surface:      #18181b;   /* zinc-900 */
  --color-border:       #27272a;   /* zinc-800 */
  --color-border-hover: #3f3f46;   /* zinc-700 */
  --color-text:         #f4f4f5;   /* zinc-100 */
  --color-text-muted:   #a1a1aa;   /* zinc-400 */
  --color-text-subtle:  #71717a;   /* zinc-500 */
  --color-accent:       #f59e0b;   /* amber-500 */
  --color-accent-dim:   #b45309;   /* amber-700 */
  --color-accent-muted: #451a03;   /* amber-950 */

  --font-sans: 'Satoshi', system-ui, sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  --nav-height: 56px;
  --filter-height: 48px;
}
```

---

## API Data Shape
```typescript
{
  id: number
  title: string
  distillery: string       // empty string when absent (not null)
  bottler: string          // empty string when absent
  date_bought: string | null   // YYYY-MM-DD or null
  date_opened: string | null
  date_finished: string | null
  state: 'in' | 'open' | 'finished'
  image_sml: string
  image_lg: string
}
```
- Date range in data: 2024-03 through 2026-04
- ~70–75% of records have at least one date; remainder are undated

---

## File Structure
```
src/
├── main.ts
├── App.vue
├── types/whisky.ts
├── composables/
│   ├── useWhiskyData.ts       # Fetch + cache; derives distilleryList, bottlerList, availableYears
│   ├── useTimeline.ts         # Derive anchor dates, sort, group by month
│   ├── useFilters.ts          # All filter state: period, year, state, distillery, bottler
│   └── useRankings.ts         # Bar chart + heatmap data
├── components/
│   ├── layout/
│   │   ├── TopNav.vue
│   │   └── FilterBar.vue      # Chips + FilterDropdown for distillery/bottler
│   ├── timeline/
│   │   ├── TimelineView.vue
│   │   ├── DateMarker.vue
│   │   ├── BottleCard.vue
│   │   ├── JourneyBar.vue
│   │   └── UndatedSection.vue
│   ├── rankings/
│   │   ├── RankingsView.vue
│   │   ├── BarChart.vue
│   │   └── ActivityHeatmap.vue
│   ├── lightbox/
│   │   └── ImageLightbox.vue
│   └── ui/
│       ├── FilterDropdown.vue  # Reusable searchable popup list
│       ├── SkeletonCard.vue
│       ├── EmptyState.vue
│       └── ErrorState.vue
└── assets/
    └── main.css               # Design tokens + global resets
```

---

## Key Logic

### `useWhiskyData.ts`
Singleton module-level refs — no duplicate fetches across component instances.

Exports:
- `records: Ref<WhiskyRecord[]>`
- `loading: Ref<boolean>`
- `error: Ref<string | null>`
- `distilleryList: ComputedRef<string[]>` — unique non-empty distilleries, sorted A–Z
- `bottlerList: ComputedRef<string[]>` — unique non-empty bottlers, sorted A–Z
- `availableYears: ComputedRef<number[]>` — unique years present in any date field, sorted desc
- `refresh(): Promise<void>`

### Anchor Date (timeline positioning)
```typescript
anchorDate = date_bought ?? date_opened ?? date_finished ?? null
```
`null` → undated bucket (state filter applies; date filters do not).

### Timeline Groups
Sort dated bottles by `anchorDate` descending (newest first). Group by `YYYY-MM` slice for month clusters.

### `useFilters.ts`
```typescript
interface ActiveFilters {
  period: '3M' | '6M' | '12M' | null
  year: number | null
  state: 'in' | 'open' | 'finished' | null
  distillery: string | null  // exact match on bottle.distillery
  bottler: string | null     // exact match on bottle.bottler
}
```
- `setPeriod` clears `year`; `setYear` clears `period` (mutually exclusive)
- Distillery and bottler filters stack with all other filters (AND logic)
- `resetFilters()` clears everything

### `FilterDropdown.vue` (reusable)
Props: `label: string`, `options: string[]`, `modelValue: string | null`
Emits: `update:modelValue`

- Trigger button shows selected value or `label` as placeholder
- Panel teleported to `<body>`, fixed-positioned below trigger (computed on open)
- Search input filters list live; ESC closes; click outside closes
- Alphabetical scrollable list; active option highlighted amber

### JourneyBar
Three milestone nodes (B/O/F). Graceful degradation:
- 2+ dates present: show all 3 nodes, hollow for missing dates
  - B-to-O segment: solid if both dates set, dashed otherwise
  - O-to-F segment: solid if both dates set, dashed otherwise
- Exactly 1 date: single node with label and date, no track
- 0 dates: render nothing (bottle goes to undated section)

### Rankings (state filter applies; date/distillery/bottler filters do not)
**Bar charts:** Top 15 distilleries + top 15 bottlers, total count descending.
Segmented CSS bars: `in` (zinc) | `open` (amber-dim) | `finished` (amber). GSAP `scaleX` reveal.

**Heatmap:** `yearMonth` rows × {Bought, Opened, Finished} columns.
Cell opacity = `count / columnMax` (normalised per column independently). Always uses full unfiltered dataset.

### Rankings Layout (asymmetric)
Desktop: `grid-template-columns: 1fr 1.4fr` — bars left, heatmap right.
Mobile: single column, heatmap below.

---

## Design Decisions
- **Vertical scroll** — better for mobile, natural for a date axis, cleaner at variable density
- **Newest-first** — most interesting to see recent activity at top
- **Timeline layout:** flex row: 72px sticky DateMarker col + flex-1 cards col. Mobile: stacked.
- **FilterBar:** sticky below nav, `overflow-x: auto` horizontal scroll on mobile
- **Cards:** `background: var(--color-surface); border: 1px solid var(--color-border)` — minimal elevation
- **Scroll reveals:** IntersectionObserver per BottleCard, fire-once GSAP fade+slide in

---

## Implementation Order
1. Scaffold: package.json, vite.config.ts, index.html, tsconfig files
2. `src/types/whisky.ts` + `src/assets/main.css`
3. `useWhiskyData.ts` + `useFilters.ts` + `useTimeline.ts` + `useRankings.ts`
4. `TopNav.vue` + `App.vue` + `src/main.ts`
5. `FilterDropdown.vue` + `FilterBar.vue`
6. `SkeletonCard.vue` + `EmptyState.vue` + `ErrorState.vue`
7. `DateMarker.vue` + `JourneyBar.vue` + `BottleCard.vue`
8. `TimelineView.vue` + `UndatedSection.vue`
9. `ImageLightbox.vue`
10. `BarChart.vue` + `ActivityHeatmap.vue` + `RankingsView.vue`
11. GSAP reveals as final polish pass

---

## Verification
1. `npm run dev` — app loads, data fetches, 150+ cards render
2. Timeline sorted newest-first, DateMarkers show correct months
3. Period/year filters work and are mutually exclusive; state filter stacks
4. Distillery dropdown: opens, search filters list, selection filters timeline, reset clears
5. Bottler dropdown: same, independent of distillery filter
6. All five filters AND correctly (distillery + period → intersection)
7. JourneyBar renders for 1-date, 2-date, and 3-date records
8. Undated section visible, collapsible, state-filterable
9. Click image → lightbox; ESC and outside-click close
10. Rankings tab: bars render with correct counts; heatmap covers full month range
11. Mobile at 375px: single column, filter bar scrollable, no page overflow
12. Loading skeletons during fetch; error state on network failure
