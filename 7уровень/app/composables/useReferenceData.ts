import { useUserReference } from '~/features/users/data'
import { useCustomerReference } from '~/features/customers/data'
import { useCategoryReference } from '~/features/categories/data'

/**
 * Справочники (пользователи, клиенты, категории).
 * Ключи useFetch общие, поэтому данные загружаются один раз и переиспользуются страницами.
 */
export function useReferenceData() {
  const users = useUserReference()
  const customers = useCustomerReference()
  const categories = useCategoryReference()

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
