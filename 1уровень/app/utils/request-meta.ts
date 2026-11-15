import type {
  AssignmentFilter,
  RequestPriority,
  RequestStatus,
  SelectOption,
  SortOption,
  UserRole,
} from '~/types'

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'Новая',
  assigned: 'Назначена',
  in_progress: 'В работе',
  waiting: 'Ожидает',
  resolved: 'Решена',
  closed: 'Закрыта',
}

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  critical: 'Критический',
  high: 'Высокий',
  normal: 'Обычный',
  low: 'Низкий',
}

/** Вес приоритета для сортировки: больше — важнее. */
export const PRIORITY_WEIGHT: Record<RequestPriority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  operator: 'Оператор',
  executor: 'Исполнитель',
  client: 'Клиент',
  admin: 'Администратор',
}

export const STATUS_OPTIONS: SelectOption<RequestStatus | 'all'>[] = [
  { value: 'all', label: 'Все статусы' },
  ...(Object.keys(STATUS_LABELS) as RequestStatus[]).map((value) => ({
    value,
    label: STATUS_LABELS[value],
  })),
]

export const PRIORITY_OPTIONS: SelectOption<RequestPriority | 'all'>[] = [
  { value: 'all', label: 'Все приоритеты' },
  ...(Object.keys(PRIORITY_LABELS) as RequestPriority[]).map((value) => ({
    value,
    label: PRIORITY_LABELS[value],
  })),
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
