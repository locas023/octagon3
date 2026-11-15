<script setup lang="ts">
const {data,error,refresh}=await useFetch<{id:string;message:string;request_id:number;read_at:string|null;created_at:string}[]>('/api/notifications')
const unreadOnly=ref(false),saving=ref(false),message=ref('')
const entries=computed(()=>(data.value||[]).filter(item=>!unreadOnly.value||!item.read_at))
const unreadCount=computed(()=>(data.value||[]).filter(item=>!item.read_at).length)
async function toggle(item:NonNullable<typeof data.value>[number]) {
 if(saving.value)return
 saving.value=true
 try{await $fetch(`/api/notifications/${encodeURIComponent(item.id)}`,{method:'PATCH',body:{read:!item.read_at}});await refresh();message.value='Состояние сохранено'}
 catch{message.value='Не удалось сохранить состояние. Повторите попытку.'}
 finally{saving.value=false}
}
</script>
<template><div class="container knowledge"><h1>Уведомления</h1><p>Непрочитанных: {{unreadCount}}</p><label><input v-model="unreadOnly" type="checkbox"/> Только непрочитанные</label><UiButton variant="secondary" @click="refresh()">Обновить</UiButton><p v-if="error" role="alert">Не удалось загрузить уведомления</p><article v-for="item in entries" :key="item.id" class="panel knowledge-card"><NuxtLink :to="`/requests/${item.request_id}`">{{item.message}}</NuxtLink><p>{{item.read_at?'Прочитано':'Новое'}} · {{formatDateTime(item.created_at)}}</p><UiButton variant="secondary" :disabled="saving" @click="toggle(item)">{{item.read_at?'Отметить непрочитанным':'Отметить прочитанным'}}</UiButton></article><p v-if="!entries.length">Нет уведомлений по выбранному фильтру</p><p role="status">{{message}}</p></div></template>
