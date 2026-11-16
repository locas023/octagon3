import type { ApiComment } from '#shared/types/api'
export function postComment(id:number,text:string,key:string){return $fetch<ApiComment>(`/api/requests/${id}/comments`,{method:'POST',body:{text,key}})}
