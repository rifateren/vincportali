-- Migration 012: Brands table with category associations
-- Creates brands and brand_categories tables; seeds all mobil-vinç brands

-- ─── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.brands (
  id   serial PRIMARY KEY,
  name text   NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.brand_categories (
  brand_id      integer NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  category_slug text    NOT NULL,
  PRIMARY KEY (brand_id, category_slug)
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE public.brands          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public brands read" ON public.brands;
CREATE POLICY "Public brands read"
  ON public.brands FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public brand_categories read" ON public.brand_categories;
CREATE POLICY "Public brand_categories read"
  ON public.brand_categories FOR SELECT
  USING (true);

-- ─── Seed: Mobil Vinç markaları (sahibinden.com listesi, değiştirilmeden) ─────

INSERT INTO public.brands (name) VALUES
  ('Abay'),
  ('ABM Zemin'),
  ('ACR'),
  ('AKC Makine'),
  ('Akkar'),
  ('Aselkon'),
  ('Astor'),
  ('Atlas'),
  ('Birpom'),
  ('Bumer Makina'),
  ('Cabr'),
  ('Coles'),
  ('Comanso'),
  ('Çalışır&İnan'),
  ('Demag'),
  ('Doğru Makina'),
  ('Dorukan'),
  ('Easy Lift'),
  ('Effer'),
  ('Ek-Bar'),
  ('Ens Platform'),
  ('ERC'),
  ('Eren Vinç'),
  ('Erkin'),
  ('Er-Power'),
  ('F.lli Ferrari'),
  ('Fassi'),
  ('Faun'),
  ('Fmk'),
  ('Fushun'),
  ('Gelişim'),
  ('Gottwald'),
  ('Gök Platform'),
  ('Grove'),
  ('Güçlü'),
  ('Güralp'),
  ('Hank'),
  ('Hiab'),
  ('Hidroacar'),
  ('Hidro Acar'),
  ('Hidrokon'),
  ('Hidrokreyn'),
  ('Hidro Öz'),
  ('Hidrotork'),
  ('Hidrovinç'),
  ('Hidroyavuz'),
  ('Hitachi'),
  ('Hunan Sinoboom'),
  ('Hydroapex'),
  ('Hydro Force'),
  ('Hydro Smart'),
  ('Hyva'),
  ('İbrahim Çimen Makina'),
  ('İndeks'),
  ('İzkon'),
  ('Jekko'),
  ('Kama'),
  ('Kardelen'),
  ('Kato'),
  ('Kobelco'),
  ('Kombassan'),
  ('Kondu'),
  ('Kondu Hidrolik'),
  ('Krupp'),
  ('Liebherr'),
  ('Link Belt'),
  ('Mecprom'),
  ('Mekatron Vinç'),
  ('Mersa'),
  ('Mesut Vinç'),
  ('Mikron Hidrolik'),
  ('Neptune'),
  ('Newtech'),
  ('Nirvana'),
  ('Optimus'),
  ('Özak'),
  ('Özenka'),
  ('P&H'),
  ('Paktaş'),
  ('Palfinger'),
  ('Poclain'),
  ('Puma'),
  ('Resco Crane'),
  ('Ruston'),
  ('Sany'),
  ('Saymaz Vinç'),
  ('Sekizli'),
  ('Sel Vinç'),
  ('Sennebogen'),
  ('Sentez'),
  ('SRT Makina'),
  ('Sumitomo'),
  ('Sunward'),
  ('Tadano'),
  ('Terex'),
  ('TGM'),
  ('TLG Technic'),
  ('Tugana'),
  ('Turkish Tower Cranes'),
  ('Uzmanlar'),
  ('Xcmg'),
  ('Xjcm'),
  ('Zamac'),
  ('Zoomlion')
ON CONFLICT (name) DO NOTHING;

-- ─── Seed: category associations for mobil-vinç ───────────────────────────────

INSERT INTO public.brand_categories (brand_id, category_slug)
SELECT id, 'mobil-vinc'
FROM public.brands
WHERE name IN (
  'Abay', 'ABM Zemin', 'ACR', 'AKC Makine', 'Akkar', 'Aselkon', 'Astor',
  'Atlas', 'Birpom', 'Bumer Makina', 'Cabr', 'Coles', 'Comanso',
  'Çalışır&İnan', 'Demag', 'Doğru Makina', 'Dorukan', 'Easy Lift', 'Effer',
  'Ek-Bar', 'Ens Platform', 'ERC', 'Eren Vinç', 'Erkin', 'Er-Power',
  'F.lli Ferrari', 'Fassi', 'Faun', 'Fmk', 'Fushun', 'Gelişim', 'Gottwald',
  'Gök Platform', 'Grove', 'Güçlü', 'Güralp', 'Hank', 'Hiab', 'Hidroacar',
  'Hidro Acar', 'Hidrokon', 'Hidrokreyn', 'Hidro Öz', 'Hidrotork',
  'Hidrovinç', 'Hidroyavuz', 'Hitachi', 'Hunan Sinoboom', 'Hydroapex',
  'Hydro Force', 'Hydro Smart', 'Hyva', 'İbrahim Çimen Makina', 'İndeks',
  'İzkon', 'Jekko', 'Kama', 'Kardelen', 'Kato', 'Kobelco', 'Kombassan',
  'Kondu', 'Kondu Hidrolik', 'Krupp', 'Liebherr', 'Link Belt', 'Mecprom',
  'Mekatron Vinç', 'Mersa', 'Mesut Vinç', 'Mikron Hidrolik', 'Neptune',
  'Newtech', 'Nirvana', 'Optimus', 'Özak', 'Özenka', 'P&H', 'Paktaş',
  'Palfinger', 'Poclain', 'Puma', 'Resco Crane', 'Ruston', 'Sany',
  'Saymaz Vinç', 'Sekizli', 'Sel Vinç', 'Sennebogen', 'Sentez',
  'SRT Makina', 'Sumitomo', 'Sunward', 'Tadano', 'Terex', 'TGM',
  'TLG Technic', 'Tugana', 'Turkish Tower Cranes', 'Uzmanlar', 'Xcmg',
  'Xjcm', 'Zamac', 'Zoomlion'
)
ON CONFLICT DO NOTHING;
