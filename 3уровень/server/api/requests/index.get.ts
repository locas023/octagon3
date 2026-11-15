import type { ApiRequestListItem, Paginated } from '#shared/types/api'

/** GET /api/requests — список заявок с поиском, фильтрами, сортировкой и пагинацией. */
export default defineEventHandler(async (event): Promise<Paginated<ApiRequestListItem>> => {
  const mode = await applySimulation(event)
  const query = parseRequestListQuery(getQuery(event))

  const source: ApiRequestListItem[] = mode === 'empty'
    ? []
    : requests.map(({ comments: _c, timeline: _t, description: _d, ...item }) => item)

  const filtered = filterAndSort(source, query)
  const start = (query.page - 1) * query.pageSize

  return {
    items: filtered.slice(start, start + query.pageSize),
    total: filtered.length,
    page: query.page,
    pageSize: query.pageSize,
  }
})
