import { database } from '../utils/database'
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import type { ApiUser } from '#shared/types/api'
export function passwordHash(password: string) { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password,salt,64).toString('hex')}` }
export function passwordMatches(password: string, hash: string) { const [salt, digest] = hash.split(':'); if (!salt || !digest) return false; const expected=Buffer.from(digest,'hex'); const actual=scryptSync(password,salt,64); return expected.length===actual.length && timingSafeEqual(expected,actual) }
export function sessionHash(token: string) { return createHash('sha256').update(token).digest('hex') }
export async function requireUser(event: H3Event): Promise<ApiUser> {
  const token = getCookie(event,'workflow-session')
  if (!token) throw createError({ statusCode:401, statusMessage:'Требуется вход' })
  const rows = await database()`SELECT u.data FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=${sessionHash(token)} AND s.expires_at>now()`
  const user = rows[0]?.data as ApiUser | undefined
  if (!user?.active) throw createError({ statusCode:401, statusMessage:'Сессия истекла' })
  return user
}
export function canRead(user: ApiUser, request: { customerId?: string | null; assigneeId?: string | null }) { return user.role==='admin' || user.role==='operator' || (user.role==='agent' ? request.assigneeId===user.id : request.customerId===user.id) }
