# Spec Delta

## REMOVED Requirements

### Requirement: Two-phase lifecycle bars
**Reason**: Replaced by an open-phase bar model that focuses on the drinking window rather than the full lifecycle. The shelf segment added noise without useful insight at a glance.
**Migration**: Bars now span date_opened → date_finished (or today). The shelf phase is no longer visualised as a bar; a dot marker conveys the bought date instead.

### Requirement: Partial bar handling for missing dates
**Reason**: The open-phase model requires date_opened to anchor the bar. Bottles without date_opened have no meaningful bar to show and are now excluded entirely.
**Migration**: Only bottles with date_opened appear on the chart. Bottles with only date_bought or no dates are not rendered.

### Requirement: Default sort by date_bought
**Reason**: Bars are now anchored at date_opened, so sorting by date_bought would produce a misleading ordering relative to bar positions.
**Migration**: The chart now sorts by date_opened ascending by default.

## ADDED Requirements

### Requirement: Open-phase bar
Only bottles with `date_opened` SHALL appear on the Gantt. Each bottle SHALL be rendered as a single horizontal bar on the shared time axis. If the bottle has `date_finished`, the bar SHALL span `date_opened` to `date_finished` and be rendered in a finished colour (purple). If the bottle has no `date_finished` (state is open), the bar SHALL span `date_opened` to today and be rendered in an ongoing colour (green).

#### Scenario: Finished bottle bar
- **WHEN** a bottle has both `date_opened` and `date_finished`
- **THEN** the bar spans from `date_opened` to `date_finished` in the finished (purple) colour

#### Scenario: Open bottle bar
- **WHEN** a bottle has `date_opened` but no `date_finished`
- **THEN** the bar spans from `date_opened` to today in the ongoing (green) colour

#### Scenario: Bottle without date_opened excluded
- **WHEN** a bottle has no `date_opened` (regardless of other dates)
- **THEN** the bottle does not appear on the Gantt

### Requirement: Bought-date dot marker
When a displayed bottle has `date_bought`, a 5px-wide dot marker SHALL be rendered on the shared time axis at the position corresponding to `date_bought`.

#### Scenario: Dot shown for bottle with date_bought
- **WHEN** a bottle with `date_opened` also has `date_bought`
- **THEN** a 5px dot appears on the axis at the `date_bought` position for that row

#### Scenario: No dot when date_bought absent
- **WHEN** a bottle with `date_opened` has no `date_bought`
- **THEN** no dot marker appears for that row

### Requirement: Default sort by date_opened
Bottles SHALL be sorted by `date_opened` ascending by default.

#### Scenario: Sort order on load
- **WHEN** the user loads the Gantt with no sort filter active
- **THEN** bottles appear in ascending order of `date_opened`, earliest at the top
