create table if not exists public.listing_conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unique (listing_id, buyer_id),
  check (seller_id <> buyer_id)
);

create table if not exists public.listing_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.listing_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists listing_conversations_seller_id_idx on public.listing_conversations (seller_id, last_message_at desc);
create index if not exists listing_conversations_buyer_id_idx on public.listing_conversations (buyer_id, last_message_at desc);
create index if not exists listing_messages_conversation_id_idx on public.listing_messages (conversation_id, created_at asc);

drop trigger if exists listing_conversations_set_updated_at on public.listing_conversations;
create trigger listing_conversations_set_updated_at
before update on public.listing_conversations
for each row
execute function public.set_updated_at();

alter table public.listing_conversations enable row level security;
alter table public.listing_messages enable row level security;

drop policy if exists "listing_conversations_select_participant" on public.listing_conversations;
create policy "listing_conversations_select_participant"
on public.listing_conversations
for select
to authenticated
using (auth.uid() in (seller_id, buyer_id));

drop policy if exists "listing_conversations_insert_buyer" on public.listing_conversations;
create policy "listing_conversations_insert_buyer"
on public.listing_conversations
for insert
to authenticated
with check (
  auth.uid() = buyer_id
  and exists (
    select 1
    from public.listings
    where listings.id = listing_conversations.listing_id
      and listings.user_id = listing_conversations.seller_id
      and listings.is_active = true
  )
);

drop policy if exists "listing_conversations_update_participant" on public.listing_conversations;
create policy "listing_conversations_update_participant"
on public.listing_conversations
for update
to authenticated
using (auth.uid() in (seller_id, buyer_id))
with check (auth.uid() in (seller_id, buyer_id));

drop policy if exists "listing_messages_select_participant" on public.listing_messages;
create policy "listing_messages_select_participant"
on public.listing_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.listing_conversations
    where listing_conversations.id = listing_messages.conversation_id
      and auth.uid() in (listing_conversations.seller_id, listing_conversations.buyer_id)
  )
);

drop policy if exists "listing_messages_insert_participant" on public.listing_messages;
create policy "listing_messages_insert_participant"
on public.listing_messages
for insert
to authenticated
with check (
  auth.uid() = sender_id
  and exists (
    select 1
    from public.listing_conversations
    where listing_conversations.id = listing_messages.conversation_id
      and auth.uid() in (listing_conversations.seller_id, listing_conversations.buyer_id)
  )
);

create or replace function public.refresh_listing_message_count(target_listing_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.listings
  set message_count = (
    select count(public.listing_messages.id)::integer
    from public.listing_messages
    join public.listing_conversations
      on public.listing_conversations.id = public.listing_messages.conversation_id
    where public.listing_conversations.listing_id = target_listing_id
      and public.listing_messages.sender_id <> public.listing_conversations.seller_id
  )
  where id = target_listing_id;
$$;

create or replace function public.handle_listing_message_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_listing_id uuid;
begin
  update public.listing_conversations
  set last_message_at = now()
  where id = new.conversation_id;

  select listing_id
  into current_listing_id
  from public.listing_conversations
  where id = new.conversation_id;

  perform public.refresh_listing_message_count(current_listing_id);
  return new;
end;
$$;

drop trigger if exists listing_messages_after_insert on public.listing_messages;
create trigger listing_messages_after_insert
after insert on public.listing_messages
for each row
execute function public.handle_listing_message_change();
