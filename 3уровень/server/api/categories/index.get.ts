import type { ApiCategory } from '#shared/types/api'

/** GET /api/categories */
export default defineEventHandler(async (event): Promise<ApiCategory[]> => {
  await applySimulation(event)
  return categories
})
