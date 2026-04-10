# MakineSepeti

Next.js (App Router) ile Supabase Postgres + Auth ve Cloudinary görselleri kullanan ilan sitesi.

## Gereksinimler

- Node.js 20+
- Supabase projesi (Postgres + Auth)
- İsteğe bağlı: Cloudinary hesabı (ilan fotoğrafları)

## Kurulum

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` içinde Supabase ve Cloudinary değerlerini doldurun.

## Veritabanı şeması

SQL dosyalarını **sırayla** Supabase SQL Editor’da çalıştırın:

1. [`src/lib/supabase/migrations/001_initial_schema.sql`](src/lib/supabase/migrations/001_initial_schema.sql)
2. [`src/lib/supabase/migrations/002_auth_profiles.sql`](src/lib/supabase/migrations/002_auth_profiles.sql)
3. [`src/lib/supabase/migrations/003_category_taxonomy.sql`](src/lib/supabase/migrations/003_category_taxonomy.sql)
4. [`src/lib/supabase/migrations/004_listings_rls_view_count.sql`](src/lib/supabase/migrations/004_listings_rls_view_count.sql)

Alternatif: önceki adımlar uygulandıysa, eksik RLS ve görüntülenme sayacı için yalnızca `004` veya tek seferde [`src/lib/supabase/rls_policies.sql`](src/lib/supabase/rls_policies.sql) (tam politika + RPC özeti) kullanılabilir; yine de migration sırası yeni ortamlarda en güvenilir yoldur.

## Örnek veri (seed)

RLS nedeniyle seed yalnızca **service role** anahtarı ile çalışır:

```bash
# .env.local veya ortamda SUPABASE_SERVICE_ROLE_KEY tanımlı olsun
npm run seed
```

## Geliştirme

```bash
npm run dev
```

```bash
npm run lint
npm run build
```

## Güvenlik notları

- `/api/upload` yalnızca giriş yapmış kullanıcılara açıktır; dakika başına yükleme sınırı vardır.
- `SUPABASE_SERVICE_ROLE_KEY` yalnızca sunucu tarafında ve seed için kullanılmalıdır; istemciye asla eklenmemelidir.

## Üretim

- `NODE_ENV=production` ortamında `/ilanlar` Supabase hatalarında **mock veriye düşmez**; boş liste gösterilir.
- `/test` bağlantı sayfası üretimde 404 döner.
