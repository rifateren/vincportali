-- Canonical RLS snapshot: apply migrations 001–004 in order on a fresh database,
-- or run this file after 001–003 if 004 was not applied yet.

alter table public.listings enable row level security;

drop policy if exists "public_select_active_listings" on public.listings;
create policy "public_select_active_listings"
on public.listings
for select
to public
using (is_active = true);

drop policy if exists "authenticated_select_own_listings" on public.listings;
create policy "authenticated_select_own_listings"
on public.listings
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "public_insert_listings" on public.listings;
drop policy if exists "authenticated_insert_own_listings" on public.listings;
create policy "authenticated_insert_own_listings"
on public.listings
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "authenticated_update_own_listings" on public.listings;
create policy "authenticated_update_own_listings"
on public.listings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "authenticated_delete_own_listings" on public.listings;
create policy "authenticated_delete_own_listings"
on public.listings
for delete
to authenticated
using (auth.uid() = user_id);

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

-- Matches migration 004 (security definer view counter).
create or replace function public.increment_listing_view_count(listing_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.listings
  set view_count = coalesce(view_count, 0) + 1
  where id = listing_id
    and is_active = true;
end;
$$;

revoke all on function public.increment_listing_view_count(uuid) from public;
grant execute on function public.increment_listing_view_count(uuid) to anon, authenticated;
