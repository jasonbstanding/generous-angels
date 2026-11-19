# Design

## Context

`RankingTable` currently receives `rows: Array<{ name, value, bottles: WhiskyBottle[] }>` and renders an identical expanded list for every metric — all entity bottles sorted by most-recent date. It has no knowledge of which metric is active. `RankingsView` builds the rows and passes them down.

## Goals / Non-Goals

**Goals:**
- Each metric renders the right expanded list (filtered set, correct detail per row)
- Column heading text aligns with indented data rows
- Rename "Recency" to "Last Acquired" throughout

**Non-Goals:**
- Persisting expanded state across metric changes
- Pagination of the expanded bottle list

## Decisions

**Metric prop on RankingTable** — Add `metric: 'count' | 'throughput' | 'shelf-time' | 'last-acquired'` prop. RankingTable uses it to pick filter logic and display format for the expanded list. The alternative (pre-computing display items in RankingsView) requires changing the row shape in six metric branches; the prop is a one-line addition to the parent and keeps all display logic co-located in the table.

**Duration computation in RankingTable** — `daysBetween(a, b)` is `Math.round((Date b - Date a) / 86_400_000)`. It's a one-liner that already exists in RankingsView; duplicating it in RankingTable avoids extracting a utility module for a trivial calculation.

**Status display** — `WhiskyBottle.state` (`'in' | 'open' | 'finished'`) is already on the type; no derivation needed. Display as muted text alongside the title: "on shelf", "open", "finished".

**Column heading alignment** — The data `td.col-name` uses `display: flex` with a 10px icon and `var(--space-2)` gap before the name text. Add matching `padding-left: calc(10px + var(--space-2))` to `th.col-name` so header text aligns with data text.

**Rename** — Change the metric value and label string for "Recency" → "Last Acquired" in `RankingsView`. The URL parameter changes from `metric=recency` to `metric=last-acquired`; existing bookmarked URLs with `metric=recency` will fall through to the default (count), which is acceptable for a personal tool.

## Risks / Trade-offs

- **URL parameter change**: `?metric=recency` bookmarks silently revert to count. Acceptable given this is a personal tool with no shared links.
- **RankingTable coupling**: the table now knows metric names. It has one caller (`RankingsView`), so this is contained.
