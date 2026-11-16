import type { ApiUser } from '#shared/types/api'
export default defineNuxtRouteMiddleware(async to=> {
 if(!['/dashboard','/requests','/profile','/admin','/notifications','/new-request'].some(path=>to.path.startsWith(path)))return
 let user:ApiUser
 try{user=await useRequestFetch()<ApiUser>('/api/auth/me')}
 catch{return navigateTo('/login')}
 useCurrentUser().value=user
 if(to.path.startsWith('/admin')&&user.role!=='admin')throw createError({statusCode:403,statusMessage:'Недостаточно прав'})
})
