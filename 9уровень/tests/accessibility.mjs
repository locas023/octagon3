import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdir,writeFile } from 'node:fs/promises'

const base=process.env.TEST_URL||'http://127.0.0.1:3019'
const browser=await chromium.launch({channel:'msedge'})
const results=[]
await mkdir('docs/audit/screenshots',{recursive:true})
try{
 for(const role of ['public','client','operator','agent','admin']){
  const context=await browser.newContext()
  if(role!=='public'){
   const login=await context.request.post(base+'/api/auth/login',{data:{email:`${role}@workflow.demo`,password:'WorkflowDemo2026!'}})
   if(login.status()!==200)throw new Error(`Login failed: ${role}`)
  }
  const page=await context.newPage()
  let paths=role==='public'?['/','/faq','/help','/articles','/articles/first-request','/login','/register']:['/dashboard','/requests','/profile','/notifications']
  if(role!=='public'){
   const list=await context.request.get(base+'/api/requests?pageSize=1').then(r=>r.json())
   if(list.items[0])paths.push(`/requests/${list.items[0].id}`)
   if(role!=='agent')paths.push('/new-request')
   if(role==='admin')paths.push('/admin/users','/admin/customers','/admin/categories','/admin/sla','/admin/analytics')
  }
  for(const path of paths){
   let violations=[]
   const overflow=[]
   for(const width of [360,768,1280]){
    await page.setViewportSize({width,height:900})
    await page.goto(base+path)
    await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
    await page.evaluate(()=>document.fonts.ready)
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))overflow.push(width)
    if(width===1280){
     const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
     violations=audit.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))
    }
    if(width!==768){
     const name=`${role}-${path.replaceAll('/','_')||'home'}-${width}.png`
     await page.screenshot({path:`docs/audit/screenshots/${name}`,fullPage:true})
    }
   }
   results.push({role,path,overflow,violations})
   console.log(`${role} ${path}: overflow=${overflow.join(',')||'none'} axe=${violations.map(v=>v.id).join(',')||'pass'}`)
  }
  await context.close()
 }
}finally{await browser.close();await writeFile('docs/audit/accessibility.json',JSON.stringify(results,null,2))}
if(results.some(row=>row.overflow.length||row.violations.length))process.exitCode=1
