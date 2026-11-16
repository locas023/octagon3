import { z } from 'zod'
import { analyticsReport } from '../../services/analytics'
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>Number.isFinite(Date.parse(value))&&new Date(value).toISOString().startsWith(value))
export default defineEventHandler(async event=>{
  await requireAdmin(event)
  const parsed=z.object({from:date.optional(),to:date.optional()}).safeParse(getQuery(event))
  if(!parsed.success)throw createError({statusCode:422,message:'Период должен содержать корректные даты ГГГГ-ММ-ДД'})
  const {from,to}=parsed.data
  if(from&&to&&from>to)throw createError({statusCode:422,message:'Начало периода позже окончания'})
  return analyticsReport(from?new Date(from).toISOString():null,to?new Date(Date.parse(to)+86400000).toISOString():null)
})
