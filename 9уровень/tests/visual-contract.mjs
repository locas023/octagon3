import {chromium,expect} from '@playwright/test'
import {mkdir,writeFile} from 'node:fs/promises'

// Geometry from the supplied 1280×900 Figma dashboard frames; data values vary.
const base=process.env.TEST_URL||'http://127.0.0.1:3019'
const browser=await chromium.launch({channel:'msedge'})
const results=[]
try{
 for(const [role,frame] of [['operator','1:38199'],['client','1:38270'],['agent','1:38244'],['admin','1:38296']]){
  const context=await browser.newContext({viewport:{width:1280,height:900}})
  expect((await context.request.post(base+'/api/auth/login',{data:{email:`${role}@workflow.demo`,password:'WorkflowDemo2026!'}})).status()).toBe(200)
  const page=await context.newPage()
  await page.goto(base+'/dashboard')
  await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
  await page.locator('table').waitFor()
  await page.evaluate(()=>document.fonts.ready)
  const geometry=await page.evaluate(()=>{
   const box=s=>{const e=document.querySelector(s),r=e?.getBoundingClientRect();return r?{x:r.x,y:r.y,width:r.width,height:r.height}:null}
   return {header:box('header'),title:box('h1'),card:box('.stat'),recent:box('.recent__title'),button:box('.recent__all'),table:box('.table-wrap'),head:box('thead'),row:box('tbody tr'),cards:document.querySelectorAll('.stat').length,titleFont:getComputedStyle(document.querySelector('h1')).fontSize}
  })
  console.log(role,JSON.stringify(geometry))
  const near=(actual,expected)=>expect(Math.abs(actual-expected)).toBeLessThanOrEqual(1)
  near(geometry.header.height,80);near(geometry.title.x,64);near(geometry.title.y,104)
  expect(geometry.titleFont).toBe('28px');near(geometry.table.width,1152)
  near(geometry.head.height,48);near(geometry.row.height,54)
  expect(geometry.cards).toBe(role==='operator'?4:0)
  if(role==='operator'){
   for(const [key,value] of Object.entries({x:64,y:208,width:276,height:154}))near(geometry.card[key],value)
   near(geometry.recent.y,386);near(geometry.button.y,438);near(geometry.table.y,502)
  }
  await mkdir('docs/screenshots',{recursive:true})
  await page.screenshot({path:`docs/screenshots/dashboard-${role}.png`,fullPage:true})
  results.push({role,frame,viewport:'1280×900',geometry})
  console.log(`PASS: ${role} dashboard geometry, Figma ${frame}`)
  await context.close()
 }
 await writeFile('docs/audit/visual.json',JSON.stringify({scope:'Four dashboard frames; geometric checks, not a pixel diff of every state',results},null,2))
}finally{await browser.close()}
