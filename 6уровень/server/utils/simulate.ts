import type { H3Event } from 'h3'
import type { SimulateMode } from '#shared/types/api'

const MODES: readonly SimulateMode[] = ['500', '429', 'slow', 'empty']

export function readSimulateMode(event: H3Event): SimulateMode | undefined {
  const value = getQuery(event).simulate
  return MODES.find((mode) => mode === value)
}

/**
 * Демо-имитация нестабильного сервера: ?simulate=500 | 429 | slow.
 * Позволяет проверить error state и повтор запроса без настоящего backend.
 */
export async function applySimulation(event: H3Event): Promise<SimulateMode | undefined> {
  const mode = readSimulateMode(event)

  if (mode === 'slow') {
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  if (mode === '429') {
    const retryAfter = 5
    setResponseHeader(event, 'Retry-After', retryAfter)
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Слишком много запросов',
      data: { retryAfter },
    })
  }

  if (mode === '500') {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Сервис временно недоступен',
    })
  }

  return mode
}
