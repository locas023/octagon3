<script setup lang="ts">
import type { NewRequestPayload, RequestPriority, SelectOption } from '~/types'

const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ created: [id: number] }>()

const { create } = useRequestsStore()

const clientOptions: SelectOption[] = MOCK_CLIENTS.map((value) => ({ value, label: value }))
const categoryOptions: SelectOption[] = MOCK_CATEGORIES.map((value) => ({ value, label: value }))
const priorityOptions = PRIORITY_OPTIONS.filter(
  (option): option is SelectOption<RequestPriority> => option.value !== 'all',
)

function emptyForm(): NewRequestPayload {
  return {
    title: '',
    client: MOCK_CLIENTS[0] ?? '',
    category: MOCK_CATEGORIES[0] ?? '',
    priority: 'normal',
    description: '',
  }
}

const form = reactive<NewRequestPayload>(emptyForm())
const touched = ref(false)

const titleError = computed(() => {
  if (!touched.value) return undefined
  if (!form.title.trim()) return 'Укажите тему заявки'
  if (form.title.trim().length < 5) return 'Тема должна быть не короче 5 символов'
  return undefined
})

watch(open, (value) => {
  if (value) {
    Object.assign(form, emptyForm())
    touched.value = false
  }
})

function submit() {
  touched.value = true
  if (titleError.value) return
  const request = create({ ...form, title: form.title.trim(), description: form.description.trim() })
  open.value = false
  emit('created', request.id)
}
</script>

<template>
  <UiModal v-model:open="open" title="Новая заявка" description="Заявка появится в списке со статусом «Новая».">
    <form id="create-request-form" class="create-form" novalidate @submit.prevent="submit">
      <UiInput
        v-model="form.title"
        label="Тема"
        placeholder="Например, не работает доступ к CRM"
        :error="titleError"
        required
        data-autofocus
      />
      <div class="create-form__row">
        <UiSelect v-model="form.client" label="Клиент" :options="clientOptions" />
        <UiSelect v-model="form.priority" label="Приоритет" :options="priorityOptions" />
      </div>
      <UiSelect v-model="form.category" label="Категория" :options="categoryOptions" />
      <UiInput
        v-model="form.description"
        label="Описание"
        placeholder="Что случилось и как это воспроизвести"
        multiline
        :rows="4"
      />
    </form>

    <template #footer="{ close }">
      <UiButton variant="secondary" @click="close">Отмена</UiButton>
      <UiButton type="submit" form="create-request-form">Создать заявку</UiButton>
    </template>
  </UiModal>
</template>

<style scoped>
.create-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.create-form__row {
  display: grid;
  gap: 16px;
}

@media (min-width: 480px) {
  .create-form__row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
