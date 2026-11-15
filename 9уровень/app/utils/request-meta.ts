import type {
  AssignmentFilter,
  RequestPriority,
  RequestStatus,
  SelectOption,
  SortOption,
  UserRole,
} from '~/types'
import { REQUEST_PRIORITIES, REQUEST_STATUSES } from '#shared/utils/request-rules'

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'Новая',
  assigned: 'Назначена',
  in_progress: 'В работе',
  waiting: 'Ожидает',
  resolved: 'Решена',
  closed: 'Закрыта',
  escalated: 'Эскалирована',
}

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  critical: 'Критический',
  high: 'Высокий',
  normal: 'Обычный',
  low: 'Низкий',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  client: 'Клиент',
  operator: 'Оператор',
  agent: 'Исполнитель',
  admin: 'Администратор',
}

export const STATUS_OPTIONS: SelectOption<RequestStatus | 'all'>[] = [
  { value: 'all', label: 'Все статусы' },
  ...REQUEST_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] })),
]

export const PRIORITY_OPTIONS: SelectOption<RequestPriority | 'all'>[] = [
  { value: 'all', label: 'Все приоритеты' },
  ...REQUEST_PRIORITIES.map((value) => ({ value, label: PRIORITY_LABELS[value] })),
]

export const ASSIGNMENT_OPTIONS: SelectOption<AssignmentFilter>[] = [
  { value: 'all', label: 'Все заявки' },
  { value: 'assigned', label: 'Назначенные' },
  { value: 'unassigned', label: 'Без исполнителя' },
]

export const SORT_OPTIONS: SelectOption<SortOption>[] = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'priority', label: 'По приоритету' },
]

