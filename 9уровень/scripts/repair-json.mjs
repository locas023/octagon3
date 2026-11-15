import postgres from 'postgres'
process.loadEnvFile('.env')
const sql=postgres(process.env.DATABASE_URL)
const rows=await sql`SELECT id,data FROM requests WHERE jsonb_typeof(data)='string'`
for(const row of rows){const parsed=JSON.parse(row.data);if(parsed && typeof parsed==='object' && Number(parsed.id)===Number(row.id))await sql`UPDATE requests SET data=${sql.json(parsed)} WHERE id=${row.id}`}
console.log(`Восстановлено записей после проверки JSONB: ${rows.length}`)
await sql.end()
