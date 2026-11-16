import type { H3Event } from 'h3'
import type { ApiRequest } from '#shared/types/api'
import { allowedTransition } from '#shared/utils/transitions'
import { z } from 'zod'
export async function visibleRequests(event: H3Event) {
  const user=await requireUser(event)
  const rows=await database()`SELECT data FROM requests ORDER BY id DESC`
  return rows.map(row=>row.data as ApiRequest).filter(item=>canRead(user,item))
}
export async function findRequest(event: H3Event) {
  const user=await requireUser(event)
  const rows=await database()`SELECT data FROM requests WHERE id=${Number(getRouterParam(event,'id')) || -1}`
  const item=rows[0]?.data as ApiRequest | undefined
  if(!item || !canRead(user,item)) throw createError({statusCode:404,statusMessage:'Заявка не найдена'})
  const comments=await database()`SELECT data FROM comments WHERE request_id=${item.id} ORDER BY data->>'createdAt'`
  return { ...item, comments:comments.map(c=>c.data) } as ApiRequest
}
export async function patchRequest(event: H3Event) {
  const user=await requireUser(event)
  const input=z.object({priority:z.enum(['critical','high','normal','low']).optional(),status:z.enum(['new','assigned','in_progress','waiting','resolved','closed']).optional(),assigneeId:z.string().nullable().optional(),reason:z.string().max(5000).optional()}).strict().safeParse(await readBody(event))
  if(!input.success) throw createError({statusCode:422,statusMessage:'Проверьте параметры заявки'})
  const body=input.data
  return database().begin(async sql=> {
    const rows=await sql`SELECT data FROM requests WHERE id=${Number(getRouterParam(event,'id')) || -1} FOR UPDATE`
    const item=rows[0]?.data as ApiRequest | undefined
    if(!item || !canRead(user,item)) throw createError({statusCode:404})
    if(user.role==='client' && (body.priority || body.assigneeId!==undefined || body.status!=='closed')) throw createError({statusCode:403})
    if(user.role==='agent' && (body.assigneeId!==undefined || body.priority)) throw createError({statusCode:403})
    if(body.status && !allowedTransition(user.role,item.status,body.status)) throw createError({statusCode:409,statusMessage:'Недопустимый переход статуса'})
    if(body.status && ['waiting','resolved','closed'].includes(body.status) && !body.reason?.trim()) throw createError({statusCode:422,statusMessage:'Укажите причину или результат решения'})
    if(body.assigneeId) {
      const agents=await sql`SELECT data FROM users WHERE id=${body.assigneeId}`
      if(!agents[0]?.data.active || agents[0].data.role!=='agent') throw createError({statusCode:422,statusMessage:'Исполнитель деактивирован или не является Agent'})
    }
    for(const key of ['priority','status','assigneeId'] as const) if(body[key]!==undefined && body[key]!==item[key]) item.timeline.unshift({id:crypto.randomUUID(),type:key==='assigneeId'?'assigned':key,actorId:user.id,value:body[key],createdAt:new Date().toISOString()})
    if(body.priority) item.priority=body.priority
    if(body.status) item.status=body.status
    if(body.assigneeId!==undefined) item.assigneeId=body.assigneeId
    await sql`UPDATE requests SET data=${sql.json({ ...item, comments:item.comments.map(c=>({...c})), timeline:item.timeline.map(e=>({...e})) })}, version=version+1 WHERE id=${item.id}`
    const comments=await sql`SELECT data FROM comments WHERE request_id=${item.id} ORDER BY data->>'createdAt'`
    return {...item,comments:comments.map(row=>row.data as ApiRequest['comments'][number])}
  })
}
