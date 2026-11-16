import type { CurrentUser, ListDensity } from '~/types'
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '~/stores/preferences'

const DEFAULT_USER: CurrentUser = {
  name: 'Анна Кузнецова',
  email: '0000@mail.demo',
  role: 'operator',
}

/** Пользователь текущей серверной сессии; заполняется auth middleware. */
export function useCurrentUser() {
  return useState<CurrentUser>('current-user', () => ({ ...DEFAULT_USER }))
}

/** Пользовательские настройки интерфейса. */
export function useUiPreferences() {
  const store = usePreferencesStore()
  onMounted(() => store.load())
  return storeToRefs(store)
}
