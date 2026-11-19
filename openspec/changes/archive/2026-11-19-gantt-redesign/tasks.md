# Tasks

## 1. Color tokens

- [x] 1.1 Add `--color-gantt-open`, `--color-gantt-open-border`, `--color-gantt-finished`, `--color-gantt-finished-border`, and `--color-gantt-dot` tokens to `src/style.css`; remove the now-unused `--color-shelf`, `--color-shelf-border`, `--color-drinking`, `--color-drinking-border`, and `--color-ongoing` tokens; verify no remaining references to removed tokens

## 2. GanttView filter and sort

- [x] 2.1 Replace `hasAnyDate()` base filter in `GanttView.vue` with `!!b.date_opened`; verify bottles without `date_opened` no longer appear on the chart
- [x] 2.2 Change `sortKey()` in `GanttView.vue` to return `b.date_opened ?? ''`; verify bottles are ordered by `date_opened` ascending on load

## 3. GanttRow bar and dot

- [x] 3.1 Remove the shelf segment from `GanttRow.vue`; replace with a single bar computed from `date_opened` → `date_finished` (or today), using `bar-finished` class when `date_finished` is set and `bar-open` class otherwise; apply `--color-gantt-finished` / `--color-gantt-open` colors; verify finished bottles show a purple bar and open bottles show a green bar
- [x] 3.2 Add a dot marker `<div>` to `GanttRow.vue` rendered only when `date_bought` is non-null; position it at `toPercent(date_bought)%` left with `width: 5px`, vertically centred; apply `--color-gantt-dot` color; verify the dot appears at the correct axis position for a bottle with a known `date_bought`
