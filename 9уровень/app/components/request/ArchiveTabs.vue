<script setup lang="ts">
withDefaults(defineProps<{ archive?: boolean }>(), { archive: false })
</script>
<template><nav class="archive-tabs" aria-label="Представление заявок"><UiButton to="/requests" :variant="archive?'secondary':'primary'" :aria-current="!archive?'page':undefined">Основной список</UiButton><UiButton to="/requests?archive=archived" :variant="archive?'primary':'secondary'" :aria-current="archive?'page':undefined">Архив</UiButton></nav></template>
<style scoped>.archive-tabs{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px}</style>
