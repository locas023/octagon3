import { readFile, writeFile } from 'node:fs/promises'
import { transpileModule } from 'typescript'

const source = await readFile(new URL('../server/utils/mock-data.ts', import.meta.url), 'utf8')
const js = transpileModule(source, { compilerOptions: { module: 99 } }).outputText
const { users, customers, categories, requests } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
await writeFile(new URL('../database/fixtures.json', import.meta.url), JSON.stringify({ users, customers, categories, requests }))
