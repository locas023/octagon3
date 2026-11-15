CREATE TABLE IF NOT EXISTS sla(priority text PRIMARY KEY, response_minutes integer NOT NULL CHECK(response_minutes>0), resolution_minutes integer NOT NULL CHECK(resolution_minutes>=response_minutes));
INSERT INTO sla VALUES('critical',15,60),('high',60,240),('normal',240,1440),('low',480,4320) ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS attachments(id text PRIMARY KEY,request_id bigint NOT NULL REFERENCES requests(id),name text NOT NULL,mime text NOT NULL,body bytea NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS notifications(id text PRIMARY KEY,user_id text NOT NULL REFERENCES users(id),request_id bigint REFERENCES requests(id),message text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),read_at timestamptz);
