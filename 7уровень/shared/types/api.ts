/**
 * Модели HTTP API. Используются и сервером (server/api), и клиентом (app/).
 * Поля, помеченные `?` или `| null`, могут отсутствовать в отдельных записях —
 * интерфейс обязан показывать такие записи без ошибок.
 */

export type RequestStatus = 'new' | 'assigned' | 'in_progress' | 'waiting' | 'resolved' | 'closed'

export type RequestPriority = 'critical' | 'high' | 'normal' | 'low'

export type UserRole = 'client' | 'operator' | 'agent' | 'admin'

export interface ApiUser {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
}

export interface ApiCustomer {
  active?: boolean
  id: string
  name: string
}

export interface ApiCategory {
  active?: boolean
  id: string
  name: string
}

export interface ApiComment {
  id: string
  authorId: string | null
  text: string
  createdAt: string
}

export type ApiTimelineEventType = 'created' | 'assigned' | 'status' | 'priority' | 'comment'

export interface ApiTimelineEvent {
  reason?: string
  id: string
  type: ApiTimelineEventType
  actorId: string | null
  /** Новое значение (статус, приоритет, id исполнителя) — зависит от type */
  value?: string | null
  createdAt: string
}

/** Элемент списка заявок */
export interface ApiRequestListItem {
  id: number
  title?: string | null
  customerId?: string | null
  categoryId?: string | null
  assigneeId?: string | null
  status: RequestStatus
  priority: RequestPriority
  createdAt: string
  dueAt?: string | null
}

/** Полная заявка */
export interface ApiRequest extends ApiRequestListItem {
  description?: string | null
  comments: ApiComment[]
  timeline: ApiTimelineEvent[]
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiRequestStats {
  new: number
  inProgress: number
  waiting: number
  resolved: number
}

export type AssignmentFilter = 'all' | 'assigned' | 'unassigned'

export type SortOption = 'newest' | 'oldest' | 'priority'

/** Параметры GET /api/requests */
export interface RequestListQuery {
  q?: string
  status?: RequestStatus
  priority?: RequestPriority
  assignment?: AssignmentFilter
  sort?: SortOption
  page?: number
  pageSize?: number
  /** Демо: имитация ошибок сервера (500, 429), медленного ответа или пустой выборки */
  simulate?: SimulateMode
}

export type SimulateMode = '500' | '429' | 'slow' | 'empty'

/** Тело ошибки, которое возвращает Nitro (createError) */
export interface ApiErrorBody {
  statusCode: number
  statusMessage?: string
  message?: string
  data?: { retryAfter?: number }
}
