import { ref, computed } from 'vue'
import type { ActiveFilters, FilterPeriod, WhiskyState } from '@/types/whisky'

// Module-level singleton — filter state is shared across the app
const filters = ref<ActiveFilters>({
  period: null,
  year: null,
  state: null,
  distillery: null,
  bottler: null,
})

export function useFilters() {
  const hasActiveFilter = computed(
    () =>
      filters.value.period !== null ||
      filters.value.year !== null ||
      filters.value.state !== null ||
      filters.value.distillery !== null ||
      filters.value.bottler !== null,
  )

  function setPeriod(period: FilterPeriod | null) {
    filters.value.period = period
    filters.value.year = null
  }

  function setYear(year: number | null) {
    filters.value.year = year
    filters.value.period = null
  }

  function setState(state: WhiskyState | null) {
    filters.value.state = state
  }

  function setDistillery(distillery: string | null) {
    filters.value.distillery = distillery
  }

  function setBottler(bottler: string | null) {
    filters.value.bottler = bottler
  }

  function resetFilters() {
    filters.value = {
      period: null,
      year: null,
      state: null,
      distillery: null,
      bottler: null,
    }
  }

  return {
    filters,
    hasActiveFilter,
    setPeriod,
    setYear,
    setState,
    setDistillery,
    setBottler,
    resetFilters,
  }
}
