import type { LoadState, MockScenario, RequestFilters, SupportRequest } from '~/types'

const MOCK_DELAY_MS = 700

export const DEFAULT_FILTERS: RequestFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  assignment: 'all',
  sort: 'newest',
}

function isScenario(value: unknown): value is MockScenario {
  return value === 'success' || value === 'loading' || value === 'empty' || value === 'error'
}

export function applyFilters(list: SupportRequest[], filters: RequestFilters): SupportRequest[] {
  const query = filters.search.trim().toLowerCase().replace(/^#/, '')

  const filtered = list.filter((request) => {
    if (filters.status !== 'all' && request.status !== filters.status) return false
    if (filters.priority !== 'all' && request.priority !== filters.priority) return false
    if (filters.assignment === 'assigned' && !request.assignee) return false
    if (filters.assignment === 'unassigned' && request.assignee) return false
    if (!query) return true
    return (
      String(request.id).includes(query) ||
      request.title.toLowerCase().includes(query) ||
      request.client.toLowerCase().includes(query)
    )
  })

  return filtered.sort((a, b) => {
    if (filters.sort === 'priority') {
      const diff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
      if (diff !== 0) return diff
    }
    const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return filters.sort === 'oldest' ? -timeDiff : timeDiff
  })
}

/**
 * Список заявок с имитацией сетевой загрузки.
 * Сценарий задаётся query-параметром: /requests?mock=loading | empty | error.
 */
export function useRequestList(options: { pageSize?: number } = {}) {
  const pageSize = options.pageSize ?? 12
  const route = useRoute()
  const { requests } = useRequestsStore()

  const state = ref<LoadState>('loading')
  const source = ref<SupportRequest[]>([])
  const filters = reactive<RequestFilters>({ ...DEFAULT_FILTERS })
  const page = ref(1)

  const scenario = computed<MockScenario>(() => {
    const value = route.query.mock
    return isScenario(value) ? value : 'success'
  })

  let timer: ReturnType<typeof setTimeout> | undefined

  function load() {
    state.value = 'loading'
    clearTimeout(timer)
    if (scenario.value === 'loading') return

    timer = setTimeout(() => {
      if (scenario.value === 'error') {
        state.value = 'error'
        return
      }
      source.value = scenario.value === 'empty' ? [] : requests.value
      state.value = 'success'
    }, MOCK_DELAY_MS)
  }

  onMounted(load)
  onBeforeUnmount(() => clearTimeout(timer))
  watch(scenario, load)
  // Новые заявки из модального окна сразу попадают в список.
  watch(requests, (value) => {
    if (state.value === 'success' && scenario.value === 'success') source.value = value
  }, { deep: true })

  const filtered = computed(() => applyFilters(source.value, filters))
  const total = computed(() => filtered.value.length)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
  const items = computed(() => {
    const start = (page.value - 1) * pageSize
    return filtered.value.slice(start, start + pageSize)
  })
  const rangeStart = computed(() => (total.value === 0 ? 0 : (page.value - 1) * pageSize + 1))
  const rangeEnd = computed(() => Math.min(page.value * pageSize, total.value))

  const hasActiveFilters = computed(() =>
    (Object.keys(DEFAULT_FILTERS) as Array<keyof RequestFilters>)
      .filter((key) => key !== 'sort')
      .some((key) => filters[key] !== DEFAULT_FILTERS[key]),
  )

  watch(() => ({ ...filters }), () => {
    page.value = 1
  })
  watch(pageCount, (count) => {
    if (page.value > count) page.value = count
  })

  function resetFilters() {
    Object.assign(filters, DEFAULT_FILTERS)
  }

  return {
    state,
    scenario,
    filters,
    page,
    pageCount,
    items,
    total,
    rangeStart,
    rangeEnd,
    isSourceEmpty: computed(() => source.value.length === 0),
    hasActiveFilters,
    load,
    resetFilters,
  }
}
