<script setup lang="ts">
const props = defineProps<{ id: number; archived: boolean }>()
const emit = defineEmits<{ changed: [] }>()
const open = ref(false), pending = ref(false), error = ref('')
async function confirm() {
  pending.value = true
  error.value = ''
  try {
    await $fetch(`/api/requests/${props.id}/archive`, { method: 'POST', body: { archived: !props.archived } })
    await refreshNuxtData(['requests-list', 'dashboard-recent', 'requests-stats', `request-${props.id}`])
    open.value = false
    emit('changed')
  } catch (cause) { error.value = toUiError(cause).message }
  finally { pending.value = false }
}
</script>
<template>
  <div class="archive-action">
    <UiButton variant="secondary" @click="open=true">{{ archived ? 'Восстановить из архива' : 'Архивировать заявку' }}</UiButton>
    <UiModal v-model:open="open" :title="archived?'Восстановить заявку?':'Архивировать заявку?'" :description="archived?'Заявка вернётся в основной список. История и файлы сохранятся.':'Закрытая заявка исчезнет из основного списка. История и файлы сохранятся в архиве.'">
      <p v-if="error" role="alert">{{ error }}</p>
      <template #footer><UiButton variant="secondary" :disabled="pending" @click="open=false">Отмена</UiButton><UiButton :disabled="pending" @click="confirm">{{ archived?'Подтвердить восстановление':'Подтвердить архивирование' }}</UiButton></template>
    </UiModal>
  </div>
</template>
<style scoped>.archive-action{margin-top:24px}</style>
