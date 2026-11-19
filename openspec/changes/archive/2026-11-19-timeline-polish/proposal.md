# Proposal

## Why

Two Timeline UX improvements surfaced in a usability review: the event type dropdown is a hidden filter that users have to open to discover, and the purchases chart has no readable count — bar height alone isn't enough when months are close in value.

## What Changes

- Replace the event type `<select>` in `FilterEventType.vue` with 4 inline pill buttons: All / Bought / Opened / Finished. The active selection is highlighted; clicking "All" clears the event filter. URL param behaviour is unchanged.
- Add a count label above each bar in `TrendChart.vue`. Labels render when the column is wide enough; the column's `overflow: hidden` clips them when too narrow, leaving the existing tooltip as fallback.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `whisky/timeline`: Event type filter changed from dropdown to button group; buying trend bars now show count labels when space allows

## Impact

- `src/components/FilterEventType.vue`: rewritten as button group (no structural change to parent)
- `src/components/TrendChart.vue`: count label added to bar column
