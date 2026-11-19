# Design

## Context

`RankingTable` currently receives `rows: Array<{ name: string; value: string }>` with no bottle data. `RankingsView` already holds the full bottle groups but strips them down before passing to the table. The table is stateless.

## Goals / Non-Goals

**Goals:**
- Thread per-entity bottle arrays through to `RankingTable`
- Table manages expand/collapse state internally
- Expanded rows show a compact title list sorted by most recent date

**Non-Goals:**
- Filtering the expanded list to only qualifying bottles (all bottles for the entity are shown)
- Persisting expanded state across route changes or page loads
- Full card/tile treatment in expanded rows (titles only)

## Decisions

**Row data shape** — Extend the row item type from `{ name, value }` to `{ name, value, bottles: WhiskyBottle[] }`. `RankingsView` already builds per-entity groups via `groupBy()`; each metric branch already iterates those groups, so adding the bottles array is a one-line addition per branch.

**Expansion state** — A `ref<string | null>(null)` in `RankingTable` holds the currently expanded row name. Click handler toggles: same name → null; different name → new name. Entirely local — no prop, no emit.

**Expanded row rendering** — Insert a `<tr class="expanded-row">` after the clicked row using `v-if="expandedRow === row.name"`. A single `<td colspan="3">` spans the full width and contains a `<ul>` of titles. No new component needed.

**Bottle sort** — `maxDate(b)` = latest non-null of `date_bought`, `date_opened`, `date_finished`. Sort descending by that string (ISO dates sort lexicographically). Bottles with no dates sort last.

**Type import** — `RankingTable` imports `WhiskyBottle` from `../types` for the prop type. Already imported in `RankingsView`.

## Risks / Trade-offs

- **Many bottles per entity**: a distillery with 50 bottles produces a long list. Acceptable for a personal collection tool — no pagination needed.
- **Row type widening**: changing `rows` prop type is a breaking change to `RankingTable`'s public interface, but it has only one caller (`RankingsView`), so the change is contained.
