<script setup lang="ts">
import type { CommentView } from '~/types'

defineProps<{ comments: CommentView[] }>()
</script>

<template>
  <ul v-if="comments.length" class="comments">
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
</template>

<style scoped>
.comments {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
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
  overflow-wrap: anywhere;
}

.comments__empty {
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}
</style>
