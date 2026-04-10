alter table public.listings
add column if not exists user_id uuid references auth.users(id);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_type text not null check (user_type in ('bireysel', 'kurumsal')),
  full_name text,
  company_name text,
  tax_number text,
  phone text,
  city text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, user_type, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_type', 'bireysel'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop policy if exists "public_insert_listings" on public.listings;
create policy "authenticated_insert_own_listings"
on public.listings
for insert
to authenticated
with check (auth.uid() = user_id);
