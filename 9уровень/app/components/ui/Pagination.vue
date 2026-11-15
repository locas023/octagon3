<script setup lang="ts">
const page = defineModel<number>({ required: true })

const props = defineProps<{ pageCount: number; label?: string }>()

const pages = computed(() => Array.from({ length: props.pageCount }, (_, index) => index + 1))

function go(value: number) {
  page.value = Math.min(Math.max(1, value), props.pageCount)
}
</script>

<template>
  <nav class="pagination" :aria-label="label ?? 'Страницы списка'">
    <UiButton variant="secondary" size="sm" :disabled="page <= 1" @click="go(page - 1)">
      Назад
    </UiButton>
    <ul class="pagination__pages">
      <li v-for="item in pages" :key="item">
        <button
          type="button"
          class="pagination__page"
          :class="{ 'is-active': item === page }"
          :aria-current="item === page ? 'page' : undefined"
          :aria-label="`Страница ${item}`"
          @click="go(item)"
        >
          {{ item }}
        </button>
      </li>
    </ul>
    <UiButton variant="secondary" size="sm" :disabled="page >= pageCount" @click="go(page + 1)">
      Далее
    </UiButton>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination__pages {
  display: flex;
  gap: 4px;
}

.pagination__page {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--c-text-muted);
  cursor: pointer;
  transition:
    background var(--transition),
    color var(--transition),
    border-color var(--transition);
}

.pagination__page:hover {
  background: var(--c-surface-2);
  color: var(--c-text);
}

.pagination__page.is-active {
  border-color: var(--c-border-strong);
  background: var(--c-surface-3);
  color: var(--c-text);
}
</style>
