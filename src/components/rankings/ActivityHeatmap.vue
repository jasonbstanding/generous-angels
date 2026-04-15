<template>
  <div class="heatmap">
    <h3 class="heatmap__title">Activity</h3>

    <div v-if="cells.length === 0" class="heatmap__empty">
      No activity data
    </div>

    <div v-else class="heatmap__grid">
      <!-- Header -->
      <div class="heatmap__cell heatmap__cell--header heatmap__cell--label"></div>
      <div class="heatmap__cell heatmap__cell--header">Bought</div>
      <div class="heatmap__cell heatmap__cell--header">Opened</div>
      <div class="heatmap__cell heatmap__cell--header">Finished</div>

      <!-- Data rows -->
      <template v-for="cell in cells" :key="cell.yearMonth">
        <div class="heatmap__cell heatmap__cell--label">{{ cell.label }}</div>
        <div
          class="heatmap__cell heatmap__cell--data"
          :style="cellStyle(cell.bought, maxBought)"
          :title="`${cell.label}: ${cell.bought} bought`"
        >
          <span v-if="cell.bought > 0" class="heatmap__count">{{ cell.bought }}</span>
        </div>
        <div
          class="heatmap__cell heatmap__cell--data"
          :style="cellStyle(cell.opened, maxOpened)"
          :title="`${cell.label}: ${cell.opened} opened`"
        >
          <span v-if="cell.opened > 0" class="heatmap__count">{{ cell.opened }}</span>
        </div>
        <div
          class="heatmap__cell heatmap__cell--data"
          :style="cellStyle(cell.finished, maxFinished)"
          :title="`${cell.label}: ${cell.finished} finished`"
        >
          <span v-if="cell.finished > 0" class="heatmap__count">{{ cell.finished }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HeatmapCell } from '@/types/whisky'

const props = defineProps<{ cells: HeatmapCell[] }>()

const maxBought = computed(() => Math.max(...props.cells.map((c) => c.bought), 1))
const maxOpened = computed(() => Math.max(...props.cells.map((c) => c.opened), 1))
const maxFinished = computed(() => Math.max(...props.cells.map((c) => c.finished), 1))

function cellStyle(count: number, max: number): Record<string, string> {
  if (count === 0) return { background: 'var(--color-surface-2)' }
  const opacity = Math.max(0.18, count / max)
  return { background: `rgba(245, 158, 11, ${opacity})` }
}
</script>

<style scoped>
.heatmap {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.heatmap__title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.heatmap__empty {
  font-size: 12px;
  color: var(--color-text-subtle);
  padding: var(--space-4) 0;
}

.heatmap__grid {
  display: grid;
  grid-template-columns: 52px repeat(3, 1fr);
  gap: 2px;
}

.heatmap__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  border-radius: var(--radius-xs);
  font-size: 10px;
}

.heatmap__cell--header {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  background: transparent;
  height: 20px;
}

.heatmap__cell--label {
  justify-content: flex-end;
  padding-right: var(--space-2);
  color: var(--color-text-subtle);
  font-size: 10px;
  background: transparent;
}

.heatmap__cell--data {
  transition: background var(--transition-fast);
}

.heatmap__count {
  color: rgba(255, 255, 255, 0.85);
  font-size: 9px;
  font-weight: 600;
}
</style>
