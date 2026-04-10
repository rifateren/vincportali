alter table public.profiles
add column if not exists store_slug text,
add column if not exists store_description text,
add column if not exists store_logo_url text,
add column if not exists store_banner_url text;

create unique index if not exists profiles_store_slug_idx
on public.profiles (store_slug)
where store_slug is not null and store_slug <> '';

drop policy if exists "public can view corporate stores" on public.profiles;
create policy "public can view corporate stores"
on public.profiles
for select
to anon, authenticated
using (user_type = 'kurumsal');
