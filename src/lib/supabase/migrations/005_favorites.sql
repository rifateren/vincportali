alter table public.listings
add column if not exists favorite_count integer not null default 0,
add column if not exists message_count integer not null default 0;

create table if not exists public.favorite_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorite_list_items (
  id uuid primary key default gen_random_uuid(),
  favorite_list_id uuid not null references public.favorite_lists(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (favorite_list_id, listing_id)
);

create index if not exists favorite_lists_user_id_idx on public.favorite_lists (user_id);
create index if not exists favorite_lists_created_at_idx on public.favorite_lists (created_at desc);
create index if not exists favorite_list_items_listing_id_idx on public.favorite_list_items (listing_id);
create index if not exists favorite_list_items_list_id_idx on public.favorite_list_items (favorite_list_id);

drop trigger if exists favorite_lists_set_updated_at on public.favorite_lists;
create trigger favorite_lists_set_updated_at
before update on public.favorite_lists
for each row
execute function public.set_updated_at();

alter table public.favorite_lists enable row level security;
alter table public.favorite_list_items enable row level security;

drop policy if exists "favorite_lists_select_own" on public.favorite_lists;
create policy "favorite_lists_select_own"
on public.favorite_lists
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "favorite_lists_insert_own" on public.favorite_lists;
create policy "favorite_lists_insert_own"
on public.favorite_lists
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "favorite_lists_update_own" on public.favorite_lists;
create policy "favorite_lists_update_own"
on public.favorite_lists
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "favorite_lists_delete_own" on public.favorite_lists;
create policy "favorite_lists_delete_own"
on public.favorite_lists
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "favorite_list_items_select_own" on public.favorite_list_items;
create policy "favorite_list_items_select_own"
on public.favorite_list_items
for select
to authenticated
using (
  exists (
    select 1
    from public.favorite_lists
    where favorite_lists.id = favorite_list_items.favorite_list_id
      and favorite_lists.user_id = auth.uid()
  )
);

drop policy if exists "favorite_list_items_insert_own" on public.favorite_list_items;
create policy "favorite_list_items_insert_own"
on public.favorite_list_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.favorite_lists
    where favorite_lists.id = favorite_list_items.favorite_list_id
      and favorite_lists.user_id = auth.uid()
  )
);

drop policy if exists "favorite_list_items_delete_own" on public.favorite_list_items;
create policy "favorite_list_items_delete_own"
on public.favorite_list_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.favorite_lists
    where favorite_lists.id = favorite_list_items.favorite_list_id
      and favorite_lists.user_id = auth.uid()
  )
);

create or replace function public.refresh_listing_favorite_count(target_listing_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.listings
  set favorite_count = (
    select count(distinct favorite_lists.user_id)::integer
    from public.favorite_list_items
    join public.favorite_lists
      on public.favorite_lists.id = public.favorite_list_items.favorite_list_id
    where public.favorite_list_items.listing_id = target_listing_id
  )
  where id = target_listing_id;
$$;

create or replace function public.handle_favorite_item_count_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_listing_id uuid;
begin
  affected_listing_id := coalesce(new.listing_id, old.listing_id);
  perform public.refresh_listing_favorite_count(affected_listing_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists favorite_item_count_change on public.favorite_list_items;
create trigger favorite_item_count_change
after insert or delete on public.favorite_list_items
for each row
execute function public.handle_favorite_item_count_change();
