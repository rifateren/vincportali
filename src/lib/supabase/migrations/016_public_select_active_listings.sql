-- Migration 016: Add missing public SELECT policy for active listings
-- This policy was only present in rls_policies.sql but not in the numbered
-- migration chain. Without it, anonymous users cannot view active listings.

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'listings' AND policyname = 'public_select_active_listings'
  ) THEN
    CREATE POLICY "public_select_active_listings"
    ON public.listings
    FOR SELECT
    TO public
    USING (is_active = true);
  END IF;
END $$;
