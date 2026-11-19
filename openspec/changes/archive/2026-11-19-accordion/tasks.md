# Tasks

## 1. Extend row data in RankingsView

- [x] 1.1 Add `bottles: WhiskyBottle[]` to each row object in every metric branch of the `rows` computed in `RankingsView.vue`; for each branch, include all bottles grouped under the entity (not just qualifying bottles); verify the prop passed to `RankingTable` includes the bottles array for each row

## 2. Accordion in RankingTable

- [x] 2.1 Update `RankingTable.vue` prop type to accept `rows: Array<{ name: string; value: string; bottles: WhiskyBottle[] }>`; import `WhiskyBottle` from `../types`; verify TypeScript compiles without errors
- [x] 2.2 Add a `ref<string | null>(null)` for `expandedRow` and a click handler that toggles it (same name → null, different name → set); add `cursor: pointer` to row style; verify clicking a row sets the expanded name and clicking again clears it
- [x] 2.3 Add an expanded `<tr>` after each row (using `v-if="expandedRow === row.name"`) with a single `<td colspan="3">` containing a `<ul>` of bottle titles sorted by most recent lifecycle date descending; verify the list appears under the clicked row and collapses on a second click
