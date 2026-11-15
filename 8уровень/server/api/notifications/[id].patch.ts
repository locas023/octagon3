import { z } from 'zod'

export default defineEventHandler(async event => {
  const user = await requireUser(event)
  const input = z.object({ read: z.boolean() }).strict().safeParse(await readBody(event))
  if (!input.success) throw createError({ statusCode: 422, message: 'Укажите состояние уведомления.' })
  const rows = await database()`UPDATE notifications SET read_at=${input.data.read ? new Date() : null} WHERE id=${getRouterParam(event, 'id') || ''} AND user_id=${user.id} RETURNING id,read_at`
  if (!rows.length) throw createError({ statusCode: 404, message: 'Уведомление не найдено.' })
  return rows[0]
})
