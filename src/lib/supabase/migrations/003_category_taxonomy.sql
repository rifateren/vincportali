-- Normalize old category values to the new taxonomy.
update public.listings
set category = case category
  when 'istif-makinesi' then 'istif-makineleri'
  when 'transpalet' then 'transpaletler'
  when 'platform' then 'platformlar-manlift'
  when 'is-makinesi' then null
  when 'diger' then null
  else category
end
where category in ('istif-makinesi', 'transpalet', 'platform', 'is-makinesi', 'diger');

alter table public.listings
drop constraint if exists listings_category_allowed;

alter table public.listings
add constraint listings_category_allowed
check (
  category is null
  or category in (
    'forklift',
    'terminal-cekici',
    'platformlar-manlift',
    'transpaletler',
    'istif-makineleri',
    'beko-loder-kazici-yukleyici',
    'beton-pompasi',
    'dozer',
    'ekskavator-kepce',
    'loder-yukleyici',
    'mobil-vinc',
    'sondaj-makinesi',
    'teleskopik-yukleyici',
    'transmikser'
  )
);
