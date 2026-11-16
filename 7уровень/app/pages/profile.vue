<!-- Профиль (макет 1.06) -->
<script setup lang="ts">
import type { ListDensity, SelectOption } from '~/types'

useHead({ title: 'Профиль' })

const user = useCurrentUser()
const { density } = useUiPreferences()

const name = ref(user.value.name)
const email = ref(user.value.email)
const submitted = ref(false)
const saved = ref(false)
const saving=ref(false),saveError=ref('')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const nameError = computed(() =>
  submitted.value && !name.value.trim() ? 'Введите имя' : undefined,
)
const emailError = computed(() =>
  submitted.value && !EMAIL_RE.test(email.value.trim())
    ? 'Введите корректный адрес электронной почты.'
    : undefined,
)

const isDirty = computed(
  () => name.value.trim() !== user.value.name || email.value.trim() !== user.value.email,
)

async function save() {
  if(saving.value)return
  submitted.value = true
  if (nameError.value || emailError.value) return
  saving.value=true;saveError.value=''
  try{user.value=await $fetch<typeof user.value>('/api/auth/profile',{method:'PATCH',body:{name:name.value.trim(),email:email.value.trim()}});saved.value=true}
  catch(error){saveError.value=toUiError(error).message}
  finally{saving.value=false}
}

const densityOptions: SelectOption<ListDensity>[] = [
  { value: 'comfortable', label: 'Комфортная' },
  { value: 'compact', label: 'Компактная' },
]

async function logout() {
  await navigateTo('/logout')
}
</script>

<template>
  <div class="page container">
    <UiPageHeader title="Профиль" subtitle="Ваши данные и настройки интерфейса" />

    <div class="profile">
      <section class="profile__block panel" aria-labelledby="profile-data-title">
        <h2 id="profile-data-title" class="visually-hidden">Личные данные</h2>
        <UiAvatar :name="user.name" size="md" />
        <form class="profile__form" novalidate @submit.prevent="save">
          <UiInput v-model="name" label="Имя" autocomplete="name" :error="nameError" />
          <UiInput
            v-model="email"
            label="Электронная почта"
            type="email"
            autocomplete="email"
            :error="emailError"
          />
          <p class="profile__role">Роль: {{ ROLE_LABELS[user.role].toLowerCase() }}</p>
          <div class="profile__actions">
            <UiButton type="submit" :disabled="!isDirty || saving">Сохранить изменения</UiButton>
            <p v-if="saveError" role="alert">{{saveError}}</p>
            <p class="profile__status" role="status" aria-live="polite">
              <template v-if="saved">Изменения сохранены</template>
            </p>
          </div>
        </form>
      </section>

      <section class="profile__block panel" aria-labelledby="profile-ui-title">
        <h2 id="profile-ui-title" class="profile__title">Настройки интерфейса</h2>
        <div class="profile__form">
          <UiSelect v-model="density" label="Плотность списка" :options="densityOptions" />
        </div>
      </section>

      <div>
        <UiButton variant="secondary" @click="logout">
          <AppIcon name="logout" :size="16" />
          Выйти из аккаунта
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile__block {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.profile__title {
  font-size: var(--fs-lg);
}

.profile__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 420px;
}

.profile__role {
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.profile__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.profile__status {
  font-size: var(--fs-xs);
  color: var(--c-success);
}
</style>
