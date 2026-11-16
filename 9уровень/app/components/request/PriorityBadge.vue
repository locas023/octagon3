<script setup lang="ts">
import type { RequestPriority } from '~/types'

defineProps<{ priority: RequestPriority }>()

</script>

<template>
  <span class="priority" :class="`priority--${priority}`">
    <img :src="`/design/priority-${priority}.svg`" alt="" aria-hidden="true" class="priority__icon">
    {{ PRIORITY_LABELS[priority] }}
  </span>
</template>

<style scoped>
.priority {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-xs);
  font-weight: 500;
  white-space: nowrap;
}

.priority--critical {
  color: var(--c-danger);
}

.priority--high {
  color: var(--c-warning);
}

.priority--normal {
  color: var(--c-text-muted);
}

.priority--low {
  color: var(--c-text-faint);
}
.priority__icon{display:block;flex:none}
</style>
