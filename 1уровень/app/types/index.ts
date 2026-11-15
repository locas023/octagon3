export type RequestStatus =
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'waiting'
  | 'resolved'
  | 'closed'

export type RequestPriority = 'critical' | 'high' | 'normal' | 'low'

export type UserRole = 'operator' | 'executor' | 'client' | 'admin'

export interface Person {
  id: string
  name: string
}

export interface RequestComment {
  id: string
  author: string
  text: string
  createdAt: string
}

export type TimelineEventType =
  | 'created'
  | 'assigned'
  | 'status'
  | 'priority'
  | 'comment'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  text: string
  author: string
  createdAt: string
}

export interface SupportRequest {
  id: number
  title: string
  description: string
  client: string
  category: string
  assignee: string | null
  status: RequestStatus
  priority: RequestPriority
  createdAt: string
  dueAt: string
  comments: RequestComment[]
  timeline: TimelineEvent[]
}

export interface NewRequestPayload {
  title: string
  client: string
  category: string
  priority: RequestPriority
  description: string
}

export type AssignmentFilter = 'all' | 'assigned' | 'unassigned'

export type SortOption = 'newest' | 'oldest' | 'priority'

export interface RequestFilters {
  search: string
  status: RequestStatus | 'all'
  priority: RequestPriority | 'all'
  assignment: AssignmentFilter
  sort: SortOption
}

/** Сценарий mock-загрузки, задаётся через ?mock=... */
export type MockScenario = 'success' | 'loading' | 'empty' | 'error'

export type LoadState = 'loading' | 'success' | 'error'

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

export interface NavItem {
  to: string
  label: string
}
