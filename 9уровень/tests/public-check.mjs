import {chromium} from '@playwright/test'
import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
const base=process.env.TEST_URL||'http://127.0.0.1:3009'
const browser=await chromium.launch({channel:'msedge'})
const page=await browser.newPage()
const errors=[]
page.on('console',message=>{if(/hydration/i.test(message.text()))errors.push(message.text())})
page.on('pageerror',error=>errors.push(error.message))
const report=[]
for(const path of ['/','/faq','/help','/articles','/articles/first-request']){
 const t=performance.now(),response=await fetch(base+path),html=await response.text()
 assert.equal(response.status,200);assert.ok(html.includes('<h1'));assert.ok(html.includes('rel="canonical"')||html.includes('rel="canonical"'))
 const row={path,htmlBytes:Buffer.byteLength(html),requestMs:Math.round(performance.now()-t),widths:[]}
 for(const width of [360,768,1280]){
  await page.setViewportSize({width,height:900});await page.goto(base+path);await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)
  assert.equal(overflow,false,`${path}: overflow at ${width}`);row.widths.push(width)
 }
 report.push(row)
}
assert.equal((await fetch(base+'/articles/missing')).status,404)
assert.equal(errors.length,0,errors.join('\n'))
await mkdir('docs/screenshots',{recursive:true})
await page.goto(base+'/faq');await page.screenshot({path:'docs/screenshots/faq.png',fullPage:true})
await writeFile('docs/performance-results.json',JSON.stringify({environment:'local production, Edge',pages:report,hydrationErrors:errors},null,2))
await browser.close()
console.log(JSON.stringify(report))
