<template>
  <div class="row">
    <div class="row-label" :title="bottle.title">
      <span class="label-name">{{ bottle.title }}</span>
      <span v-if="bottle.distillery" class="label-sub">{{ bottle.distillery }}</span>
    </div>
    <div class="row-bar-area">
      <!-- Shelf segment: bought → opened (or today if no opened date) -->
      <div
        v-if="shelfSegment"
        class="segment shelf"
        :style="{ left: shelfSegment.left + '%', width: shelfSegment.width + '%' }"
        :title="`On shelf: ${bottle.date_bought} → ${bottle.date_opened ?? 'today'}`"
      />
      <!-- Drinking segment: opened → finished (or today if ongoing) -->
      <div
        v-if="drinkingSegment"
        class="segment drinking"
        :class="{ ongoing: !bottle.date_finished }"
        :style="{ left: drinkingSegment.left + '%', width: drinkingSegment.width + '%' }"
        :title="`Drinking: ${bottle.date_opened} → ${bottle.date_finished ?? 'today'}`"
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

interface Segment { left: number; width: number }

const todayStr = new Date().toISOString().slice(0, 10)

const shelfSegment = computed((): Segment | null => {
  const { date_bought, date_opened } = props.bottle
  if (!date_bought) return null
  const left = props.toPercent(date_bought)
  const rightDate = date_opened ?? todayStr
  const right = props.toPercent(rightDate)
  const width = right - left
  if (width <= 0) return null
  return { left, width }
})

const drinkingSegment = computed((): Segment | null => {
  const { date_bought, date_opened, date_finished } = props.bottle
  // Need at least date_opened to show a drinking bar
  if (!date_opened) return null
  // If only date_opened (no date_bought means no shelf bar shown)
  const left = props.toPercent(date_opened)
  const rightDate = date_finished ?? todayStr
  const right = props.toPercent(rightDate)
  const width = right - left
  // Allow thin bars (min 0.1%)
  if (width < 0) return null
  return { left, width: Math.max(width, 0.1) }
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

.segment {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 14px;
  border-radius: 2px;
}

.shelf {
  background: var(--color-shelf);
  border: 1px solid var(--color-shelf-border);
}

.drinking {
  background: var(--color-drinking);
  border: 1px solid var(--color-drinking-border);
}

.ongoing {
  background: var(--color-ongoing);
  border-color: var(--color-drinking);
  /* Subtle right-edge pulse to signal it's still going */
  border-right: 3px solid var(--color-drinking-border);
}
</style>
