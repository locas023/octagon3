import postgres from 'postgres'
let connection: ReturnType<typeof postgres> | undefined
export function database() {
  if (!process.env.DATABASE_URL) throw createError({ statusCode: 503, statusMessage: 'DATABASE_URL не настроен' })
  return connection ??= postgres(process.env.DATABASE_URL, { max: 5 })
}
