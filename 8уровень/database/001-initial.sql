CREATE TABLE IF NOT EXISTS users(id text PRIMARY KEY, data jsonb NOT NULL, password_hash text NOT NULL);
CREATE TABLE IF NOT EXISTS customers(id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS categories(id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS requests(id bigserial PRIMARY KEY, data jsonb NOT NULL, version integer NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS comments(id text PRIMARY KEY, request_id bigint NOT NULL REFERENCES requests(id), data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token_hash text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id), expires_at timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
