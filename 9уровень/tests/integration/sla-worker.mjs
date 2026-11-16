import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
const base=process.env.TEST_URL||'http://127.0.0.1:3019',docker=process.env.DOCKER_EXE||'docker'
const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'admin@workflow.demo',password:'WorkflowDemo2026!'})})
assert.equal(login.status,200)
const cookie=login.headers.get('set-cookie').split(';')[0]
const response=await fetch(base+'/api/requests',{method:'POST',headers:{cookie,'content-type':'application/json'},body:JSON.stringify({title:'Background SLA test',priority:'critical'})})
assert.equal(response.status,201)
const {id}=await response.json();assert.ok(Number.isSafeInteger(id))
// Inspect PostgreSQL directly: no notification GET can trigger generation.
const query=`SELECT count(*)::int FROM notifications WHERE request_id=${id} AND user_id='admin' AND id LIKE 'sla-%'`
let count=0
for(let attempt=0;attempt<15;attempt++){
 count=Number(execFileSync(docker,['compose','--env-file','.env.compose','-p','workflow-level9','exec','-T','db','psql','-U','workflow','-d','workflow','-tAc',query],{encoding:'utf8',windowsHide:true}).trim())
 if(count)break
 console.log('Waiting for next background SLA scan')
 await new Promise(resolve=>setTimeout(resolve,5000))
}
assert.equal(count,1,'Worker should persist one notification without a notification page request')
console.log('PASS: background SLA notification created without opening notifications')
