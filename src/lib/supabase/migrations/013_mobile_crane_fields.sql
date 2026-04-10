alter table public.listings
  add column if not exists crane_type text,
  add column if not exists crane_chassis_type text,
  add column if not exists crane_axle_count text,
  add column if not exists crane_length_m numeric,
  add column if not exists crane_tonnage numeric,
  add column if not exists criteria_suggestion text;
