<template>
  <div class="table-wrapper">
    <table class="table" v-if="rows.length">
      <thead>
        <tr>
          <th class="col-rank">#</th>
          <th class="col-name">{{ entityLabel }}</th>
          <th class="col-value">{{ metricLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, i) in rows" :key="row.name">
          <tr class="data-row" @click="toggle(row.name)">
            <td class="col-rank">{{ i + 1 }}</td>
            <td class="col-name">
              <span class="expand-icon">{{ expandedRow === row.name ? '▾' : '▸' }}</span>
              {{ row.name }}
            </td>
            <td class="col-value">{{ row.value }}</td>
          </tr>
          <tr v-if="expandedRow === row.name" class="expanded-row">
            <td colspan="3">
              <ul class="bottle-list">
                <li v-for="b in sortedBottles(row.bottles)" :key="b.id">{{ b.title }}</li>
              </ul>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <p v-else class="empty">No data for this metric.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { WhiskyBottle } from '../types'

defineProps<{
  rows: Array<{ name: string; value: string; bottles: WhiskyBottle[] }>
  entityLabel: string
  metricLabel: string
}>()

const expandedRow = ref<string | null>(null)

function toggle(name: string) {
  expandedRow.value = expandedRow.value === name ? null : name
}

function maxDate(b: WhiskyBottle): string {
  return [b.date_bought, b.date_opened, b.date_finished]
    .filter(Boolean)
    .sort()
    .at(-1) ?? ''
}

function sortedBottles(bottles: WhiskyBottle[]): WhiskyBottle[] {
  return [...bottles].sort((a, b) => maxDate(b).localeCompare(maxDate(a)))
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.table th {
  text-align: left;
  padding: var(--space-2) var(--space-3);
  border-bottom: 2px solid var(--color-border);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  font-weight: 600;
}

.table td {
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.data-row {
  cursor: pointer;
}

.data-row:hover td {
  background: var(--color-surface-alt);
}

.col-rank {
  width: 40px;
  color: var(--color-text-muted);
}

.col-name {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.expand-icon {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  width: 10px;
  flex-shrink: 0;
}

.col-value {
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
}

.expanded-row td {
  background: var(--color-surface-alt);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-2) var(--space-3) var(--space-3);
}

.bottle-list {
  margin: 0;
  padding: 0 0 0 var(--space-6);
  list-style: disc;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bottle-list li {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.empty {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  padding: var(--space-4) 0;
  margin: 0;
}
</style>
