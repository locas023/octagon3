import { scanSlaNotifications } from '../services/notifications'

export default defineNitroPlugin(app=>{
  if(!process.env.DATABASE_URL)return
  let running=false
  const tick=async()=>{
    if(running)return
    running=true
    try{await scanSlaNotifications()}catch{console.error('[sla-worker] Scan failed; retrying next minute')}
    finally{running=false}
  }
  void tick()
  const timer=setInterval(()=>void tick(),60_000)
  timer.unref()
  app.hooks.hook('close',()=>{clearInterval(timer)})
})
