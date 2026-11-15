<script setup lang="ts">
import type { RequestStatus } from '~/types'

defineProps<{ status: RequestStatus }>()
</script>

<template>
  <span class="badge" :class="`badge--${status}`">
    <span class="badge__dot" aria-hidden="true" />
    {{ STATUS_LABELS[status] }}
  </span>
</template>

<style scoped>
.badge {
  --tone: var(--c-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tone) 16%, transparent);
  font-size: var(--fs-xs);
  font-weight: 500;
  line-height: 1.4;
  color: color-mix(in srgb, var(--tone) 70%, white);
  white-space: nowrap;
}

.badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tone);
}

.badge--new {
  --tone: #a99bff;
}

.badge--assigned {
  --tone: var(--c-cyan);
}

.badge--in_progress {
  --tone: var(--c-info);
}

.badge--waiting {
  --tone: var(--c-warning);
}

.badge--resolved {
  --tone: var(--c-success);
}

.badge--closed {
  --tone: var(--c-text-faint);
}
</style>
