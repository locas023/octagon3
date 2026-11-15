<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string; size?: 'sm' | 'md' }>(), { size: 'sm' })
const initials = computed(() => getInitials(props.name))
</script>

<template>
  <span class="avatar" :class="`avatar--${size}`" aria-hidden="true">{{ initials }}</span>
</template>

<style scoped>
.avatar {
  display: inline-grid;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--c-border-strong);
  border-radius: 50%;
  background: var(--c-surface-3);
  font-weight: 600;
  color: var(--c-text);
}

.avatar--sm {
  width: 28px;
  height: 28px;
  font-size: 10px;
}

.avatar--md {
  width: 40px;
  height: 40px;
  font-size: var(--fs-xs);
}
</style>
