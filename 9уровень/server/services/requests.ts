import type { H3Event } from 'h3'
import type { ApiRequest, ApiComment } from '#shared/types/api'
import { allowedTransition } from '#shared/utils/transitions'
import { z } from 'zod'
export async function visibleRequests(event: H3Event) {
  const user=await requireUser(event)
  const sql=database()
  const access=user.role==='client'?sql`data->>'customerId'=${user.id}`:user.role==='agent'?sql`data->>'assigneeId'=${user.id}`:sql`true`
  const rows=await sql`SELECT data FROM requests WHERE ${access} AND archived_at IS NULL ORDER BY id DESC`
  return rows.map(row=>row.data as ApiRequest)
}
export async function findRequest(event: H3Event) {
  const user=await requireUser(event)
  const rows=await database()`SELECT data,archived_at FROM requests WHERE id=${Number(getRouterParam(event,'id')) || -1}`
  const item=rows[0]?.data as ApiRequest | undefined
  if(!item || !canRead(user,item) || (rows[0]?.archived_at && user.role!=='admin')) throw createError({statusCode:404,statusMessage:'Заявка не найдена'})
  const comments=await database()`SELECT data FROM comments WHERE request_id=${item.id} ORDER BY data->>'createdAt'`
  const ratings=await database()`SELECT score,created_at FROM request_ratings WHERE request_id=${item.id}`
  return { ...item, archivedAt:rows[0]?.archived_at?.toISOString()||null, rating:ratings[0]?{score:ratings[0].score,createdAt:ratings[0].created_at.toISOString()}:null, comments:comments.map(c=>c.data) } as ApiRequest
}
export async function patchRequest(event: H3Event) {
  const user=await requireUser(event)
  const input=z.object({priority:z.enum(['critical','high','normal','low']).optional(),status:z.enum(['new','assigned','in_progress','waiting','resolved','closed','escalated']).optional(),assigneeId:z.string().nullable().optional(),reason:z.string().max(5000).optional()}).strict().safeParse(await readBody(event))
  if(!input.success) throw createError({statusCode:422,statusMessage:'Проверьте параметры заявки'})
  const body=input.data
  return database().begin(async sql=> {
    const rows=await sql`SELECT data,archived_at FROM requests WHERE id=${Number(getRouterParam(event,'id')) || -1} FOR UPDATE`
    const item=rows[0]?.data as ApiRequest | undefined
    if(!item || !canRead(user,item)) throw createError({statusCode:404})
    if(rows[0]?.archived_at) throw createError({statusCode:user.role==='admin'?409:404,message:'Архивная заявка доступна только для чтения'})
    if(item.status==='closed' && (body.priority || body.assigneeId!==undefined || (body.status && body.status!=='closed'))) throw createError({statusCode:409,message:'Закрытая заявка доступна только для чтения'})
    if(user.role==='client' && (body.priority || body.assigneeId!==undefined || body.status!=='closed')) throw createError({statusCode:403})
    if(user.role==='agent' && (body.assigneeId!==undefined || body.priority)) throw createError({statusCode:403})
    if(body.status && !allowedTransition(user.role,item.status,body.status)) throw createError({statusCode:409,statusMessage:'Недопустимый переход статуса'})
    if(body.status && ['waiting','resolved','closed','escalated'].includes(body.status) && !body.reason?.trim()) throw createError({statusCode:422,statusMessage:'Укажите причину или результат решения'})
    if(body.assigneeId) {
      const agents=await sql`SELECT data FROM users WHERE id=${body.assigneeId}`
      if(!agents[0]?.data.active || agents[0].data.role!=='agent') throw createError({statusCode:422,statusMessage:'Исполнитель деактивирован или не является Agent'})
    }
    if(body.priority && body.priority!==item.priority) {
      const policy=await sql`SELECT resolution_minutes FROM sla WHERE priority=${body.priority}`
      item.dueAt=new Date(new Date(item.createdAt).getTime()+Number(policy[0]?.resolution_minutes||1440)*60000).toISOString()
    }
    for(const key of ['priority','status','assigneeId'] as const) if(body[key]!==undefined && body[key]!==item[key]) {
      const change={id:crypto.randomUUID(),type:key==='assigneeId'?'assigned' as const:key,actorId:user.id,value:body[key],createdAt:new Date().toISOString(),reason:body.reason?.trim()}
      item.timeline.unshift(change)
      await sql`INSERT INTO request_events(id,request_id,kind,status,actor_id,reason,occurred_at,deadline_at) VALUES(${change.id},${item.id},${change.type},${key==='status'?body.status!:null},${user.id},${change.reason||null},${change.createdAt},${item.dueAt||null})`
    }
    if((body.assigneeId && body.assigneeId!==item.assigneeId) || (body.status==='escalated'&&item.status!=='escalated')) {
      const targets=body.status==='escalated'?await sql`SELECT id FROM users WHERE data->>'role' IN ('operator','admin')`:[{id:body.assigneeId!}]
      for(const target of targets) await sql`INSERT INTO notifications(id,user_id,request_id,message) VALUES(${crypto.randomUUID()},${target.id},${item.id},${body.status==='escalated'?`Эскалация #${item.id}: ${body.reason}`:`Вам назначена заявка #${item.id}`})`
    }
    if(body.priority) item.priority=body.priority
    if(body.status) item.status=body.status
    if(body.assigneeId!==undefined) item.assigneeId=body.assigneeId
    const {rating:_rating,archivedAt:_archivedAt,...record}=item
    await sql`UPDATE requests SET data=${sql.json({ ...record, comments:item.comments.map(c=>({...c})), timeline:item.timeline.map(e=>({...e})) })}, version=version+1 WHERE id=${item.id}`
    const comments=await sql`SELECT data FROM comments WHERE request_id=${item.id} ORDER BY data->>'createdAt'`
    return {...item,comments:comments.map(row=>row.data as ApiComment)}
  })
}
