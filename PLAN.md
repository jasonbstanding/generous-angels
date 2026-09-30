# Whisky Timeline — Spiritual Journey

## Context
Build a Vue 3 read-only visualisation over the whisky collection API at `https://www.jasonbstanding.com/wp-json/jbs/v2/whisky`. The app surfaces 150+ records chronologically, shows each bottle's lifecycle journey (bought → opened → finished), provides distillery/bottler rankings, and filters by time window and specific distillery/bottler. Starting from a blank repo (no package.json).

The primary goal of the app is to be able to see a timeline of the whiskies that I've bought, opened, and finished.  It's interesting to know statistics about how many I've bought in a given period, how many I've opened, what the most frequent distilleries are that crop up in each list, what the most frequent bottlers are that crop up in each list, how my tastes change over time, and anything else that can be deduced from the data.  Perhaps days since last purchase/opening/finishing?

The code should be structured using SOLID principles, avoid use of a data store unless absolutely necessary, and only call the API once per session (the data is nonvolatile - possibly one update every few days).

Ask questions about data visualisations and what to do with the data (beyond the simpler timeline view).

All filtered views must be reachable via direct URL, and all filter/sort options must have a "clear" option.
---

## Tech Stack
- **Vue 3** + Composition API + TypeScript
- **Vite** (build tool)
- **Vanilla CSS** with CSS custom properties (design tokens) + `<style scoped>` per SFC
- **No Pinia** — singleton composables handle shared state

---

## API Data Shape
```typescript
{
  id: number
  title: string
  distillery: string       // empty string when absent (not null)
  bottler: string          // empty string when absent
  date_bought: string | null   // YYYY-MM-DD or null
  date_opened: string | null
  date_finished: string | null
  state: 'in' | 'open' | 'finished'
  image_sml: string
  image_lg: string
}
```

