<script setup lang="ts">
import type { RequestPriority, SelectOption, SupportRequest } from '~/types'

const props = defineProps<{ request: SupportRequest }>()
const emit = defineEmits<{
  save: [payload: { assignee: string | null; priority: RequestPriority }]
}>()

const UNASSIGNED = ''

const assignee = ref<string>(props.request.assignee ?? UNASSIGNED)
const priority = ref<RequestPriority>(props.request.priority)

// Синхронизация, если заявка изменилась извне
watch(
  () => [props.request.assignee, props.request.priority] as const,
  ([nextAssignee, nextPriority]) => {
    assignee.value = nextAssignee ?? UNASSIGNED
    priority.value = nextPriority
  },
)

const assigneeOptions: SelectOption[] = [
  { value: UNASSIGNED, label: 'Не назначен' },
  ...MOCK_EXECUTORS.map((name) => ({ value: name, label: name })),
]
const priorityOptions = PRIORITY_OPTIONS.filter(
  (option): option is SelectOption<RequestPriority> => option.value !== 'all',
)

const isDirty = computed(
  () =>
    assignee.value !== (props.request.assignee ?? UNASSIGNED) ||
    priority.value !== props.request.priority,
)

const saved = ref(false)

function save() {
  emit('save', { assignee: assignee.value || null, priority: priority.value })
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}
</script>

<template>
  <section class="params panel" aria-labelledby="params-title">
    <h2 id="params-title" class="params__title">Параметры</h2>
    <dl class="params__list">
      <div>
        <dt>Клиент</dt>
        <dd>{{ request.client }}</dd>
      </div>
      <div>
        <dt>Категория</dt>
        <dd>{{ request.category }}</dd>
      </div>
    </dl>

    <form class="params__form" @submit.prevent="save">
      <UiSelect v-model="assignee" label="Исполнитель" :options="assigneeOptions" />
      <UiSelect v-model="priority" label="Приоритет" :options="priorityOptions" />
      <dl class="params__list">
        <div>
          <dt>Срок решения</dt>
          <dd class="params__due">
            <time :datetime="request.dueAt">{{ formatDateTime(request.dueAt) }}</time>
          </dd>
        </div>
      </dl>
      <UiButton type="submit" block :disabled="!isDirty">
        {{ request.assignee ? 'Сохранить изменения' : 'Назначить исполнителя' }}
      </UiButton>
      <p class="params__status" role="status" aria-live="polite">
        <template v-if="saved">Изменения сохранены</template>
      </p>
    </form>
  </section>
</template>

<style scoped>
.params {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.params__title {
  font-size: var(--fs-lg);
}

.params__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
}

.params__list dt {
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--c-text-muted);
}

.params__list dd {
  margin: 4px 0 0;
  font-size: var(--fs-sm);
}

.params__due {
  color: var(--c-cyan);
}

.params__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.params__status {
  min-height: 1em;
  font-size: var(--fs-xs);
  color: var(--c-success);
}
</style>
