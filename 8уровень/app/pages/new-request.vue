<script setup lang="ts">
import type { RequestPriority } from '#shared/types/api'
definePageMeta({middleware:['auth']})
useHead({title:'Создать заявку'})
const {categories,customers,ready}=useReferenceData()
await ready
const actor=useCurrentUser()
const title=ref(''),description=ref(''),categoryId=ref(''),customerId=ref(''),priority=ref<RequestPriority>('normal'),pending=ref(false),error=ref('')
const categoryOptions=computed(()=>[{value:'',label:'Без категории'},...categories.value.filter(c=>c.active!==false).map(c=>({value:c.id,label:c.name}))])
const customerOptions=computed(()=>[{value:'',label:'Не указан'},...customers.value.map(c=>({value:c.id,label:c.name}))])
const priorities=Object.entries(PRIORITY_LABELS).map(([value,label])=>({value:value as RequestPriority,label}))
async function submit(){if(pending.value)return;pending.value=true;try{const item=await $fetch<{id:number}>('/api/requests',{method:'POST',body:{title:title.value,description:description.value,priority:priority.value,...(categoryId.value?{categoryId:categoryId.value}:{}),...(actor.value.role!=='client'&&customerId.value?{customerId:customerId.value}:{})}});await navigateTo(`/requests/${item.id}`)}catch(cause){error.value=toUiError(cause).message}finally{pending.value=false}}
</script>
<template><div class="container knowledge"><h1>Создать заявку</h1><form class="panel knowledge-card" @submit.prevent="submit"><UiInput v-model="title" label="Тема" required minlength="3" maxlength="300"/><UiInput v-model="description" label="Описание" multiline/><UiSelect v-model="categoryId" label="Категория" :options="categoryOptions"/><UiSelect v-model="priority" label="Приоритет" :options="priorities"/><UiSelect v-if="actor.role!=='client'" v-model="customerId" label="Клиент" :options="customerOptions"/><UiButton type="submit" :disabled="pending">Создать заявку</UiButton><p role="alert">{{error}}</p></form></div></template>
