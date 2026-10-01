<template>
  <div class="rankings-view">
    <div class="controls">
      <div class="control-group">
        <label class="control-label">Entity</label>
        <select :value="entity" @change="setEntity" aria-label="Entity dimension">
          <option value="distillery">Distillery</option>
          <option value="bottler">Bottler</option>
        </select>
        <button v-if="entity !== 'distillery'" class="clear-btn" @click="clearEntity">✕ Clear</button>
      </div>
      <div class="control-group">
        <label class="control-label">Metric</label>
        <select :value="metric" @change="setMetric" aria-label="Ranking metric">
          <option value="count">Count</option>
          <option value="throughput">Throughput</option>
          <option value="shelf-time">Shelf Time</option>
          <option value="recency">Recency</option>
        </select>
        <button v-if="metric !== 'count'" class="clear-btn" @click="clearMetric">✕ Clear</button>
      </div>
    </div>

    <div class="table-container">
      <RankingTable
        :rows="rows"
        :entity-label="entity === 'distillery' ? 'Distillery' : 'Bottler'"
        :metric-label="metricLabel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWhiskyData } from '../composables/useWhiskyData'
import RankingTable from '../components/RankingTable.vue'
import type { WhiskyBottle } from '../types'

const route = useRoute()
const router = useRouter()
const { bottles } = useWhiskyData()

type Entity = 'distillery' | 'bottler'
type Metric = 'count' | 'throughput' | 'shelf-time' | 'recency'

const entity = computed<Entity>(() => (route.query.entity as Entity) ?? 'distillery')
const metric = computed<Metric>(() => (route.query.metric as Metric) ?? 'count')

function setEntity(e: Event) {
  const val = (e.target as HTMLSelectElement).value as Entity
  const query = { ...route.query }
  if (val === 'distillery') delete query.entity
  else query.entity = val
  router.replace({ query })
}

function setMetric(e: Event) {
  const val = (e.target as HTMLSelectElement).value as Metric
  const query = { ...route.query }
  if (val === 'count') delete query.metric
  else query.metric = val
  router.replace({ query })
}

function clearEntity() {
  const query = { ...route.query }
  delete query.entity
  router.replace({ query })
}

function clearMetric() {
  const query = { ...route.query }
  delete query.metric
  router.replace({ query })
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000)
}

function groupBy(field: keyof WhiskyBottle): Map<string, WhiskyBottle[]> {
  const map = new Map<string, WhiskyBottle[]>()
  for (const b of bottles.value) {
    const key = b[field] as string
    if (!key) continue
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(b)
  }
  return map
}

const rows = computed(() => {
  const field = entity.value
  const groups = groupBy(field)

  if (metric.value === 'count') {
    return [...groups.entries()]
      .map(([name, bs]) => ({ name, value: String(bs.length) }))
      .sort((a, b) => Number(b.value) - Number(a.value))
  }

  if (metric.value === 'throughput') {
    const result: { name: string; value: string; avg: number }[] = []
    for (const [name, bs] of groups) {
      const qualified = bs.filter(b => b.date_opened && b.date_finished)
      if (!qualified.length) continue
      const avg = qualified.reduce((s, b) => s + daysBetween(b.date_opened!, b.date_finished!), 0) / qualified.length
      result.push({ name, avg, value: `${Math.round(avg)} days (n=${qualified.length})` })
    }
    return result.sort((a, b) => a.avg - b.avg).map(({ name, value }) => ({ name, value }))
  }

  if (metric.value === 'shelf-time') {
    const result: { name: string; value: string; avg: number }[] = []
    for (const [name, bs] of groups) {
      const qualified = bs.filter(b => b.date_bought && b.date_opened)
      if (!qualified.length) continue
      const avg = qualified.reduce((s, b) => s + daysBetween(b.date_bought!, b.date_opened!), 0) / qualified.length
      result.push({ name, avg, value: `${Math.round(avg)} days (n=${qualified.length})` })
    }
    return result.sort((a, b) => b.avg - a.avg).map(({ name, value }) => ({ name, value }))
  }

  // recency
  const result: { name: string; value: string; latest: string }[] = []
  for (const [name, bs] of groups) {
    const dates = bs.map(b => b.date_bought).filter(Boolean) as string[]
    if (!dates.length) continue
    const latest = dates.sort().at(-1)!
    result.push({
      name,
      latest,
      value: new Date(latest).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    })
  }
  return result.sort((a, b) => b.latest.localeCompare(a.latest)).map(({ name, value }) => ({ name, value }))
})

const metricLabel = computed(() => ({
  count: 'Bottles',
  throughput: 'Avg days to finish',
  'shelf-time': 'Avg days on shelf',
  recency: 'Last acquired',
}[metric.value]))
</script>

<style scoped>
.rankings-view {
  display: flex;
  flex-direction: column;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.control-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.control-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.clear-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  padding: 2px var(--space-2);
  cursor: pointer;
}

.clear-btn:hover {
  border-color: var(--color-text-muted);
  color: var(--color-text);
}

.table-container {
  padding: var(--space-4) var(--space-6);
}
</style>
