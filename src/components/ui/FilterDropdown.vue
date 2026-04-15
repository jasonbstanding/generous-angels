<template>
  <div class="fdd" ref="containerRef">
    <button
      ref="triggerRef"
      class="fdd__trigger"
      :class="{ 'fdd__trigger--active': modelValue !== null }"
      @click="toggle"
      :aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <span class="fdd__trigger-label">{{ modelValue ?? label }}</span>
      <PhCaretDown :size="12" class="fdd__caret" :class="{ 'fdd__caret--open': isOpen }" />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fdd__backdrop"
        @click="close"
      />
      <div
        v-if="isOpen"
        class="fdd__panel"
        :style="panelStyle"
        ref="panelRef"
        role="listbox"
      >
        <div class="fdd__search-wrap">
          <PhMagnifyingGlass :size="13" class="fdd__search-icon" />
          <input
            ref="searchInputRef"
            v-model="search"
            type="text"
            class="fdd__search"
            :placeholder="`Search ${label.toLowerCase()}…`"
            @keydown.escape="close"
          />
        </div>
        <div class="fdd__list">
          <button
            v-for="option in filteredOptions"
            :key="option"
            class="fdd__option"
            :class="{ 'fdd__option--selected': option === modelValue }"
            role="option"
            :aria-selected="option === modelValue"
            @click="select(option)"
          >
            <PhCheck v-if="option === modelValue" :size="12" class="fdd__check" />
            <span :class="{ 'fdd__option-text--offset': option !== modelValue }">{{ option }}</span>
          </button>
          <div v-if="filteredOptions.length === 0" class="fdd__no-results">
            No matches for "{{ search }}"
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { PhCaretDown, PhMagnifyingGlass, PhCheck } from '@phosphor-icons/vue'

const props = defineProps<{
  label: string
  options: string[]
  modelValue: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const isOpen = ref(false)
const search = ref('')
const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

const filteredOptions = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? props.options.filter((o) => o.toLowerCase().includes(q)) : props.options
})

function computePanelPosition() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const panelWidth = Math.max(rect.width, 220)
  const spaceBelow = window.innerHeight - rect.bottom
  const showAbove = spaceBelow < 300 && rect.top > 300

  panelStyle.value = {
    position: 'fixed',
    left: `${Math.min(rect.left, window.innerWidth - panelWidth - 8)}px`,
    width: `${panelWidth}px`,
    zIndex: '200',
    ...(showAbove
      ? { bottom: `${window.innerHeight - rect.top + 6}px` }
      : { top: `${rect.bottom + 6}px` }),
  }
}

async function toggle() {
  if (isOpen.value) {
    close()
    return
  }
  computePanelPosition()
  isOpen.value = true
  search.value = ''
  await nextTick()
  searchInputRef.value?.focus()
}

function close() {
  isOpen.value = false
}

function select(option: string) {
  emit('update:modelValue', option === props.modelValue ? null : option)
  close()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.fdd {
  position: relative;
  display: inline-flex;
}

.fdd__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 5px var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
}

.fdd__trigger:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text);
}

.fdd__trigger--active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-bg);
}

.fdd__caret {
  opacity: 0.6;
  transition: transform var(--transition-fast);
}

.fdd__caret--open {
  transform: rotate(180deg);
}

/* Panel — teleported, so NOT scoped */
</style>

<style>
.fdd__backdrop {
  position: fixed;
  inset: 0;
  z-index: 199;
}

.fdd__panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  max-height: 320px;
  overflow: hidden;
}

.fdd__search-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.fdd__search-icon {
  color: var(--color-text-subtle);
  flex-shrink: 0;
}

.fdd__search {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--color-text);
}

.fdd__search::placeholder {
  color: var(--color-text-subtle);
}

.fdd__list {
  overflow-y: auto;
  padding: var(--space-1) 0;
}

.fdd__option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: 7px var(--space-3);
  font-size: 12px;
  font-family: var(--font-sans);
  color: var(--color-text-muted);
  text-align: left;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.fdd__option:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.fdd__option--selected {
  color: var(--color-accent);
}

.fdd__option--selected:hover {
  background: var(--color-accent-bg);
}

.fdd__check {
  color: var(--color-accent);
  flex-shrink: 0;
}

.fdd__option-text--offset {
  padding-left: 16px;
}

.fdd__no-results {
  padding: var(--space-4) var(--space-3);
  font-size: 12px;
  color: var(--color-text-subtle);
  text-align: center;
}
</style>
