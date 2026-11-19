# Proposal

## Why

The app's warm-beige palette reads too close to CellarTracker. The timeline layout wastes horizontal space on desktop by stretching one card per row. Bottle thumbnail images are static and can't be inspected in detail. This change dials back the beige, tightens the card layout, and makes thumbnails interactive.

## What Changes

- **Palette**: Shift background, surface, and border tokens from warm beige to slate/stone neutrals. Amber accents and dark nav are retained — only the base surfaces change.
- **Timeline tile layout**: Replace the single-column card list with a multi-column grid. Cards reflow to a vertical tile shape (image on top, metadata below) suited to narrower widths. Desktop shows several tiles per row; mobile collapses to one.
- **Date lozenges**: Each lifecycle date on a card (bought, opened, finished) is displayed as a distinct pill/badge for visual separation, replacing the plain inline text run.
- **Thumbnail popup**: Clicking a bottle's thumbnail image in any card opens a modal showing the full-size image (`image_lg`). The modal closes on click-outside or Escape.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `whisky/timeline`: Add thumbnail image popup requirement (new observable interaction on card thumbnails).

## Impact

- `src/style.css` — CSS token values for bg, surface, surface-alt, and border colors
- `src/components/BottleCard.vue` — tile layout, date lozenges, thumbnail click handler
- `src/views/TimelineView.vue` — grid layout for card list
- New or inline modal component for full-size image display
