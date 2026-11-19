# Spec Delta

## Purpose

Chronological event stream of whisky bottle lifecycle events — bought, opened, finished — with a buying-trend summary chart that answers whether purchasing frequency has changed over time.

## ADDED Requirements

### Requirement: Buying trend summary
The view SHALL display a bar chart in the header showing the count of bottles with a recorded `date_bought` per calendar month, across all time (unaffected by active filters).

#### Scenario: Trend chart visible on load
- **WHEN** the user loads the Timeline view with no filters active
- **THEN** the header displays a bar chart with one bar per month from the earliest `date_bought` to the current month, with bar height proportional to purchase count

#### Scenario: Trend chart not filtered by active year filter
- **WHEN** the user applies a year filter
- **THEN** the trend chart continues to show the full date range across all years

### Requirement: Event stream display
The view SHALL display each bottle as a card in reverse chronological order of the active event-type date, showing the bottle name, distillery, bottler, and thumbnail image.

#### Scenario: Default event stream
- **WHEN** no event type filter is active
- **THEN** all bottles with any lifecycle date are displayed, ordered by their earliest available date descending

#### Scenario: Filtered event stream
- **WHEN** an event type (bought, opened, or finished) is selected
- **THEN** only bottles with a date for that event type are shown, ordered by that date descending

### Requirement: Year and event type filter
The view SHALL provide controls to filter the event stream by a calendar year and by event type (bought, opened, finished). Each filter SHALL have a clear option that removes it.

#### Scenario: Year filter applied
- **WHEN** the user selects a year (e.g. 2025) and event type (e.g. opened)
- **THEN** only bottles with a `date_opened` in 2025 are shown

#### Scenario: Clear year filter
- **WHEN** the user activates the clear option on the year filter
- **THEN** the year restriction is removed and all years are shown

#### Scenario: Clear event type filter
- **WHEN** the user activates the clear option on the event type filter
- **THEN** all event types contribute to the display

### Requirement: Distillery and bottler filter
The view SHALL provide controls to filter to a specific distillery or bottler. Each filter SHALL have a clear option.

#### Scenario: Distillery filter applied
- **WHEN** the user selects a distillery
- **THEN** only bottles where `distillery` matches are shown

#### Scenario: Bottler filter applied
- **WHEN** the user selects a bottler
- **THEN** only bottles where `bottler` matches are shown

#### Scenario: Clear distillery/bottler filter
- **WHEN** the user activates the clear option on the distillery or bottler filter
- **THEN** the restriction is removed

### Requirement: URL-addressable filter state
All active filter values SHALL be encoded in the page URL as query parameters. Navigating directly to a URL with filter parameters SHALL reproduce the filtered view.

#### Scenario: Filter state survives page reload
- **WHEN** the user reloads a page with `?year=2025&event=bought` in the URL
- **THEN** the view loads with those filters pre-applied

#### Scenario: Filter state shareable
- **WHEN** a second user opens the URL copied from the first user's browser
- **THEN** they see the same filtered view
