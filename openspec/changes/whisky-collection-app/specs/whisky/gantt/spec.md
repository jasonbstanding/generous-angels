# Spec Delta

## Purpose

Lifecycle Gantt chart that visualises each bottle as a horizontal bar spanning its shelf phase (bought to opened) and drinking phase (opened to finished or today), revealing patterns in how long bottles sit before opening and how quickly they are consumed.

## ADDED Requirements

### Requirement: Two-phase lifecycle bars
Each bottle SHALL be rendered as a horizontal bar on a shared time axis. The bar SHALL visually distinguish the shelf phase (date_bought to date_opened) from the drinking phase (date_opened to date_finished, or date_opened to today if the bottle is still open).

#### Scenario: Bottle with all three dates
- **WHEN** a bottle has date_bought, date_opened, and date_finished
- **THEN** the bar shows a muted segment from date_bought to date_opened, followed by a warm segment from date_opened to date_finished

#### Scenario: Currently open bottle
- **WHEN** a bottle has date_bought and date_opened but no date_finished (state is open)
- **THEN** the bar shows a muted segment from date_bought to date_opened, and a warm segment from date_opened extending to today with a visual indicator that it is ongoing

#### Scenario: Unopened bottle with date_bought
- **WHEN** a bottle has date_bought but no date_opened (state is in)
- **THEN** the bar shows only a muted segment from date_bought extending to today

### Requirement: Partial bar handling for missing dates
Bottles missing one or more lifecycle dates SHALL still appear on the Gantt anchored to their available dates. Bottles with no dates at all SHALL be excluded.

#### Scenario: Bottle with only date_opened
- **WHEN** a bottle has date_opened but no date_bought
- **THEN** the bar begins at date_opened and shows only the drinking phase (warm segment)

#### Scenario: Bottle with no dates
- **WHEN** a bottle has no date_bought, no date_opened, and no date_finished
- **THEN** the bottle does not appear on the Gantt

### Requirement: Default sort by date_bought
Bottles SHALL be sorted by date_bought ascending by default, with date_opened used as a fallback when date_bought is absent.

#### Scenario: Sort order on load
- **WHEN** the user loads the Gantt with no sort filter active
- **THEN** bottles appear in ascending order of date_bought (or date_opened where date_bought is absent), earliest at the top

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
