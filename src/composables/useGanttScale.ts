import { computed, type Ref } from 'vue'
import type { WhiskyBottle } from '../types'

export function useGanttScale(bottles: Ref<WhiskyBottle[]>) {
  const minTs = computed(() => {
    const dates = bottles.value.flatMap(b =>
      [b.date_bought, b.date_opened, b.date_finished].filter(Boolean) as string[]
    )
    if (!dates.length) return Date.now()
    return Math.min(...dates.map(d => new Date(d).getTime()))
  })

  const maxTs = computed(() => {
    // Always include today so ongoing bars extend to now
    const today = Date.now()
    const dates = bottles.value.flatMap(b =>
      [b.date_bought, b.date_opened, b.date_finished].filter(Boolean) as string[]
    )
    const maxFromData = dates.length
      ? Math.max(...dates.map(d => new Date(d).getTime()))
      : today
    return Math.max(maxFromData, today)
  })

  const totalSpan = computed(() => maxTs.value - minTs.value || 1)

  function toPercent(dateStr: string): number {
    const ts = new Date(dateStr).getTime()
    return Math.max(0, Math.min(100, ((ts - minTs.value) / totalSpan.value) * 100))
  }

  function todayPercent(): number {
    return toPercent(new Date().toISOString().slice(0, 10))
  }

  const yearMarkers = computed(() => {
    const markers: { year: number; left: number }[] = []
    const min = new Date(minTs.value)
    const max = new Date(maxTs.value)
    for (let y = min.getFullYear() + 1; y <= max.getFullYear(); y++) {
      const ts = new Date(`${y}-01-01`).getTime()
      if (ts > minTs.value && ts < maxTs.value) {
        markers.push({ year: y, left: ((ts - minTs.value) / totalSpan.value) * 100 })
      }
    }
    return markers
  })

  return { minTs, maxTs, totalSpan, toPercent, todayPercent, yearMarkers }
}
