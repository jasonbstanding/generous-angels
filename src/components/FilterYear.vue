<template>
  <select :value="modelValue" @change="onChange" :aria-label="'Filter by year'">
    <option value="">All years</option>
    <option v-for="year in years" :key="year" :value="String(year)">{{ year }}</option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWhiskyData } from '../composables/useWhiskyData'

const route = useRoute()
const router = useRouter()
const { bottles } = useWhiskyData()

const modelValue = computed(() => (route.query.year as string) ?? '')

const years = computed(() => {
  const set = new Set<number>()
  for (const b of bottles.value) {
    for (const d of [b.date_bought, b.date_opened, b.date_finished]) {
      if (d) set.add(new Date(d).getFullYear())
    }
  }
  return [...set].sort((a, b) => b - a)
})

function onChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  const query = { ...route.query }
  if (val) query.year = val
  else delete query.year
  router.replace({ query })
}
</script>
