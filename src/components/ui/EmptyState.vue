<template>
  <div class="empty-state">
    <PhFunnel :size="32" weight="thin" class="empty-state__icon" />
    <p class="empty-state__heading">No bottles match</p>
    <p class="empty-state__sub">{{ message }}</p>
    <button class="empty-state__reset" @click="emit('reset')">Reset filters</button>
  </div>
</template>

<script setup lang="ts">
import { PhFunnel } from '@phosphor-icons/vue'

withDefaults(defineProps<{ message?: string }>(), {
  message: 'Try adjusting your filter criteria.',
})

const emit = defineEmits<{ reset: [] }>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-8);
  color: var(--color-text-subtle);
  text-align: center;
}

.empty-state__icon {
  color: var(--color-border-hover);
  margin-bottom: var(--space-2);
}

.empty-state__heading {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.empty-state__sub {
  font-size: 13px;
  max-width: 280px;
}

.empty-state__reset {
  font-size: 13px;
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  margin-top: var(--space-2);
  transition: opacity var(--transition-fast);
}

.empty-state__reset:hover {
  opacity: 0.8;
}
</style>
