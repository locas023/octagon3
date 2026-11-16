import type { ApiUser } from '#shared/types/api'
export function useUserReference(){return useFetch<ApiUser[]>('/api/users',{key:'ref-users',default:()=>[]})}
