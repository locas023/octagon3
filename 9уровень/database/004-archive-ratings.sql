ALTER TABLE requests ADD COLUMN IF NOT EXISTS archived_at timestamptz;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS archived_by text REFERENCES users(id);
CREATE INDEX IF NOT EXISTS requests_archive_idx ON requests(archived_at, id DESC);
CREATE TABLE IF NOT EXISTS request_ratings (
  request_id bigint PRIMARY KEY REFERENCES requests(id),
  user_id text NOT NULL REFERENCES users(id),
  score integer NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now()
);
