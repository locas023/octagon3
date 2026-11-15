<script setup lang="ts">
import type { RequestComment } from '~/types'

defineProps<{ comments: RequestComment[] }>()
const emit = defineEmits<{ submit: [text: string] }>()

const draft = ref('')
const sending = ref(false)
const canSend = computed(() => draft.value.trim().length > 0)

async function submit() {
  if (!canSend.value) return
  sending.value = true
  // Имитация сетевого запроса
  await new Promise((resolve) => setTimeout(resolve, 300))
  emit('submit', draft.value)
  draft.value = ''
  sending.value = false
}

// Ctrl/Cmd + Enter — отправить
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    submit()
  }
}
</script>

<template>
  <div class="comments">
    <ul v-if="comments.length" class="comments__list">
      <li v-for="comment in comments" :key="comment.id" class="comment">
        <UiAvatar :name="comment.author" />
        <div>
          <p class="comment__meta">
            <strong>{{ comment.author }}</strong>
            <span aria-hidden="true"> · </span>
            <time :datetime="comment.createdAt">{{ formatTime(comment.createdAt) }}</time>
          </p>
          <p class="comment__text">{{ comment.text }}</p>
        </div>
      </li>
    </ul>
    <p v-else class="comments__empty">Комментариев пока нет.</p>

    <form class="comments__form" @submit.prevent="submit">
      <UiInput
        v-model="draft"
        label="Ваш комментарий"
        placeholder="Напишите сообщение…"
        hint="Ctrl + Enter — отправить"
        multiline
        :rows="3"
        @keydown="onKeydown"
      />
      <UiButton type="submit" variant="secondary" :disabled="!canSend" :loading="sending">
        Отправить комментарий
      </UiButton>
    </form>
  </div>
</template>

<style scoped>
.comments__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.comment {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
}

.comment__meta {
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.comment__meta strong {
  font-weight: 600;
  color: var(--c-text);
}

.comment__text {
  margin-top: 2px;
  font-size: var(--fs-sm);
}

.comments__empty {
  margin-bottom: 16px;
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.comments__form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.comments__form > :first-child {
  width: 100%;
}
</style>
