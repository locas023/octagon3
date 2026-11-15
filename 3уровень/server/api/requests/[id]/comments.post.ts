import { requests } from '../../../utils/mock-data'
export default defineEventHandler(async event => {
  const item = requests.find(r => r.id === Number(getRouterParam(event, 'id')))
  if (!item) throw createError({ statusCode: 404 })
  const body = await readBody<{ text: string; key: string }>(event)
  if (!body.text?.trim() || body.text.length > 5000 || !body.key) throw createError({ statusCode: 422, statusMessage: 'Введите комментарий до 5000 символов' })
  const previous = item.comments.find(c => c.id === body.key)
  if (previous) return previous
  const comment = { id: body.key, text: body.text.trim(), authorId: null, createdAt: new Date().toISOString() }
  item.comments.push(comment)
  item.timeline.unshift({ id: crypto.randomUUID(), type: 'comment', actorId: null, createdAt: comment.createdAt })
  return comment
})
