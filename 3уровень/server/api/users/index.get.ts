import type { ApiUser } from '#shared/types/api'

/** GET /api/users */
export default defineEventHandler(async (event): Promise<ApiUser[]> => {
  await applySimulation(event)
  return users
})
