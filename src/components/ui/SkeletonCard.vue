<template>
  <div class="skeleton-card">
    <div class="skeleton-card__image shimmer"></div>
    <div class="skeleton-card__content">
      <div class="skeleton-card__line skeleton-card__line--title shimmer"></div>
      <div class="skeleton-card__line skeleton-card__line--sub shimmer"></div>
      <div class="skeleton-card__line skeleton-card__line--bar shimmer"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.skeleton-card__image {
  width: 52px;
  height: 80px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.skeleton-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-1);
}

.skeleton-card__line {
  height: 12px;
  border-radius: var(--radius-xs);
}

.skeleton-card__line--title {
  width: 75%;
}

.skeleton-card__line--sub {
  width: 45%;
}

.skeleton-card__line--bar {
  width: 90%;
  margin-top: auto;
}
</style>
