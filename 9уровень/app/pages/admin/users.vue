<script setup lang="ts">
import type {ApiUser} from '#shared/types/api'
const {data,refresh,error}=await useFetch<ApiUser[]>('/api/admin/users')
const pending=ref(false),message=ref('')
async function toggle(user:ApiUser){if(pending.value)return;pending.value=true;try{await $fetch('/api/admin/users',{method:'PATCH',body:{id:user.id,active:!user.active}});await refresh()}catch{message.value='Не удалось изменить пользователя'}finally{pending.value=false}}
</script>
<template><div class="container knowledge"><h1>Пользователи</h1><p v-if="error" role="alert">Требуются права администратора</p><section v-for="user in data" :key="user.id" class="panel knowledge-card"><h2>{{user.name}}</h2><p>{{user.email}} · {{user.role}} · {{user.active?'Активен':'Деактивирован'}}</p><UiButton :disabled="pending" @click="toggle(user)">{{user.active?'Деактивировать':'Активировать'}}</UiButton></section><p role="status">{{message}}</p></div></template>
