# Proposal

## Why

The Rankings view has several rough edges surfaced in a usability review: the "Recency" metric label is unclear, the entity name column is misaligned between header and data rows, and the expanded bottle lists are generic across all metrics rather than showing the information most relevant to each one.

## What Changes

- Rename the "Recency" metric to "Last Acquired" in the dropdown, metric label, and URL parameter display
- Fix column heading alignment so the entity name header aligns with the indented data rows
- Count expanded list: show each bottle's current status (`state`: on shelf / open / finished) alongside its title
- Throughput expanded list: show only bottles that qualify for the metric (both `date_opened` and `date_finished`), each with their individual days-to-finish
- Shelf Time expanded list: show only qualifying bottles (both `date_bought` and `date_opened`), each with their individual shelf time in days
- Last Acquired expanded list: sort by `date_bought` descending and show each bottle's purchase date

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `whisky/rankings`: Recency metric renamed to Last Acquired; expanded row detail content now varies by metric (status indicator for count, duration per bottle for throughput/shelf-time, purchase date for last-acquired)

## Impact

- `src/views/RankingsView.vue`: rename metric value and label
- `src/components/RankingTable.vue`: metric-aware expanded row rendering, column heading CSS fix
