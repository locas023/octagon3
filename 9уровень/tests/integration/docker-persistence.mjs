import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const base = process.env.TEST_URL || 'http://127.0.0.1:3019'
const docker = process.env.DOCKER_EXE || 'docker'
const login = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'admin@workflow.demo', password: 'WorkflowDemo2026!' }) })
assert.equal(login.status, 200)
const cookie = login.headers.get('set-cookie').split(';')[0]
await login.arrayBuffer()
const created = await fetch(base + '/api/requests', { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify({ title: `Docker persistence ${crypto.randomUUID()}` }) })
assert.equal(created.status, 201)
const item = await created.json()
const options = { stdio: 'inherit', timeout: 120000, windowsHide: true }
execFileSync(docker, ['compose', '--env-file', '.env.compose', '-p', 'workflow-level9', 'down'], options)
execFileSync(docker, ['compose', '--env-file', '.env.compose', '-p', 'workflow-level9', 'up', '-d', '--wait', '--wait-timeout', '90'], options)
// Docker's Windows port proxy can reset a pooled connection across recreation.
// Retry transport failures only; authorization and content assertions stay strict.
let restored
for (let attempt = 0; attempt < 5; attempt++) {
  try {
    restored = await fetch(base + `/api/requests/${item.id}`, { headers: { cookie, connection: 'close' } })
    break
  } catch (error) {
    if (attempt === 4) throw error
    await new Promise(resolve => setTimeout(resolve, 300))
  }
}
assert.equal(restored.status, 200, 'Session and request should survive container recreation')
assert.equal((await restored.json()).title, item.title)
console.log('PASS: request and session persisted across Compose down/up without deleting volumes')
