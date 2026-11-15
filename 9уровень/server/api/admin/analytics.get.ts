import type { ApiRequest } from '#shared/types/api'
export default defineEventHandler(async event=>{
 await requireAdmin(event)
 const rows=await database()`SELECT data FROM requests`
 const list=rows.map(row=>row.data as ApiRequest)
 const statuses=Object.fromEntries(['new','assigned','in_progress','waiting','resolved','closed','escalated'].map(status=>[status,list.filter(r=>r.status===status).length]))
 const agents=await database()`SELECT data FROM users WHERE data->>'role'='agent'`
 const due=list.filter(r=>r.dueAt)
 return {total:list.length,statuses,slaPercent:due.length?Math.round(100*due.filter(r=>new Date(r.dueAt!).getTime()>=Date.now()).length/due.length):null,agents:agents.map(row=>({name:row.data.name,count:list.filter(r=>r.assigneeId===row.data.id&&!['resolved','closed'].includes(r.status)).length}))}
})
