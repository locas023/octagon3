import {readFile} from 'node:fs/promises'
import {transpileModule} from 'typescript'
export async function seedFixtures(sql,hash){
 const source=await readFile(new URL('../server/utils/mock-data.ts',import.meta.url),'utf8')
 const js=transpileModule(source,{compilerOptions:{module:99}}).outputText
 const fixtures=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'))
 for(const user of fixtures.users)await sql`INSERT INTO users(id,data,password_hash) VALUES(${user.id},${sql.json(user)},${hash}) ON CONFLICT DO NOTHING`
 for(const table of ['customers','categories'])for(const item of fixtures[table])await sql`INSERT INTO ${sql(table)}(id,data) VALUES(${item.id},${sql.json(item)}) ON CONFLICT DO NOTHING`
 for(const original of fixtures.requests){
  const item={...original,customerId:original.customerId==='c-vector'?'client':original.customerId}
  await sql`INSERT INTO requests(id,data) VALUES(${item.id},${sql.json(item)}) ON CONFLICT DO NOTHING`
  for(const comment of item.comments)await sql`INSERT INTO comments(id,request_id,data) VALUES(${comment.id},${item.id},${sql.json(comment)}) ON CONFLICT DO NOTHING`
 }
 await sql`SELECT setval(pg_get_serial_sequence('requests','id'),GREATEST((SELECT max(id) FROM requests),1))`
}
