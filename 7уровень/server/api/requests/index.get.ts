import type { ApiRequestListItem, Paginated } from '#shared/types/api'
import { requestPage } from '../../repositories/requests'

/** GET /api/requests — список заявок с поиском, фильтрами, сортировкой и пагинацией. */
export default defineEventHandler(async (event): Promise<Paginated<ApiRequestListItem>> => {
  const user = await requireUser(event)
  const mode = await applySimulation(event)
  const query = parseRequestListQuery(getQuery(event))

  if (mode === 'empty') return { items: [], total: 0, page: query.page, pageSize: query.pageSize }
  return requestPage(user, query)
})
