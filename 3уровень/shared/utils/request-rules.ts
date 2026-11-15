import type { RequestPriority, RequestStatus } from '../types/api'

/** Чистые константы и функции без зависимостей от Vue/Nitro — общие для сервера и клиента. */

export const REQUEST_STATUSES: readonly RequestStatus[] = [
  'new',
  'assigned',
  'in_progress',
  'waiting',
  'resolved',
  'closed',
]

export const REQUEST_PRIORITIES: readonly RequestPriority[] = ['critical', 'high', 'normal', 'low']

/** Вес приоритета для сортировки: больше — важнее. */
export const PRIORITY_WEIGHT: Record<RequestPriority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
}

export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 50

export function isRequestStatus(value: unknown): value is RequestStatus {
  return typeof value === 'string' && (REQUEST_STATUSES as readonly string[]).includes(value)
}

export function isRequestPriority(value: unknown): value is RequestPriority {
  return typeof value === 'string' && (REQUEST_PRIORITIES as readonly string[]).includes(value)
}
