<template>
  <select :value="modelValue" @change="onChange" aria-label="Filter by bottler">
    <option value="">All bottlers</option>
    <option v-for="b in bottlers" :key="b" :value="b">{{ b }}</option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWhiskyData } from '../composables/useWhiskyData'

const route = useRoute()
const router = useRouter()
const { bottles } = useWhiskyData()

const modelValue = computed(() => (route.query.bottler as string) ?? '')

const bottlers = computed(() => {
  const set = new Set<string>()
  for (const b of bottles.value) {
    if (b.bottler) set.add(b.bottler)
  }
  return [...set].sort()
})

function onChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  const query = { ...route.query }
  if (val) query.bottler = val
  else delete query.bottler
  router.replace({ query })
}
</script>
