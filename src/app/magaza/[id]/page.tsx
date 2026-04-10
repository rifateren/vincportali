import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ImageWithFallback from "@/components/ImageWithFallback";

type StoreProfile = {
  id: string;
  user_type: "kurumsal";
  company_name: string | null;
  full_name: string | null;
  city: string | null;
  phone: string | null;
  store_slug: string | null;
  store_description: string | null;
  store_logo_url: string | null;
  store_banner_url: string | null;
};

type Listing = {
  id: string;
  title: string;
  price: number | null;
  created_at: string;
  view_count: number | null;
  images: string[] | null;
};

function formatPrice(price: number | null) {
  if (price === null) return "Fiyat sorunuz";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

const PROFILE_COLUMNS =
  "id, user_type, company_name, full_name, city, phone, store_slug, store_description, store_logo_url, store_banner_url";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = createSupabaseServerClient();
  const identifier = params.id;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(identifier);

  const { data } = isUuid
    ? await supabase
        .from("profiles")
        .select("company_name, full_name")
        .eq("id", identifier)
        .eq("user_type", "kurumsal")
        .maybeSingle()
    : await supabase
        .from("profiles")
        .select("company_name, full_name")
        .eq("store_slug", identifier)
        .eq("user_type", "kurumsal")
        .maybeSingle();

  const name = data?.company_name || data?.full_name || "Mağaza";
  return {
    title: `${name} - Kurumsal Mağaza`,
    description: `${name} kurumsal mağaza sayfası. MakinePazarı'nda iş makinesi ilanlarını inceleyin.`,
  };
}

export default async function StoreDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const identifier = params.id;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(identifier);

  let profileData: StoreProfile | null = null;

  if (isUuid) {
    const { data } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", identifier)
      .eq("user_type", "kurumsal")
      .maybeSingle();
    profileData = data as StoreProfile | null;
  } else {
    const { data } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("store_slug", identifier)
      .eq("user_type", "kurumsal")
      .maybeSingle();
    profileData = data as StoreProfile | null;
  }

  const userId = profileData?.id;

  const { data: listingsData } = userId
    ? await supabase
        .from("listings")
        .select("id, title, price, created_at, view_count, images")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
    : { data: [] };

  if (!profileData) {
    notFound();
  }

  const store = profileData as StoreProfile;
  const listings = (listingsData ?? []) as Listing[];
  const totalViews = listings.reduce((sum, listing) => sum + (listing.view_count ?? 0), 0);
  const displayName = store.company_name || store.full_name || "Kurumsal Mağaza";

  return (
    <main className="min-h-[70vh] bg-slate-50">
      <section className="relative overflow-hidden bg-[#0f2744]">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src={store.store_banner_url || ""}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 text-white md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/20 bg-white/10">
              <ImageWithFallback
                src={store.store_logo_url || ""}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-200">Kurumsal Mağaza</p>
              <h1 className="mt-2 text-3xl font-bold">{displayName}</h1>
              <p className="mt-2 text-sm text-slate-200">
                {store.city || "Şehir belirtilmedi"}{store.phone ? ` / ${store.phone}` : ""}
              </p>
            </div>
          </div>
          <Link
            href="/magazalar"
            className="inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white"
          >
            Tüm mağazalar
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1e3a5f]">Mağaza Hakkında</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
              {store.store_description || "Bu mağaza henüz açıklama eklemedi."}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1e3a5f]">Özet</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Aktif ilan</p>
                <p className="mt-1 text-2xl font-bold text-[#1e3a5f]">{listings.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Toplam görüntülenme</p>
                <p className="mt-1 text-2xl font-bold text-[#1e3a5f]">{totalViews}</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Aktif İlanlar</h2>
            <p className="text-sm text-slate-500">{listings.length} kayıt</p>
          </div>
          {listings.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">Bu mağazanın aktif ilanı bulunmuyor.</p>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/ilan/${listing.id}`}
                  className="overflow-hidden rounded-xl border border-slate-200 transition hover:border-[#f97316]"
                >
                  <div className="h-44 bg-slate-100">
                    <ImageWithFallback
                      src={listing.images?.[0] || ""}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-[#1e3a5f]">{listing.title}</p>
                    <p className="mt-2 text-sm font-semibold text-[#f97316]">{formatPrice(listing.price)}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(listing.created_at).toLocaleDateString("tr-TR")}</span>
                      <span>{listing.view_count ?? 0} görüntülenme</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
