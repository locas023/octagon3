import type { H3Event } from 'h3'
import { z } from 'zod'
import { database } from '../utils/database'
import { requireUser } from './auth'
import { findRequest } from './requests'

export async function addComment(event:H3Event){
 const actor=await requireUser(event),item=await findRequest(event)
 if(item.archivedAt)throw createError({statusCode:409,message:'Архивная заявка доступна только для чтения'})
 const parsed=z.object({text:z.string().trim().min(1).max(5000),key:z.string().min(1).max(100)}).strict().safeParse(await readBody(event))
 if(!parsed.success)throw createError({statusCode:422,message:'Введите комментарий до 5000 символов'})
 const body=parsed.data,createdAt=new Date().toISOString()
 return database().begin(async sql=>{
  const locked=await sql`SELECT archived_at FROM requests WHERE id=${item.id} FOR UPDATE`
  if(locked[0]?.archived_at)throw createError({statusCode:409,message:'Архивная заявка доступна только для чтения'})
  const comment={id:body.key,text:body.text,authorId:actor.id,createdAt}
  const added=await sql`INSERT INTO comments(id,request_id,data) VALUES(${body.key},${item.id},${sql.json(comment)}) ON CONFLICT(id) DO NOTHING RETURNING id`
  if(added.length){
   const change={id:`comment-${body.key}`,type:'comment',actorId:actor.id,createdAt}
   await sql`UPDATE requests SET data=jsonb_set(data,'{timeline}',${sql.json([change])}||COALESCE(data->'timeline','[]'::jsonb)) WHERE id=${item.id}`
   await sql`INSERT INTO request_events(id,request_id,kind,actor_id,occurred_at) VALUES(${change.id},${item.id},'comment',${actor.id},${createdAt}) ON CONFLICT DO NOTHING`
  }
  const rows=await sql`SELECT data FROM comments WHERE id=${body.key} AND request_id=${item.id}`
  if(!rows[0])throw createError({statusCode:409,message:'Ключ комментария уже используется'})
  return rows[0].data
 })
}
