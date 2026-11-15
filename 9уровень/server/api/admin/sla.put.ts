import { z } from 'zod'
export default defineEventHandler(async event=>{
 await requireAdmin(event)
 const result=z.object({priority:z.enum(['critical','high','normal','low']),response_minutes:z.number().int().min(1).max(43200),resolution_minutes:z.number().int().min(1).max(43200)}).refine(v=>v.resolution_minutes>=v.response_minutes).safeParse(await readBody(event))
 if(!result.success)throw createError({statusCode:422,statusMessage:'Срок решения должен быть не меньше срока реакции; вводите минуты'})
 const v=result.data
 await database()`UPDATE sla SET response_minutes=${v.response_minutes},resolution_minutes=${v.resolution_minutes} WHERE priority=${v.priority}`
 return {ok:true}
})
