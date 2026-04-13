-- Migration 018: Admins can read all conversations and messages (dashboard / moderation)

DROP POLICY IF EXISTS "Admins can select all listing_conversations" ON public.listing_conversations;
CREATE POLICY "Admins can select all listing_conversations"
ON public.listing_conversations
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true)
);

DROP POLICY IF EXISTS "Admins can select all listing_messages" ON public.listing_messages;
CREATE POLICY "Admins can select all listing_messages"
ON public.listing_messages
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true)
);
