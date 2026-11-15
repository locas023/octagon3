import {seedFixtures} from './seed-fixtures.mjs'
import postgres from 'postgres'
import { readFile } from 'node:fs/promises'
import { scryptSync, randomBytes } from 'node:crypto'
try { process.loadEnvFile('.env') } catch { process.loadEnvFile('../.env') }
if(!process.env.DATABASE_URL) throw new Error('Создайте .env с DATABASE_URL')
const target=new URL(process.env.DATABASE_URL)
const dbName=decodeURIComponent(target.pathname.slice(1))
if(!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(dbName)) throw new Error('Используйте простое имя базы')
const maintenance=new URL(target); maintenance.pathname='/postgres'
const admin=postgres(maintenance.toString())
if(!(await admin`SELECT 1 FROM pg_database WHERE datname=${dbName}`).length) await admin.unsafe(`CREATE DATABASE "${dbName}"`)
await admin.end()
const sql=postgres(process.env.DATABASE_URL)
await sql.unsafe(await readFile(new URL('../database/001-initial.sql',import.meta.url),'utf8'))
const salt=randomBytes(16).toString('hex')
const hash=`${salt}:${scryptSync('WorkflowDemo2026!',salt,64).toString('hex')}`
for(const role of ['admin','operator','agent','client']) {
  const user={id:role,name:`Demo ${role}`,email:`${role}@workflow.demo`,role,active:true}
  await sql`INSERT INTO users(id,data,password_hash) VALUES(${role},${sql.json(user)},${hash}) ON CONFLICT(id) DO NOTHING`
}
await sql`INSERT INTO customers(id,data) VALUES('client','{"id":"client","name":"Демо-компания"}') ON CONFLICT DO NOTHING`
await sql`INSERT INTO categories(id,data) VALUES('it','{"id":"it","name":"IT-поддержка"}') ON CONFLICT DO NOTHING`
await seedFixtures(sql,hash)
await sql.end()
console.log('Схема и demo accounts созданы. Пароль демо: WorkflowDemo2026!')

