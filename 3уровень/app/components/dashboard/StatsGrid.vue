<script setup lang="ts">
const { stats } = useRequestStats()
</script>

<template>
  <section class="stats" aria-label="Сводка по заявкам" :aria-busy="!stats || undefined">
    <template v-if="stats">
      <DashboardStatCard
        v-for="stat in stats"
        :key="stat.key"
        :label="stat.label"
        :value="stat.value"
        :hint="stat.hint"
      />
    </template>
    <div v-for="n in 4" v-else :key="n" class="stats__placeholder panel" aria-hidden="true" />
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}

.stats__placeholder {
  min-height: 112px;
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

@media (min-width: 1024px) {
  .stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
}
</style>
