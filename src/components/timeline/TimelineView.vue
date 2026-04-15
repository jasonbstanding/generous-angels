<template>
  <div class="timeline-view">

    <!-- Loading state -->
    <div v-if="loading" class="timeline-view__loading">
      <div v-for="n in 6" :key="n" class="timeline-view__skeleton-row">
        <div class="timeline-view__skeleton-marker shimmer"></div>
        <div class="timeline-view__skeleton-cards">
          <SkeletonCard />
          <SkeletonCard v-if="n % 3 === 0" />
        </div>
      </div>
    </div>

    <!-- Error state -->
    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="refresh"
    />

    <!-- Empty state -->
    <EmptyState
      v-else-if="isEmpty && !loading"
      @reset="resetFilters"
    />

    <!-- Timeline content -->
    <template v-else>
      <div
        v-for="group in datedGroups"
        :key="group.yearMonth"
        class="timeline-group"
      >
        <div class="timeline-group__marker-col">
          <DateMarker
            :yearMonth="group.yearMonth"
            :isCurrentMonth="group.yearMonth === currentYearMonth"
          />
        </div>
        <div class="timeline-group__cards">
          <BottleCard
            v-for="bottle in group.bottles"
            :key="bottle.id"
            :bottle="bottle"
            @open-lightbox="emit('open-lightbox', $event)"
          />
        </div>
      </div>

      <UndatedSection
        v-if="undated.length > 0"
        :bottles="undated"
        @open-lightbox="emit('open-lightbox', $event)"
      />
    </template>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DateMarker from './DateMarker.vue'
import BottleCard from './BottleCard.vue'
import UndatedSection from './UndatedSection.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { useWhiskyData } from '@/composables/useWhiskyData'
import { useFilters } from '@/composables/useFilters'
import { useTimeline } from '@/composables/useTimeline'
import type { WhiskyWithAnchor } from '@/types/whisky'

const emit = defineEmits<{ 'open-lightbox': [bottle: WhiskyWithAnchor] }>()

const { records, loading, error, refresh } = useWhiskyData()
const { filters, resetFilters } = useFilters()
const { datedGroups, undated, isEmpty } = useTimeline(records, filters)

const currentYearMonth = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})
</script>

<style scoped>
.timeline-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4) var(--space-12);
}

/* Groups */
.timeline-group {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-bottom: var(--space-6);
}

.timeline-group__marker-col {
  width: 72px;
  flex-shrink: 0;
  position: sticky;
  top: calc(var(--nav-height) + var(--filter-height) + var(--space-4));
  align-self: flex-start;
}

.timeline-group__cards {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Loading skeletons */
.timeline-view__loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.timeline-view__skeleton-row {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.timeline-view__skeleton-marker {
  width: 72px;
  height: 40px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.timeline-view__skeleton-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

@media (max-width: 640px) {
  .timeline-group {
    flex-direction: column;
    gap: 0;
  }

  .timeline-group__marker-col {
    width: 100%;
    position: static;
  }

  .timeline-view__skeleton-row {
    flex-direction: column;
  }

  .timeline-view__skeleton-marker {
    width: 100%;
    height: 24px;
    margin-bottom: var(--space-2);
  }
}
</style>
