import type { ApiCustomer } from '#shared/types/api'

/** GET /api/customers */
export default defineEventHandler(async (event): Promise<ApiCustomer[]> => {
  await applySimulation(event)
  return customers
})
