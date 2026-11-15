import type {
  ApiRequest,
  ApiRequestListItem,
  ApiRequestStats,
  Paginated,
  SimulateMode,
} from '#shared/types/api'
import type { RequestFilters } from '~/types'
import { DEFAULT_PAGE_SIZE } from '#shared/utils/request-rules'

const SIMULATE_MODES: readonly SimulateMode[] = ['500', '429', 'slow', 'empty']

/** Демо-сценарий из URL (?simulate=500|429|slow|empty) */
export function useSimulateMode() {
  const route = useRoute()
  return computed<SimulateMode | undefined>(() =>
    SIMULATE_MODES.find((mode) => mode === route.query.simulate),
  )
}

/**
 * URL state: поиск, фильтры, сортировка и страница живут в query-параметрах.
 * Прямая ссылка восстанавливает состояние страницы целиком.
 */
export function useRequestFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed(() => parseFilters(route.query))

  function update(patch: Partial<RequestFilters>) {
    const next: RequestFilters = { ...filters.value, ...patch }
    // Любое изменение фильтров, кроме перелистывания, возвращает на первую страницу
    if (!('page' in patch)) next.page = 1
    const keep = route.query.simulate ? { simulate: route.query.simulate } : {}
    return router.replace({ query: { ...serializeFilters(next), ...keep } })
  }

  function reset() {
    return update({ ...DEFAULT_FILTERS })
  }

  return { filters, update, reset, hasActive: computed(() => hasActiveFilters(filters.value)) }
}

/** Server state: список заявок по текущим фильтрам из URL. */
export function useRequests(options: { pageSize?: number } = {}) {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
  const { filters } = useRequestFilters()
  const simulate = useSimulateMode()
  const reference = useReferenceData()

  const query = computed(() => ({ ...toApiQuery(filters.value, pageSize), simulate: simulate.value }))

  const request = useFetch<Paginated<ApiRequestListItem>>('/api/requests', {
    key: 'requests-list',
    query,
    lazy: true,
  })

  const items = computed(() =>
    (request.data.value?.items ?? []).map((item) => toRequestListItemView(item, reference.lookups.value)),
  )
  const total = computed(() => request.data.value?.total ?? 0)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
  const rangeStart = computed(() => (total.value === 0 ? 0 : (filters.value.page - 1) * pageSize + 1))
  const rangeEnd = computed(() => Math.min(filters.value.page * pageSize, total.value))
  const error = computed(() => (request.error.value ? toUiError(request.error.value) : null))

  return {
    items,
    total,
    pageCount,
    rangeStart,
    rangeEnd,
    error,
    /** Первая загрузка — данных ещё нет */
    loading: computed(() => request.status.value === 'pending' && !request.data.value),
    /** Повторная загрузка при смене фильтров — показываем старые данные приглушёнными */
    refreshing: computed(() => request.status.value === 'pending' && !!request.data.value),
    refresh: request.refresh,
    ready: request,
  }
}

/** Server state: одна заявка. */
export function useRequest(id: Ref<number>) {
  const simulate = useSimulateMode()
  const reference = useReferenceData()

  const request = useFetch<ApiRequest>(() => `/api/requests/${id.value}`, {
    key: computed(() => `request-${id.value}`),
    query: computed(() => ({ simulate: simulate.value })),
    lazy: true,
  })

  const view = computed(() =>
    request.data.value ? toRequestView(request.data.value, reference.lookups.value) : null,
  )
  const error = computed(() => (request.error.value ? toUiError(request.error.value) : null))

  return {
    request: view,
    error,
    notFound: computed(() => error.value?.status === 404),
    loading: computed(() => request.status.value === 'pending' && !request.data.value),
    refresh: request.refresh,
    ready: request,
  }
}

/** Server state: сводка для Dashboard и списка. */
export function useRequestStats() {
  const request = useFetch<ApiRequestStats>('/api/requests/stats', { key: 'requests-stats', lazy: true })
  return {
    stats: computed(() => (request.data.value ? toStatItems(request.data.value) : null)),
    error: computed(() => (request.error.value ? toUiError(request.error.value) : null)),
    refresh: request.refresh,
  }
}
