<script setup lang="ts">
import type { ApiRating } from '#shared/types/api'
const props = defineProps<{ id: number; rating?: ApiRating | null }>()
const emit = defineEmits<{ saved: [] }>()
const selected = ref<number>(), saved = ref<ApiRating | null>(props.rating || null)
const pending = ref(false), error = ref('')
async function submit() {
  if (!selected.value || pending.value) return
  pending.value = true
  try {
    saved.value = await $fetch<ApiRating>(`/api/requests/${props.id}/rating`, { method: 'POST', body: { score: selected.value } })
    emit('saved')
  } catch (cause) { error.value = toUiError(cause).message }
  finally { pending.value = false }
}
</script>
<template>
  <section class="rating panel" aria-labelledby="rating-title">
    <h2 id="rating-title">Оцените решение заявки</h2>
    <p v-if="saved" role="status">Ваша оценка: {{ saved.score }} из 5. Спасибо за обратную связь!</p>
    <form v-else @submit.prevent="submit">
      <fieldset :disabled="pending"><legend>Выберите оценку от 1 до 5</legend><div class="rating__options"><label v-for="score in 5" :key="score" class="rating__choice" :class="{'is-selected':selected===score}"><input v-model="selected" class="visually-hidden" type="radio" name="rating" :value="score" :aria-label="`Оценка ${score} из 5`" required>{{score}} ★</label></div></fieldset>
      <p aria-live="polite">{{ selected ? `Выбрана оценка: ${selected} из 5` : 'Оценка пока не выбрана' }}</p>
      <UiButton type="submit" :disabled="!selected || pending">Отправить оценку</UiButton><p v-if="error" role="alert">{{error}}</p>
    </form>
  </section>
</template>
<style scoped>
.rating{padding:24px}.rating h2{font-size:20px;line-height:28px;margin-bottom:16px}.rating form{display:grid;justify-items:start;gap:16px}fieldset{border:0;padding:0;min-width:0}legend{font-size:14px;margin-bottom:12px}.rating__options{display:flex;flex-wrap:wrap;gap:12px}.rating__choice{position:relative;padding:10px 16px;min-height:40px;border:1px solid var(--c-border-strong);border-radius:4px;cursor:pointer;font-size:14px}.rating__choice:has(input:focus-visible){outline:2px solid var(--c-focus);outline-offset:3px}.is-selected{background:var(--gradient-accent);border-color:transparent}
</style>
