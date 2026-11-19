# Spec Delta

## ADDED Requirements

### Requirement: Expandable row detail
Clicking a ranking row SHALL expand it to show an indented list of bottle titles attributed to that entity, sorted by each bottle's most recent lifecycle date descending. Clicking the same row again SHALL collapse it. Clicking a different row SHALL collapse the previously expanded row and expand the new one.

#### Scenario: Row expanded on click
- **WHEN** the user clicks a ranking row
- **THEN** an indented list of bottle titles for that entity appears beneath the row, sorted by most recent lifecycle date descending

#### Scenario: Row collapsed on second click
- **WHEN** the user clicks an already-expanded row
- **THEN** the bottle list collapses and the row returns to its default appearance

#### Scenario: Only one row expanded at a time
- **WHEN** the user clicks a row while another row is already expanded
- **THEN** the previously expanded row collapses and the clicked row expands
