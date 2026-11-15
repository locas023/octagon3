export default defineEventHandler(async event => {
  const user=await requireUser(event)
  const item=await findRequest(event)
  const body = await readBody<{ text: string; key: string }>(event)
  if (!body.text?.trim() || body.text.length > 5000 || !body.key) throw createError({ statusCode: 422, statusMessage: 'Введите комментарий до 5000 символов' })
  const comment = { id: body.key, text: body.text.trim(), authorId: user.id, createdAt: new Date().toISOString() }
  const sql=database()
  await sql`INSERT INTO comments(id,request_id,data) VALUES(${body.key},${item.id},${sql.json(comment)}) ON CONFLICT(id) DO NOTHING`
  const rows=await sql`SELECT data FROM comments WHERE id=${body.key} AND request_id=${item.id}`
  if(!rows[0]) throw createError({statusCode:409})
  return rows[0].data
})
