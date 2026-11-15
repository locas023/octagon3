import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import type { RequestListQuery } from '#shared/types/api'
import type { AssignmentFilter, RequestFilters, SortOption } from '~/types'
import { isRequestPriority, isRequestStatus } from '#shared/utils/request-rules'

export const DEFAULT_FILTERS: RequestFilters = {
  q: '',
  status: 'all',
  priority: 'all',
  assignment: 'all',
  sort: 'newest',
  page: 1,
}

const ASSIGNMENTS: readonly AssignmentFilter[] = ['all', 'assigned', 'unassigned']
const SORTS: readonly SortOption[] = ['newest', 'oldest', 'priority']

function first(value: LocationQuery[string] | undefined): string | undefined {
  const item = Array.isArray(value) ? value[0] : value
  return typeof item === 'string' ? item : undefined
}

/** URL → фильтры. Неизвестные значения заменяются значениями по умолчанию. */
export function parseFilters(query: LocationQuery): RequestFilters {
  const status = first(query.status)
  const priority = first(query.priority)
  const assignment = first(query.assignment)
  const sort = first(query.sort)
  const page = Number.parseInt(first(query.page) ?? '', 10)

  return {
    q: first(query.q)?.slice(0, 100) ?? '',
    status: isRequestStatus(status) ? status : 'all',
    priority: isRequestPriority(priority) ? priority : 'all',
    assignment: ASSIGNMENTS.find((value) => value === assignment) ?? 'all',
    sort: SORTS.find((value) => value === sort) ?? 'newest',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

/** Фильтры → URL. Значения по умолчанию в URL не попадают, чтобы ссылки были короткими. */
export function serializeFilters(filters: RequestFilters): LocationQueryRaw {
  const query: LocationQueryRaw = {}
  if (filters.q.trim()) query.q = filters.q.trim()
  if (filters.status !== 'all') query.status = filters.status
  if (filters.priority !== 'all') query.priority = filters.priority
  if (filters.assignment !== 'all') query.assignment = filters.assignment
  if (filters.sort !== 'newest') query.sort = filters.sort
  if (filters.page > 1) query.page = String(filters.page)
  return query
}

/** Фильтры → параметры API. */
export function toApiQuery(filters: RequestFilters, pageSize: number): RequestListQuery {
  return {
    q: filters.q.trim() || undefined,
    status: filters.status === 'all' ? undefined : filters.status,
    priority: filters.priority === 'all' ? undefined : filters.priority,
    assignment: filters.assignment === 'all' ? undefined : filters.assignment,
    sort: filters.sort,
    page: filters.page,
    pageSize,
  }
}

export function hasActiveFilters(filters: RequestFilters): boolean {
  return (
    filters.q.trim() !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assignment !== 'all'
  )
}
