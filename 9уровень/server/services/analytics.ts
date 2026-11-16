import type { AnalyticsReport } from '#shared/types/analytics'
import { database } from '../utils/database'

export async function analyticsReport(from: string | null, toExclusive: string | null): Promise<AnalyticsReport> {
  const sql=database()
  const rows=await sql`WITH cohort AS (
    SELECT id,data FROM requests WHERE (${from}::timestamptz IS NULL OR (data->>'createdAt')::timestamptz>=${from}::timestamptz)
    AND (${toExclusive}::timestamptz IS NULL OR (data->>'createdAt')::timestamptz<${toExclusive}::timestamptz)
  ), resolved AS (
    SELECT DISTINCT ON (e.request_id) e.request_id,e.occurred_at,e.deadline_at FROM request_events e JOIN cohort c ON c.id=e.request_id
    WHERE e.kind='status' AND e.status='resolved' AND (${toExclusive}::timestamptz IS NULL OR e.occurred_at<${toExclusive}::timestamptz)
    ORDER BY e.request_id,e.occurred_at DESC
  ) SELECT (SELECT count(*)::int FROM cohort) AS total,
    (SELECT COALESCE(jsonb_object_agg(status,n),'{}'::jsonb) FROM (SELECT data->>'status' AS status,count(*)::int AS n FROM cohort GROUP BY data->>'status') s) AS statuses,
    count(r.request_id)::int AS resolved,count(r.deadline_at)::int AS measured,
    CASE WHEN count(r.deadline_at)>0 THEN round(100.0*count(*) FILTER(WHERE r.occurred_at<=r.deadline_at)/count(r.deadline_at))::int END AS percent,
    (avg(GREATEST(0,extract(epoch FROM (r.occurred_at-(c.data->>'createdAt')::timestamptz))/60)) FILTER(WHERE r.request_id IS NOT NULL))::float AS average
    FROM cohort c LEFT JOIN resolved r ON r.request_id=c.id`
  const agents=await sql`SELECT u.id,u.data->>'name' AS name,count(r.id)::int AS count FROM users u LEFT JOIN requests r ON r.data->>'assigneeId'=u.id AND r.data->>'status' NOT IN ('resolved','closed') WHERE u.data->>'role'='agent' GROUP BY u.id,u.data->>'name' ORDER BY name`
  const row=rows[0]!
  return {total:row.total,statuses:row.statuses,resolved:row.resolved,slaMeasured:row.measured,slaPercent:row.percent,averageResolutionMinutes:row.average,agents:agents.map(a=>({id:a.id,name:a.name,count:a.count}))}
}
