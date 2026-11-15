export default defineNuxtRouteMiddleware(async ()=>{try{await useRequestFetch()('/api/auth/me')}catch{return navigateTo('/login')}})
