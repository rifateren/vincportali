-- Migration 009: Fix handle_new_user trigger to extract all registration fields
-- Previously only full_name and user_type were extracted from metadata.
-- Now company_name, tax_number, phone, and city are also populated on signup.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, full_name, company_name, tax_number, phone, city)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_type', 'bireysel'),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'tax_number',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
