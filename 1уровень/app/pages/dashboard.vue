<!-- Dashboard (макет 1.03) -->
<script setup lang="ts">
useHead({ title: 'Обзор' })

const { requests } = useRequestsStore()
const recent = computed(() => applyFilters(requests.value, DEFAULT_FILTERS).slice(0, 3))
</script>

<template>
  <div class="page container">
    <UiPageHeader title="Обзор" subtitle="Обзор работы поддержки" />

    <DashboardStatsGrid />

    <section aria-labelledby="recent-title">
      <div class="recent__head">
        <h2 id="recent-title" class="recent__title">Последние заявки</h2>
        <UiButton to="/requests" size="sm">Все заявки</UiButton>
      </div>
      <RequestList :requests="recent" caption="Последние заявки" />
    </section>
  </div>
</template>

<style scoped>
.recent__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.recent__title {
  font-size: var(--fs-lg);
}
</style>
