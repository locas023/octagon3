<!-- Параметры заявки. На уровне 2 — только просмотр; изменение появится на уровне 3. -->
<script setup lang="ts">
import type { RequestView } from '~/types'

defineProps<{ request: RequestView }>()
</script>

<template>
  <section class="params panel" aria-labelledby="params-title">
    <h2 id="params-title" class="params__title">Параметры</h2>
    <dl class="params__list">
      <div>
        <dt>Клиент</dt>
        <dd :class="{ muted: !request.customer }">{{ request.customer ?? 'Не указан' }}</dd>
      </div>
      <div>
        <dt>Категория</dt>
        <dd :class="{ muted: !request.category }">{{ request.category ?? 'Не указана' }}</dd>
      </div>
      <div>
        <dt>Исполнитель</dt>
        <dd :class="{ muted: !request.assignee }">{{ request.assignee ?? 'Не назначен' }}</dd>
      </div>
      <div>
        <dt>Приоритет</dt>
        <dd><RequestPriorityBadge :priority="request.priority" /></dd>
      </div>
      <div>
        <dt>Срок решения</dt>
        <dd class="params__due">
          <time v-if="request.dueAt" :datetime="request.dueAt">{{ formatDateTime(request.dueAt) }}</time>
          <span v-else class="muted">Не задан</span>
        </dd>
      </div>
    </dl>
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
  gap: 14px;
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
  overflow-wrap: anywhere;
}

.params__due {
  color: var(--c-cyan);
}
</style>
