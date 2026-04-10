import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ImageWithFallback from "@/components/ImageWithFallback";

type StoreProfile = {
  id: string;
  company_name: string | null;
  full_name: string | null;
  city: string | null;
  store_slug: string | null;
  store_description: string | null;
  store_logo_url: string | null;
};

export default async function StoresPage() {
  const supabase = createSupabaseServerClient();
  const [{ data: profilesData }, { data: listingsData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, company_name, full_name, city, store_slug, store_description, store_logo_url")
      .eq("user_type", "kurumsal")
      .order("created_at", { ascending: false }),
    supabase.from("listings").select("id, user_id").eq("is_active", true),
  ]);

  const storeProfiles = (profilesData ?? []) as StoreProfile[];
  const activeListingCountByStore = new Map<string, number>();

  (listingsData ?? []).forEach((listing) => {
    const userId = listing.user_id as string | null;
    if (!userId) return;
    activeListingCountByStore.set(userId, (activeListingCountByStore.get(userId) ?? 0) + 1);
  });

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">Kurumsal Mağazalar</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Kurumsal satıcıların mağaza vitrinlerini inceleyin, aktif ilanlarını tek sayfada görün.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {storeProfiles.map((store) => (
          <Link
            key={store.id}
            href={`/magaza/${store.store_slug || store.id}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#f97316]"
          >
            <div className="flex items-center gap-4 border-b border-slate-100 p-5">
              <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                <ImageWithFallback
                  src={store.store_logo_url || ""}
                  alt={store.company_name || store.full_name || "Mağaza"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1e3a5f]">
                  {store.company_name || store.full_name || "Kurumsal Mağaza"}
                </h2>
                <p className="text-sm text-slate-500">{store.city || "Şehir belirtilmedi"}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="line-clamp-3 text-sm text-slate-600">
                {store.store_description || "Bu mağaza için henüz açıklama girilmemiş."}
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                Aktif ilan: {activeListingCountByStore.get(store.id) ?? 0}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
