<template>
  <div class="row">
    <div class="row-label" :title="bottle.title">
      <span class="label-name">{{ bottle.title }}</span>
      <span v-if="bottle.distillery" class="label-sub">{{ bottle.distillery }}</span>
    </div>
    <div class="row-bar-area">
      <!-- Bought-date dot at axis position -->
      <div
        v-if="dotLeft !== null"
        class="dot"
        :style="{ left: dotLeft + '%' }"
        :title="`Bought: ${bottle.date_bought}`"
      />
      <!-- Single open-phase bar: opened → finished (purple) or today (green) -->
      <div
        v-if="bar"
        class="bar"
        :class="bottle.date_finished ? 'bar-finished' : 'bar-open'"
        :style="{ left: bar.left + '%', width: bar.width + '%' }"
        :title="`${bottle.date_finished ? 'Finished' : 'Open'}: ${bottle.date_opened} → ${bottle.date_finished ?? 'today'}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WhiskyBottle } from '../types'

const props = defineProps<{
  bottle: WhiskyBottle
  toPercent: (d: string) => number
  todayPercent: () => number
}>()

const todayStr = new Date().toISOString().slice(0, 10)

const bar = computed(() => {
  const { date_opened, date_finished } = props.bottle
  if (!date_opened) return null
  const left = props.toPercent(date_opened)
  const right = props.toPercent(date_finished ?? todayStr)
  const width = right - left
  if (width < 0) return null
  return { left, width: Math.max(width, 0.1) }
})

const dotLeft = computed(() => {
  const { date_bought } = props.bottle
  if (!date_bought) return null
  return props.toPercent(date_bought)
})
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
  height: 36px;
  border-bottom: 1px solid var(--color-border);
}

.row:hover {
  background: var(--color-surface-alt);
}

.row-label {
  width: 200px;
  flex-shrink: 0;
  padding: 0 var(--space-3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.label-name {
  font-size: var(--font-size-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text);
}

.label-sub {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-bar-area {
  flex: 1;
  position: relative;
  height: 100%;
}

.bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 14px;
  border-radius: 2px;
}

.bar-open {
  background: var(--color-gantt-open);
  border: 1px solid var(--color-gantt-open-border);
}

.bar-finished {
  background: var(--color-gantt-finished);
  border: 1px solid var(--color-gantt-finished-border);
}

.dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-gantt-dot);
}
</style>
