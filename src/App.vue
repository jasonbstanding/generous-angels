<template>
  <header class="nav">
    <span class="nav-brand">Jason B. Drammin'</span>
    <nav class="nav-links">
      <router-link to="/">Timeline</router-link>
      <router-link to="/gantt">Gantt</router-link>
      <router-link to="/rankings">Rankings</router-link>
    </nav>
    <a class="nav-attribution" href="https://jasonbstanding.com" target="_blank" rel="noopener">Powered by jasonbstanding.com</a>
  </header>

  <main class="main-content">
    <div v-if="loading" class="status-msg">Loading collection…</div>
    <div v-else-if="error" class="status-msg error">Failed to load: {{ error }}</div>
    <router-view v-else />
  </main>
</template>

<script setup lang="ts">
import { useWhiskyData } from './composables/useWhiskyData'

const { loading, error } = useWhiskyData()
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--nav-height);
  background: var(--color-nav-bg);
  color: var(--color-nav-text);
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding: 0 var(--space-6);
}

.nav-brand {
  font-size: var(--font-size-md);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-nav-text);
  opacity: 0.9;
}

.nav-links {
  display: flex;
  gap: var(--space-4);
}

.nav-links a {
  color: var(--color-nav-text);
  text-decoration: none;
  font-size: var(--font-size-sm);
  opacity: 0.7;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  transition: opacity 0.1s, color 0.1s;
}

.nav-links a:hover {
  opacity: 1;
}

.nav-links a.router-link-active {
  opacity: 1;
  color: var(--color-nav-active);
}

.nav-attribution {
  margin-left: auto;
  font-size: var(--font-size-xs);
  color: var(--color-nav-text);
  opacity: 0.45;
  text-decoration: none;
  white-space: nowrap;
}

.nav-attribution:hover {
  opacity: 0.75;
}

.main-content {
  min-height: calc(100vh - var(--nav-height));
}

.status-msg {
  padding: var(--space-8) var(--space-6);
  color: var(--color-text-muted);
  font-size: var(--font-size-md);
}

.status-msg.error {
  color: var(--color-error);
}
</style>
