<script setup lang="ts">
definePageMeta({layout:'public'})
usePublicSeo('Частые вопросы','Ответы о работе с сервисными заявками WorkFlow')
const search=ref('')
const entries=computed(()=>FAQ.filter(entry=>entry.join(' ').toLowerCase().includes(search.value.toLowerCase())))
</script>
<template><div class="container knowledge"><h1>Частые вопросы</h1><p class="muted">Ответы о работе с сервисными заявками</p><UiInput v-model="search" label="Поиск по вопросам" placeholder="Что вы хотите узнать?"/><section v-for="entry in entries" :key="entry[0]" class="panel knowledge-card"><h2>{{entry[0]}}</h2><p>{{entry[1]}}</p></section><p v-if="!entries.length" role="status">Ничего не найдено</p></div></template>
