# Rankings

## Purpose

Ranking tables for distilleries and bottlers across multiple metrics — count, throughput, shelf time, and recency — surfacing which producers appear most frequently and how quickly their bottles are consumed.

## Requirements

### Requirement: Entity dimension toggle
The view SHALL provide a toggle to switch between ranking by distillery and ranking by bottler. Bottles with an empty distillery field SHALL be excluded from distillery rankings; bottles with an empty bottler field SHALL be excluded from bottler rankings.

#### Scenario: Distillery ranking shown
- **WHEN** the user selects the distillery dimension
- **THEN** the table rows represent distinct non-empty distillery values

#### Scenario: Bottler ranking shown
- **WHEN** the user selects the bottler dimension
- **THEN** the table rows represent distinct non-empty bottler values

### Requirement: Count metric
The ranking SHALL support a count metric showing the number of bottles attributed to each entity.

#### Scenario: Count ranking
- **WHEN** the user selects the count metric
- **THEN** entities are ordered by bottle count descending

### Requirement: Throughput metric
The ranking SHALL support a throughput metric showing the average number of days from date_opened to date_finished for bottles with both dates. The sample size SHALL be displayed alongside the metric.

#### Scenario: Throughput ranking
- **WHEN** the user selects the throughput metric
- **THEN** entities are ordered by average days-to-finish ascending (fastest first), with each row showing the average and the count of bottles used to compute it (e.g. "47 days (n=8)")

#### Scenario: Insufficient data excluded
- **WHEN** an entity has no bottles with both date_opened and date_finished
- **THEN** that entity does not appear in the throughput ranking

### Requirement: Shelf time metric
The ranking SHALL support a shelf time metric showing the average number of days from date_bought to date_opened for bottles with both dates. The sample size SHALL be displayed alongside the metric.

#### Scenario: Shelf time ranking
- **WHEN** the user selects the shelf time metric
- **THEN** entities are ordered by average shelf days descending (longest wait first), with the sample size shown per row

#### Scenario: Insufficient data excluded
- **WHEN** an entity has no bottles with both date_bought and date_opened
- **THEN** that entity does not appear in the shelf time ranking

### Requirement: Last Acquired metric
The ranking SHALL support a Last Acquired metric showing when the most recent bottle from each entity was acquired (latest date_bought). Entities with no date_bought on any bottle SHALL be excluded.

#### Scenario: Last Acquired ranking
- **WHEN** the user selects the Last Acquired metric
- **THEN** entities are ordered by their most recent date_bought descending (most recently acquired first)

### Requirement: URL-addressable ranking state
The active entity dimension and metric SHALL be encoded in the page URL as query parameters. Navigating directly to a URL with those parameters SHALL reproduce that view.

#### Scenario: Ranking state survives reload
- **WHEN** the user reloads the page with `?entity=bottler&metric=throughput` in the URL
- **THEN** the bottler ranking ordered by throughput is shown

#### Scenario: Clear returns to default
- **WHEN** the user activates the clear option on either the entity or metric selector
- **THEN** the selection reverts to its default (distillery; count) and the URL parameter is removed

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
