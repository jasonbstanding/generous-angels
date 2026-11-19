<template>
  <div class="event-btns" role="group" aria-label="Filter by event type">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="event-btn"
      :class="{ active: modelValue === opt.value }"
      @click="select(opt.value)"
    >{{ opt.label }}</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const options = [
  { value: '', label: 'All' },
  { value: 'bought', label: 'Bought' },
  { value: 'opened', label: 'Opened' },
  { value: 'finished', label: 'Finished' },
]

const modelValue = computed(() => (route.query.event as string) ?? '')

function select(val: string) {
  const query = { ...route.query }
  if (val) query.event = val
  else delete query.event
  router.replace({ query })
}
</script>

<style scoped>
.event-btns {
  display: flex;
}

.event-btn {
  padding: 4px var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: 500;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  margin-left: -1px;
  transition: background 0.1s, color 0.1s;
}

.event-btn:first-child {
  border-radius: var(--radius) 0 0 var(--radius);
  margin-left: 0;
}

.event-btn:last-child {
  border-radius: 0 var(--radius) var(--radius) 0;
}

.event-btn:hover:not(.active) {
  background: var(--color-surface-alt);
  color: var(--color-text);
  z-index: 1;
}

.event-btn.active {
  background: var(--color-nav-active);
  border-color: var(--color-nav-active);
  color: #fff;
  z-index: 1;
}
</style>
