import { spawn } from 'node:child_process'
process.env.NUXT_PUBLIC_SITE_URL ||= process.env.RENDER_EXTERNAL_URL || 'http://127.0.0.1:3009'
if(process.env.RUN_MIGRATIONS==='true') {
 const code=await new Promise(resolve=>{const child=spawn(process.execPath,['scripts/setup.mjs'],{stdio:'inherit',env:process.env});child.on('exit',resolve);child.on('error',()=>resolve(1))})
 if(code!==0)process.exit(Number(code)||1)
}
await import('../.output/server/index.mjs')
