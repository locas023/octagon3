export default defineEventHandler(async event=>{
 const user=await requireUser(event)
 const requests=await visibleRequests(event)
 const soon=requests.filter(r=>r.dueAt&&!['closed','resolved'].includes(r.status)&&new Date(r.dueAt).getTime()-Date.now()<3600000)
 for(const item of soon) {
   const id=`sla-${user.id}-${item.id}`
   await database()`INSERT INTO notifications(id,user_id,request_id,message) VALUES(${id},${user.id},${item.id},${`Приближается или просрочен SLA заявки #${item.id}`}) ON CONFLICT(id) DO NOTHING`
 }
 const rows=await database()`SELECT id,message,request_id,created_at,read_at FROM notifications WHERE user_id=${user.id} ORDER BY created_at DESC LIMIT 100`
 return rows.map(row=>({...row,request_id:Number(row.request_id)}))
})
