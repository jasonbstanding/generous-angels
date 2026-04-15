<template>
  <div class="bar-chart" ref="containerRef">
    <h3 class="bar-chart__title">{{ title }}</h3>

    <div v-if="entries.length === 0" class="bar-chart__empty">
      No data available
    </div>

    <div v-else class="bar-chart__rows">
      <div
        v-for="(entry, i) in entries"
        :key="entry.label"
        class="bar-row"
        :style="{ '--index': i }"
      >
        <span class="bar-row__label" :title="entry.label">{{ entry.label }}</span>
        <div class="bar-row__track-wrap">
          <div class="bar-row__track" ref="trackRefs">
            <div
              class="bar-row__seg bar-row__seg--in"
              :style="{ width: `${pct(entry.breakdown.in, maxTotal)}%` }"
            ></div>
            <div
              class="bar-row__seg bar-row__seg--open"
              :style="{ width: `${pct(entry.breakdown.open, maxTotal)}%` }"
            ></div>
            <div
              class="bar-row__seg bar-row__seg--finished"
              :style="{ width: `${pct(entry.breakdown.finished, maxTotal)}%` }"
            ></div>
          </div>
        </div>
        <span class="bar-row__count">{{ entry.total }}</span>
      </div>
    </div>

    <!-- Legend -->
    <div class="bar-chart__legend">
      <span class="legend-item legend-item--finished">Finished</span>
      <span class="legend-item legend-item--open">Open</span>
      <span class="legend-item legend-item--in">In collection</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { BarEntry } from '@/types/whisky'
import gsap from 'gsap'

const props = defineProps<{
  title: string
  entries: BarEntry[]
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const trackRefs = ref<HTMLDivElement[]>([])
let animated = false

const maxTotal = computed(() =>
  props.entries.reduce((max, e) => Math.max(max, e.total), 0),
)

function pct(count: number, max: number): number {
  if (max === 0) return 0
  return (count / max) * 100
}

function animateBars() {
  if (!trackRefs.value.length || animated) return
  animated = true
  gsap.fromTo(
    trackRefs.value,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.55,
      ease: 'power3.out',
      stagger: 0.035,
    },
  )
}

onMounted(() => {
  if (props.entries.length > 0) animateBars()
})

watch(
  () => props.entries,
  () => {
    animated = false
    gsap.set(trackRefs.value, { scaleX: 0 })
    animateBars()
  },
)
</script>

<style scoped>
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.bar-chart__title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.bar-chart__empty {
  font-size: 12px;
  color: var(--color-text-subtle);
  padding: var(--space-4) 0;
}

.bar-chart__rows {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.bar-row {
  display: grid;
  grid-template-columns: 140px 1fr 28px;
  align-items: center;
  gap: var(--space-3);
}

.bar-row__label {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}

.bar-row__track-wrap {
  overflow: hidden;
  border-radius: var(--radius-xs);
}

.bar-row__track {
  display: flex;
  height: 6px;
  border-radius: var(--radius-xs);
  overflow: hidden;
  transform-origin: left center;
  background: var(--color-surface-2);
}

.bar-row__seg {
  height: 100%;
  transition: width var(--transition-base);
}

.bar-row__seg--in {
  background: var(--color-border-hover);
}

.bar-row__seg--open {
  background: var(--color-accent-dim);
}

.bar-row__seg--finished {
  background: var(--color-accent);
}

.bar-row__count {
  font-size: 11px;
  color: var(--color-text-subtle);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.bar-chart__legend {
  display: flex;
  gap: var(--space-4);
  padding-left: 152px;
}

.legend-item {
  font-size: 10px;
  color: var(--color-text-subtle);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.legend-item::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.legend-item--finished::before {
  background: var(--color-accent);
}

.legend-item--open::before {
  background: var(--color-accent-dim);
}

.legend-item--in::before {
  background: var(--color-border-hover);
}

@media (max-width: 640px) {
  .bar-row {
    grid-template-columns: 100px 1fr 24px;
    gap: var(--space-2);
  }

  .bar-chart__legend {
    padding-left: 108px;
  }
}
</style>
