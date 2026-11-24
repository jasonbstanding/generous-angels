# Tasks

## 1. Fix asset base path

- [x] 1.1 In `vite.config.ts`, add `base: '/generous-angels/'` to the `defineConfig` object
- [x] 1.2 Run `npm run build` to rebuild `dist/` with the corrected asset paths; verify `dist/index.html` now references `/generous-angels/assets/...`
- [x] 1.3 Commit `dist/` and push the subtree to `gh-pages`: `git add dist/ && git commit -m "Rebuild dist with corrected base path"` then `git subtree push --prefix dist origin gh-pages`
- [x] 1.4 Verify `https://jasonbstanding.github.io/generous-angels/` loads correctly
