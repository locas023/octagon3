export default defineEventHandler(async event=>{await requireAdmin(event);return database()`SELECT priority,response_minutes,resolution_minutes FROM sla ORDER BY resolution_minutes`})
