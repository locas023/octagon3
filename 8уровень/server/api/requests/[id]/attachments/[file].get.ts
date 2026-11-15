export default defineEventHandler(async event=>{
 const item=await findRequest(event)
 const rows=await database()`SELECT name,mime,body FROM attachments WHERE id=${getRouterParam(event,'file')||''} AND request_id=${item.id}`
 if(!rows[0])throw createError({statusCode:404})
 setHeader(event,'content-type',rows[0].mime);setHeader(event,'content-disposition',`attachment; filename*=UTF-8''${encodeURIComponent(rows[0].name)}`);setHeader(event,'x-content-type-options','nosniff');return rows[0].body
})
