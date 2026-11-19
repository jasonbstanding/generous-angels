# Spec Delta

## MODIFIED Requirements

### Requirement: Buying trend summary
The view SHALL display a bar chart in the header showing the count of bottles with a recorded `date_bought` per calendar month, across all time (unaffected by active filters). Each bar column SHALL display its purchase count as a numeric label when the column is wide enough to show it; when too narrow the count SHALL remain accessible via the column's tooltip.

#### Scenario: Trend chart visible on load
- **WHEN** the user loads the Timeline view with no filters active
- **THEN** the header displays a bar chart with one bar per month from the earliest `date_bought` to the current month, with bar height proportional to purchase count

#### Scenario: Trend chart not filtered by active year filter
- **WHEN** the user applies a year filter
- **THEN** the trend chart continues to show the full date range across all years

#### Scenario: Count label visible on wide columns
- **WHEN** a bar column is wide enough to display a number
- **THEN** the purchase count is shown as a numeric label within or above the bar

#### Scenario: Count label clipped on narrow columns
- **WHEN** bar columns are too narrow to display a number
- **THEN** the count label is not visible but remains accessible via the column tooltip

### Requirement: Year and event type filter
The view SHALL provide controls to filter the event stream by a calendar year and by event type. The event type control SHALL be a group of four buttons — All, Bought, Opened, Finished — with the active selection visually highlighted. Selecting "All" clears the event type filter. The year filter SHALL have a clear option that removes it.

#### Scenario: Year filter applied
- **WHEN** the user selects a year (e.g. 2025) and event type (e.g. opened)
- **THEN** only bottles with a `date_opened` in 2025 are shown

#### Scenario: Clear year filter
- **WHEN** the user activates the clear option on the year filter
- **THEN** the year restriction is removed and all years are shown

#### Scenario: Event type button selected
- **WHEN** the user clicks one of the event type buttons (Bought, Opened, or Finished)
- **THEN** only bottles with a date for that event type are shown, and that button appears highlighted

#### Scenario: All button clears event type filter
- **WHEN** the user clicks the All button
- **THEN** all event types contribute to the display and the All button appears highlighted
