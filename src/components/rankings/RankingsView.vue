<template>
  <div class="rankings-view">

    <div v-if="loading" class="rankings-view__loading">
      <div v-for="n in 3" :key="n" class="rankings-view__skeleton-row">
        <div class="rankings-view__skeleton-bar shimmer"></div>
      </div>
    </div>

    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="refresh"
    />

    <div v-else class="rankings-view__layout">
      <div class="rankings-view__bars">
        <BarChart title="Distilleries" :entries="distilleryBars" />
        <div class="rankings-view__separator"></div>
        <BarChart title="Bottlers & Producers" :entries="bottlerBars" />
      </div>
      <div class="rankings-view__heatmap">
        <ActivityHeatmap :cells="heatmapCells" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import BarChart from './BarChart.vue'
import ActivityHeatmap from './ActivityHeatmap.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { useWhiskyData } from '@/composables/useWhiskyData'
import { useFilters } from '@/composables/useFilters'
import { useRankings } from '@/composables/useRankings'

const { records, loading, error, refresh } = useWhiskyData()
const { filters } = useFilters()
const { distilleryBars, bottlerBars, heatmapCells } = useRankings(records, filters)
</script>

<style scoped>
.rankings-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4) var(--space-12);
}

.rankings-view__layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: var(--space-8);
  align-items: flex-start;
}

.rankings-view__bars {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.rankings-view__separator {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-8) 0;
}

.rankings-view__heatmap {
  /* Offset from top to create visual asymmetry */
  padding-top: var(--space-6);
}

/* Loading */
.rankings-view__loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-4);
}

.rankings-view__skeleton-row {
  height: 24px;
}

.rankings-view__skeleton-bar {
  height: 100%;
  border-radius: var(--radius-sm);
  width: 100%;
}

@media (max-width: 768px) {
  .rankings-view__layout {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }

  .rankings-view__heatmap {
    padding-top: 0;
  }
}
</style>
