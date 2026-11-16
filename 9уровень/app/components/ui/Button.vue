<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    to?: RouteLocationRaw
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    block?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    to: undefined,
    disabled: false,
    loading: false,
    block: false,
  },
)

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  { 'btn--block': props.block, 'btn--loading': props.loading },
])
</script>

<template>
  <NuxtLink v-if="to && !disabled" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  line-height:20px;
  --btn-h: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: var(--btn-h);
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition:
    background var(--transition),
    border-color var(--transition),
    color var(--transition),
    box-shadow var(--transition),
    transform var(--transition);
}

.btn:hover {
  text-decoration: none;
}

.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:focus-visible {
  outline: 2px solid var(--c-focus);
  outline-offset: 2px;
  border-radius: var(--radius);
}

.btn--sm {
  --btn-h: 32px;
  padding: 0 12px;
  font-size: var(--fs-xs);
}

.btn--block {
  width: 100%;
}

/* primary */
.btn--primary {
  background: var(--gradient-accent);
  color: #fff;
  box-shadow: none;
}

.btn--primary:hover:not(:disabled) {
  background: var(--gradient-accent-hover);
  box-shadow: 0 8px 24px rgba(200, 75, 196, 0.35);
}

/* secondary */
.btn--secondary {
  background: var(--c-surface-2);
  border-color: var(--c-border-strong);
  color: var(--c-text);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--c-surface-3);
  border-color: var(--c-focus);
}

/* ghost */
.btn--ghost {
  background: transparent;
  color: var(--c-cyan);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--c-surface-2);
}

/* disabled */
.btn:disabled {
  cursor: not-allowed;
  background: var(--c-surface-2);
  border-color: var(--c-border);
  color: var(--c-text-faint);
  box-shadow: none;
}

.btn--ghost:disabled {
  background: transparent;
}

.btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
