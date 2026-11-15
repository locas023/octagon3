<script setup lang="ts">
import type { IconName, RequestPriority } from '~/types'

defineProps<{ priority: RequestPriority }>()

const icons: Record<RequestPriority, IconName> = {
  critical: 'alert-triangle',
  high: 'chevrons-up',
  normal: 'equals',
  low: 'chevron-down',
}
</script>

<template>
  <span class="priority" :class="`priority--${priority}`">
    <AppIcon :name="icons[priority]" :size="14" />
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
</style>
