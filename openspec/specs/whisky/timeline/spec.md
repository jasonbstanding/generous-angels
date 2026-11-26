# Timeline

## Purpose

Chronological event stream of whisky bottle lifecycle events — bought, opened, finished — with a buying-trend summary chart that answers whether purchasing frequency has changed over time.

## Requirements

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

### Requirement: Event stream display
The view SHALL display each bottle as a card in reverse chronological order of the active event-type date, showing the bottle name, distillery, bottler, and thumbnail image.

#### Scenario: Default event stream
- **WHEN** no event type filter is active
- **THEN** all bottles with any lifecycle date are displayed, ordered by their earliest available date descending

#### Scenario: Filtered event stream
- **WHEN** an event type (bought, opened, or finished) is selected
- **THEN** only bottles with a date for that event type are shown, ordered by that date descending

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

### Requirement: Thumbnail image popup
When a user clicks a bottle's thumbnail image, a modal SHALL open displaying the full-size bottle image. The modal SHALL close when the user clicks outside it or presses Escape.

#### Scenario: Thumbnail clicked
- **WHEN** the user clicks a bottle thumbnail image
- **THEN** a modal opens showing the full-size image for that bottle

#### Scenario: Modal dismissed by click-outside
- **WHEN** the modal is open and the user clicks outside the image area
- **THEN** the modal closes

#### Scenario: Modal dismissed by Escape
- **WHEN** the modal is open and the user presses the Escape key
- **THEN** the modal closes

### Requirement: Clickable distillery and bottler tags
Each bottle card SHALL display the distillery and bottler values as interactive tags. Clicking a distillery tag SHALL apply that distillery as the active distillery filter, exactly as selecting it from the distillery dropdown would. Clicking a bottler tag SHALL apply that bottler as the active bottler filter, exactly as selecting it from the bottler dropdown would.

#### Scenario: Distillery tag clicked
- **WHEN** the user clicks a distillery tag on a bottle card
- **THEN** the `?distillery=` URL parameter is set to that distillery's value and the card list is filtered to that distillery

#### Scenario: Bottler tag clicked
- **WHEN** the user clicks a bottler tag on a bottle card
- **THEN** the `?bottler=` URL parameter is set to that bottler's value and the card list is filtered to that bottler

#### Scenario: Tag click preserves other active filters
- **WHEN** the user clicks a distillery tag while a year filter is already active
- **THEN** the year filter remains active and the distillery filter is added alongside it

### Requirement: State-based card background tint
Each bottle card's background SHALL be visually tinted to reflect the bottle's lifecycle state: a green tint for bottles that are in stock (state: in), a purple tint for bottles that are open (state: open), and a red tint for bottles that are finished (state: finished). The tint SHALL be subtle enough that text and other card elements remain easily legible.

#### Scenario: In-stock card tint
- **WHEN** a bottle's state is in
- **THEN** the card background has a green tint

#### Scenario: Open card tint
- **WHEN** a bottle's state is open
- **THEN** the card background has a purple tint

#### Scenario: Finished card tint
- **WHEN** a bottle's state is finished
- **THEN** the card background has a red tint
