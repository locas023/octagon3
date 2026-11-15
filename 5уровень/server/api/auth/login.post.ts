import { randomBytes } from 'node:crypto'
import { z } from 'zod'
export default defineEventHandler(async event => {
  const parsed=z.object({ email:z.string().email(), password:z.string().min(6).max(200) }).safeParse(await readBody(event))
  if (!parsed.success) throw createError({statusCode:422,statusMessage:'Проверьте email и пароль'})
  const rows=await database()`SELECT data,password_hash FROM users WHERE lower(data->>'email')=${parsed.data.email.toLowerCase()}`
  if (!rows[0] || !passwordMatches(parsed.data.password,rows[0].password_hash) || !rows[0].data.active) throw createError({statusCode:401,statusMessage:'Неверный email или пароль'})
  const token=randomBytes(32).toString('hex')
  await database()`INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(${sessionHash(token)},${rows[0].data.id},now()+interval '12 hours')`
  setCookie(event,'workflow-session',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:43200})
  return rows[0].data
})
