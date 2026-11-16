import { database } from '../utils/database'

/** An idempotent SQL job; safe when multiple app processes run concurrently. */
export async function scanSlaNotifications() {
  const sql=database()
  return sql`INSERT INTO notifications(id,user_id,request_id,message)
    SELECT 'sla-'||u.id||'-'||r.id,u.id,r.id,'Приближается или просрочен SLA заявки #'||r.id
    FROM requests r JOIN users u ON (u.data->>'active')::boolean AND (
      u.data->>'role' IN ('operator','admin')
      OR (u.data->>'role'='agent' AND r.data->>'assigneeId'=u.id)
      OR (u.data->>'role'='client' AND r.data->>'customerId'=u.id))
    WHERE r.data->>'status' NOT IN ('closed','resolved') AND r.data->>'dueAt' IS NOT NULL
      AND (r.data->>'dueAt')::timestamptz<=now()+interval '1 hour'
    ON CONFLICT(id) DO NOTHING RETURNING id`
}
