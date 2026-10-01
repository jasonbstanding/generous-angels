<template>
  <div class="timeline">
    <!-- Trend chart — always unfiltered -->
    <TrendChart />

    <!-- Filters -->
    <div class="filters">
      <FilterYear />
      <FilterEventType />
      <FilterDistillery />
      <FilterBottler />
    </div>

    <!-- Results -->
    <section class="results">
      <p class="result-count">{{ filtered.length }} bottle{{ filtered.length !== 1 ? 's' : '' }}</p>
      <div v-if="filtered.length" class="card-list">
        <BottleCard v-for="b in filtered" :key="b.id" :bottle="b" />
      </div>
      <p v-else class="empty">No bottles match these filters.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWhiskyData } from '../composables/useWhiskyData'
import TrendChart from '../components/TrendChart.vue'
import FilterYear from '../components/FilterYear.vue'
import FilterEventType from '../components/FilterEventType.vue'
import FilterDistillery from '../components/FilterDistillery.vue'
import FilterBottler from '../components/FilterBottler.vue'
import BottleCard from '../components/BottleCard.vue'
import type { WhiskyBottle } from '../types'

const route = useRoute()
const { bottles } = useWhiskyData()

type EventType = 'bought' | 'opened' | 'finished'
const eventDateField: Record<EventType, keyof WhiskyBottle> = {
  bought: 'date_bought',
  opened: 'date_opened',
  finished: 'date_finished',
}

function getRelevantDate(b: WhiskyBottle, event: EventType | ''): string | null {
  if (event) return b[eventDateField[event]] as string | null
  return b.date_bought ?? b.date_opened ?? b.date_finished ?? null
}

const filtered = computed(() => {
  const year = (route.query.year as string) ?? ''
  const event = (route.query.event as EventType | '') ?? ''
  const distillery = (route.query.distillery as string) ?? ''
  const bottler = (route.query.bottler as string) ?? ''

  return bottles.value
    .filter(b => {
      const date = getRelevantDate(b, event)
      if (!date) return false
      if (year && !date.startsWith(year)) return false
      if (distillery && b.distillery !== distillery) return false
      if (bottler && b.bottler !== bottler) return false
      return true
    })
    .sort((a, b) => {
      const da = getRelevantDate(a, event) ?? ''
      const db = getRelevantDate(b, event) ?? ''
      return db.localeCompare(da) // descending
    })
})
</script>

<style scoped>
.timeline {
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
}

.results {
  padding: var(--space-4) var(--space-6);
}

.result-count {
  margin: 0 0 var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.empty {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
