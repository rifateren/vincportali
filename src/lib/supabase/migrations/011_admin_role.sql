-- Migration 011: Admin role support
-- Adds is_admin flag to profiles for platform administrators

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- RLS policy: admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true)
);

-- RLS policy: admins can update all listings (moderation)
DROP POLICY IF EXISTS "Admins can update any listing" ON public.listings;
CREATE POLICY "Admins can update any listing"
ON public.listings
FOR UPDATE
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true)
);

-- RLS policy: admins can delete any listing
DROP POLICY IF EXISTS "Admins can delete any listing" ON public.listings;
CREATE POLICY "Admins can delete any listing"
ON public.listings
FOR DELETE
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true)
);
