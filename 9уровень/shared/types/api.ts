/**
 * Модели HTTP API. Используются и сервером (server/api), и клиентом (app/).
 * Поля, помеченные `?` или `| null`, могут отсутствовать в отдельных записях —
 * интерфейс обязан показывать такие записи без ошибок.
 */

export type RequestStatus = 'new' | 'assigned' | 'in_progress' | 'waiting' | 'resolved' | 'closed' | 'escalated'

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
  id: string
  name: string
  active?: boolean
}

export interface ApiCategory {
  id: string
  name: string
  active?: boolean
}

export interface ApiComment {
  id: string
  authorId: string | null
  text: string
  createdAt: string
}

export type ApiTimelineEventType = 'created' | 'assigned' | 'status' | 'priority' | 'comment' | 'archived' | 'restored' | 'rated'

export interface ApiTimelineEvent {
  id: string
  type: ApiTimelineEventType
  actorId: string | null
  /** Новое значение (статус, приоритет, id исполнителя) — зависит от type */
  value?: string | null
  createdAt: string
  reason?: string
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
  archivedAt?: string | null
}

export interface ApiRating { score: number; createdAt: string }

/** Полная заявка */
export interface ApiRequest extends ApiRequestListItem {
  description?: string | null
  comments: ApiComment[]
  timeline: ApiTimelineEvent[]
  rating?: ApiRating | null
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
  archive?: 'active' | 'archived'
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
