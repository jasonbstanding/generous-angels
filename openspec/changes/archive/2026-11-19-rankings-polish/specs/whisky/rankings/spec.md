# Spec Delta

## REMOVED Requirements

### Requirement: Recency metric
**Reason**: Renamed to "Last Acquired metric" and label updated for clarity.
**Migration**: Select "Last Acquired" in the metric dropdown; the sort order and URL parameter behaviour are unchanged.

## ADDED Requirements

### Requirement: Last Acquired metric
The ranking SHALL support a Last Acquired metric showing when the most recent bottle from each entity was acquired (latest date_bought). Entities with no date_bought on any bottle SHALL be excluded.

#### Scenario: Last Acquired ranking
- **WHEN** the user selects the Last Acquired metric
- **THEN** entities are ordered by their most recent date_bought descending (most recently acquired first)

## MODIFIED Requirements

### Requirement: Expandable row detail
Clicking a ranking row SHALL expand it to show a list of bottles attributed to that entity. The list content varies by metric:
- **Count**: All entity bottles, each showing its current status (on shelf / open / finished)
- **Throughput**: Only bottles with both date_opened and date_finished, sorted fastest first, each showing its individual days-to-finish
- **Shelf Time**: Only bottles with both date_bought and date_opened, sorted longest first, each showing its individual shelf time in days
- **Last Acquired**: All entity bottles sorted by date_bought descending, each showing its purchase date

Clicking the same row again SHALL collapse it. Clicking a different row SHALL collapse the previously expanded row and expand the new one.

#### Scenario: Count expanded list shows bottle status
- **WHEN** the user expands a row in Count metric
- **THEN** each bottle title is shown alongside its current status (on shelf, open, or finished)

#### Scenario: Throughput expanded list shows qualifying bottles with durations
- **WHEN** the user expands a row in Throughput metric
- **THEN** only bottles with both date_opened and date_finished are shown, each with their individual days-to-finish

#### Scenario: Shelf Time expanded list shows qualifying bottles with durations
- **WHEN** the user expands a row in Shelf Time metric
- **THEN** only bottles with both date_bought and date_opened are shown, each with their individual shelf time in days

#### Scenario: Last Acquired expanded list shows bottles with purchase dates
- **WHEN** the user expands a row in Last Acquired metric
- **THEN** all entity bottles are shown sorted by date_bought descending, each with its purchase date

#### Scenario: Row collapsed on second click
- **WHEN** the user clicks an already-expanded row
- **THEN** the bottle list collapses and the row returns to its default appearance

#### Scenario: Only one row expanded at a time
- **WHEN** the user clicks a row while another row is already expanded
- **THEN** the previously expanded row collapses and the clicked row expands
