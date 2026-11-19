# Proposal

## Why

The current Gantt shows shelf time as the primary bar, but the more useful question is how long a bottle was in the drinking window. Bought-only bottles add noise without insight. The redesign anchors every bar at the open date — the moment that matters — and reduces the bought date to a subtle positional marker.

## What Changes

- **Remove bought-only rows**: Bottles without `date_opened` no longer appear on the chart.
- **Replace two-phase bars with single open-phase bars**: The bar spans `date_opened` → `date_finished` (purple) or `date_opened` → today (green for ongoing). The shelf segment is removed entirely.
- **Add bought-date dot**: When a bottle has `date_bought`, a 5px dot is rendered on the shared time axis at the bought date's position (not attached to the bar).
- **Change default sort to `date_opened`**: Since bars are now anchored at `date_opened`, sort by that date ascending.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `whisky/gantt`: Replace two-phase bar model and bought-only row logic with open-anchored single-phase bars, bought-date dot marker, and date_opened sort.

## Impact

- `src/views/GanttView.vue` — filter logic (exclude non-opened bottles), sort key
- `src/components/GanttRow.vue` — bar rendering (single phase, new colors, dot marker)
- `src/style.css` — new or updated Gantt color tokens (green for ongoing, purple for finished)
