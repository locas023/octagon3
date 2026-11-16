<script setup lang="ts">
import type { UserRole } from '#shared/types/api'
type Entry={id:string;name:string;active?:boolean;email?:string;role?:UserRole}
const props=defineProps<{kind:'users'|'customers'|'categories';title:string}>()
const {data,refresh,error}=await useFetch<Entry[]>(`/api/admin/${props.kind}`)
const editing=ref<Entry|null>(null),name=ref(''),email=ref(''),password=ref(''),role=ref<UserRole>('agent'),active=ref(true)
const pending=ref(false),message=ref(''),deleting=ref<Entry|null>(null),confirmOpen=ref(false)
const roles=Object.entries(ROLE_LABELS).map(([value,label])=>({value:value as UserRole,label}))
function reset(){editing.value=null;name.value='';email.value='';password.value='';role.value='agent';active.value=true}
function edit(item:Entry){editing.value=item;name.value=item.name;email.value=item.email||'';role.value=item.role||'agent';active.value=item.active!==false;document.querySelector<HTMLInputElement>('#directory-form input')?.focus()}
async function save(){
 if(pending.value)return
 pending.value=true
 try{
  const body={...(editing.value?{id:editing.value.id}:{}),name:name.value,active:active.value,...(props.kind==='users'?{email:email.value,role:role.value,...(!editing.value?{password:password.value}:{})}:{})}
  await $fetch(`/api/admin/${props.kind}`,{method:editing.value?'PATCH':'POST',body})
  message.value='Сохранено';reset();await refresh();await refreshNuxtData(['ref-users','ref-customers','ref-categories'])
 }catch(cause){message.value=toUiError(cause).message}finally{pending.value=false}
}
async function remove(){
 if(!deleting.value||pending.value)return
 pending.value=true
 try{await $fetch(`/api/admin/${props.kind}/${encodeURIComponent(deleting.value.id)}`,{method:'DELETE'});confirmOpen.value=false;message.value='Запись удалена';await refresh();await refreshNuxtData(['ref-users','ref-customers','ref-categories'])}
 catch(cause){message.value=toUiError(cause).message;confirmOpen.value=false}finally{pending.value=false}
}
</script>
<template>
 <div class="container knowledge"><h1>{{title}}</h1><nav class="directory-buttons" aria-label="Справочники"><NuxtLink to="/admin/users">Пользователи</NuxtLink><NuxtLink to="/admin/customers">Клиенты</NuxtLink><NuxtLink to="/admin/categories">Категории</NuxtLink></nav><p v-if="error" role="alert">Раздел доступен администратору</p>
 <template v-else><form id="directory-form" class="panel knowledge-card" @submit.prevent="save"><h2>{{editing?'Изменить запись':'Добавить запись'}}</h2><UiInput v-model="name" label="Название / имя" minlength="2" maxlength="200" required/><template v-if="kind==='users'"><UiInput v-model="email" label="Email" type="email" required/><UiSelect v-model="role" label="Роль" :options="roles"/><UiInput v-if="!editing" v-model="password" label="Временный пароль" type="password" minlength="10" required/></template><label><input v-model="active" type="checkbox"/> Активна</label><div class="directory-buttons"><UiButton type="submit" :loading="pending">Сохранить</UiButton><UiButton v-if="editing" variant="secondary" @click="reset">Отмена</UiButton></div></form>
 <p role="status">{{message}}</p><article v-for="item in data" :key="item.id" class="panel knowledge-card"><h2>{{item.name}}</h2><p>{{item.email}} {{item.role?ROLE_LABELS[item.role]:''}} · {{item.active===false?'Неактивна':'Активна'}}</p><div class="directory-buttons"><UiButton variant="secondary" :aria-label="`Изменить ${item.name}`" @click="edit(item)">Изменить</UiButton><UiButton variant="secondary" :aria-label="`Удалить ${item.name}`" @click="deleting=item;confirmOpen=true">Удалить</UiButton></div></article></template>
 <UiModal v-model:open="confirmOpen" title="Удалить запись?" :description="deleting?.name"><p>Связанные с заявками записи защищены от удаления. Для них используйте деактивацию.</p><template #footer><UiButton variant="secondary" @click="confirmOpen=false">Отмена</UiButton><UiButton :disabled="pending" @click="remove">Подтвердить удаление</UiButton></template></UiModal>
 </div>
</template>
<style scoped>.directory-buttons{display:flex;flex-wrap:wrap;gap:12px}</style>
