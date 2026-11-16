import { z } from 'zod'
export default defineEventHandler(async event=> {
  const user=await requireUser(event)
  if(user.role==='agent')throw createError({statusCode:403,message:'Создание доступно клиенту, оператору или администратору'})
  const parsed=z.object({title:z.string().trim().min(3).max(300),description:z.string().max(10000).default(''),categoryId:z.string().optional(),customerId:z.string().optional(),priority:z.enum(['critical','high','normal','low']).default('normal')}).strict().safeParse(await readBody(event))
  if(!parsed.success)throw createError({statusCode:422,message:'Проверьте тему, описание и приоритет'})
  const body=parsed.data
  const item=await database().begin(async sql=>{
    if(body.categoryId&&!(await sql`SELECT id FROM categories WHERE id=${body.categoryId} AND COALESCE((data->>'active')::boolean,true)`).length)throw createError({statusCode:422,message:'Категория недоступна'})
    const customerId=user.role==='client'?user.id:body.customerId
    if(customerId&&!(await sql`SELECT id FROM customers WHERE id=${customerId}`).length)throw createError({statusCode:422,message:'Клиент не найден'})
    const sequence=await sql`SELECT nextval(pg_get_serial_sequence('requests','id')) AS id`
    const id=Number(sequence[0]!.id),createdAt=new Date().toISOString()
    const policy=await sql`SELECT resolution_minutes FROM sla WHERE priority=${body.priority}`
    const dueAt=new Date(Date.now()+Number(policy[0]?.resolution_minutes||1440)*60000).toISOString()
    const change={id:crypto.randomUUID(),type:'created' as const,actorId:user.id,createdAt}
    const result={...body,id,customerId,status:'new' as const,createdAt,dueAt,comments:[],timeline:[change]}
    await sql`INSERT INTO requests(id,data) VALUES(${id},${sql.json(result)})`
    await sql`INSERT INTO request_events(id,request_id,kind,actor_id,occurred_at,deadline_at) VALUES(${change.id},${id},'created',${user.id},${createdAt},${dueAt})`
    return result
  })
  setResponseStatus(event,201)
  return item
})
