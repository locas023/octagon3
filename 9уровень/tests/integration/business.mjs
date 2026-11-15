import assert from 'node:assert/strict'
const base=process.env.TEST_URL||'http://127.0.0.1:3008'
async function login(role){const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:`${role}@workflow.demo`,password:'WorkflowDemo2026!'})});assert.equal(r.status,200);return r.headers.get('set-cookie').split(';')[0]}
const admin=await login('admin'),agent=await login('agent'),operator=await login('operator')
assert.equal((await fetch(base+'/api/admin/sla',{headers:{cookie:agent}})).status,403)
assert.equal((await fetch(base+'/api/admin/sla',{headers:{cookie:admin}})).status,200)
const create=await fetch(base+'/api/requests',{method:'POST',headers:{cookie:operator,'content-type':'application/json'},body:JSON.stringify({title:'SLA test',priority:'critical'})});const item=await create.json();assert.ok(item.dueAt)
const patch=async body=>fetch(base+`/api/requests/${item.id}`,{method:'PATCH',headers:{cookie:operator,'content-type':'application/json'},body:JSON.stringify(body)})
assert.equal((await patch({status:'assigned',assigneeId:'agent'})).status,200)
assert.equal((await patch({status:'in_progress'})).status,200)
assert.equal((await patch({status:'escalated'})).status,422)
assert.equal((await patch({status:'escalated',reason:'Нужна помощь эксперта'})).status,200)
const notifications=await fetch(base+'/api/notifications',{headers:{cookie:admin}}).then(r=>r.json());assert.ok(notifications.some(n=>n.request_id===item.id))
const upload=async(name,type,bytes)=>{const body=new FormData();body.append('file',new Blob([bytes],{type}),name);return fetch(base+`/api/requests/${item.id}/attachments`,{method:'POST',headers:{cookie:operator},body})}
assert.equal((await upload('bad.pdf','application/pdf','not a PDF')).status,415)
for(let i=0;i<5;i++)assert.equal((await upload(`test${i}.pdf`,'application/pdf','%PDF-1.4\n%%EOF')).status,200)
assert.equal((await upload('six.pdf','application/pdf','%PDF-1.4\n%%EOF')).status,422)
console.log('PASS: admin permissions, SLA deadline, escalation reason, notifications, attachment signature/count')
