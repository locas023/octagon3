<script setup lang="ts">
import { postComment } from '~/features/comments/data'
const props=defineProps<{id:number}>()
const comment=ref(''),pending=ref(false),message=ref('')
async function send(){
  if(pending.value || !comment.value.trim())return
  pending.value=true
  try{await postComment(props.id,comment.value,crypto.randomUUID());comment.value='';await refreshNuxtData(`request-${props.id}`);message.value='Комментарий отправлен'}
  catch{message.value='Комментарий не отправлен. Текст сохранён — попробуйте ещё раз.'}
  finally{pending.value=false}
}
</script>
<template><form class="comment-form" @submit.prevent="send"><UiInput v-model="comment" label="Комментарий" multiline maxlength="5000" :disabled="pending"/><UiButton type="submit" :disabled="pending || !comment.trim()">Отправить</UiButton><p role="status" aria-label="Отправка комментария">{{message}}</p></form></template>
<style scoped>.comment-form{display:grid;justify-items:start;gap:16px;margin-top:24px}.comment-form>.field{width:100%}</style>
