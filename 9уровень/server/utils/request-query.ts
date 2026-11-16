import type {
  ApiRequestListItem,
  AssignmentFilter,
  RequestListQuery,
  SortOption,
} from '#shared/types/api'
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PRIORITY_WEIGHT,
  isRequestPriority,
  isRequestStatus,
} from '#shared/utils/request-rules'

const ASSIGNMENTS: readonly AssignmentFilter[] = ['all', 'assigned', 'unassigned']
const SORTS: readonly SortOption[] = ['newest', 'oldest', 'priority']

function toPositiveInt(value: unknown, fallback: number, max = Number.MAX_SAFE_INTEGER): number {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.min(parsed, max)
}

/** Разбор query-параметров списка. Некорректные значения игнорируются. */
export function parseRequestListQuery(query: Record<string, unknown>): Required<Omit<RequestListQuery, 'status' | 'priority' | 'simulate'>> & Pick<RequestListQuery, 'status' | 'priority'> {
  const assignment = ASSIGNMENTS.find((value) => value === query.assignment) ?? 'all'
  const sort = SORTS.find((value) => value === query.sort) ?? 'newest'

  return {
    archive: query.archive === 'archived' ? 'archived' : 'active',
    q: typeof query.q === 'string' ? query.q.trim().slice(0, 100) : '',
    status: isRequestStatus(query.status) ? query.status : undefined,
    priority: isRequestPriority(query.priority) ? query.priority : undefined,
    assignment,
    sort,
    page: toPositiveInt(query.page, 1),
    pageSize: toPositiveInt(query.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
  }
}

type ParsedQuery = ReturnType<typeof parseRequestListQuery>

export function filterAndSort<T extends ApiRequestListItem>(list: T[], query: ParsedQuery): T[] {
  const needle = query.q.toLowerCase().replace(/^#/, '')

  return list
    .filter((item) => {
      if (query.status && item.status !== query.status) return false
      if (query.priority && item.priority !== query.priority) return false
      if (query.assignment === 'assigned' && !item.assigneeId) return false
      if (query.assignment === 'unassigned' && item.assigneeId) return false
      if (!needle) return true
      return String(item.id).includes(needle) || (item.title ?? '').toLowerCase().includes(needle)
    })
    .sort((a, b) => {
      if (query.sort === 'priority') {
        const diff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
        if (diff !== 0) return diff
      }
      const time = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return query.sort === 'oldest' ? -time : time
    })
}
