<script setup lang="ts">
defineProps<{ label: string; value: number; hint: string }>()
</script>

<template>
  <article class="stat panel">
    <h3 class="stat__label">{{ label }}</h3>
    <p class="stat__value">{{ value }}</p>
    <p class="stat__hint">{{ hint }}</p>
  </article>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  transition: border-color var(--transition);
}

.stat:hover {
  border-color: var(--c-border-strong);
}

.stat__label {
  line-height:16px;
  font-size: var(--fs-xs);
  font-weight: 500;
  color: var(--c-text-muted);
}

.stat__value {
  font-size: var(--fs-2xl);
  font-weight: 700;
  line-height: 40px;
}

.stat__hint {
  line-height:16px;
  font-weight:500;
  font-size: var(--fs-xs);
  color: var(--c-text-faint);
}

@media (min-width: 768px) {
  .stat {
    padding: 24px;
  }
}
</style>
