# Proposal

## Why

The app currently presents as a generic "Whisky Collection" with no personal identity. Personalising the nav brand, page title, favicon, and adding an attribution link ties the app to its author.

## What Changes

- Rename nav brand text from "Whisky Collection" to "Jason B. Drammin'"
- Update `<title>` in `index.html` from "Whisky Collection" to "Jason B. Drammin'"
- Add a "Powered by jasonbstanding.com" attribution link in the nav (right-aligned)
- Set favicon from the jasonbstanding.com favicon URL via a `<link rel="icon">` in `index.html`

## Capabilities

### New Capabilities
- `whisky/shell`: App identity — nav brand, page title, favicon, and attribution link

### Modified Capabilities
<!-- none -->

## Impact

- `index.html`: add `<link rel="icon">`, update `<title>`
- `src/App.vue`: update nav brand text, add attribution link
