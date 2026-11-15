import { requests, users } from '../../utils/mock-data'
import type { RequestPriority, RequestStatus } from '#shared/types/api'
export default defineEventHandler(async event => {
  const item = requests.find(r => r.id === Number(getRouterParam(event, 'id')))
  if (!item) throw createError({ statusCode: 404 })
  const body = await readBody<{ priority?: RequestPriority; status?: RequestStatus; assigneeId?: string | null; simulate?: string }>(event)
  await new Promise(resolve => setTimeout(resolve, 500))
  if (body.simulate === '409' || body.simulate === '500') throw createError({ statusCode: Number(body.simulate), statusMessage: body.simulate === '409' ? 'Заявка изменена другим пользователем. Изменение отменено.' : 'Сервер недоступен. Изменение отменено.' })
  if (body.priority && !['critical','high','normal','low'].includes(body.priority)) throw createError({ statusCode: 422 })
  if (body.status && !['new','assigned','in_progress','waiting','resolved','closed'].includes(body.status)) throw createError({ statusCode: 422 })
  if (body.assigneeId && !users.some(u => u.id === body.assigneeId && u.active && u.role === 'agent')) throw createError({ statusCode: 422, statusMessage: 'Исполнитель недоступен' })
  for (const key of ['priority','status','assigneeId'] as const) {
    if (body[key] !== undefined && body[key] !== item[key]) {
      item.timeline.unshift({ id: crypto.randomUUID(), type: key === 'assigneeId' ? 'assigned' : key, actorId: null, value: body[key], createdAt: new Date().toISOString() })
    }
  }
  if (body.priority) item.priority = body.priority
  if (body.status) item.status = body.status
  if (body.assigneeId !== undefined) item.assigneeId = body.assigneeId
  return item
})
