-- Migration 008: Full-text search support
-- Adds a tsvector column and GIN index for fast text search across multiple fields

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Populate search_vector from existing data
UPDATE public.listings SET search_vector =
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(brand, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(description, '')), 'C') ||
  setweight(to_tsvector('simple', coalesce(city, '')), 'D') ||
  setweight(to_tsvector('simple', coalesce(contact_name, '')), 'D');

-- GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_listings_search_vector
ON public.listings USING gin(search_vector);

-- Function to auto-update search_vector on insert/update
CREATE OR REPLACE FUNCTION update_listing_search_vector()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(NEW.city, '')), 'D') ||
    setweight(to_tsvector('simple', coalesce(NEW.contact_name, '')), 'D');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_listings_search_vector ON public.listings;
CREATE TRIGGER trg_listings_search_vector
  BEFORE INSERT OR UPDATE OF title, brand, description, city, contact_name
  ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_search_vector();

-- RPC function for search that includes ID matching and full-text
CREATE OR REPLACE FUNCTION search_listings(search_term text)
RETURNS SETOF public.listings
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  -- If the search term looks like a UUID, try exact ID match first
  IF search_term ~ '^[0-9a-f]{8}-' THEN
    RETURN QUERY
      SELECT * FROM public.listings
      WHERE id::text = search_term AND is_active = true;
    IF FOUND THEN RETURN; END IF;
  END IF;

  -- Full-text search with fallback to ILIKE for partial matches
  RETURN QUERY
    SELECT DISTINCT l.* FROM public.listings l
    WHERE l.is_active = true
      AND (
        l.search_vector @@ plainto_tsquery('simple', search_term)
        OR l.title ILIKE '%' || search_term || '%'
        OR l.brand ILIKE '%' || search_term || '%'
        OR l.contact_name ILIKE '%' || search_term || '%'
      )
    ORDER BY
      ts_rank(l.search_vector, plainto_tsquery('simple', search_term)) DESC,
      l.created_at DESC;
END;
$$;
