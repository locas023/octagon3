import type { ApiRequest, ApiUser, Paginated, ApiRequestListItem } from '#shared/types/api'
import { database } from '../utils/database'
import type { parseRequestListQuery } from '../utils/request-query'

/** All predicates, ordering and pagination are applied by PostgreSQL. */
export async function requestPage(user: ApiUser, query: ReturnType<typeof parseRequestListQuery>): Promise<Paginated<ApiRequestListItem>> {
  const sql = database()
  if (query.archive === 'archived' && user.role !== 'admin') throw createError({ statusCode: 403, message: 'Архив доступен администратору' })
  const access = user.role === 'client' ? sql`data->>'customerId'=${user.id}` : user.role === 'agent' ? sql`data->>'assigneeId'=${user.id}` : sql`true`
  const needle = query.q.replace(/^#/, '').toLowerCase()
  const where = sql`${access} AND (${query.archive === 'archived'} = (archived_at IS NOT NULL))
    AND (${!query.status} OR data->>'status'=${query.status || ''})
    AND (${!query.priority} OR data->>'priority'=${query.priority || ''})
    AND (${query.assignment === 'all'} OR (${query.assignment === 'assigned'} AND NULLIF(data->>'assigneeId','') IS NOT NULL) OR (${query.assignment === 'unassigned'} AND NULLIF(data->>'assigneeId','') IS NULL))
    AND (${!needle} OR position(${needle} in lower(COALESCE(data->>'title','')))>0 OR position(${needle} in id::text)>0)`
  const order = query.sort === 'oldest' ? sql`data->>'createdAt' ASC,id ASC` : query.sort === 'priority' ? sql`CASE data->>'priority' WHEN 'critical' THEN 4 WHEN 'high' THEN 3 WHEN 'normal' THEN 2 ELSE 1 END DESC,data->>'createdAt' DESC,id DESC` : sql`data->>'createdAt' DESC,id DESC`
  // One statement gives count and page a consistent snapshot, including empty pages.
  const rows = await sql`WITH selected AS (SELECT id,data FROM requests WHERE ${where}), page AS (SELECT data FROM selected ORDER BY ${order} LIMIT ${query.pageSize} OFFSET ${(query.page - 1) * query.pageSize}) SELECT (SELECT count(*)::int FROM selected) AS total,COALESCE((SELECT jsonb_agg(data) FROM page),'[]'::jsonb) AS items`
  const items = (rows[0]!.items as ApiRequest[]).map(({ comments: _comments, timeline: _timeline, description: _description, ...item }) => item)
  return { items, total: rows[0]!.total, page: query.page, pageSize: query.pageSize }
}
