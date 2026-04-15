<template>
  <div class="filter-bar">
    <div class="filter-bar__strip">
      <!-- Period filters -->
      <div class="filter-bar__group">
        <button
          class="chip"
          :class="{ 'chip--active': filters.period === null && filters.year === null }"
          @click="resetDateFilter"
        >
          All time
        </button>
        <button
          v-for="p in periods"
          :key="p"
          class="chip"
          :class="{ 'chip--active': filters.period === p }"
          @click="setPeriod(p as FilterPeriod)"
        >
          {{ p }}
        </button>
      </div>

      <div class="filter-bar__divider" />

      <!-- Year filters (derived from data) -->
      <div class="filter-bar__group">
        <button
          v-for="year in availableYears"
          :key="year"
          class="chip"
          :class="{ 'chip--active': filters.year === year }"
          @click="setYear(filters.year === year ? null : year)"
        >
          {{ year }}
        </button>
      </div>

      <div class="filter-bar__divider" />

      <!-- State filters -->
      <div class="filter-bar__group">
        <button
          v-for="s in states"
          :key="s.value"
          class="chip"
          :class="[`chip--state-${s.value}`, { 'chip--active': filters.state === s.value }]"
          @click="setState(filters.state === s.value ? null : s.value)"
        >
          {{ s.label }}
        </button>
      </div>

      <div class="filter-bar__divider" />

      <!-- Distillery + Bottler dropdowns -->
      <div class="filter-bar__group">
        <FilterDropdown
          label="Distilleries"
          :options="distilleryList"
          :modelValue="filters.distillery"
          @update:modelValue="setDistillery"
        />
        <FilterDropdown
          label="Bottlers"
          :options="bottlerList"
          :modelValue="filters.bottler"
          @update:modelValue="setBottler"
        />
      </div>

      <!-- Reset -->
      <Transition name="fade">
        <div v-if="hasActiveFilter" class="filter-bar__group">
          <div class="filter-bar__divider" />
          <button class="chip chip--reset" @click="resetFilters">
            <PhX :size="11" />
            Reset
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
import FilterDropdown from '@/components/ui/FilterDropdown.vue'
import { useFilters } from '@/composables/useFilters'
import { useWhiskyData } from '@/composables/useWhiskyData'
import type { FilterPeriod, WhiskyState } from '@/types/whisky'

const { filters, hasActiveFilter, setPeriod, setYear, setState, setDistillery, setBottler, resetFilters } = useFilters()
const { distilleryList, bottlerList, availableYears } = useWhiskyData()

const periods: FilterPeriod[] = ['3M', '6M', '12M']

const states: { value: WhiskyState; label: string }[] = [
  { value: 'in', label: 'In collection' },
  { value: 'open', label: 'Open' },
  { value: 'finished', label: 'Finished' },
]

function resetDateFilter() {
  setPeriod(null)
  setYear(null)
}
</script>

<style scoped>
.filter-bar {
  position: sticky;
  top: var(--nav-height);
  z-index: 50;
  background: rgba(9, 9, 11, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  height: var(--filter-height);
}

.filter-bar__strip {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-bar__strip::-webkit-scrollbar {
  display: none;
}

.filter-bar__group {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-shrink: 0;
}

.filter-bar__divider {
  width: 1px;
  height: 18px;
  background: var(--color-border);
  flex-shrink: 0;
  margin: 0 var(--space-1);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
}

.chip:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text);
}

.chip--active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-bg);
}

.chip--state-open.chip--active {
  border-color: var(--color-accent-dim);
  color: var(--color-accent-dim);
  background: var(--color-accent-bg-dim);
}

.chip--state-in.chip--active {
  border-color: var(--color-border-hover);
  color: var(--color-text-muted);
  background: var(--color-surface-2);
}

.chip--reset {
  border-color: transparent;
  color: var(--color-text-subtle);
}

.chip--reset:hover {
  border-color: var(--color-border);
  color: var(--color-text-muted);
  background: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
