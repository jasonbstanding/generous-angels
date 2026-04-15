<template>
  <div class="error-state">
    <PhWarning :size="32" weight="thin" class="error-state__icon" />
    <p class="error-state__heading">Could not load collection</p>
    <p class="error-state__message">{{ message }}</p>
    <button class="error-state__retry" @click="emit('retry')">Try again</button>
  </div>
</template>

<script setup lang="ts">
import { PhWarning } from '@phosphor-icons/vue'

defineProps<{ message: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-8);
  text-align: center;
}

.error-state__icon {
  color: #ef4444;
  margin-bottom: var(--space-2);
}

.error-state__heading {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.error-state__message {
  font-size: 13px;
  color: var(--color-text-subtle);
  max-width: 300px;
  font-family: monospace;
  background: var(--color-surface);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.error-state__retry {
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-muted);
  background: var(--color-surface);
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.error-state__retry:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text);
}
</style>
