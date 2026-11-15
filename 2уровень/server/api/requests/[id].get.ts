import type { ApiRequest } from '#shared/types/api'

/** GET /api/requests/:id — полная заявка с комментариями и историей. */
export default defineEventHandler(async (event): Promise<ApiRequest> => {
  await applySimulation(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Некорректный номер заявки' })
  }

  const request = requests.find((item) => item.id === id)
  if (!request) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Заявка не найдена' })
  }
  return request
})
