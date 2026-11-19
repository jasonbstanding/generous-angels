# Design

## Context

The app is a Vue 3 SPA with scoped component styles and global CSS custom properties in `src/style.css`. The color palette is defined entirely as tokens on `:root`, so a palette shift requires no component changes — only token value updates. The timeline card list (`TimelineView.vue`) uses `flex-direction: column`; `BottleCard.vue` is a horizontal flex (image left, body right). The `WhiskyBottle` type already includes `image_lg`.

## Goals / Non-Goals

**Goals:**
- Shift palette to slate/stone without altering the amber accent or dark nav
- Rework `BottleCard` to a vertical tile layout that works in a multi-column grid
- Display lifecycle dates as pill/lozenge badges rather than plain inline text
- Add a full-size image modal triggered from the thumbnail

**Non-Goals:**
- Responsive layout for the Gantt or Rankings views
- Any dark mode implementation
- Changing filter, sort, or data logic

## Decisions

**Palette tokens** — update the five values in `:root` (`--color-bg`, `--color-surface`, `--color-surface-alt`, `--color-border`, `--color-text-muted`) to cooler stone/slate equivalents. No component changes needed; all consumers reference the tokens.

**Card layout** — redesign `BottleCard` as a vertical tile (image on top, 100% card width; metadata and lozenges below). The existing horizontal layout is not needed elsewhere, so there is no variant to maintain. `TimelineView` switches its card list from column flex to CSS grid (`repeat(auto-fill, minmax(220px, 1fr))`).

**Date lozenges** — style each date `<span>` in `card-dates` as a pill using the existing `.tag` visual pattern (background, border, border-radius). Each lozenge gets a small label prefix (Bought / Opened / Finished) so the date is identifiable without relying on order.

**Thumbnail modal** — a dedicated `ImageModal.vue` component using Vue 3 `<Teleport to="body">` so the overlay sits outside card stacking contexts. The overlay uses a fixed full-screen backdrop; click-outside and Escape both close it. `BottleCard` emits a click event on the thumbnail; the parent (or the card itself via local `ref` state) manages open/closed state. Using component-local state in `BottleCard` is simpler and sufficient — only one modal can be open at a time.

**No new dependencies** — `<Teleport>`, `<dialog>`, and CSS are sufficient. No modal library needed.

## Risks / Trade-offs

- **Card height uniformity**: tiles in a grid may vary in height if title or metadata wraps differently. CSS grid auto-rows with `align-items: start` avoids stretching but means uneven row bottoms. Acceptable for a collection view. → No mitigation needed; this is the natural grid behavior.
- **Image aspect ratio**: `image_sml` is 64×96px (portrait). Full-size `image_lg` dimensions are unknown — the modal should constrain to viewport (`max-width: 90vw; max-height: 90vh`) with `object-fit: contain`.
