<template>
  <article class="card">
    <div class="card-img-wrap" @click="showModal = true">
      <img
        v-if="bottle.image_sml"
        :src="bottle.image_sml"
        :alt="bottle.title"
        class="card-img"
        loading="lazy"
      />
      <div v-else class="card-img-placeholder" />
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ bottle.title }}</h3>
      <div class="card-meta">
        <span v-if="bottle.distillery" class="tag">{{ bottle.distillery }}</span>
        <span v-if="bottle.bottler" class="tag tag-bottler">{{ bottle.bottler }}</span>
        <span class="tag" :class="`state-${bottle.state}`">{{ bottle.state }}</span>
      </div>
      <div class="card-dates">
        <span v-if="bottle.date_bought" class="lozenge">
          <span class="lozenge-label">Bought</span> {{ fmt(bottle.date_bought) }}
        </span>
        <span v-if="bottle.date_opened" class="lozenge">
          <span class="lozenge-label">Opened</span> {{ fmt(bottle.date_opened) }}
        </span>
        <span v-if="bottle.date_finished" class="lozenge">
          <span class="lozenge-label">Finished</span> {{ fmt(bottle.date_finished) }}
        </span>
      </div>
    </div>

    <ImageModal
      v-if="showModal"
      :src="bottle.image_lg"
      :alt="bottle.title"
      @close="showModal = false"
    />
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { WhiskyBottle } from '../types'
import ImageModal from './ImageModal.vue'

defineProps<{ bottle: WhiskyBottle }>()

const showModal = ref(false)

function fmt(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card-img-wrap {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  cursor: pointer;
  background: var(--color-surface-alt);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.15s;
}

.card-img-wrap:hover .card-img {
  opacity: 0.85;
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-surface-alt);
}

.card-body {
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.card-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  line-height: 1.3;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.tag {
  display: inline-block;
  padding: 1px var(--space-2);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.tag-bottler {
  font-style: italic;
}

.state-in {
  color: var(--color-state-in);
  border-color: var(--color-state-in);
}

.state-open {
  color: var(--color-state-open);
  border-color: var(--color-state-open);
}

.state-finished {
  color: var(--color-state-finished);
  border-color: var(--color-state-finished);
}

.card-dates {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.lozenge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px var(--space-2);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: var(--font-size-xs);
  color: var(--color-text);
}

.lozenge-label {
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 9px;
}
</style>
