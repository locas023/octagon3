import type { RequestStatus, UserRole } from '../types/api'
const transitions: Record<RequestStatus, RequestStatus[]> = { new:['assigned'], assigned:['in_progress'], in_progress:['waiting','resolved','escalated'], waiting:['in_progress'], resolved:['closed','in_progress'], closed:[], escalated:['assigned','in_progress','resolved'] }
export function allowedTransition(role: UserRole, from: RequestStatus, to: RequestStatus) {
  if (from===to) return true
  if (role==='client') return from==='resolved' && to==='closed'
  if (role==='agent' && (to==='assigned' || to==='closed')) return false
  return transitions[from].includes(to)
}

