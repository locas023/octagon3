import type { ApiCustomer } from '#shared/types/api'
export function useCustomerReference(){return useFetch<ApiCustomer[]>('/api/customers',{key:'ref-customers',default:()=>[]})}
