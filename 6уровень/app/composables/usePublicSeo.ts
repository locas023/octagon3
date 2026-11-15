export function usePublicSeo(title:string, description:string) {
 const route=useRoute(), config=useRuntimeConfig()
 const canonical=new URL(route.path,config.public.siteUrl).href
 useSeoMeta({title,description,ogTitle:title,ogDescription:description,ogUrl:canonical,ogType:'website',twitterCard:'summary'})
 useHead({link:[{rel:'canonical',href:canonical}]})
}
