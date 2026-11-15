export default defineEventHandler(async event => { await requireUser(event); const rows = await database()`SELECT data FROM customers`; return rows.map(row => row.data) })
