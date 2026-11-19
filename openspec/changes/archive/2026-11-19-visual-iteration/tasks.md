# Tasks

## 1. Palette

- [x] 1.1 Update `--color-bg`, `--color-surface`, `--color-surface-alt`, `--color-border`, and `--color-text-muted` tokens in `src/style.css` to slate/stone values; verify the app renders with no warm-beige backgrounds and amber accents remain intact

## 2. Card tile layout

- [x] 2.1 Redesign `BottleCard.vue` to a vertical tile: image spans full card width on top, metadata and dates stack below; verify the card renders correctly as a tile and the image is not cropped horizontally
- [x] 2.2 Update the `.card-list` in `TimelineView.vue` from `flex-direction: column` to a CSS grid with `repeat(auto-fill, minmax(220px, 1fr))`; verify multiple tiles appear per row on a laptop-width viewport and the grid collapses to one column on mobile

## 3. Date lozenges

- [x] 3.1 Style each lifecycle date span in `BottleCard.vue` as a pill badge (background, border, border-radius) with a short label prefix (Bought / Opened / Finished); verify that a bottle with all three dates shows three distinct labelled lozenges

## 4. Thumbnail modal

- [x] 4.1 Create `src/components/ImageModal.vue`: uses `<Teleport to="body">`, renders a fixed full-screen backdrop with the full-size image constrained to `max-width: 90vw; max-height: 90vh; object-fit: contain`; closes on backdrop click and on Escape keydown; verify the modal opens, the image fills the viewport proportionally, and both close interactions work
- [x] 4.2 Add a click handler to the thumbnail `<img>` in `BottleCard.vue` that opens `ImageModal` with the bottle's `image_lg` URL; verify clicking any card thumbnail opens the modal showing the full-size image
