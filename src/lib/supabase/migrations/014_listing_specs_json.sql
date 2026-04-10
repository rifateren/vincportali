alter table public.listings
  add column if not exists specs jsonb not null default '{}'::jsonb;
