<template>
  <select :value="modelValue" @change="onChange" aria-label="Filter by distillery">
    <option value="">All distilleries</option>
    <option v-for="d in distilleries" :key="d" :value="d">{{ d }}</option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWhiskyData } from '../composables/useWhiskyData'

const route = useRoute()
const router = useRouter()
const { bottles } = useWhiskyData()

const modelValue = computed(() => (route.query.distillery as string) ?? '')

const distilleries = computed(() => {
  const set = new Set<string>()
  for (const b of bottles.value) {
    if (b.distillery) set.add(b.distillery)
  }
  return [...set].sort()
})

function onChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  const query = { ...route.query }
  if (val) query.distillery = val
  else delete query.distillery
  router.replace({ query })
}
</script>
