<template>
  <article class="card">
    <img
      v-if="bottle.image_sml"
      :src="bottle.image_sml"
      :alt="bottle.title"
      class="card-img"
      loading="lazy"
    />
    <div class="card-body">
      <h3 class="card-title">{{ bottle.title }}</h3>
      <div class="card-meta">
        <span v-if="bottle.distillery" class="tag">{{ bottle.distillery }}</span>
        <span v-if="bottle.bottler" class="tag tag-bottler">{{ bottle.bottler }}</span>
        <span class="tag" :class="`state-${bottle.state}`">{{ bottle.state }}</span>
      </div>
      <div class="card-dates">
        <span v-if="bottle.date_bought">Bought {{ fmt(bottle.date_bought) }}</span>
        <span v-if="bottle.date_opened">Opened {{ fmt(bottle.date_opened) }}</span>
        <span v-if="bottle.date_finished">Finished {{ fmt(bottle.date_finished) }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { WhiskyBottle } from '../types'

defineProps<{ bottle: WhiskyBottle }>()

function fmt(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.card {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.card-img {
  width: 64px;
  height: 96px;
  object-fit: cover;
  border-radius: var(--radius);
  flex-shrink: 0;
  background: var(--color-surface-alt);
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-title {
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-md);
  font-weight: 600;
  line-height: 1.3;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
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
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
