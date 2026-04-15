import { computed, type Ref } from 'vue'
import type {
  WhiskyRecord,
  WhiskyWithAnchor,
  ActiveFilters,
  TimelineGroup,
} from '@/types/whisky'

function deriveAnchor(r: WhiskyRecord): WhiskyWithAnchor {
  if (r.date_bought) return { ...r, anchorDate: r.date_bought, anchorField: 'date_bought' }
  if (r.date_opened) return { ...r, anchorDate: r.date_opened, anchorField: 'date_opened' }
  if (r.date_finished) return { ...r, anchorDate: r.date_finished, anchorField: 'date_finished' }
  return { ...r, anchorDate: null, anchorField: null }
}

function isInDateRange(anchorDate: string, filters: ActiveFilters): boolean {
  const d = new Date(anchorDate)

  if (filters.period) {
    const now = new Date()
    const months = filters.period === '3M' ? 3 : filters.period === '6M' ? 6 : 12
    const cutoff = new Date(now)
    cutoff.setMonth(cutoff.getMonth() - months)
    return d >= cutoff
  }

  if (filters.year) {
    return d.getFullYear() === filters.year
  }

  return true
}

function matchesEntityFilters(r: WhiskyRecord, filters: ActiveFilters): boolean {
  if (filters.state && r.state !== filters.state) return false
  if (filters.distillery && r.distillery !== filters.distillery) return false
  if (filters.bottler && r.bottler !== filters.bottler) return false
  return true
}

function formatGroupLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  const d = new Date(Number(year), Number(month) - 1, 1)
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export function useTimeline(records: Ref<WhiskyRecord[]>, filters: Ref<ActiveFilters>) {
  const withAnchors = computed(() => records.value.map(deriveAnchor))

  const undated = computed(() =>
    withAnchors.value
      .filter((b) => b.anchorDate === null)
      .filter((b) => matchesEntityFilters(b, filters.value)),
  )

  const datedGroups = computed<TimelineGroup[]>(() => {
    const dated = withAnchors.value
      .filter((b) => b.anchorDate !== null)
      .filter((b) => isInDateRange(b.anchorDate!, filters.value))
      .filter((b) => matchesEntityFilters(b, filters.value))
      .sort((a, b) => {
        const cmp = b.anchorDate!.localeCompare(a.anchorDate!)
        return cmp !== 0 ? cmp : b.id - a.id
      })

    const groupMap = new Map<string, WhiskyWithAnchor[]>()
    for (const bottle of dated) {
      const ym = bottle.anchorDate!.slice(0, 7)
      if (!groupMap.has(ym)) groupMap.set(ym, [])
      groupMap.get(ym)!.push(bottle)
    }

    return [...groupMap.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([ym, bottles]) => ({
        yearMonth: ym,
        label: formatGroupLabel(ym),
        bottles,
      }))
  })

  const isEmpty = computed(
    () => datedGroups.value.length === 0 && undated.value.length === 0,
  )

  const totalVisible = computed(
    () =>
      datedGroups.value.reduce((sum, g) => sum + g.bottles.length, 0) +
      undated.value.length,
  )

  return { datedGroups, undated, isEmpty, totalVisible }
}
