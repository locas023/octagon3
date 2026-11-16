<script setup lang="ts">
definePageMeta({ layout: 'public', minimalHeader: true })
useHead({ title: 'Создать аккаунт' })
const name = ref(''), company = ref(''), email = ref(''), password = ref('')
const pending = ref(false), error = ref('')
const hydrated = ref(false)
onMounted(() => { hydrated.value = true })
async function submit() {
  if (pending.value) return
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: { name: name.value, company: company.value, email: email.value, password: password.value } })
    await navigateTo('/login?registered=1')
  } catch (cause) { error.value = toUiError(cause).message }
  finally { pending.value = false }
}
</script>
<template>
  <div class="container registration">
    <section class="panel registration__card" aria-labelledby="registration-title">
      <h1 id="registration-title">Создать аккаунт</h1>
      <p class="muted">Зарегистрируйтесь, чтобы отправлять заявки</p>
      <form :aria-busy="!hydrated" @submit.prevent="submit">
        <UiInput v-model="name" :disabled="!hydrated" label="Имя" autocomplete="name" minlength="2" maxlength="120" required />
        <UiInput v-model="company" :disabled="!hydrated" label="Компания" autocomplete="organization" minlength="2" maxlength="200" required />
        <UiInput v-model="email" :disabled="!hydrated" label="Электронная почта" type="email" autocomplete="email" required />
        <UiInput v-model="password" :disabled="!hydrated" label="Пароль" type="password" autocomplete="new-password" minlength="10" maxlength="200" required />
        <p class="muted">Пароль — не менее 10 символов.</p>
        <UiButton type="submit" :disabled="pending || !hydrated" :loading="pending">Зарегистрироваться</UiButton>
        <p v-if="error" role="alert">{{ error }}</p>
      </form>
      <NuxtLink to="/login">Уже есть аккаунт? Войти</NuxtLink>
    </section>
  </div>
</template>
<style scoped>
.registration{display:grid;justify-items:center;padding-block:64px}.registration__card{width:100%;max-width:440px;padding:24px;display:grid;gap:20px}.registration__card h1{font-size:28px;line-height:36px}.registration__card form{display:grid;gap:20px}.registration__card>a{font-size:12px}
</style>
