<template>
  <div class="undated">
    <button class="undated__toggle" @click="isOpen = !isOpen">
      <PhArchive :size="14" />
      <span>Undated — {{ bottles.length }} {{ bottles.length === 1 ? 'bottle' : 'bottles' }}</span>
      <PhCaretDown :size="12" class="undated__caret" :class="{ 'undated__caret--open': isOpen }" />
    </button>

    <div v-if="isOpen" class="undated__cards">
      <div class="undated__grid">
        <BottleCard
          v-for="bottle in bottles"
          :key="bottle.id"
          :bottle="bottle"
          @open-lightbox="emit('open-lightbox', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PhArchive, PhCaretDown } from '@phosphor-icons/vue'
import BottleCard from './BottleCard.vue'
import type { WhiskyWithAnchor } from '@/types/whisky'

defineProps<{ bottles: WhiskyWithAnchor[] }>()
const emit = defineEmits<{ 'open-lightbox': [bottle: WhiskyWithAnchor] }>()

const isOpen = ref(false)
</script>

<style scoped>
.undated {
  margin-top: var(--space-8);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
}

.undated__toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-subtle);
  transition: color var(--transition-fast);
  padding: var(--space-1) 0;
}

.undated__toggle:hover {
  color: var(--color-text-muted);
}

.undated__caret {
  margin-left: auto;
  transition: transform var(--transition-base);
}

.undated__caret--open {
  transform: rotate(180deg);
}

.undated__cards {
  margin-top: var(--space-4);
}

.undated__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-2);
}

@media (max-width: 640px) {
  .undated__grid {
    grid-template-columns: 1fr;
  }
}
</style>
