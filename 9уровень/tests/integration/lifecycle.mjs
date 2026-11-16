import assert from 'node:assert/strict'
const base=process.env.TEST_URL||'http://127.0.0.1:3019'
async function login(role){const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:`${role}@workflow.demo`,password:'WorkflowDemo2026!'})});assert.equal(r.status,200);return r.headers.get('set-cookie').split(';')[0]}
const [client,operator,agent,admin]=await Promise.all(['client','operator','agent','admin'].map(login))
async function call(path,method='GET',body,cookie=admin){const r=await fetch(base+path,{method,headers:{cookie,...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});return{status:r.status,data:await r.json()}}
const title=`Lifecycle ${crypto.randomUUID()}`
const created=await call('/api/requests','POST',{title},client);assert.equal(created.status,201)
const path=`/api/requests/${created.data.id}`
assert.equal((await call(path+'/archive','POST',{archived:true},operator)).status,403)
assert.equal((await call(path+'/archive','POST',{archived:true})).status,409)
assert.equal((await call(path+'/rating','POST',{score:5},client)).status,409)
assert.equal((await call(path+'/rating','POST',{score:0},client)).status,422)
assert.equal((await call(path+'/rating','POST',{score:5},agent)).status,403)
for(const status of ['assigned','in_progress','resolved'])assert.equal((await call(path,'PATCH',{status,assigneeId:'agent',reason:'Verified resolution'},operator)).status,200)
assert.equal((await call(path,'PATCH',{status:'closed',reason:'Подтверждаю решение'},client)).status,200)
assert.equal((await call(path+'/rating','POST',{score:5},client)).status,200)
assert.equal((await call(path+'/rating','POST',{score:5},client)).status,200)
assert.equal((await call(path+'/rating','POST',{score:4},client)).status,409)
assert.equal((await call(path,'PATCH',{priority:'high'})).status,409)
assert.equal((await call(path+'/archive','POST',{archived:true})).status,200)
assert.equal((await call(path+'/archive','POST',{archived:true})).status,200)
assert.equal((await call('/api/requests?q='+encodeURIComponent(title))).data.total,0)
assert.equal((await call('/api/requests?archive=archived&q='+encodeURIComponent(title))).data.total,1)
assert.equal((await call(path,'GET',undefined,client)).status,404)
assert.equal((await call('/api/requests?archive=archived','GET',undefined,client)).status,403)
assert.equal((await call(path,'PATCH',{priority:'low'})).status,409)
assert.equal((await call(path+'/comments','POST',{text:'Cannot edit archive',key:crypto.randomUUID()})).status,409)
const archived=await call(path);assert.ok(archived.data.archivedAt);assert.equal(archived.data.rating.score,5)
assert.equal(archived.data.timeline.filter(e=>e.type==='rated').length,1)
assert.equal(archived.data.timeline.filter(e=>e.type==='archived').length,1)
assert.equal((await call(path+'/archive','POST',{archived:false})).status,200)
assert.equal((await call('/api/requests?q='+encodeURIComponent(title))).data.total,1)
assert.equal((await call(path,'GET',undefined,client)).data.rating.score,5)
console.log('PASS: archive/restore permissions, read-only archive, closed-only rating, ownership, score bounds and idempotency')
