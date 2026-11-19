# Gantt

## Purpose

Lifecycle Gantt chart that visualises each bottle as a horizontal bar spanning its shelf phase (bought to opened) and drinking phase (opened to finished or today), revealing patterns in how long bottles sit before opening and how quickly they are consumed.

## Requirements

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

### Requirement: Year and event type filter
The Gantt SHALL support the same year and event type (bought, opened, finished) filter as the Timeline view. Each filter SHALL have a clear option.

#### Scenario: Year filter restricts visible bars
- **WHEN** the user selects year 2025 and event type bought
- **THEN** only bottles with a date_bought in 2025 are rendered on the chart

#### Scenario: Clear filter restores all bars
- **WHEN** the user clears the active year filter
- **THEN** all bottles with at least one date are rendered

### Requirement: URL-addressable filter state
All active Gantt filter values SHALL be encoded in the page URL as query parameters. Navigating directly to a filtered URL SHALL reproduce that view.

#### Scenario: Filter state survives reload
- **WHEN** the user reloads the page with `?year=2024&event=opened` in the URL
- **THEN** the Gantt loads with those filters pre-applied
