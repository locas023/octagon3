<script setup lang="ts">
import type { RequestFilters } from '~/types'

const props = withDefaults(
  defineProps<{ filters: RequestFilters; disabled?: boolean; debounce?: number }>(),
  { disabled: false, debounce: 350 },
)

const emit = defineEmits<{ change: [patch: Partial<RequestFilters>] }>()

/* Поиск: локальное значение поля + debounce, чтобы не дёргать API на каждый символ */
const search = ref(props.filters.q)
const debouncedSearch = useDebouncedRef(search, props.debounce)

watch(debouncedSearch, (value) => {
  if (value.trim() !== props.filters.q) emit('change', { q: value.trim() })
})

// Синхронизация, если URL поменялся извне (кнопка «назад», сброс фильтров)
watch(
  () => props.filters.q,
  (value) => {
    if (value !== search.value.trim()) search.value = value
  },
)

const status = computed({
  get: () => props.filters.status,
  set: (value) => emit('change', { status: value }),
})
const priority = computed({
  get: () => props.filters.priority,
  set: (value) => emit('change', { priority: value }),
})
const assignment = computed({
  get: () => props.filters.assignment,
  set: (value) => emit('change', { assignment: value }),
})
const sort = computed({
  get: () => props.filters.sort,
  set: (value) => emit('change', { sort: value }),
})

const searchField = ref<{ focus: () => void } | null>(null)

// «/» — быстрый переход к поиску
function onGlobalKeydown(event: KeyboardEvent) {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return
  const target = event.target as HTMLElement | null
  if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return
  event.preventDefault()
  searchField.value?.focus()
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && search.value) {
    event.preventDefault()
    search.value = ''
  }
}

onMounted(() => document.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <form class="filters" role="search" @submit.prevent="emit('change', { q: search.trim() })">
    <UiInput
      ref="searchField"
      v-model="search"
      class="filters__search"
      label="Поиск"
      type="search"
      placeholder="Номер или название заявки"
      hint="Нажмите «/», чтобы перейти к поиску, Esc — очистить"
      @keydown="onSearchKeydown"
    />
    <UiSelect v-model="status" label="Статус" :options="STATUS_OPTIONS" :disabled="disabled" />
    <UiSelect v-model="priority" label="Приоритет" :options="PRIORITY_OPTIONS" :disabled="disabled" />
    <UiSelect v-model="assignment" label="Назначение" :options="ASSIGNMENT_OPTIONS" :disabled="disabled" />
    <UiSelect v-model="sort" label="Сортировка" :options="SORT_OPTIONS" :disabled="disabled" />
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
}

@media (min-width: 1024px) {
  .filters {
    grid-template-columns: minmax(0, 1.6fr) repeat(4, minmax(0, 1fr));
  }

  .filters__search {
    grid-column: auto;
  }
}
</style>
