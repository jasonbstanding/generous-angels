<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="bottle"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="`Full image: ${bottle.title}`"
        @click.self="emit('close')"
      >
        <div class="lightbox__content">
          <button class="lightbox__close" @click="emit('close')" aria-label="Close">
            <PhX :size="18" />
          </button>
          <div class="lightbox__image-wrap">
            <img
              :src="bottle.image_lg"
              :alt="bottle.title"
              class="lightbox__image"
              loading="eager"
            />
          </div>
          <div class="lightbox__caption">
            <p class="lightbox__title">{{ bottle.title }}</p>
            <p v-if="secondaryLabel" class="lightbox__sub">{{ secondaryLabel }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { PhX } from '@phosphor-icons/vue'
import type { WhiskyWithAnchor } from '@/types/whisky'

const props = defineProps<{ bottle: WhiskyWithAnchor | null }>()
const emit = defineEmits<{ close: [] }>()

const secondaryLabel = computed(() => {
  if (!props.bottle) return null
  const { distillery, bottler } = props.bottle
  if (distillery && bottler) return `${distillery} / ${bottler}`
  if (distillery) return distillery
  if (bottler) return bottler
  return null
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.bottle) emit('close')
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(9, 9, 11, 0.93);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.lightbox__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  max-width: 520px;
  width: 100%;
}

.lightbox__close {
  position: absolute;
  top: -48px;
  right: -8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-hover);
  border-radius: 50%;
  color: var(--color-text-muted);
  background: var(--color-surface);
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.lightbox__close:hover {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.lightbox__image-wrap {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04) inset;
}

.lightbox__image {
  width: 100%;
  height: auto;
  display: block;
  max-height: 75dvh;
  object-fit: contain;
}

.lightbox__caption {
  text-align: center;
}

.lightbox__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.4;
}

.lightbox__sub {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

/* Transition */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-active .lightbox__content,
.lightbox-leave-active .lightbox__content {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.lightbox-enter-from .lightbox__content,
.lightbox-leave-to .lightbox__content {
  transform: scale(0.96);
  opacity: 0;
}
</style>
