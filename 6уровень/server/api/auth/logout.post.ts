export default defineEventHandler(async event => {
  const token=getCookie(event,'workflow-session')
  if(token) await database()`DELETE FROM sessions WHERE token_hash=${sessionHash(token)}`
  deleteCookie(event,'workflow-session',{path:'/'})
  return {ok:true}
})
