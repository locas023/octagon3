import { z } from 'zod'

const registration = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(10).max(200),
}).strict()

export default defineEventHandler(async event => {
  const parsed = registration.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 422, message: 'Проверьте имя, компанию, email и пароль (не менее 10 символов).' })
  const input = parsed.data
  const id = crypto.randomUUID()
  const user = { id, name: input.name, email: input.email, role: 'client' as const, active: true }
  const hash = passwordHash(input.password)
  await database().begin(async sql => {
    // Transaction-scoped lock prevents two simultaneous registrations of one email.
    await sql`SELECT pg_advisory_xact_lock(hashtext(${input.email}))`
    const existing = await sql`SELECT id FROM users WHERE lower(data->>'email')=${input.email}`
    if (existing.length) throw createError({ statusCode: 409, message: 'Этот email уже зарегистрирован.' })
    await sql`INSERT INTO users(id,data,password_hash) VALUES(${id},${sql.json(user)},${hash})`
    await sql`INSERT INTO customers(id,data) VALUES(${id},${sql.json({ id, name: input.company })})`
  })
  setResponseStatus(event, 201)
  return { email: user.email }
})
