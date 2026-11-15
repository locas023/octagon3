import type { CurrentUser, ListDensity } from '~/types'

const DEFAULT_USER: CurrentUser = {
  name: 'Анна Кузнецова',
  email: '0000@mail.demo',
  role: 'operator',
}

/** Текущий пользователь (mock, без backend). */
export function useCurrentUser() {
  return useState<CurrentUser>('current-user', () => ({ ...DEFAULT_USER }))
}

/** Пользовательские настройки интерфейса. */
export function useUiPreferences() {
  const density = useState<ListDensity>('ui-density', () => 'comfortable')
  return { density }
}
