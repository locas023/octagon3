export default defineEventHandler(async event=>{
 const user=await requireUser(event)
 const rows=await database()`SELECT id,message,request_id,created_at,read_at FROM notifications WHERE user_id=${user.id} ORDER BY created_at DESC LIMIT 100`
 return rows.map(row=>({...row,request_id:Number(row.request_id)}))
})
