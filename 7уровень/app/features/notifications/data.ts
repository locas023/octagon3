export interface NotificationItem{id:string;message:string;request_id:number;read_at:string|null;created_at:string}
export function useNotifications(){return useFetch<NotificationItem[]>('/api/notifications')}
export function markNotification(id:string,read:boolean){return $fetch(`/api/notifications/${encodeURIComponent(id)}`,{method:'PATCH',body:{read}})}
