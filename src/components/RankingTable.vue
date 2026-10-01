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
        <tr v-for="(row, i) in rows" :key="row.name">
          <td class="col-rank">{{ i + 1 }}</td>
          <td class="col-name">{{ row.name }}</td>
          <td class="col-value">{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">No data for this metric.</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  rows: Array<{ name: string; value: string }>
  entityLabel: string
  metricLabel: string
}>()
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

.table tr:hover td {
  background: var(--color-surface-alt);
}

.col-rank {
  width: 40px;
  color: var(--color-text-muted);
}

.col-value {
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
}

.empty {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  padding: var(--space-4) 0;
  margin: 0;
}
</style>
