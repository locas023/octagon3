<script setup lang="ts">
import type { RequestStatus } from '~/types'

defineProps<{ status: RequestStatus }>()
</script>

<template>
  <span class="badge" :class="`badge--${status}`">
    <img v-if="status!=='escalated'" :src="`/design/status-${status}.svg`" alt="" aria-hidden="true" class="badge__asset"><span v-else class="badge__dot" aria-hidden="true"/>
    {{ STATUS_LABELS[status] }}
  </span>
</template>

<style scoped>
.badge {
  --tone: var(--c-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tone) 16%, transparent);
  font-size: var(--fs-xs);
  font-weight: 600;
  line-height: 16px;
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
  --tone: #ffda7b;
}

.badge--waiting {
  --tone: #b9b3d4;
}
.badge__asset{display:block;flex:none}
.badge--escalated{--tone:#ff97a7}

.badge--resolved {
  --tone: var(--c-success);
}

.badge--closed {
  --tone: var(--c-text-faint);
}
</style>
