# Proposal

## Why

The app is deployed to GitHub Pages at `https://jasonbstanding.github.io/generous-angels/`, but the built `index.html` references assets at absolute paths (e.g. `/assets/index.js`). The browser resolves these against the GitHub Pages root (`jasonbstanding.github.io`), not the repo subpath, causing 404s for all assets and a blank page.

## What Changes

- Add `base: '/generous-angels/'` to `vite.config.ts` so Vite emits relative asset paths in the production build
- Rebuild `dist/` and redeploy to `gh-pages` via `git subtree push`

No user-visible behaviour changes — the app works identically, just from the correct URL.

## Capabilities

### New Capabilities
<!-- none — pure build config, skip_specs: true -->

### Modified Capabilities
<!-- none -->

## Impact

- `vite.config.ts`: add `base` field
- `dist/`: rebuild required after the config change
