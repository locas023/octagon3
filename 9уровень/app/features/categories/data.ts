import type { ApiCategory } from '#shared/types/api'
export function useCategoryReference(){return useFetch<ApiCategory[]>('/api/categories',{key:'ref-categories',default:()=>[]})}
