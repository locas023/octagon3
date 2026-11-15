export default defineNuxtRouteMiddleware(async to=> {
  if(!['/dashboard','/requests','/profile','/admin','/notifications'].some(path=>to.path.startsWith(path))) return
  try { const user=await useRequestFetch()<import('#shared/types/api').ApiUser>('/api/auth/me'); useCurrentUser().value=user }
  catch { return navigateTo('/login') }
})

