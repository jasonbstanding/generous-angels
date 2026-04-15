<template>
  <div class="journey" v-if="nodeCount > 0">

    <!-- Multi-node layout (2 or 3 dates present) -->
    <template v-if="nodeCount >= 2">
      <div class="journey__node" :class="{ 'journey__node--present': !!bottle.date_bought }">
        <div class="journey__dot"></div>
        <span class="journey__key">B</span>
        <span class="journey__date">{{ fmtDate(bottle.date_bought) }}</span>
      </div>

      <div
        class="journey__segment"
        :class="bottle.date_bought && bottle.date_opened ? 'journey__segment--solid' : 'journey__segment--dashed'"
      ></div>

      <div class="journey__node" :class="{ 'journey__node--present': !!bottle.date_opened }">
        <div class="journey__dot"></div>
        <span class="journey__key">O</span>
        <span class="journey__date">{{ fmtDate(bottle.date_opened) }}</span>
      </div>

      <div
        class="journey__segment"
        :class="bottle.date_opened && bottle.date_finished ? 'journey__segment--solid' : 'journey__segment--dashed'"
      ></div>

      <div class="journey__node" :class="{ 'journey__node--present': !!bottle.date_finished }">
        <div class="journey__dot"></div>
        <span class="journey__key">F</span>
        <span class="journey__date">{{ fmtDate(bottle.date_finished) }}</span>
      </div>
    </template>

    <!-- Single-node layout -->
    <template v-else>
      <div class="journey__node journey__node--present journey__node--solo">
        <div class="journey__dot"></div>
        <span class="journey__key">{{ singleKey }}</span>
        <span class="journey__date">{{ singleDate }}</span>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WhiskyWithAnchor } from '@/types/whisky'

const props = defineProps<{ bottle: WhiskyWithAnchor }>()

function fmtDate(date: string | null): string {
  if (!date) return ''
  const [y, m, d] = date.split('-')
  const dt = new Date(Number(y), Number(m) - 1, Number(d))
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const nodeCount = computed(
  () =>
    [props.bottle.date_bought, props.bottle.date_opened, props.bottle.date_finished].filter(
      Boolean,
    ).length,
)

const singleKey = computed(() => {
  if (props.bottle.date_bought) return 'B'
  if (props.bottle.date_opened) return 'O'
  return 'F'
})

const singleDate = computed(() => {
  if (props.bottle.date_bought) return fmtDate(props.bottle.date_bought)
  if (props.bottle.date_opened) return fmtDate(props.bottle.date_opened)
  return fmtDate(props.bottle.date_finished)
})
</script>

<style scoped>
.journey {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-top: var(--space-2);
  height: 36px;
  min-width: 0;
}

.journey__node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.journey__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border-hover);
  background: transparent;
  margin-top: 3px;
}

.journey__node--present .journey__dot {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.journey__key {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-text-subtle);
  line-height: 1;
}

.journey__node--present .journey__key {
  color: var(--color-text-muted);
}

.journey__date {
  font-size: 9px;
  color: var(--color-text-subtle);
  white-space: nowrap;
  line-height: 1;
}

.journey__node--present .journey__date {
  color: var(--color-text-muted);
}

.journey__segment {
  flex: 1;
  height: 1.5px;
  margin-top: 9px;
  min-width: 8px;
}

.journey__segment--solid {
  background: var(--color-accent);
  opacity: 0.5;
}

.journey__segment--dashed {
  background: repeating-linear-gradient(
    to right,
    var(--color-border-hover) 0,
    var(--color-border-hover) 3px,
    transparent 3px,
    transparent 6px
  );
}

.journey__node--solo {
  flex-direction: row;
  gap: var(--space-2);
  align-items: center;
}

.journey__node--solo .journey__dot {
  margin-top: 0;
}

.journey__node--solo .journey__key {
  font-size: 10px;
}

.journey__node--solo .journey__date {
  font-size: 10px;
}
</style>
