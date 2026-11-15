<script setup lang="ts">
definePageMeta({middleware:['auth']})
const title=ref(''), description=ref(''), pending=ref(false), error=ref('')
async function submit(){if(pending.value)return;pending.value=true;try{const item=await $fetch<{id:number}>('/api/requests',{method:'POST',body:{title:title.value,description:description.value}});await navigateTo(`/requests/${item.id}`)}catch{error.value='Не удалось создать заявку. Проверьте тему и повторите.'}finally{pending.value=false}}
</script>
<template><main class="container page"><h1>Создать заявку</h1><form class="panel" style="padding:24px;display:grid;gap:16px" @submit.prevent="submit"><UiInput v-model="title" label="Тема" required minlength="3" maxlength="300"/><UiInput v-model="description" label="Описание"/><UiButton type="submit" :disabled="pending">Создать заявку</UiButton><p role="alert">{{error}}</p></form></main></template>
