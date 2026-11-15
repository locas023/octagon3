<script setup lang="ts">
import type { RequestListItemView } from '~/types'

withDefaults(
  defineProps<{
    requests: RequestListItemView[]
    caption: string
    compact?: boolean
  }>(),
  { compact: false },
)
</script>

<template>
  <div class="table-wrap panel">
    <table class="table" :class="{ 'table--compact': compact }">
      <caption class="visually-hidden">{{ caption }}</caption>
      <thead>
        <tr>
          <th scope="col">Номер</th>
          <th scope="col">Заявка</th>
          <th scope="col" class="col-wide">Клиент</th>
          <th scope="col" class="col-wide">Исполнитель</th>
          <th scope="col">Статус</th>
          <th scope="col">Приоритет</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in requests" :key="request.id">
          <td class="muted nowrap">{{ formatRequestNumber(request.id) }}</td>
          <td class="table__title">
            <!-- Ссылка растянута на всю строку, но в фокусе остаётся одна точка табуляции -->
            <NuxtLink
              :to="`/requests/${request.id}`"
              class="table__link"
              :class="{ 'is-untitled': request.untitled }"
              :title="request.title"
            >
              {{ request.title }}
            </NuxtLink>
          </td>
          <td class="col-wide clamp" :class="{ muted: !request.customer }" :title="request.customer ?? undefined">
            {{ request.customer ?? '—' }}
          </td>
          <td class="col-wide clamp" :class="{ muted: !request.assignee }" :title="request.assignee ?? undefined">
            {{ request.assignee ?? 'Не назначен' }}
          </td>
          <td><RequestStatusBadge :status="request.status" /></td>
          <td><RequestPriorityBadge :priority="request.priority" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  font-size: var(--fs-sm);
}

th {
  padding: 12px 16px;
  background: var(--c-surface-3);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--c-text-muted);
  text-align: left;
  white-space: nowrap;
}

td {
  padding: 14px 16px;
  border-top: 1px solid var(--c-border);
  vertical-align: middle;
}

.table--compact td {
  padding-block: 8px;
}

tbody tr {
  position: relative;
  transition: background var(--transition);
}

tbody tr:hover,
tbody tr:focus-within {
  background: var(--c-surface-2);
}

.nowrap {
  white-space: nowrap;
}

.table__title {
  width: 45%;
}

/* Длинные названия: не больше двух строк, полный текст — в title */
.table__link {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-wrap: anywhere;
  color: var(--c-text);
  font-weight: 500;
}

.table__link.is-untitled {
  font-style: italic;
  color: var(--c-text-muted);
}

.table__link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.table__link:hover {
  color: var(--c-cyan);
  text-decoration: none;
}

.table__link:focus-visible {
  outline: none;
}

tbody tr:has(.table__link:focus-visible) {
  outline: 2px solid var(--c-focus);
  outline-offset: -2px;
}

.clamp {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-wide {
  display: none;
}

@media (min-width: 1024px) {
  .col-wide {
    display: table-cell;
  }

  .table__title {
    width: auto;
  }
}
</style>
