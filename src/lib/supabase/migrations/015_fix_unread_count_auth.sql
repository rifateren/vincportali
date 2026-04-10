-- Migration 015: Harden get_unread_conversation_count to only allow querying own data
-- Previously any authenticated user could pass an arbitrary p_user_id and read
-- another user's unread count. Now the function ignores the parameter and uses
-- auth.uid() directly.

CREATE OR REPLACE FUNCTION get_unread_conversation_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unread_count integer;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL OR v_uid IS DISTINCT FROM p_user_id THEN
    RETURN 0;
  END IF;

  SELECT count(*) INTO unread_count
  FROM listing_conversations c
  WHERE
    (
      (c.seller_id = v_uid AND c.last_message_at > coalesce(c.seller_last_read_at, '1970-01-01'))
      OR
      (c.buyer_id = v_uid AND c.last_message_at > coalesce(c.buyer_last_read_at, '1970-01-01'))
    );
  RETURN unread_count;
END;
$$;
