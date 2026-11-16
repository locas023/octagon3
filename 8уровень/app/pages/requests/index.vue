<!--
  Все заявки (макеты 1.04, 1.07–1.09, 2.01–2.06).
  Данные — GET /api/requests; фильтры, поиск, сортировка и страница — в URL.
  Демо-сценарии API: ?simulate=slow | empty | 500 | 429
-->
<script setup lang="ts">
useHead({ title: 'Заявки' })
const actor=useCurrentUser()
const heading=computed(()=>actor.value.role==='client'?'Мои заявки':actor.value.role==='agent'?'Назначенные мне заявки':'Рабочий день под контролем')

const route = useRoute()
const router = useRouter()
const { filters, update, reset, hasActive } = useRequestFilters()
const { items, total, pageCount, rangeStart, rangeEnd, error, loading, refreshing, refresh } = useRequests()

const page = computed({
  get: () => filters.value.page,
  set: (value: number) => update({ page: value }),
})

const retrying = ref(false)

/** Повтор после временной ошибки. Демо-параметр simulate снимаем, чтобы повтор прошёл успешно. */
async function retry() {
  retrying.value = true
  try {
    if (route.query.simulate) {
      const { simulate: _simulate, ...rest } = route.query
      await router.replace({ query: rest })
    } else {
      await refresh()
    }
  } finally {
    retrying.value = false
  }
}

</script>

<template>
  <div class="page container">
    <UiPageHeader :title="heading" subtitle="Заявки, которые требуют вашего внимания" />

    <DashboardStatsGrid />

    <section aria-labelledby="requests-title">
      <div class="requests__head">
        <h2 id="requests-title" class="requests__title">Заявки</h2>
        <UiButton v-if="actor.role!=='agent'" to="/new-request">
          <AppIcon name="plus" :size="16" />
          Создать заявку
        </UiButton>
      </div>

      <RequestFilters :filters="filters" :disabled="!!error" @change="update" />

      <RequestListSkeleton v-if="loading" />

      <UiErrorBlock v-else-if="error" :error="error" :retrying="retrying" @retry="retry" />

      <UiStateBlock
        v-else-if="total === 0 && hasActive"
        icon="search"
        title="Ничего не найдено"
        description="По заданным условиям заявок нет. Измените запрос или сбросьте фильтры."
      >
        <UiButton variant="secondary" @click="reset">Сбросить фильтры</UiButton>
      </UiStateBlock>

      <UiStateBlock
        v-else-if="total === 0"
        title="Заявок пока нет"
        description="Обращения появятся здесь после создания."
      />

      <template v-else>
        <p class="visually-hidden" role="status" aria-live="polite">Найдено заявок: {{ total }}</p>
        <RequestList :requests="items" caption="Все заявки" :busy="refreshing" />
        <div class="requests__footer">
          <p class="muted">Показано {{ rangeStart }}–{{ rangeEnd }} из {{ total }}</p>
          <UiPagination v-if="pageCount > 1" v-model="page" :page-count="pageCount" />
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.requests__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.requests__title {
  font-size: var(--fs-lg);
}

.requests__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  font-size: var(--fs-xs);
}

.scenarios {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px dashed var(--c-border);
  font-size: var(--fs-xs);
}

.scenarios__link {
  padding: 4px 10px;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  color: var(--c-text-muted);
}

.scenarios__link:hover {
  border-color: var(--c-border-strong);
  color: var(--c-text);
  text-decoration: none;
}

.scenarios__link.is-active {
  border-color: var(--c-focus);
  color: var(--c-text);
}
</style>
