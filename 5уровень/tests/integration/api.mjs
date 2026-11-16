import assert from 'node:assert/strict'
const base=process.env.TEST_URL || 'http://127.0.0.1:3005'
async function request(path,options={}) {const r=await fetch(base+path,options); return {status:r.status, data:await r.json(), cookie:r.headers.get('set-cookie')?.split(';')[0]}}
const json=(body,cookie)=>({method:'POST',headers:{'content-type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(body)})
assert.equal((await request('/api/requests')).status,401)
const login=await request('/api/auth/login',json({email:'operator@workflow.demo',password:'WorkflowDemo2026!'}));assert.equal(login.status,200)
const cookie=login.cookie
const created=await request('/api/requests',json({title:'Integration request'},cookie));assert.equal(created.status,201)
const path=`/api/requests/${created.data.id}`
const key=crypto.randomUUID()
await Promise.all([request(path+'/comments',json({text:'one',key},cookie)),request(path+'/comments',json({text:'one',key},cookie))])
const detail=await request(path,{headers:{cookie}});assert.equal(detail.data.comments.filter(c=>c.id===key).length,1)
const updated=await request(path,{...json({priority:'high'},cookie),method:'PATCH'});assert.equal(updated.status,200);assert.equal(updated.data.comments.filter(c=>c.id===key).length,1)
const invalid=await request(path,{...json({status:'closed'},cookie),method:'PATCH'});assert.equal(invalid.status,409)
const client=await request('/api/auth/login',json({email:'client@workflow.demo',password:'WorkflowDemo2026!'}));assert.equal((await request(path,{headers:{cookie:client.cookie}})).status,404)
await request('/api/auth/logout',json({},cookie));assert.equal((await request(path,{headers:{cookie}})).status,401)
console.log('PASS: auth, create, duplicate comment, transition, ownership, logout')
