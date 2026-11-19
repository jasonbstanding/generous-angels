# Design

## Context

`GanttView.vue` currently shows any bottle with any date and sorts by `date_bought`. `GanttRow.vue` renders two segments (shelf: `date_bought`→`date_opened`; drinking: `date_opened`→`date_finished`/today) using `--color-shelf`, `--color-drinking`, and `--color-ongoing` tokens. The existing `FilterEventType` and `FilterYear` controls remain.

## Goals / Non-Goals

**Goals:**
- Show only bottles with `date_opened`; sort by `date_opened` ascending
- Single bar: `date_opened` → `date_finished` (purple) or today (green)
- 5px dot at `date_bought` axis position when present
- New color tokens for the two bar states

**Non-Goals:**
- Changing the year/event-type filter logic or controls
- Any other views

## Decisions

**Filter and sort** — `GanttView` replaces `hasAnyDate()` with `!!b.date_opened` as the base filter. `sortKey` changes from `date_bought ?? date_opened ?? date_finished` to `date_opened`. The event-type filter continues to work on top of the base filter unchanged.

**Bar rendering** — `GanttRow` drops the shelf segment entirely. The single bar spans `toPercent(date_opened)` → `toPercent(date_finished ?? todayStr)`. Two CSS classes distinguish the state: `bar-open` (green) and `bar-finished` (purple).

**Dot marker** — An absolutely-positioned `<div class="dot">` at `left: toPercent(date_bought) + '%'` with a fixed `width: 5px` and `height: 5px`, centred vertically on the row. Rendered only when `date_bought` is non-null. The dot sits in `row-bar-area` alongside the bar, so it shares the same coordinate space without additional prop threading.

**Color tokens** — Add four new tokens to `style.css` rather than reuse state-badge colors (those carry different semantic meaning in the UI):

```
--color-gantt-open: #4e9a6a;         /* green bar, ongoing */
--color-gantt-open-border: #3a7a52;
--color-gantt-finished: #7b6fad;     /* purple bar, finished */
--color-gantt-finished-border: #5e539a;
--color-gantt-dot: #94a3b8;          /* slate dot for bought date */
```

Old Gantt tokens (`--color-shelf`, `--color-shelf-border`, `--color-drinking`, `--color-drinking-border`, `--color-ongoing`) are unused after this change and can be removed.

## Risks / Trade-offs

- **"event type: bought" filter with no bought-only rows**: the filter still usefully narrows visible bottles to those where `date_bought` falls in the selected year. No behavioral conflict — the filter just operates on a pre-narrowed set.
- **Dot overlapping bar**: if `date_bought` is after `date_opened` (data error), the dot lands inside the bar. Acceptable — it remains visible as a colour contrast against the bar.
