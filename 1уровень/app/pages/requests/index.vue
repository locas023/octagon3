<!--
  Все заявки (макеты 1.04, 1.07–1.09).
  Mock-сценарии загрузки: /requests?mock=loading | empty | error
-->
<script setup lang="ts">
useHead({ title: 'Заявки' })

const {
  state,
  filters,
  page,
  pageCount,
  items,
  total,
  rangeStart,
  rangeEnd,
  isSourceEmpty,
  hasActiveFilters,
  load,
  resetFilters,
} = useRequestList({ pageSize: 12 })

const createOpen = ref(false)

async function onCreated(id: number) {
  await navigateTo(`/requests/${id}`)
}

const scenarios = [
  { value: undefined, label: 'Данные' },
  { value: 'loading', label: 'Загрузка' },
  { value: 'empty', label: 'Пусто' },
  { value: 'error', label: 'Ошибка' },
] as const

const route = useRoute()
</script>

<template>
  <div class="page container">
    <UiPageHeader title="Рабочий день под контролем" subtitle="Заявки, которые требуют вашего внимания" />

    <DashboardStatsGrid />

    <section aria-labelledby="requests-title">
      <div class="requests__head">
        <h2 id="requests-title" class="requests__title">Заявки</h2>
        <UiButton @click="createOpen = true">
          <AppIcon name="plus" :size="16" />
          Создать заявку
        </UiButton>
      </div>

      <RequestFilters v-model="filters" :disabled="state !== 'success'" />

      <!-- Состояния списка -->
      <RequestListSkeleton v-if="state === 'loading'" />

      <UiStateBlock
        v-else-if="state === 'error'"
        tone="danger"
        icon="alert-circle"
        title="Не удалось загрузить заявки"
        description="Сервис временно недоступен. Попробуйте ещё раз."
      >
        <UiButton @click="load">Повторить загрузку</UiButton>
      </UiStateBlock>

      <UiStateBlock
        v-else-if="isSourceEmpty"
        title="Заявок пока нет"
        description="Обращения появятся здесь после создания."
      >
        <UiButton @click="createOpen = true">Создать заявку</UiButton>
      </UiStateBlock>

      <UiStateBlock
        v-else-if="total === 0"
        icon="search"
        title="Ничего не найдено"
        description="Попробуйте изменить запрос или сбросить фильтры."
      >
        <UiButton v-if="hasActiveFilters" variant="secondary" @click="resetFilters">Сбросить фильтры</UiButton>
      </UiStateBlock>

      <template v-else>
        <p class="visually-hidden" role="status" aria-live="polite">Найдено заявок: {{ total }}</p>
        <RequestList :requests="items" caption="Все заявки" />
        <div class="requests__footer">
          <p class="muted">Показано {{ rangeStart }}–{{ rangeEnd }} из {{ total }}</p>
          <UiPagination v-if="pageCount > 1" v-model="page" :page-count="pageCount" />
        </div>
      </template>

      <!-- Переключатель mock-сценариев для демонстрации состояний -->
      <nav class="scenarios" aria-label="Демо-сценарии загрузки">
        <span class="muted">Демо-сценарий:</span>
        <NuxtLink
          v-for="item in scenarios"
          :key="item.label"
          :to="{ query: item.value ? { mock: item.value } : {} }"
          class="scenarios__link"
          :class="{ 'is-active': (route.query.mock ?? undefined) === item.value }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </section>

    <RequestCreateModal v-model:open="createOpen" @created="onCreated" />
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
