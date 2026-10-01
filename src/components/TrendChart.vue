<template>
  <div class="trend-wrapper">
    <h2 class="trend-title">Purchases over time</h2>
    <div
      v-if="months.length"
      class="chart"
      role="img"
      :aria-label="`Monthly purchase counts from ${months[0].label} to ${months[months.length - 1].label}`"
    >
      <div
        v-for="m in months"
        :key="m.key"
        class="bar-col"
        :title="`${m.label}: ${m.count} bottle${m.count !== 1 ? 's' : ''}`"
      >
        <div class="bar" :style="{ '--h': `${m.pct}%` }" />
        <div v-if="m.isJan" class="year-label">{{ m.year }}</div>
      </div>
    </div>
    <p v-else class="no-data">No purchase dates recorded yet.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWhiskyData } from '../composables/useWhiskyData'

const { bottles } = useWhiskyData()

interface MonthBar {
  key: string
  label: string
  year: number
  isJan: boolean
  count: number
  pct: number
}

const months = computed((): MonthBar[] => {
  const withDates = bottles.value.filter(b => b.date_bought)
  if (!withDates.length) return []

  const counts = new Map<string, number>()
  for (const b of withDates) {
    const key = b.date_bought!.slice(0, 7) // YYYY-MM
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const sorted = [...counts.keys()].sort()
  const [minKey] = sorted
  const todayKey = new Date().toISOString().slice(0, 7)

  const result: MonthBar[] = []
  let cursor = minKey
  while (cursor <= todayKey) {
    const [y, m] = cursor.split('-').map(Number)
    const count = counts.get(cursor) ?? 0
    result.push({
      key: cursor,
      label: new Date(y, m - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      year: y,
      isJan: m === 1,
      count,
      pct: 0, // filled below
    })
    // advance month
    const next = new Date(y, m) // month is 0-indexed so this gives next month
    cursor = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`
  }

  const maxCount = Math.max(...result.map(r => r.count), 1)
  for (const r of result) r.pct = (r.count / maxCount) * 100

  return result
})
</script>

<style scoped>
.trend-wrapper {
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.trend-title {
  margin: 0 0 var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.chart {
  display: flex;
  align-items: flex-end;
  height: 72px;
  gap: 1px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  position: relative;
  min-width: 2px;
}

.bar {
  width: 100%;
  height: var(--h, 0%);
  min-height: 1px;
  background: var(--color-drinking);
  border-radius: 1px 1px 0 0;
  transition: opacity 0.1s;
}

.bar-col:hover .bar {
  opacity: 0.7;
}

.year-label {
  position: absolute;
  bottom: -16px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  pointer-events: none;
}

.no-data {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
