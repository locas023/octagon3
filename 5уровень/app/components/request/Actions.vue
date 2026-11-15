<script setup lang="ts">
import type { ApiRequest, RequestPriority, RequestStatus } from '#shared/types/api'
const props = defineProps<{ id: number }>()
const { data } = useNuxtData<ApiRequest>(`request-${props.id}`)
const { users } = useReferenceData()
const pending = ref(false), message = ref(''), comment = ref(''), simulate = ref('')
const reason=ref('')
const undo = ref<{ priority?: RequestPriority; status?: RequestStatus } | null>(null)
async function change(patch: { priority?: RequestPriority; status?: RequestStatus; assigneeId?: string | null }, reversing = false) {
  if (pending.value || !data.value) return
  const previous = structuredClone(toRaw(data.value))
  pending.value = true
  message.value = 'Сохранение…'
  if (patch.priority) data.value = { ...data.value, priority: patch.priority }
  try {
    data.value = await $fetch<ApiRequest>(`/api/requests/${props.id}`, { method: 'PATCH', body: { ...patch, reason: reason.value } })
    undo.value = reversing ? null : patch.priority ? { priority: previous.priority } : patch.status ? { status: previous.status } : null
    message.value = 'Изменение сохранено'
    await refreshNuxtData(['requests-list', 'requests-stats'])
  } catch (error) { data.value = previous; message.value = toUiError(error).message || 'Не удалось сохранить. Предыдущее значение восстановлено.' }
  finally { pending.value = false }
}
async function send() {
  if (pending.value || !comment.value.trim()) return
  pending.value = true
  try { await $fetch(`/api/requests/${props.id}/comments`, { method: 'POST', body: { text: comment.value, key: crypto.randomUUID() } }); comment.value = ''; await refreshNuxtData(`request-${props.id}`); message.value = 'Комментарий отправлен' }
  catch { message.value = 'Комментарий не отправлен. Текст сохранён — попробуйте ещё раз.' }
  finally { pending.value = false }
}
</script>
<template>
  <section v-if="data" class="panel actions">
    <h2>Изменить заявку</h2><label>Причина / результат решения<textarea v-model="reason" /></label>
    <label>Приоритет<select :value="data.priority" :disabled="pending" @change="change({ priority: ($event.target as HTMLSelectElement).value as RequestPriority })"><option v-for="(meta,key) in PRIORITY_LABELS" :key="key" :value="key">{{ meta }}</option></select></label>
    <label>Статус<select :value="data.status" :disabled="pending" @change="change({ status: ($event.target as HTMLSelectElement).value as RequestStatus })"><option v-for="(meta,key) in STATUS_LABELS" :key="key" :value="key">{{ meta }}</option></select></label>
    <label>Исполнитель<select :value="data.assigneeId || ''" :disabled="pending" @change="change({ assigneeId: ($event.target as HTMLSelectElement).value || null })"><option value="">Не назначен</option><option v-for="user in users.filter(u => u.role === 'agent')" :key="user.id" :disabled="!user.active" :value="user.id">{{ user.name }}</option></select></label>
    <button v-if="undo" :disabled="pending" @click="change(undo!, true)">Отменить последнее изменение (Undo)</button>
    <form @submit.prevent="send"><label>Комментарий<textarea v-model="comment" maxlength="5000" :disabled="pending" required /></label><UiButton type="submit" :disabled="pending || !comment.trim()">Отправить</UiButton></form>
    <p role="status" aria-label="Сохранение заявки">{{ message }}</p>
    <details><summary>Проверка ошибок API</summary><label>Ответ сервера<select v-model="simulate"><option value="">Успех</option><option value="409">409 — конфликт</option><option value="500">500 — ошибка</option></select></label></details>
  </section>
</template>
<style scoped>.actions{padding:20px;display:grid;gap:16px}label{display:grid;gap:8px}select,textarea{background:var(--c-bg);color:inherit;padding:12px;border:1px solid var(--c-border);border-radius:8px;width:100%}textarea{min-height:90px}form{display:grid;gap:12px}</style>



