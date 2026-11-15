import { z } from 'zod'
export default defineEventHandler(async event=> {
  const user=await requireUser(event)
  const parsed=z.object({title:z.string().trim().min(3).max(300),description:z.string().max(10000).default(''),categoryId:z.string().optional(),customerId:z.string().optional(),priority:z.enum(['critical','high','normal','low']).default('normal')}).safeParse(await readBody(event))
  if(!parsed.success) throw createError({statusCode:422,statusMessage:'Введите тему от 3 до 300 символов'})
  const body=parsed.data, sql=database()
  const item={...body,id:0,customerId:user.role==='client'?user.id:body.customerId,status:'new',createdAt:new Date().toISOString(),comments:[],timeline:[{id:crypto.randomUUID(),type:'created',actorId:user.id,createdAt:new Date().toISOString()}]}
  const sla=await sql`SELECT resolution_minutes FROM sla WHERE priority=${item.priority}`
  Object.assign(item,{dueAt:new Date(Date.now()+Number(sla[0]?.resolution_minutes||1440)*60000).toISOString()})
  const result=await sql`INSERT INTO requests(data) VALUES(${sql.json(item)}) RETURNING id`
  item.id=Number(result[0]!.id)
  await sql`UPDATE requests SET data=${sql.json(item)} WHERE id=${item.id}`
  setResponseStatus(event,201)
  return item
})

