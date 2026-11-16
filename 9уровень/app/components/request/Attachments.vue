<script setup lang="ts">
const props=defineProps<{id:number;readOnly?:boolean}>()
const {data,refresh}=await useFetch<{id:string;name:string;size:number}[]>(`/api/requests/${props.id}/attachments`)
const file=ref<File|null>(null),pending=ref(false),message=ref('')
function select(event:Event){const selected=(event.target as HTMLInputElement).files?.[0];file.value=selected||null;message.value=selected&&selected.size>5242880?'Максимальный размер файла — 5 МБ':''}
async function upload(){if(!file.value||pending.value||file.value.size>5242880)return;pending.value=true;try{const body=new FormData();body.append('file',file.value);await $fetch(`/api/requests/${props.id}/attachments`,{method:'POST',body});file.value=null;message.value='Файл загружен';await refresh()}catch{message.value='Загрузка отклонена: разрешено до 5 PDF/PNG/JPEG файлов по 5 МБ. Проверьте файл и повторите.'}finally{pending.value=false}}
</script>
<template><section class="panel knowledge-card"><h2>Вложения</h2><p>До 5 файлов, PDF, PNG или JPEG, не более 5 МБ каждый</p><ul><li v-for="item in data" :key="item.id"><a :href="`/api/requests/${id}/attachments/${item.id}`">{{item.name}} · {{Math.ceil(item.size/1024)}} КБ</a></li></ul><label v-if="!readOnly">Выбрать файл<input type="file" accept="application/pdf,image/png,image/jpeg" :disabled="pending" @change="select"/></label><UiButton v-if="!readOnly" :disabled="!file||pending||file.size>5242880" @click="upload">Загрузить</UiButton><p role="status">{{message}}</p></section></template>
