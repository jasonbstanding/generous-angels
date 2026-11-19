# Tasks

## 1. Event type button group

- [x] 1.1 Rewrite `FilterEventType.vue`: replace the `<select>` with four `<button>` elements (All, Bought, Opened, Finished) in a `.event-btns` wrapper; each button reads `modelValue` from `route.query.event` and calls the same router replace logic on click (empty string → delete query.event, otherwise set it); verify clicking each button updates the URL param and the Timeline filters correctly, and clicking All removes the param
- [x] 1.2 Style the button group in `FilterEventType.vue`: buttons share a border radius group (pill left/right on outermost, square inner joins), active button gets `background: var(--color-nav-active); color: white`, inactive gets muted surface style; verify the active state tracks the URL param on load and navigation

## 2. TrendChart count labels

- [x] 2.1 Add `overflow: hidden` to `.bar-col` in `TrendChart.vue` so content is clipped when columns are narrow; add a `<span class="bar-count">{{ m.count || '' }}</span>` inside `.bar-col` positioned above the bar; style `.bar-count` with `font-size: 9px; line-height: 1; text-align: center; width: 100%; color: var(--color-text-muted); pointer-events: none`; verify the count appears above bars when columns are wide, and is clipped (not overlapping) when columns are narrow, with the existing `:title` tooltip still present
