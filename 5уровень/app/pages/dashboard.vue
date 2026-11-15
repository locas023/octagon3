<!-- Dashboard (макет 1.03). Последние заявки — GET /api/requests?pageSize=3 -->
<script setup lang="ts">
import type { ApiRequestListItem, Paginated } from '#shared/types/api'

useHead({ title: 'Обзор' })

const { lookups } = useReferenceData()
const { data, error, status, refresh } = useFetch<Paginated<ApiRequestListItem>>('/api/requests', {
  key: 'dashboard-recent',
  query: { pageSize: 3, sort: 'newest' },
  lazy: true,
})

const recent = computed(() => (data.value?.items ?? []).map((item) => toRequestListItemView(item, lookups.value)))
const uiError = computed(() => (error.value ? toUiError(error.value) : null))
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
      <RequestListSkeleton v-if="status === 'pending' && !data" :rows="3" />
      <UiErrorBlock v-else-if="uiError" :error="uiError" @retry="refresh()" />
      <RequestList v-else :requests="recent" caption="Последние заявки" />
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
