create extension if not exists pgcrypto;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title text not null,
  description text,
  category text,
  brand text,
  model text,
  year integer,
  price numeric,
  price_negotiable boolean default false,
  condition text,
  working_hours integer,
  capacity_kg integer,
  lift_height_mm integer,
  fuel_type text,
  city text,
  district text,
  images text[],
  contact_name text,
  contact_phone text,
  is_active boolean default true,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists listings_category_idx on public.listings (category);
create index if not exists listings_city_idx on public.listings (city);
create index if not exists listings_condition_idx on public.listings (condition);
create index if not exists listings_is_active_idx on public.listings (is_active);
create index if not exists listings_created_at_idx on public.listings (created_at);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists listings_set_updated_at on public.listings;

create trigger listings_set_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();

create or replace function increment_listing_view_count(listing_id uuid)
returns void as $$
  update listings set view_count = view_count + 1 where id = listing_id;
$$ language sql;

