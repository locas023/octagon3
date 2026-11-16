import assert from 'node:assert/strict'
const base=process.env.TEST_URL||'http://127.0.0.1:3019'
async function login(role){const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:`${role}@workflow.demo`,password:'WorkflowDemo2026!'})});assert.equal(r.status,200);return r.headers.get('set-cookie').split(';')[0]}
const admin=await login('admin'),agent=await login('agent')
async function call(path,method='GET',body,cookie=admin){const r=await fetch(base+path,{method,headers:{cookie,...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()}}
for(const kind of ['users','customers','categories']){
 assert.equal((await call(`/api/admin/${kind}`,'GET',undefined,agent)).status,403)
 const body=kind==='users'?{name:'CRUD user',email:`crud-${crypto.randomUUID()}@workflow.demo`,password:'TestWorkflow2026!',role:'agent'}:{name:`CRUD ${kind}`}
 const created=await call(`/api/admin/${kind}`,'POST',body);assert.equal(created.status,201)
 const id=created.data.id
 assert.equal((await call(`/api/admin/${kind}`,'PATCH',{id,name:'Updated record',active:false})).status,200)
 assert.ok((await call(`/api/admin/${kind}`)).data.some(row=>row.id===id&&row.name==='Updated record'))
 assert.equal((await call(`/api/admin/${kind}/${id}`,'DELETE')).status,200)
 assert.equal((await call(`/api/admin/${kind}/${id}`,'DELETE')).status,404)
}
const created=await call('/api/requests','POST',{title:`Analytics ${crypto.randomUUID()}`,priority:'critical'})
assert.equal(created.status,201)
const id=created.data.id
for(const status of ['assigned','in_progress','resolved'])assert.equal((await call(`/api/requests/${id}`,'PATCH',{status,assigneeId:'agent',reason:'Integration resolution'})).status,200)
const report=await call('/api/admin/analytics');assert.equal(report.status,200);assert.ok(report.data.resolved>0);assert.ok(report.data.slaMeasured>0);assert.ok(report.data.averageResolutionMinutes>=0)
assert.equal((await call('/api/admin/analytics?from=2100-01-01&to=2100-01-02')).data.total,0)
assert.equal((await call('/api/admin/analytics?from=2026-12-01&to=2026-01-01')).status,422)
const detail=await call(`/api/requests/${id}`);assert.ok(detail.data.timeline.some(event=>event.reason==='Integration resolution'))
// Literal percent/underscore search must not act as wildcard syntax.
const marker=`literal%_unique_marker_${crypto.randomUUID()}`
const exact=await call('/api/requests','POST',{title:marker})
const found=await call('/api/requests?q='+encodeURIComponent(marker))
assert.equal(found.data.total,1);assert.equal(found.data.items[0].id,exact.data.id)
console.log('PASS: directory CRUD + permissions, history analytics + date period, reason persistence, literal SQL search')
