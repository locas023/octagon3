import { z } from 'zod'
export default defineEventHandler(async event=>{
 const actor=await requireUser(event)
 const parsed=z.object({name:z.string().trim().min(2).max(120),email:z.string().trim().email().max(254).transform(v=>v.toLowerCase())}).strict().safeParse(await readBody(event))
 if(!parsed.success)throw createError({statusCode:422,message:'Проверьте имя и email'})
 const sql=database()
 try{
  const rows=await sql`UPDATE users SET data=data||${sql.json(parsed.data)} WHERE id=${actor.id} RETURNING data`
  return rows[0]!.data
 }catch(error){if((error as {code?:string}).code==='23505')throw createError({statusCode:409,message:'Этот email уже используется'});throw error}
})
