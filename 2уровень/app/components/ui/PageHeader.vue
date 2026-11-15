<script setup lang="ts">
withDefaults(defineProps<{ title: string; subtitle?: string }>(), { subtitle: undefined })
</script>

<template>
  <header class="page-header">
    <div>
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header__title {
  font-size: var(--fs-xl);
}

.page-header__subtitle {
  margin-top: 8px;
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

@media (min-width: 768px) {
  .page-header__title {
    font-size: var(--fs-2xl);
  }
}
</style>
