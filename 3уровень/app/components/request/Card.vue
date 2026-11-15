<script setup lang="ts">
import type { RequestListItemView } from '~/types'

defineProps<{ request: RequestListItemView }>()
</script>

<template>
  <article class="card panel">
    <div class="card__top">
      <span class="muted">{{ formatRequestNumber(request.id) }}</span>
      <RequestPriorityBadge :priority="request.priority" />
    </div>
    <h3 class="card__title">
      <NuxtLink
        :to="`/requests/${request.id}`"
        class="card__link"
        :class="{ 'is-untitled': request.untitled }"
      >
        {{ request.title }}
      </NuxtLink>
    </h3>
    <dl class="card__meta">
      <div>
        <dt>Клиент</dt>
        <dd :class="{ muted: !request.customer }">{{ request.customer ?? '—' }}</dd>
      </div>
      <div>
        <dt>Исполнитель</dt>
        <dd :class="{ muted: !request.assignee }">{{ request.assignee ?? 'Не назначен' }}</dd>
      </div>
    </dl>
    <RequestStatusBadge :status="request.status" />
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
  transition:
    background var(--transition),
    border-color var(--transition);
}

.card:hover,
.card:focus-within {
  border-color: var(--c-border-strong);
  background: var(--c-surface-2);
}

.card:has(.card__link:focus-visible) {
  outline: 2px solid var(--c-focus);
  outline-offset: 2px;
}

.card__top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: var(--fs-xs);
}

.card__title {
  max-width: 100%;
  font-size: var(--fs-md);
  font-weight: 600;
  overflow-wrap: anywhere;
}

.card__link {
  color: var(--c-text);
}

.card__link.is-untitled {
  font-style: italic;
  color: var(--c-text-muted);
}

.card__link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.card__link:hover {
  text-decoration: none;
}

.card__link:focus-visible {
  outline: none;
}

.card__meta {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  width: 100%;
  margin: 0;
  font-size: var(--fs-xs);
}

.card__meta dt {
  color: var(--c-text-faint);
}

.card__meta dd {
  margin: 2px 0 0;
  overflow-wrap: anywhere;
}
</style>
