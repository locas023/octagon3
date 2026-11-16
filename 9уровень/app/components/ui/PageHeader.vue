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
  font-size: 28px; line-height: 36px;
}

.page-header__subtitle {
  line-height:20px;
  margin-top: 24px;
  font-size: 14px;
  color: var(--c-text-muted);
}

@media (min-width: 768px) {
  .page-header__title {
    font-size: 28px;
  }
}
</style>
