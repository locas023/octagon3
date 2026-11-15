<script setup lang="ts">
const stats = useRequestStats()
</script>

<template>
  <section class="stats" aria-label="Сводка по заявкам">
    <DashboardStatCard
      v-for="stat in stats"
      :key="stat.key"
      :label="stat.label"
      :value="stat.value"
      :hint="stat.hint"
    />
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}

@media (min-width: 1024px) {
  .stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
}
</style>
