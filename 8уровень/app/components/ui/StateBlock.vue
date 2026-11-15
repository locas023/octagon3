<script setup lang="ts">
import type { IconName } from '~/types'

withDefaults(
  defineProps<{
    icon?: IconName
    title: string
    description?: string
    tone?: 'neutral' | 'danger'
  }>(),
  { icon: 'inbox', description: undefined, tone: 'neutral' },
)
</script>

<template>
  <section
    class="state panel"
    :class="`state--${tone}`"
    :role="tone === 'danger' ? 'alert' : 'status'"
  >
    <AppIcon :name="icon" :size="22" class="state__icon" />
    <h2 class="state__title">{{ title }}</h2>
    <p v-if="description" class="state__description">{{ description }}</p>
    <div v-if="$slots.default" class="state__actions">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  text-align: center;
}

.state__icon {
  margin-bottom: 4px;
  color: var(--c-text-muted);
}

.state--danger .state__icon {
  color: var(--c-danger);
}

.state__title {
  font-size: var(--fs-lg);
}

.state__description {
  max-width: 420px;
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.state__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}
</style>
