<script setup lang="ts">
const page = defineModel<number>({ required: true })

const props = defineProps<{ pageCount: number; label?: string }>()

const pages = computed(() => {
  const marks = [...new Set([1, page.value - 1, page.value, page.value + 1, props.pageCount].filter(n => n >= 1 && n <= props.pageCount))].sort((a,b)=>a-b)
  return marks.flatMap((n,i): (number|null)[] => i && n > marks[i-1]! + 1 ? [null,n] : [n])
})

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
      <li v-for="(item,index) in pages" :key="item ?? `gap-${index}`">
        <button
          v-if="item!==null"
          type="button"
          class="pagination__page"
          :class="{ 'is-active': item === page }"
          :aria-current="item === page ? 'page' : undefined"
          :aria-label="`Страница ${item}`"
          @click="go(item)"
        >
          {{ item }}
        </button>
        <span v-else aria-hidden="true">…</span>
      </li>
    </ul>
    <span class="pagination__summary" role="status" :aria-label="`Страница ${page} из ${pageCount}`">{{page}} / {{pageCount}}</span>
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
.pagination__summary{display:none;font-size:12px;color:var(--c-text-muted)}
@media(max-width:479px){.pagination__pages{display:none}.pagination__summary{display:inline}.pagination{max-width:100%;flex-wrap:wrap}}

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
