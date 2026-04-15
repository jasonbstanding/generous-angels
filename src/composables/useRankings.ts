import { computed, type Ref } from 'vue'
import type { WhiskyRecord, WhiskyState, BarEntry, HeatmapCell, ActiveFilters } from '@/types/whisky'

function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  const d = new Date(Number(year), Number(month) - 1, 1)
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
}

export function useRankings(records: Ref<WhiskyRecord[]>, filters: Ref<ActiveFilters>) {
  // Rankings respect only the state filter — date/distillery/bottler filters don't apply
  const stateFiltered = computed(() =>
    records.value.filter((r) => !filters.value.state || r.state === filters.value.state),
  )

  function buildBars(field: 'distillery' | 'bottler', top: number): BarEntry[] {
    const map = new Map<string, Record<WhiskyState, number>>()

    for (const r of stateFiltered.value) {
      const key = r[field]
      if (!key) continue
      if (!map.has(key)) map.set(key, { in: 0, open: 0, finished: 0 })
      map.get(key)![r.state]++
    }

    return [...map.entries()]
      .map(([label, breakdown]) => ({
        label,
        total: breakdown.in + breakdown.open + breakdown.finished,
        breakdown,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, top)
  }

  const distilleryBars = computed(() => buildBars('distillery', 15))
  const bottlerBars = computed(() => buildBars('bottler', 15))

  // Heatmap always uses the full unfiltered dataset for accuracy
  const heatmapCells = computed<HeatmapCell[]>(() => {
    const map = new Map<string, { bought: number; opened: number; finished: number }>()

    const addEvent = (date: string | null, field: 'bought' | 'opened' | 'finished') => {
      if (!date) return
      const ym = date.slice(0, 7)
      if (!map.has(ym)) map.set(ym, { bought: 0, opened: 0, finished: 0 })
      map.get(ym)![field]++
    }

    for (const r of records.value) {
      addEvent(r.date_bought, 'bought')
      addEvent(r.date_opened, 'opened')
      addEvent(r.date_finished, 'finished')
    }

    return [...map.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([ym, counts]) => ({
        yearMonth: ym,
        label: formatMonthLabel(ym),
        ...counts,
      }))
  })

  return { distilleryBars, bottlerBars, heatmapCells }
}
