import { readFile,readdir } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
const root=process.cwd(),edges=new Map()
async function files(dir){const entries=await readdir(dir,{withFileTypes:true});return(await Promise.all(entries.map(e=>e.isDirectory()?files(path.join(dir,e.name)):/\.(ts|vue)$/.test(e.name)?[path.join(dir,e.name)]:[]))).flat()}
const sources=(await Promise.all(['app','server','shared'].map(dir=>files(path.join(root,dir))))).flat()
const available=new Set(sources)
for(const file of sources){
 const source=await readFile(file,'utf8'),local=path.relative(root,file).replaceAll('\\','/')
 const imports=[...source.matchAll(/(?:from\s*|import\s*\()\s*['"]([^'"]+)['"]/g)].map(m=>m[1])
 if(local.startsWith('shared/'))assert.ok(!imports.some(i=>/^(vue|h3|#app|#imports|nuxt|nitro|postgres|~\/)/.test(i)),local+' shared depends on runtime')
 if(local.startsWith('app/'))assert.ok(!imports.some(i=>i.includes('/server/')),local+' app imports server')
 if(local.startsWith('server/'))assert.ok(!imports.some(i=>i.startsWith('~/')||i.includes('/app/')),local+' server imports app')
 const links=[]
 for(const imp of imports){const target=imp.startsWith('.')?path.resolve(path.dirname(file),imp):imp.startsWith('~/')?path.join(root,'app',imp.slice(2)):imp.startsWith('#shared/')?path.join(root,'shared',imp.slice(8)):null;if(!target)continue;const resolved=[target,target+'.ts',target+'.vue',path.join(target,'index.ts')].find(p=>available.has(p));if(resolved)links.push(resolved)}
 edges.set(file,links)
}
const done=new Set(),active=new Set()
function visit(file){assert.ok(!active.has(file),'Import cycle at '+path.relative(root,file));if(done.has(file))return;active.add(file);for(const next of edges.get(file)||[])visit(next);active.delete(file);done.add(file)}
for(const file of sources)visit(file)
for(const feature of ['requests','customers','users','comments','auth','notifications'])assert.ok(sources.some(f=>f.includes(path.join('features',feature))),feature+' missing')
console.log(`PASS: ${sources.length} modules; layer boundaries; explicit import graph has no cycles`)
