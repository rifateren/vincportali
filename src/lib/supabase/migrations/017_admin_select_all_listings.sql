-- Migration 017: Admins can SELECT all listings (including inactive, other users' rows)
-- Required for moderation; without this, admins only see active + own listings via OR of prior policies.

DROP POLICY IF EXISTS "Admins can select all listings" ON public.listings;
CREATE POLICY "Admins can select all listings"
ON public.listings
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true)
);
