import { ref, type Ref } from 'vue'
import type { WhiskyBottle } from '../types'

const API_URL = import.meta.env.DEV
  ? '/wp-json/jbs/v2/whisky'
  : 'https://www.jasonbstanding.com/wp-json/jbs/v2/whisky'

const bottles: Ref<WhiskyBottle[]> = ref([])
const loading = ref(false)
const error: Ref<string | null> = ref(null)
let fetched = false

export function useWhiskyData() {
  if (!fetched) {
    fetched = true
    loading.value = true
    fetch(API_URL)
      .then(r => {
        if (!r.ok) throw new Error(`API error ${r.status}`)
        return r.json()
      })
      .then((data: WhiskyBottle[]) => {
        bottles.value = data
        loading.value = false
      })
      .catch((e: Error) => {
        error.value = e.message
        loading.value = false
      })
  }
  return { bottles, loading, error }
}
