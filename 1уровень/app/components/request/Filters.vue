<script setup lang="ts">
import type { RequestFilters } from '~/types'

const filters = defineModel<RequestFilters>({ required: true })

withDefaults(defineProps<{ disabled?: boolean; extended?: boolean }>(), {
  disabled: false,
  extended: true,
})

const search = ref<{ focus: () => void } | null>(null)

// «/» — быстрый переход к поиску, как в большинстве рабочих интерфейсов
function onGlobalKeydown(event: KeyboardEvent) {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return
  const target = event.target as HTMLElement | null
  if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return
  event.preventDefault()
  search.value?.focus()
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && filters.value.search) {
    event.preventDefault()
    filters.value.search = ''
  }
}

onMounted(() => document.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <form class="filters" :class="{ 'filters--extended': extended }" role="search" @submit.prevent>
    <UiInput
      ref="search"
      v-model="filters.search"
      class="filters__search"
      label="Поиск"
      type="search"
      placeholder="Номер или название заявки"
      hint="Нажмите «/», чтобы перейти к поиску, Esc — очистить"
      :disabled="disabled"
      @keydown="onSearchKeydown"
    />
    <UiSelect v-model="filters.status" label="Статус" :options="STATUS_OPTIONS" :disabled="disabled" />
    <UiSelect v-model="filters.priority" label="Приоритет" :options="PRIORITY_OPTIONS" :disabled="disabled" />
    <template v-if="extended">
      <UiSelect v-model="filters.assignment" label="Назначение" :options="ASSIGNMENT_OPTIONS" :disabled="disabled" />
      <UiSelect v-model="filters.sort" label="Сортировка" :options="SORT_OPTIONS" :disabled="disabled" />
    </template>
  </form>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

/* Подсказка о горячих клавишах доступна скринридерам, но визуально скрыта */
.filters__search :deep(.field__hint) {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (min-width: 768px) {
  .filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .filters__search {
    grid-column: 1 / -1;
  }

  .filters:not(.filters--extended) {
    grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr));
  }

  .filters:not(.filters--extended) .filters__search {
    grid-column: auto;
  }
}

@media (min-width: 1024px) {
  .filters--extended {
    grid-template-columns: minmax(0, 1.6fr) repeat(4, minmax(0, 1fr));
  }

  .filters--extended .filters__search {
    grid-column: auto;
  }
}
</style>
