import Image from "next/image";
import Link from "next/link";
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
  images: string[] | null;
};

function formatPrice(price: number | null) {
  if (price === null) return "Belirtilmedi";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function buildQuery(parts: { sayfa?: string; durum?: string; q?: string }) {
  const sp = new URLSearchParams();
  if (parts.sayfa && parts.sayfa !== "1") sp.set("sayfa", parts.sayfa);
  if (parts.durum) sp.set("durum", parts.durum);
  if (parts.q?.trim()) sp.set("q", parts.q.trim());
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams?: { sayfa?: string; durum?: string; q?: string };
}) {
  const supabase = createSupabaseServerClient();

  const currentPage = Math.max(Number(searchParams?.sayfa) || 1, 1);
  const statusFilter = searchParams?.durum;
  const qRaw = (searchParams?.q ?? "").trim().slice(0, 120);
  const PAGE_SIZE = 20;

  let query = supabase
    .from("listings")
    .select(
      "id, title, price, is_active, created_at, user_id, contact_name, city, category, images",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (statusFilter === "aktif") {
    query = query.eq("is_active", true);
  } else if (statusFilter === "pasif") {
    query = query.eq("is_active", false);
  }

  if (qRaw) {
    const isUuidPrefix = /^[0-9a-f]{8}-/i.test(qRaw);
    if (isUuidPrefix) {
      query = query.eq("id", qRaw);
    } else {
      query = query.or(
        `title.ilike.%${qRaw}%,city.ilike.%${qRaw}%,category.ilike.%${qRaw}%,contact_name.ilike.%${qRaw}%`,
      );
    }
  }

  const from = (currentPage - 1) * PAGE_SIZE;
  const { data, count } = await query.range(from, from + PAGE_SIZE - 1);

  const listings = (data ?? []) as AdminListing[];
  const totalPages = Math.max(Math.ceil((count ?? 0) / PAGE_SIZE), 1);

  const qPersist = qRaw;
  const baseNav = { durum: statusFilter, q: qPersist };

  return (
    <main className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f] sm:text-3xl">İlan moderasyonu</h1>
          <p className="mt-1 text-sm text-slate-600">{count ?? 0} ilan</p>
        </div>
      </div>

      <form
        action="/admin/ilanlar"
        method="get"
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        role="search"
      >
        <label className="sr-only" htmlFor="admin-ilan-q">
          İlan ara
        </label>
        <input
          id="admin-ilan-q"
          type="search"
          name="q"
          defaultValue={qPersist}
          placeholder="Başlık, şehir, kategori, ilan no…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#1e3a5f] shadow-sm focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/25"
        />
        {statusFilter ? <input type="hidden" name="durum" value={statusFilter} /> : null}
        <button
          type="submit"
          className="rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#163252]"
        >
          Ara
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: "Tümü", value: undefined as string | undefined },
          { label: "Aktif", value: "aktif" },
          { label: "Pasif", value: "pasif" },
        ].map((opt) => (
          <Link
            key={opt.label}
            href={`/admin/ilanlar${buildQuery({ ...baseNav, durum: opt.value })}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              statusFilter === opt.value || (!statusFilter && !opt.value)
                ? "bg-[#1e3a5f] text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {listings.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
            Kriterlere uyan ilan yok.
          </p>
        ) : (
          listings.map((listing) => {
            const thumb = listing.images?.[0];
            return (
              <div
                key={listing.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                        —
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/ilan/${listing.id}`}
                        className="font-semibold text-[#1e3a5f] hover:text-[#f97316] line-clamp-2"
                      >
                        {listing.title}
                      </Link>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          listing.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {listing.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      <code className="rounded bg-slate-100 px-1 text-[10px]" title={listing.id}>
                        {listing.id.slice(0, 8)}…
                      </code>
                      {" · "}
                      {formatPrice(listing.price)} · {listing.city || "-"} · {listing.contact_name || "-"} ·{" "}
                      {new Date(listing.created_at).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
                <ListingActions listingId={listing.id} isActive={listing.is_active} />
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {currentPage > 1 ? (
          <Link
            href={`/admin/ilanlar${buildQuery({ sayfa: String(currentPage - 1), ...baseNav })}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-[#f97316]"
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
            href={`/admin/ilanlar${buildQuery({ sayfa: String(currentPage + 1), ...baseNav })}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-[#f97316]"
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
