import type { ApiRequestStats } from '#shared/types/api'

/** GET /api/requests/stats — сводка для карточек «Новые / В работе / Ожидают / Решены». */
export default defineEventHandler(async (event): Promise<ApiRequestStats> => {
  await applySimulation(event)
  const count = (predicate: (status: string) => boolean) =>
    requests.filter((request) => predicate(request.status)).length

  return {
    new: count((s) => s === 'new'),
    inProgress: count((s) => s === 'assigned' || s === 'in_progress'),
    waiting: count((s) => s === 'waiting'),
    resolved: count((s) => s === 'resolved'),
  }
})
