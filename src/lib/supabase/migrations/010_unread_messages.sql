-- Migration 010: Track read status per conversation participant
-- Adds last_read_at timestamps for buyer and seller to know which messages are "new"

ALTER TABLE public.listing_conversations
ADD COLUMN IF NOT EXISTS seller_last_read_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS buyer_last_read_at timestamptz DEFAULT now();

-- Function to get unread conversation count for a user
CREATE OR REPLACE FUNCTION get_unread_conversation_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  unread_count integer;
BEGIN
  SELECT count(*) INTO unread_count
  FROM listing_conversations c
  WHERE
    (
      (c.seller_id = p_user_id AND c.last_message_at > coalesce(c.seller_last_read_at, '1970-01-01'))
      OR
      (c.buyer_id = p_user_id AND c.last_message_at > coalesce(c.buyer_last_read_at, '1970-01-01'))
    );
  RETURN unread_count;
END;
$$;

-- Function to mark a conversation as read for the current user
CREATE OR REPLACE FUNCTION mark_conversation_read(p_conversation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  UPDATE listing_conversations
  SET
    seller_last_read_at = CASE WHEN seller_id = v_user_id THEN now() ELSE seller_last_read_at END,
    buyer_last_read_at = CASE WHEN buyer_id = v_user_id THEN now() ELSE buyer_last_read_at END
  WHERE id = p_conversation_id
    AND (seller_id = v_user_id OR buyer_id = v_user_id);
END;
$$;
