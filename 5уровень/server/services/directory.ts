import type { H3Event } from 'h3'
import { z } from 'zod'
import { database } from '../utils/database'
import { requireAdmin } from '../utils/admin'
import { passwordHash } from '../utils/auth'

export type DirectoryKind='users'|'customers'|'categories'
const name=z.string().trim().min(2).max(200)
const role=z.enum(['client','operator','agent','admin'])
const userCreate=z.object({name,email:z.string().trim().email().max(254).transform(s=>s.toLowerCase()),role,password:z.string().min(10).max(200),active:z.boolean().default(true)}).strict()
const userUpdate=z.object({id:z.string().min(1),name:name.optional(),email:z.string().trim().email().max(254).transform(s=>s.toLowerCase()).optional(),role:role.optional(),active:z.boolean().optional()}).strict()
const entityCreate=z.object({name,active:z.boolean().default(true)}).strict()
const entityUpdate=entityCreate.partial().extend({id:z.string().min(1)}).strict()

export async function listDirectory(event:H3Event,kind:DirectoryKind){
 await requireAdmin(event)
 const sql=database(),rows=await sql`SELECT data FROM ${sql(kind)} ORDER BY lower(data->>'name')`
 return rows.map(row=>row.data)
}
export async function createDirectory(event:H3Event,kind:DirectoryKind){
 await requireAdmin(event)
 const input=await readBody(event)
 const parsed=(kind==='users'?userCreate:entityCreate).safeParse(input)
 if(!parsed.success)throw createError({statusCode:422,message:'Проверьте имя, email, роль и пароль (от 10 символов)'})
 try{
  const result=await database().begin(async sql=>{
   const id=crypto.randomUUID()
   if(kind==='users'){
    const user=userCreate.parse(parsed.data)
    const {password,...fields}=user
    const record={id,...fields}
    await sql`INSERT INTO users(id,data,password_hash) VALUES(${id},${sql.json(record)},${passwordHash(password)})`
    if(user.role==='client')await sql`INSERT INTO customers(id,data) VALUES(${id},${sql.json({id,name:user.name,active:true})})`
    return record
   }
   const record={id,...entityCreate.parse(parsed.data)}
   await sql`INSERT INTO ${sql(kind)}(id,data) VALUES(${id},${sql.json(record)})`
   return record
  })
  setResponseStatus(event,201)
  return result
 }catch(error){if((error as {code?:string}).code==='23505')throw createError({statusCode:409,message:'Этот email уже используется'});throw error}
}
export async function updateDirectory(event:H3Event,kind:DirectoryKind){
 const actor=await requireAdmin(event)
 const input=await readBody(event)
 const parsed=(kind==='users'?userUpdate:entityUpdate).safeParse(input)
 if(!parsed.success)throw createError({statusCode:422,message:'Проверьте изменённые поля'})
 const {id,...patch}=parsed.data
 if(kind==='users'&&id===actor.id&&(('active' in patch&&patch.active===false)||('role' in patch&&patch.role!=='admin')))throw createError({statusCode:422,message:'Нельзя лишить себя прав администратора'})
 const sql=database()
 try{
  return await sql.begin(async transaction=>{
   const rows=await transaction`UPDATE ${transaction(kind)} SET data=data||${transaction.json(patch)} WHERE id=${id} RETURNING data`
   if(!rows[0])throw createError({statusCode:404,message:'Запись не найдена'})
   if(kind==='users'){
    if('active' in patch&&patch.active===false)await transaction`DELETE FROM sessions WHERE user_id=${id}`
    if('role' in patch&&patch.role==='client')await transaction`INSERT INTO customers(id,data) VALUES(${id},${transaction.json({id,name:rows[0].data.name,active:true})}) ON CONFLICT DO NOTHING`
   }
   return rows[0].data
  })
 }catch(error){if((error as {code?:string}).code==='23505')throw createError({statusCode:409,message:'Этот email уже используется'});throw error}
}
export async function deleteDirectory(event:H3Event,kind:DirectoryKind){
 const actor=await requireAdmin(event)
 const id=getRouterParam(event,'id')||''
 if(kind==='users'&&id===actor.id)throw createError({statusCode:422,message:'Нельзя удалить текущий аккаунт'})
 return database().begin(async sql=>{
  const exists=await sql`SELECT id FROM ${sql(kind)} WHERE id=${id} FOR UPDATE`
  if(!exists[0])throw createError({statusCode:404,message:'Запись не найдена'})
  const used=kind==='categories'?await sql`SELECT id FROM requests WHERE data->>'categoryId'=${id} LIMIT 1`:await sql`SELECT id FROM requests WHERE data->>'assigneeId'=${id} OR data->>'customerId'=${id} LIMIT 1`
  if(used.length)throw createError({statusCode:409,message:'Запись используется в заявках. Деактивируйте её вместо удаления.'})
  if(kind==='customers'&&(await sql`SELECT id FROM users WHERE id=${id}`).length)throw createError({statusCode:409,message:'Клиент связан с аккаунтом'})
  if(kind==='users'){
   if((await sql`SELECT id FROM request_events WHERE actor_id=${id} LIMIT 1`).length)throw createError({statusCode:409,message:'Сохранена история действий пользователя; доступна деактивация'})
   await sql`DELETE FROM sessions WHERE user_id=${id}`
   await sql`DELETE FROM notifications WHERE user_id=${id}`
   await sql`DELETE FROM customers WHERE id=${id}`
  }
  await sql`DELETE FROM ${sql(kind)} WHERE id=${id}`
  return {ok:true}
 })
}
