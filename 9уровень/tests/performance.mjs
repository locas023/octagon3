import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import { mkdir,writeFile } from 'node:fs/promises'

const phase=process.argv[2]||'after'
if(!['before','after'].includes(phase))throw new Error('Use before or after')
const base=process.env.TEST_URL||'http://127.0.0.1:3019'
const chrome=await chromeLauncher.launch({chromePath:process.env.EDGE_PATH||'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',chromeFlags:['--headless','--disable-gpu','--no-first-run']})
const directory=`docs/performance/${phase}`
await mkdir(directory,{recursive:true})
const summaries=[]
try{
 for(const [name,path] of [['home','/'],['faq','/faq'],['help','/help']]){
  const result=await lighthouse(base+path,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo'],maxWaitForLoad:20000})
  const lhr=result.lhr,a=lhr.audits
  const row={name,url:base+path,version:lhr.lighthouseVersion,fetchTime:lhr.fetchTime,performance:lhr.categories.performance.score,LCP:a['largest-contentful-paint'].numericValue,FCP:a['first-contentful-paint'].numericValue,CLS:a['cumulative-layout-shift'].numericValue,TBT:a['total-blocking-time'].numericValue,transferBytes:a['total-byte-weight'].numericValue,accessibility:lhr.categories.accessibility.score}
  summaries.push(row)
  await writeFile(`${directory}/${name}.json`,JSON.stringify(lhr,null,2))
  console.log(JSON.stringify(row))
 }
 await writeFile(`${directory}/summary.json`,JSON.stringify({phase,configuration:'Lighthouse default mobile simulated throttling; local Docker; one diagnostic run per page, not a statistical benchmark',pages:summaries},null,2))
}finally{await chrome.kill()}
