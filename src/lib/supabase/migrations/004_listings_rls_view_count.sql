alter table public.listings enable row level security;

-- Owner can see all their listings (including inactive). Public still sees only active (existing policy).
drop policy if exists "authenticated_select_own_listings" on public.listings;
create policy "authenticated_select_own_listings"
on public.listings
for select
to authenticated
using (auth.uid() = user_id);

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

-- View count must bypass RLS for anonymous listing views; restrict to active listings only.
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
