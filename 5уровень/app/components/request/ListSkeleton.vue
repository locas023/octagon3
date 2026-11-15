<script setup lang="ts">
withDefaults(defineProps<{ rows?: number }>(), { rows: 6 })
</script>

<template>
  <section class="skeleton panel" role="status" aria-live="polite" aria-busy="true">
    <p class="skeleton__label">Загружаем заявки…</p>
    <div v-for="row in rows" :key="row" class="skeleton__row" aria-hidden="true">
      <span class="skeleton__bar skeleton__bar--xs" />
      <span class="skeleton__bar skeleton__bar--lg" />
      <span class="skeleton__bar skeleton__bar--sm" />
    </div>
  </section>
</template>

<style scoped>
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 16px;
}

.skeleton__label {
  margin-bottom: 4px;
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  text-align: center;
}

.skeleton__row {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 40px;
  padding: 0 14px;
  border-radius: var(--radius);
  background: var(--c-surface-3);
  animation: pulse 1.4s ease-in-out infinite;
}

.skeleton__bar {
  height: 8px;
  border-radius: 4px;
  background: rgba(166, 162, 207, 0.25);
}

.skeleton__bar--xs {
  width: 32px;
}

.skeleton__bar--lg {
  width: 40%;
}

.skeleton__bar--sm {
  width: 15%;
  margin-left: auto;
}

@keyframes pulse {
  50% {
    opacity: 0.55;
  }
}
</style>
