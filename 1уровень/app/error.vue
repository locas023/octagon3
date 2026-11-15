<!-- Системная ошибка / 404 (макет 1.10) -->
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

useHead({ title: is404.value ? 'Страница не найдена' : 'Ошибка' })

function goBack() {
  clearError({ redirect: '/requests' })
}
</script>

<template>
  <main class="error-page">
    <div class="error-page__inner">
      <p class="error-page__code">{{ error.statusCode }}</p>
      <h1 class="error-page__title">{{ is404 ? 'Страница не найдена' : 'Что-то пошло не так' }}</h1>
      <p class="error-page__text">
        {{ is404 ? 'Проверьте адрес или вернитесь к заявкам.' : 'Сервис временно недоступен. Попробуйте ещё раз позже.' }}
      </p>
      <UiButton @click="goBack">Вернуться к заявкам</UiButton>
    </div>
  </main>
</template>

<style scoped>
.error-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px var(--gutter);
  text-align: center;
}

.error-page__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 420px;
}

.error-page__code {
  font-size: var(--fs-2xl);
  font-weight: 700;
  color: var(--c-cyan);
}

.error-page__title {
  font-size: var(--fs-xl);
}

.error-page__text {
  margin-bottom: 8px;
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}
</style>
