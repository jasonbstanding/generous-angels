<template>
  <div class="gantt-view">
    <div class="filters">
      <FilterYear />
      <FilterEventType />
    </div>

    <div v-if="sorted.length" class="gantt">
      <!-- Time axis -->
      <div class="axis">
        <div class="axis-label-area" />
        <div class="axis-ticks">
          <span class="axis-start">{{ startLabel }}</span>
          <span
            v-for="m in yearMarkers"
            :key="m.year"
            class="axis-year"
            :style="{ left: m.left + '%' }"
          >{{ m.year }}</span>
          <span class="axis-end">Today</span>
        </div>
      </div>

      <!-- Rows -->
      <GanttRow
        v-for="b in sorted"
        :key="b.id"
        :bottle="b"
        :to-percent="scale.toPercent"
        :today-percent="scale.todayPercent"
      />
    </div>

    <p v-else class="empty">No bottles match these filters.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWhiskyData } from '../composables/useWhiskyData'
import { useGanttScale } from '../composables/useGanttScale'
import FilterYear from '../components/FilterYear.vue'
import FilterEventType from '../components/FilterEventType.vue'
import GanttRow from '../components/GanttRow.vue'
import type { WhiskyBottle } from '../types'

const route = useRoute()
const { bottles } = useWhiskyData()
const scale = useGanttScale(bottles)

type EventType = 'bought' | 'opened' | 'finished'
const eventDateField: Record<EventType, keyof WhiskyBottle> = {
  bought: 'date_bought',
  opened: 'date_opened',
  finished: 'date_finished',
}

function hasAnyDate(b: WhiskyBottle): boolean {
  return !!(b.date_bought || b.date_opened || b.date_finished)
}

function sortKey(b: WhiskyBottle): string {
  return b.date_bought ?? b.date_opened ?? b.date_finished ?? ''
}

const sorted = computed(() => {
  const year = (route.query.year as string) ?? ''
  const event = (route.query.event as EventType | '') ?? ''

  return bottles.value
    .filter(b => {
      if (!hasAnyDate(b)) return false
      if (!year && !event) return true
      if (event) {
        const d = b[eventDateField[event]] as string | null
        if (!d) return false
        if (year && !d.startsWith(year)) return false
        return true
      }
      // year filter only — any date in that year
      return [b.date_bought, b.date_opened, b.date_finished].some(
        d => d && d.startsWith(year)
      )
    })
    .slice()
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
})

const startLabel = computed(() => {
  if (!bottles.value.length) return ''
  const min = scale.minTs.value
  return new Date(min).getFullYear().toString()
})

const { yearMarkers } = scale
</script>

<style scoped>
.gantt-view {
  display: flex;
  flex-direction: column;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: var(--nav-height);
  z-index: 10;
}

.gantt {
  overflow-x: auto;
}

.axis {
  display: flex;
  align-items: flex-end;
  height: 28px;
  border-bottom: 2px solid var(--color-border);
  background: var(--color-bg);
}

.axis-label-area {
  width: 200px;
  flex-shrink: 0;
}

.axis-ticks {
  flex: 1;
  position: relative;
  height: 100%;
}

.axis-start,
.axis-end {
  position: absolute;
  bottom: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.axis-start { left: 0; }
.axis-end   { right: 0; }

.axis-year {
  position: absolute;
  bottom: 4px;
  transform: translateX(-50%);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 600;
}

.empty {
  padding: var(--space-8) var(--space-6);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
