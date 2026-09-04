-- One notebook per signed-in user. JSON keeps the existing 8-stack board shape.
create table if not exists boards (
  user_id    text primary key,
  stacks     jsonb not null,
  updated_at timestamptz not null default now()
);
