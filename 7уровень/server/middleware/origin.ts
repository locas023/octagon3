export default defineEventHandler(event => {
  if (!event.path.startsWith('/api/') || !['POST','PATCH','DELETE','PUT'].includes(event.method)) return
  const origin=getHeader(event,'origin')
  if(origin && origin!==getRequestURL(event).origin) throw createError({statusCode:403,statusMessage:'Недопустимый источник запроса'})
})
