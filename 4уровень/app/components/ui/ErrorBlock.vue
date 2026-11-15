<!-- Error state с повтором запроса. Для HTTP 429 кнопка блокируется на время Retry-After. -->
<script setup lang="ts">
import type { UiError } from '~/types'

const props = defineProps<{ error: UiError; retrying?: boolean }>()
const emit = defineEmits<{ retry: [] }>()

const secondsLeft = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function startCountdown(seconds: number | null) {
  clearInterval(timer)
  secondsLeft.value = seconds ?? 0
  if (!seconds || !import.meta.client) return
  timer = setInterval(() => {
    secondsLeft.value = Math.max(0, secondsLeft.value - 1)
    if (secondsLeft.value === 0) clearInterval(timer)
  }, 1000)
}

watch(() => props.error, (error) => startCountdown(error.retryAfter), { immediate: true })
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <UiStateBlock tone="danger" icon="alert-circle" :title="error.title" :description="error.message">
    <UiButton :disabled="secondsLeft > 0" :loading="retrying" @click="emit('retry')">
      <AppIcon name="refresh" :size="16" />
      {{ secondsLeft > 0 ? `Повторить через ${secondsLeft} с` : 'Повторить загрузку' }}
    </UiButton>
    <p v-if="error.status" class="error-code">Код ответа: {{ error.status }}</p>
  </UiStateBlock>
</template>

<style scoped>
.error-code {
  flex-basis: 100%;
  font-size: var(--fs-xs);
  color: var(--c-text-faint);
}
</style>
