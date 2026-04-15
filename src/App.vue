<template>
  <TopNav />
  <FilterBar v-if="activeView === 'timeline'" />

  <main class="app-main" :class="{ 'app-main--no-filter': activeView === 'rankings' }">
    <TimelineView
      v-if="activeView === 'timeline'"
      @open-lightbox="lightboxBottle = $event"
    />
    <RankingsView v-else />
  </main>

  <ImageLightbox
    :bottle="lightboxBottle"
    @close="lightboxBottle = null"
  />
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import TopNav from '@/components/layout/TopNav.vue'
import FilterBar from '@/components/layout/FilterBar.vue'
import TimelineView from '@/components/timeline/TimelineView.vue'
import RankingsView from '@/components/rankings/RankingsView.vue'
import ImageLightbox from '@/components/lightbox/ImageLightbox.vue'
import type { WhiskyWithAnchor } from '@/types/whisky'

const activeView = ref<'timeline' | 'rankings'>('timeline')
provide('activeView', activeView)

const lightboxBottle = ref<WhiskyWithAnchor | null>(null)
</script>

<style scoped>
.app-main {
  padding-top: calc(var(--nav-height) + var(--filter-height));
  min-height: 100dvh;
}

.app-main--no-filter {
  padding-top: var(--nav-height);
}
</style>
