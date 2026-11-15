export default defineEventHandler(async event => { await requireUser(event); const rows = await database()`SELECT data FROM users`; return rows.map(row => row.data) })
