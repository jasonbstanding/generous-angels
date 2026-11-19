# Proposal

## Why

The rankings table shows aggregate statistics per distillery or bottler but gives no way to see which bottles are behind each number. Clicking a row to reveal the underlying bottles makes the data explorable without leaving the view.

## What Changes

- **Expandable ranking rows**: Clicking any row in the rankings table toggles an indented list of bottle titles beneath it. Clicking again (or clicking a different row) collapses it.
- **Bottle list sort**: Bottles in the expanded list are sorted by their most recent lifecycle date (latest of date_bought, date_opened, date_finished) descending.
- **One row open at a time**: Expanding a row collapses any previously expanded row.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `whisky/rankings`: Add row expansion requirement (new observable interaction on table rows).

## Impact

- `src/views/RankingsView.vue` — include per-entity bottle arrays in the rows data passed to `RankingTable`
- `src/components/RankingTable.vue` — expand/collapse state, expanded row rendering
