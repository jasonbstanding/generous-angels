# Tasks

## 1. Rename Recency to Last Acquired

- [x] 1.1 In `RankingsView.vue`, change the metric option value from `'recency'` to `'last-acquired'` in the `<select>`, update the `Metric` type union, change the `clearMetric` guard, rename the `metricLabel` entry from `recency` to `last-acquired`, and rename the computed branch; verify the dropdown shows "Last Acquired" and the URL param becomes `?metric=last-acquired` when selected

## 2. Column heading alignment

- [x] 2.1 In `RankingTable.vue`, add `padding-left: calc(10px + var(--space-2))` to the `.table th.col-name` rule; verify the "Distillery" / "Bottler" header text visually aligns with the entity name text in data rows

## 3. Metric-aware expanded lists in RankingTable

- [x] 3.1 Add `metric: 'count' | 'throughput' | 'shelf-time' | 'last-acquired'` to `defineProps` in `RankingTable.vue` and pass it from `RankingsView.vue`; verify TypeScript compiles without errors
- [x] 3.2 Add a `daysBetween(a: string, b: string): number` helper in `RankingTable.vue` (identical to the one in `RankingsView`); verify it is used by the throughput and shelf-time display functions
- [x] 3.3 Replace the single `sortedBottles()` call in the expanded row with a `expandedItems(row)` computed that returns metric-specific display objects; for **count**: all bottles with their `state` label; for **throughput**: qualifying bottles (both dates) sorted fastest first with days-to-finish; for **shelf-time**: qualifying bottles sorted longest first with shelf days; for **last-acquired**: all bottles sorted by `date_bought` descending with formatted purchase date; verify each metric shows the correct subset and detail
- [x] 3.4 Update the expanded-row template to render items from `expandedItems` — bottle title + detail string per item; verify the expanded list reflects the active metric when switching between metrics

