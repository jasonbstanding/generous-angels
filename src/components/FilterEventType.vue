<template>
  <select :value="modelValue" @change="onChange" aria-label="Filter by event type">
    <option value="">All events</option>
    <option value="bought">Bought</option>
    <option value="opened">Opened</option>
    <option value="finished">Finished</option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const modelValue = computed(() => (route.query.event as string) ?? '')

function onChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  const query = { ...route.query }
  if (val) query.event = val
  else delete query.event
  router.replace({ query })
}
</script>
