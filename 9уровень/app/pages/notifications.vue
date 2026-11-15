<script setup lang="ts">
const {data,error,refresh}=await useFetch<{id:string;message:string;request_id:number}[]>('/api/notifications')
</script>
<template><div class="container knowledge"><h1>Уведомления</h1><UiButton variant="secondary" @click="refresh()">Обновить</UiButton><p v-if="error" role="alert">Не удалось загрузить уведомления</p><NuxtLink v-for="item in data" :key="item.id" :to="`/requests/${item.request_id}`" class="panel knowledge-card">{{item.message}}</NuxtLink><p v-if="!data?.length">Новых уведомлений нет</p></div></template>
