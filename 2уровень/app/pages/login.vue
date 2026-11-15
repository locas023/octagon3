<!-- Вход (макет 1.02). Авторизация mock — реальная появится на уровне 4. -->
<script setup lang="ts">
definePageMeta({ layout: 'public', minimalHeader: true })
useHead({ title: 'Вход' })

const user = useCurrentUser()

const email = ref('')
const password = ref('')
const submitted = ref(false)
const loading = ref(false)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailError = computed(() => {
  if (!submitted.value) return undefined
  if (!email.value.trim()) return 'Введите электронную почту'
  if (!EMAIL_RE.test(email.value.trim())) return 'Введите корректный адрес электронной почты.'
  return undefined
})

const passwordError = computed(() => {
  if (!submitted.value) return undefined
  if (password.value.length < 6) return 'Пароль должен быть не короче 6 символов'
  return undefined
})

async function submit() {
  submitted.value = true
  if (emailError.value || passwordError.value) return
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 500))
  user.value = { ...user.value, email: email.value.trim() }
  loading.value = false
  await navigateTo('/dashboard')
}
</script>

<template>
  <div class="login container">
    <section class="login__card panel" aria-labelledby="login-title">
      <h1 id="login-title" class="login__title">С возвращением</h1>
      <p class="login__subtitle">Войдите для работы с заявками</p>

      <form class="login__form" novalidate @submit.prevent="submit">
        <UiInput
          v-model="email"
          label="Электронная почта"
          type="email"
          placeholder="0000@mail.demo"
          autocomplete="email"
          :error="emailError"
          required
        />
        <UiInput
          v-model="password"
          label="Пароль"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          :error="passwordError"
          required
        />
        <UiButton type="submit" :loading="loading" class="login__submit">Войти</UiButton>
      </form>

      <p class="login__footer">
        Нет аккаунта? <NuxtLink to="/login">Зарегистрироваться</NuxtLink>
      </p>
    </section>
  </div>
</template>

<style scoped>
.login {
  display: grid;
  place-items: center;
  min-height: calc(100vh - var(--header-h));
  padding-block: 32px;
}

.login__card {
  width: 100%;
  max-width: 400px;
  padding: 24px;
}

.login__title {
  font-size: var(--fs-xl);
}

.login__subtitle {
  margin-top: 8px;
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.login__submit {
  align-self: flex-start;
}

.login__footer {
  margin-top: 20px;
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

@media (min-width: 768px) {
  .login__card {
    padding: 28px;
  }
}
</style>
