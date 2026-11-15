export default defineEventHandler(async event=>{
 const user=await requireUser(event)
 const rows=await database()`SELECT id,message,request_id,created_at,read_at FROM notifications WHERE user_id=${user.id} ORDER BY created_at DESC LIMIT 100`
 const requests=await visibleRequests(event)
 const soon=requests.filter(r=>r.dueAt&&!['closed','resolved'].includes(r.status)&&new Date(r.dueAt).getTime()-Date.now()<3600000).map(r=>({id:`sla-${r.id}`,message:`Приближается или просрочен SLA заявки #${r.id}`,request_id:r.id,created_at:r.dueAt,read_at:null}))
 return [...rows,...soon]
})
