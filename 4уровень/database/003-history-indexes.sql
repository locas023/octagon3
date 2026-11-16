CREATE TABLE IF NOT EXISTS request_events (
  id text PRIMARY KEY,
  request_id bigint NOT NULL REFERENCES requests(id),
  kind text NOT NULL,
  status text,
  actor_id text,
  reason text,
  occurred_at timestamptz NOT NULL,
  deadline_at timestamptz
);
CREATE INDEX IF NOT EXISTS request_events_history ON request_events(request_id,occurred_at);
CREATE INDEX IF NOT EXISTS request_events_resolution ON request_events(status,occurred_at);
CREATE INDEX IF NOT EXISTS requests_customer_idx ON requests((data->>'customerId'));
CREATE INDEX IF NOT EXISTS requests_assignee_idx ON requests((data->>'assigneeId'));
CREATE INDEX IF NOT EXISTS requests_status_idx ON requests((data->>'status'));
CREATE INDEX IF NOT EXISTS requests_created_idx ON requests((data->>'createdAt'));
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(lower(data->>'email'));
INSERT INTO request_events(id,request_id,kind,status,actor_id,reason,occurred_at,deadline_at)
SELECT e->>'id',r.id,e->>'type',CASE WHEN e->>'type'='status' THEN e->>'value' END,
 e->>'actorId',e->>'reason',(e->>'createdAt')::timestamptz,(r.data->>'dueAt')::timestamptz
FROM requests r CROSS JOIN LATERAL jsonb_array_elements(COALESCE(r.data->'timeline','[]'::jsonb)) e
WHERE e->>'id' IS NOT NULL
ON CONFLICT(id) DO NOTHING;
