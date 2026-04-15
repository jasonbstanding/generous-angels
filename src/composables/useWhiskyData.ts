import { ref, computed } from 'vue'
import type { WhiskyRecord } from '@/types/whisky'

const API_URL = 'https://www.jasonbstanding.com/wp-json/jbs/v2/whisky'

// Module-level singleton — only one fetch regardless of how many components call this
const records = ref<WhiskyRecord[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let fetched = false

export function useWhiskyData() {
  const distilleryList = computed<string[]>(() => {
    const seen = new Set<string>()
    for (const r of records.value) {
      if (r.distillery) seen.add(r.distillery)
    }
    return [...seen].sort((a, b) => a.localeCompare(b))
  })

  const bottlerList = computed<string[]>(() => {
    const seen = new Set<string>()
    for (const r of records.value) {
      if (r.bottler) seen.add(r.bottler)
    }
    return [...seen].sort((a, b) => a.localeCompare(b))
  })

  const availableYears = computed<number[]>(() => {
    const seen = new Set<number>()
    for (const r of records.value) {
      for (const d of [r.date_bought, r.date_opened, r.date_finished]) {
        if (d) seen.add(Number(d.slice(0, 4)))
      }
    }
    return [...seen].sort((a, b) => b - a)
  })

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      records.value = await res.json()
      fetched = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load collection data'
    } finally {
      loading.value = false
    }
  }

  if (!fetched && !loading.value) {
    refresh()
  }

  return { records, loading, error, distilleryList, bottlerList, availableYears, refresh }
}
