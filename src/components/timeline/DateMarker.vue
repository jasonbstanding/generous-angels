<template>
  <div class="date-marker" :class="{ 'date-marker--current': isCurrentMonth }">
    <span class="date-marker__month">{{ monthAbbr }}</span>
    <span class="date-marker__year">{{ year }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  yearMonth: string  // 'YYYY-MM'
  isCurrentMonth?: boolean
}>()

const parts = computed(() => {
  const [y, m] = props.yearMonth.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return {
    month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    year: y,
  }
})

const monthAbbr = computed(() => parts.value.month)
const year = computed(() => parts.value.year)
</script>

<style scoped>
.date-marker {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: var(--space-3);
  padding-right: var(--space-3);
}

.date-marker__month {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--color-text-subtle);
  line-height: 1;
}

.date-marker__year {
  font-size: 10px;
  font-weight: 400;
  color: var(--color-text-subtle);
  opacity: 0.6;
  margin-top: 2px;
}

.date-marker--current .date-marker__month {
  color: var(--color-accent);
}

.date-marker--current .date-marker__year {
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .date-marker {
    flex-direction: row;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) 0 var(--space-1);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-2);
  }

  .date-marker__month {
    font-size: 10px;
  }

  .date-marker__year {
    margin-top: 0;
    opacity: 1;
  }
}
</style>
