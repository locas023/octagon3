<!-- Dashboard (макет 1.03). Последние заявки — GET /api/requests?pageSize=3 -->
<script setup lang="ts">
import type { ApiRequestListItem, Paginated } from '#shared/types/api'

useHead({ title: 'Обзор' })
const actor=useCurrentUser()
const subtitle=computed(()=>actor.value.role==='client'?'Обзор ваших обращений':actor.value.role==='agent'?'Обзор назначенной работы':actor.value.role==='admin'?'Обзор сервиса':'Обзор работы поддержки')

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
    <UiPageHeader title="Обзор" :subtitle="subtitle" />

    <DashboardStatsGrid v-if="actor.role==='operator'" />
    <RequestArchiveTabs v-if="actor.role==='admin'"/>

    <section aria-labelledby="recent-title">
      <div v-if="actor.role==='operator' || actor.role==='admin'" class="recent__head">
        <h2 id="recent-title" class="recent__title">Последние заявки</h2>
      </div>
      <UiButton v-if="actor.role==='operator' || actor.role==='client'" to="/requests" class="recent__all">Все заявки</UiButton>
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
  margin-bottom: 24px;
}

.recent__title {
  font-weight:600;
  font-size: 20px;
  line-height:28px;
}
.recent__all{margin-bottom:24px}
</style>
