import type { ApiCategory, ApiCustomer, ApiUser } from '#shared/types/api'

/**
 * Справочники (пользователи, клиенты, категории).
 * Ключи useFetch общие, поэтому данные загружаются один раз и переиспользуются страницами.
 */
export function useReferenceData() {
  const users = useFetch<ApiUser[]>('/api/users', { key: 'ref-users', default: () => [] })
  const customers = useFetch<ApiCustomer[]>('/api/customers', { key: 'ref-customers', default: () => [] })
  const categories = useFetch<ApiCategory[]>('/api/categories', { key: 'ref-categories', default: () => [] })

  const lookups = computed(() =>
    createLookups(users.data.value, customers.data.value, categories.data.value),
  )

  const pending = computed(
    () => users.pending.value || customers.pending.value || categories.pending.value,
  )

  async function refresh() {
    await Promise.all([users.refresh(), customers.refresh(), categories.refresh()])
  }

  /** Промис, который можно дождаться в setup, чтобы SSR отдал заполненный HTML */
  const ready = Promise.all([users, customers, categories])

  return { users: users.data, customers: customers.data, categories: categories.data, lookups, pending, refresh, ready }
}
