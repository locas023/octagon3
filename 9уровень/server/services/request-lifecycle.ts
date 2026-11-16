import type { H3Event } from 'h3'
import type { ApiRequest } from '#shared/types/api'
import { z } from 'zod'
import { database } from '../utils/database'
import { requireUser } from './auth'
import { requireAdmin } from '../utils/admin'

export async function setArchived(event: H3Event) {
  const actor = await requireAdmin(event)
  const input = z.object({ archived: z.boolean() }).strict().safeParse(await readBody(event))
  if (!input.success) throw createError({ statusCode: 422, message: 'Укажите действие с архивом' })
  return database().begin(async sql => {
    const rows = await sql`SELECT data,archived_at FROM requests WHERE id=${Number(getRouterParam(event,'id'))||-1} FOR UPDATE`
    const item = rows[0]?.data as ApiRequest | undefined
    if (!item) throw createError({ statusCode: 404, message: 'Заявка не найдена' })
    const archived = input.data.archived
    if (archived && item.status !== 'closed') throw createError({ statusCode: 409, message: 'Архивировать можно только закрытую заявку' })
    if (Boolean(rows[0]!.archived_at) === archived) return { archivedAt: rows[0]!.archived_at?.toISOString() || null }
    const createdAt = new Date().toISOString()
    const change = { id: crypto.randomUUID(), type: archived ? 'archived' : 'restored', actorId: actor.id, createdAt }
    await sql`UPDATE requests SET archived_at=${archived?createdAt:null},archived_by=${archived?actor.id:null},data=jsonb_set(data,'{timeline}',${sql.json([change])}||COALESCE(data->'timeline','[]'::jsonb)),version=version+1 WHERE id=${item.id}`
    await sql`INSERT INTO request_events(id,request_id,kind,actor_id,occurred_at) VALUES(${change.id},${item.id},${change.type},${actor.id},${createdAt})`
    return { archivedAt: archived ? createdAt : null }
  })
}

export async function rateRequest(event: H3Event) {
  const actor = await requireUser(event)
  if (actor.role !== 'client') throw createError({ statusCode: 403, message: 'Оценку оставляет клиент' })
  const input = z.object({ score: z.number().int().min(1).max(5) }).strict().safeParse(await readBody(event))
  if (!input.success) throw createError({ statusCode: 422, message: 'Выберите оценку от 1 до 5' })
  return database().begin(async sql => {
    const rows = await sql`SELECT data,archived_at FROM requests WHERE id=${Number(getRouterParam(event,'id'))||-1} FOR UPDATE`
    const item = rows[0]?.data as ApiRequest | undefined
    if (!item || item.customerId !== actor.id || rows[0]?.archived_at) throw createError({ statusCode: 404, message: 'Заявка не найдена' })
    if (item.status !== 'closed') throw createError({ statusCode: 409, message: 'Оценить можно закрытую заявку' })
    const existing = await sql`SELECT score,created_at FROM request_ratings WHERE request_id=${item.id}`
    if (existing[0]) {
      if (existing[0].score !== input.data.score) throw createError({ statusCode: 409, message: 'Оценка уже сохранена' })
      return { score: existing[0].score, createdAt: existing[0].created_at.toISOString() }
    }
    const createdAt = new Date().toISOString()
    await sql`INSERT INTO request_ratings(request_id,user_id,score,created_at) VALUES(${item.id},${actor.id},${input.data.score},${createdAt})`
    const change = { id: crypto.randomUUID(), type: 'rated', actorId: actor.id, value: String(input.data.score), createdAt }
    await sql`UPDATE requests SET data=jsonb_set(data,'{timeline}',${sql.json([change])}||COALESCE(data->'timeline','[]'::jsonb)),version=version+1 WHERE id=${item.id}`
    await sql`INSERT INTO request_events(id,request_id,kind,actor_id,occurred_at) VALUES(${change.id},${item.id},'rated',${actor.id},${createdAt})`
    return { score: input.data.score, createdAt }
  })
}
