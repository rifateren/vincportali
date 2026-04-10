import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ListingActions from "@/components/ListingActions";

type AdminListing = {
  id: string;
  title: string;
  price: number | null;
  is_active: boolean;
  created_at: string;
  user_id: string;
  contact_name: string | null;
  city: string | null;
  category: string | null;
};

function formatPrice(price: number | null) {
  if (price === null) return "Belirtilmedi";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams?: { sayfa?: string; durum?: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", authData.user.id)
    .single();

  if (!profile?.is_admin) {
    notFound();
  }

  const currentPage = Math.max(Number(searchParams?.sayfa) || 1, 1);
  const statusFilter = searchParams?.durum;
  const PAGE_SIZE = 20;

  let query = supabase
    .from("listings")
    .select("id, title, price, is_active, created_at, user_id, contact_name, city, category", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (statusFilter === "aktif") {
    query = query.eq("is_active", true);
  } else if (statusFilter === "pasif") {
    query = query.eq("is_active", false);
  }

  const from = (currentPage - 1) * PAGE_SIZE;
  const { data, count } = await query.range(from, from + PAGE_SIZE - 1);

  const listings = (data ?? []) as AdminListing[];
  const totalPages = Math.max(Math.ceil((count ?? 0) / PAGE_SIZE), 1);

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a5f]">İlan Moderasyonu</h1>
          <p className="mt-1 text-sm text-slate-600">{count ?? 0} ilan toplam</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-[#f97316] hover:underline">
          Panel
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        {[
          { label: "Tümü", value: undefined },
          { label: "Aktif", value: "aktif" },
          { label: "Pasif", value: "pasif" },
        ].map((opt) => (
          <Link
            key={opt.label}
            href={opt.value ? `/admin/ilanlar?durum=${opt.value}` : "/admin/ilanlar"}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              statusFilter === opt.value || (!statusFilter && !opt.value)
                ? "bg-[#1e3a5f] text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link href={`/ilan/${listing.id}`} className="font-semibold text-[#1e3a5f] hover:text-[#f97316]">
                  {listing.title}
                </Link>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    listing.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {listing.is_active ? "Aktif" : "Pasif"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {formatPrice(listing.price)} &middot; {listing.city || "-"} &middot;{" "}
                {listing.contact_name || "-"} &middot;{" "}
                {new Date(listing.created_at).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <ListingActions listingId={listing.id} isActive={listing.is_active} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {currentPage > 1 ? (
          <Link
            href={`/admin/ilanlar?sayfa=${currentPage - 1}${statusFilter ? `&durum=${statusFilter}` : ""}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:border-[#f97316]"
          >
            Önceki
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400">Önceki</span>
        )}
        <span className="text-sm text-slate-600">
          {currentPage} / {totalPages}
        </span>
        {currentPage < totalPages ? (
          <Link
            href={`/admin/ilanlar?sayfa=${currentPage + 1}${statusFilter ? `&durum=${statusFilter}` : ""}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:border-[#f97316]"
          >
            Sonraki
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400">Sonraki</span>
        )}
      </div>
    </main>
  );
}
