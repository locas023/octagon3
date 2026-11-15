<script setup lang="ts">
import type { TimelineEventView } from '~/types'

const props = defineProps<{ events: TimelineEventView[] }>()

// Новые события — сверху
const sorted = computed(() =>
  [...props.events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
)
</script>

<template>
  <ol class="timeline">
    <li v-for="event in sorted" :key="event.id" class="timeline__item" :class="`timeline__item--${event.type}`">
      <span class="timeline__dot" aria-hidden="true" />
      <div>
        <p class="timeline__text">
          <strong>{{ event.author }}</strong> {{ event.text }}
        </p>
        <time class="timeline__time" :datetime="event.createdAt">{{ formatDateTime(event.createdAt) }}</time>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 12px;
}

.timeline__item:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 14px;
  bottom: -18px;
  left: 5px;
  width: 2px;
  background: var(--c-border);
}

.timeline__dot {
  width: 12px;
  height: 12px;
  margin-top: 4px;
  border: 2px solid var(--c-bg);
  border-radius: 50%;
  background: var(--c-text-faint);
  box-shadow: 0 0 0 1px var(--c-border-strong);
}

.timeline__item--created .timeline__dot {
  background: var(--c-accent);
}

.timeline__item--assigned .timeline__dot {
  background: var(--c-cyan);
}

.timeline__item--status .timeline__dot {
  background: var(--c-success);
}

.timeline__item--priority .timeline__dot {
  background: var(--c-warning);
}

.timeline__text {
  font-size: var(--fs-sm);
}

.timeline__text strong {
  font-weight: 600;
}

.timeline__time {
  font-size: var(--fs-xs);
  color: var(--c-text-faint);
}
</style>
