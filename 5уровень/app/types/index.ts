import type {
  AssignmentFilter,
  RequestPriority,
  RequestStatus,
  SimulateMode,
  SortOption,
  UserRole,
} from '#shared/types/api'

export type {
  AssignmentFilter,
  RequestPriority,
  RequestStatus,
  SimulateMode,
  SortOption,
  UserRole,
} from '#shared/types/api'

/* ---------- View-модели: то, что получают компоненты после маппинга API ---------- */

export interface CommentView {
  id: string
  author: string
  text: string
  createdAt: string
}

export type TimelineEventType = 'created' | 'assigned' | 'status' | 'priority' | 'comment'

export interface TimelineEventView {
  id: string
  type: TimelineEventType
  author: string
  text: string
  createdAt: string
}

export interface RequestListItemView {
  id: number
  title: string
  /** true, если в API нет названия и показывается заглушка */
  untitled: boolean
  customer: string | null
  category: string | null
  assignee: string | null
  status: RequestStatus
  priority: RequestPriority
  createdAt: string
  dueAt: string | null
}

export interface RequestView extends RequestListItemView {
  description: string | null
  comments: CommentView[]
  timeline: TimelineEventView[]
}

export interface StatItem {
  key: string
  label: string
  value: number
  hint: string
}

/* ---------- Состояние фильтров (хранится в URL) ---------- */

export interface RequestFilters {
  q: string
  status: RequestStatus | 'all'
  priority: RequestPriority | 'all'
  assignment: AssignmentFilter
  sort: SortOption
  page: number
}

/* ---------- Ошибки API в виде, удобном для UI ---------- */

export interface UiError {
  status: number | null
  title: string
  message: string
  /** Через сколько секунд можно повторить (HTTP 429) */
  retryAfter: number | null
}

/* ---------- Прочее ---------- */

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

export interface CurrentUser {
  name: string
  email: string
  role: UserRole
}

export type ListDensity = 'comfortable' | 'compact'

export type DemoScenario = SimulateMode

export type IconName =
  | 'bell'
  | 'menu'
  | 'close'
  | 'arrow-left'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevrons-up'
  | 'equals'
  | 'alert-triangle'
  | 'alert-circle'
  | 'inbox'
  | 'search'
  | 'plus'
  | 'user'
  | 'logout'
  | 'refresh'

export interface NavItem {
  to: string
  label: string
}
