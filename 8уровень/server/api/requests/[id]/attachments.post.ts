import { Buffer } from 'node:buffer'
export default defineEventHandler(async event=>{
 const item=await findRequest(event)
 if(Number(getHeader(event,'content-length')||0)>5*1024*1024+65536)throw createError({statusCode:413,message:'Максимальный размер файла — 5 МБ'})
 const parts=await readMultipartFormData(event), file=parts?.find(part=>part.name==='file')
 if(!file?.filename || !file.type)throw createError({statusCode:422,message:'Выберите файл'})
 if(file.data.length>5*1024*1024)throw createError({statusCode:413,message:'Максимальный размер файла — 5 МБ'})
 const type=file.type
 const valid=type==='application/pdf'?file.data.subarray(0,5).toString()==='%PDF-':type==='image/png'?file.data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):type==='image/jpeg'?file.data[0]===255&&file.data[1]===216&&file.data[2]===255:false
 if(!valid)throw createError({statusCode:415,message:'Разрешены PDF, PNG и JPEG с корректным содержимым'})
 const name=file.filename.replace(/[\\/\x00-\x1f]/g,'_').slice(0,200)
 return database().begin(async sql=>{
  await sql`SELECT id FROM requests WHERE id=${item.id} FOR UPDATE`
  const count=await sql`SELECT count(*)::int AS count FROM attachments WHERE request_id=${item.id}`
  if(count[0]!.count>=5)throw createError({statusCode:422,message:'Не более 5 файлов на заявку'})
  const id=crypto.randomUUID()
  await sql`INSERT INTO attachments(id,request_id,name,mime,body) VALUES(${id},${item.id},${name},${type},${file.data})`
  return {id,name,mime:type,size:file.data.length}
 })
})
