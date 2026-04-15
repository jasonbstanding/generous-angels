<template>
  <div class="bottle-card" ref="cardRef">
    <button class="bottle-card__image-wrap" @click="emit('open-lightbox', bottle)" :aria-label="`View full image for ${bottle.title}`">
      <img
        :src="bottle.image_sml"
        :alt="bottle.title"
        class="bottle-card__image"
        loading="lazy"
        @load="imgLoaded = true"
        @error="imgError = true"
      />
      <div v-if="!imgLoaded && !imgError" class="bottle-card__image-skeleton shimmer"></div>
      <div v-if="imgError" class="bottle-card__image-fallback">
        <PhBeerBottle :size="20" weight="thin" />
      </div>
      <div class="bottle-card__image-hover">
        <PhMagnifyingGlassPlus :size="16" />
      </div>
    </button>

    <div class="bottle-card__content">
      <div class="bottle-card__meta">
        <span
          class="bottle-card__state"
          :class="`bottle-card__state--${bottle.state}`"
        >{{ stateLabel }}</span>
        <span v-if="secondaryLabel" class="bottle-card__producer">{{ secondaryLabel }}</span>
      </div>
      <h3 class="bottle-card__title" :title="bottle.title">{{ bottle.title }}</h3>
      <JourneyBar :bottle="bottle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { PhBeerBottle, PhMagnifyingGlassPlus } from '@phosphor-icons/vue'
import JourneyBar from './JourneyBar.vue'
import type { WhiskyWithAnchor } from '@/types/whisky'
import gsap from 'gsap'

const props = defineProps<{ bottle: WhiskyWithAnchor }>()
const emit = defineEmits<{ 'open-lightbox': [bottle: WhiskyWithAnchor] }>()

const cardRef = ref<HTMLDivElement | null>(null)
const imgLoaded = ref(false)
const imgError = ref(false)

const stateLabel = computed(() => {
  return { in: 'In collection', open: 'Open', finished: 'Finished' }[props.bottle.state]
})

const secondaryLabel = computed(() => {
  const { distillery, bottler } = props.bottle
  if (distillery && bottler) return `${distillery} / ${bottler}`
  if (distillery) return distillery
  if (bottler) return bottler
  return null
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  const el = cardRef.value
  if (!el) return

  // Start invisible for GSAP reveal
  gsap.set(el, { opacity: 0, y: 14 })

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' })
        observer?.disconnect()
        observer = null
      }
    },
    { threshold: 0.05 },
  )
  observer.observe(el)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.bottle-card {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition: border-color var(--transition-base);
}

.bottle-card:hover {
  border-color: var(--color-border-hover);
}

/* Image */
.bottle-card__image-wrap {
  position: relative;
  width: 52px;
  min-width: 52px;
  height: 88px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface-2);
  cursor: pointer;
  flex-shrink: 0;
}

.bottle-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bottle-card__image-skeleton {
  position: absolute;
  inset: 0;
}

.bottle-card__image-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-subtle);
}

.bottle-card__image-hover {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.bottle-card__image-wrap:hover .bottle-card__image-hover {
  opacity: 1;
}

/* Content */
.bottle-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.bottle-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.bottle-card__state {
  display: inline-block;
  padding: 1px 7px;
  border-radius: var(--radius-xs);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.bottle-card__state--in {
  color: var(--color-text-muted);
  background: var(--color-border);
}

.bottle-card__state--open {
  color: var(--color-accent-dim);
  background: var(--color-accent-bg-dim);
}

.bottle-card__state--finished {
  color: var(--color-accent);
  background: var(--color-accent-bg);
}

.bottle-card__producer {
  font-size: 11px;
  color: var(--color-text-subtle);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bottle-card__title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.35;
  color: var(--color-text);
  /* Allow 3 lines before truncating */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
