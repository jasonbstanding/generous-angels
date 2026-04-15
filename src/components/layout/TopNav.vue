<template>
  <header class="nav">
    <div class="nav__inner">
      <span class="nav__wordmark">Spiritual Journey</span>
      <nav class="nav__tabs" role="tablist">
        <button
          role="tab"
          :aria-selected="activeView === 'timeline'"
          class="nav__tab"
          :class="{ 'nav__tab--active': activeView === 'timeline' }"
          @click="activeView = 'timeline'"
        >
          Timeline
        </button>
        <button
          role="tab"
          :aria-selected="activeView === 'rankings'"
          class="nav__tab"
          :class="{ 'nav__tab--active': activeView === 'rankings' }"
          @click="activeView = 'rankings'"
        >
          Rankings
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue'

const activeView = inject<Ref<'timeline' | 'rankings'>>('activeView')!
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: rgba(9, 9, 11, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
}

.nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav__wordmark {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.nav__tabs {
  display: flex;
  gap: var(--space-1);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 3px;
}

.nav__tab {
  padding: 5px var(--space-3);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.nav__tab:hover {
  color: var(--color-text);
}

.nav__tab--active {
  background: var(--color-surface-2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
</style>
