export default defineEventHandler(async event=>{const item=await findRequest(event);return database()`SELECT id,name,mime,octet_length(body) AS size FROM attachments WHERE request_id=${item.id}`})
