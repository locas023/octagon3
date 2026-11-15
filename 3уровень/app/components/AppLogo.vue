<script setup lang="ts">
withDefaults(defineProps<{ to?: string }>(), { to: '/' })
</script>

<template>
  <NuxtLink :to="to" class="logo" aria-label="WorkFlow — на главную">
    WorkFlow
  </NuxtLink>
</template>

<style scoped>
.logo {
  font-size: var(--fs-md);
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--c-text);
  text-decoration: none;
  transition: color var(--transition);
}

.logo:hover {
  color: var(--c-cyan);
  text-decoration: none;
}
</style>
