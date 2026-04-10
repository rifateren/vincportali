import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCloudinaryImageUrl } from "@/lib/cloudinary/url";
import ListingsFilterForm from "@/components/ListingsFilterForm";
import { cityOptions } from "@/lib/listingFormOptions";
import { getCityDisplayLabel } from "@/lib/cityDisplayLabels";

export const metadata: Metadata = {
  title: "İlanlar - İş Makinesi Al Sat | MakinePazarı",
  description:
    "Sıfır ve ikinci el iş makinesi ilanları. Forklift, platform, vinç, ekskavatör ve daha fazlası. Filtrele, karşılaştır, en uygun fiyatı bul.",
  openGraph: {
    title: "İlanlar - İş Makinesi Al Sat | MakinePazarı",
    description:
      "Sıfır ve ikinci el iş makinesi ilanları. Forklift, platform, vinç, ekskavatör ve daha fazlası.",
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

type Listing = {
  id: string;
  title: string;
  price: number | null;
  city: string | null;
  year: number | null;
  working_hours: number | null;
  images: string[] | null;
  category: string | null;
  brand: string | null;
  condition: string | null;
  created_at: string;
};

const PAGE_SIZE = 12;

const CITY_OPTIONS_UI = cityOptions.map((value) => ({
  value,
  label: getCityDisplayLabel(value),
}));

const mockListings: Listing[] = [
  {
    id: "mock-1",
    title: "2.5 Ton Elektrikli Forklift",
    price: 850000,
    city: "Istanbul",
    year: 2021,
    working_hours: 1800,
    images: [],
    category: "forklift",
    brand: "Toyota",
    condition: "ikinci-el",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    title: "8 Metre Makasli Platform",
    price: 710000,
    city: "Ankara",
    year: 2020,
    working_hours: 1200,
    images: [],
    category: "platformlar-manlift",
    brand: "JLG",
    condition: "sifir",
    created_at: new Date().toISOString(),
  },
];

function getArrayParam(searchParams: SearchParams, key: string): string[] {
  const value = searchParams[key];
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function getStringParam(searchParams: SearchParams, key: string): string | undefined {
  const value = searchParams[key];
  if (!value) return undefined;
  const s = Array.isArray(value) ? value[0] : value;
  const t = s?.trim();
  return t ? t : undefined;
}

function getNumberParam(searchParams: SearchParams, key: string): number | undefined {
  const raw = getStringParam(searchParams, key);
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function formatPrice(price: number | null) {
  if (price === null) return "Fiyat sorunuz";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function cloneSearchParamsToURL(sp: SearchParams): URLSearchParams {
  const u = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((v) => u.append(key, v));
    } else if (value !== "") {
      u.set(key, value);
    }
  }
  return u;
}

function hrefWithoutKeys(sp: SearchParams, keys: string[]): string {
  const u = cloneSearchParamsToURL(sp);
  for (const k of keys) {
    u.delete(k);
  }
  u.delete("sayfa");
  const query = u.toString();
  return query ? `/ilanlar?${query}` : "/ilanlar";
}

function buildUrl(searchParams: SearchParams, updates: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    params.delete(key);
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `/ilanlar?${query}` : "/ilanlar";
}

function sanitizeIlikeFragment(raw: string): string {
  return raw.replace(/[%_\\]/g, "").trim();
}

type ActiveChip = { label: string; clearKeys: string[] };

function buildActiveFilterChips(
  sp: SearchParams,
  opts: {
    searchQuery?: string;
    selectedCategories: string[];
    selectedBrands: string[];
    selectedCondition?: string;
    selectedCity?: string;
    districtQuery?: string;
    minPrice?: number;
    maxPrice?: number;
    maxWorkingHours?: number;
    minYear?: number;
    maxYear?: number;
    minCapacityKg?: number;
    maxCapacityKg?: number;
  },
): ActiveChip[] {
  const chips: ActiveChip[] = [];
  if (opts.searchQuery) {
    chips.push({ label: `"${opts.searchQuery}"`, clearKeys: ["q"] });
  }
  if (opts.selectedCategories.length > 0) {
    chips.push({
      label: `Kategori (${opts.selectedCategories.length})`,
      clearKeys: ["kategori"],
    });
  }
  if (opts.selectedBrands.length > 0) {
    chips.push({
      label: `Marka (${opts.selectedBrands.length})`,
      clearKeys: ["marka"],
    });
  }
  if (opts.selectedCondition) {
    chips.push({
      label: opts.selectedCondition === "sifir" ? "Sıfır" : "İkinci el",
      clearKeys: ["durum"],
    });
  }
  if (opts.selectedCity) {
    chips.push({
      label: getCityDisplayLabel(opts.selectedCity),
      clearKeys: ["sehir"],
    });
  }
  if (opts.districtQuery) {
    chips.push({ label: `İlçe: ${opts.districtQuery}`, clearKeys: ["ilce"] });
  }
  if (opts.minYear !== undefined || opts.maxYear !== undefined) {
    const a = opts.minYear !== undefined ? String(opts.minYear) : "…";
    const b = opts.maxYear !== undefined ? String(opts.maxYear) : "…";
    chips.push({ label: `Yıl: ${a}–${b}`, clearKeys: ["yilMin", "yilMax"] });
  }
  if (opts.minCapacityKg !== undefined || opts.maxCapacityKg !== undefined) {
    const a = opts.minCapacityKg !== undefined ? `${opts.minCapacityKg} kg` : "…";
    const b = opts.maxCapacityKg !== undefined ? `${opts.maxCapacityKg} kg` : "…";
    chips.push({ label: `Kapasite: ${a} – ${b}`, clearKeys: ["kapasiteMin", "kapasiteMax"] });
  }
  if (opts.minPrice !== undefined || opts.maxPrice !== undefined) {
    const a = opts.minPrice !== undefined ? formatPrice(opts.minPrice) : "…";
    const b = opts.maxPrice !== undefined ? formatPrice(opts.maxPrice) : "…";
    chips.push({ label: `Fiyat: ${a} – ${b}`, clearKeys: ["fiyatMin", "fiyatMax"] });
  }
  if (opts.maxWorkingHours !== undefined) {
    chips.push({
      label: `Saat ≤ ${opts.maxWorkingHours}`,
      clearKeys: ["saatMax"],
    });
  }
  return chips;
}

function FilterPreservingSortForm({
  searchParams,
  sort,
}: {
  searchParams: SearchParams;
  sort: string;
}) {
  const q = getStringParam(searchParams, "q");
  const selectedCategories = getArrayParam(searchParams, "kategori");
  const selectedBrands = getArrayParam(searchParams, "marka");
  const selectedCondition = getStringParam(searchParams, "durum");
  const selectedCity = getStringParam(searchParams, "sehir");
  const ilce = getStringParam(searchParams, "ilce");
  const minPrice = getNumberParam(searchParams, "fiyatMin");
  const maxPrice = getNumberParam(searchParams, "fiyatMax");
  const maxWorkingHours = getNumberParam(searchParams, "saatMax");
  const minYear = getNumberParam(searchParams, "yilMin");
  const maxYear = getNumberParam(searchParams, "yilMax");
  const minCapacityKg = getNumberParam(searchParams, "kapasiteMin");
  const maxCapacityKg = getNumberParam(searchParams, "kapasiteMax");

  return (
    <form
      action="/ilanlar"
      method="get"
      className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2"
    >
      {q && <input type="hidden" name="q" value={q} />}
      {selectedCategories.map((v) => (
        <input key={`k-${v}`} type="hidden" name="kategori" value={v} />
      ))}
      {selectedBrands.map((v) => (
        <input key={`m-${v}`} type="hidden" name="marka" value={v} />
      ))}
      {selectedCondition && <input type="hidden" name="durum" value={selectedCondition} />}
      {selectedCity && <input type="hidden" name="sehir" value={selectedCity} />}
      {ilce && <input type="hidden" name="ilce" value={ilce} />}
      {typeof minPrice === "number" && <input type="hidden" name="fiyatMin" value={minPrice} />}
      {typeof maxPrice === "number" && <input type="hidden" name="fiyatMax" value={maxPrice} />}
      {typeof maxWorkingHours === "number" && (
        <input type="hidden" name="saatMax" value={maxWorkingHours} />
      )}
      {typeof minYear === "number" && <input type="hidden" name="yilMin" value={minYear} />}
      {typeof maxYear === "number" && <input type="hidden" name="yilMax" value={maxYear} />}
      {typeof minCapacityKg === "number" && (
        <input type="hidden" name="kapasiteMin" value={minCapacityKg} />
      )}
      {typeof maxCapacityKg === "number" && (
        <input type="hidden" name="kapasiteMax" value={maxCapacityKg} />
      )}

      <select
        name="sirala"
        defaultValue={sort}
        className="min-h-[44px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f97316] sm:w-auto"
      >
        <option value="en-yeni">En yeni</option>
        <option value="fiyat-artan">En düşük fiyat</option>
        <option value="fiyat-azalan">En yüksek fiyat</option>
      </select>
      <button
        type="submit"
        className="min-h-[44px] rounded-lg bg-[#f97316] px-4 py-2 text-sm font-semibold text-white"
      >
        Uygula
      </button>
    </form>
  );
}

export default async function ListingsPage({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const searchQuery = getStringParam(searchParams, "q")?.trim() || undefined;
  const selectedCategories = getArrayParam(searchParams, "kategori");
  const selectedBrands = getArrayParam(searchParams, "marka");
  const selectedCondition = getStringParam(searchParams, "durum");
  const selectedCity = getStringParam(searchParams, "sehir");
  const districtQuery = getStringParam(searchParams, "ilce");
  const minPrice = getNumberParam(searchParams, "fiyatMin");
  const maxPrice = getNumberParam(searchParams, "fiyatMax");
  const maxWorkingHours = getNumberParam(searchParams, "saatMax");
  const minYear = getNumberParam(searchParams, "yilMin");
  const maxYear = getNumberParam(searchParams, "yilMax");
  const minCapacityKg = getNumberParam(searchParams, "kapasiteMin");
  const maxCapacityKg = getNumberParam(searchParams, "kapasiteMax");
  const sort = getStringParam(searchParams, "sirala") ?? "en-yeni";
  const currentPage = Math.max(getNumberParam(searchParams, "sayfa") ?? 1, 1);

  let listings: Listing[] = [];
  let totalCount = 0;
  let allBrands: string[] = [];

  try {
    const supabase = createSupabaseServerClient();

    const { data: brandRows } = await supabase
      .from("listings")
      .select("brand")
      .eq("is_active", true)
      .not("brand", "is", null)
      .limit(3000);

    const brandSet = new Set<string>();
    (brandRows ?? []).forEach((row) => {
      const brand = (row.brand ?? "").trim();
      if (brand) brandSet.add(brand);
    });
    allBrands = Array.from(brandSet).sort((a, b) => a.localeCompare(b, "tr"));

    let query = supabase
      .from("listings")
      .select(
        "id, title, price, city, year, working_hours, images, category, brand, condition, created_at",
        { count: "exact" },
      )
      .eq("is_active", true);

    if (searchQuery) {
      const isUuidPrefix = /^[0-9a-f]{8}-/.test(searchQuery);
      if (isUuidPrefix) {
        query = query.eq("id", searchQuery);
      } else {
        query = query.or(
          `title.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,contact_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
        );
      }
    }
    if (selectedCategories.length > 0) query = query.in("category", selectedCategories);
    if (selectedBrands.length > 0) query = query.in("brand", selectedBrands);
    if (selectedCondition) query = query.eq("condition", selectedCondition);
    if (selectedCity) query = query.eq("city", selectedCity);
    const safeDistrict = districtQuery ? sanitizeIlikeFragment(districtQuery) : "";
    if (safeDistrict) {
      query = query.ilike("district", `%${safeDistrict}%`);
    }
    if (typeof minPrice === "number") query = query.gte("price", minPrice);
    if (typeof maxPrice === "number") query = query.lte("price", maxPrice);
    if (typeof maxWorkingHours === "number") query = query.lte("working_hours", maxWorkingHours);
    if (typeof minYear === "number") query = query.gte("year", minYear);
    if (typeof maxYear === "number") query = query.lte("year", maxYear);
    if (typeof minCapacityKg === "number") query = query.gte("capacity_kg", minCapacityKg);
    if (typeof maxCapacityKg === "number") query = query.lte("capacity_kg", maxCapacityKg);

    if (sort === "fiyat-artan") {
      query = query.order("price", { ascending: true, nullsFirst: false });
    } else if (sort === "fiyat-azalan") {
      query = query.order("price", { ascending: false, nullsFirst: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, count, error } = await query.range(from, to);

    if (error) throw error;

    listings = (data ?? []) as Listing[];
    totalCount = count ?? 0;
  } catch (error) {
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.warn("[ilanlar] Supabase sorgusu başarısız, geliştirme modunda mock veri kullanılıyor.", error);
      listings = mockListings.slice(0, PAGE_SIZE);
      totalCount = mockListings.length;
      allBrands = ["Toyota", "JLG", "Linde", "Still", "Hyster"];
    } else {
      console.error("[ilanlar] Supabase sorgusu başarısız.", error);
      listings = [];
      totalCount = 0;
      allBrands = [];
    }
  }

  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);
  const prevPage = currentPage > 1 ? currentPage - 1 : undefined;
  const nextPage = currentPage < totalPages ? currentPage + 1 : undefined;

  const activeChips = buildActiveFilterChips(searchParams, {
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedCondition,
    selectedCity,
    districtQuery,
    minPrice,
    maxPrice,
    maxWorkingHours,
    minYear,
    maxYear,
    minCapacityKg,
    maxCapacityKg,
  });

  const filterFormProps = {
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedCondition,
    selectedCity,
    districtQuery,
    minPrice,
    maxPrice,
    maxWorkingHours,
    minYear,
    maxYear,
    minCapacityKg,
    maxCapacityKg,
    sort,
    allBrands,
    cityOptions: CITY_OPTIONS_UI,
  };

  return (
    <main className="min-h-screen bg-white text-[#1e3a5f]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[minmax(280px,320px)_1fr] lg:px-8">
        <aside className="hidden rounded-xl border border-slate-200 bg-white p-5 lg:block">
          <ListingsFilterForm {...filterFormProps} />
        </aside>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <details className="w-full sm:max-w-[200px] lg:hidden">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">
                <Menu size={18} />
                Filtreler
              </summary>
              <div className="mt-3 max-h-[min(70vh,520px)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
                <ListingsFilterForm {...filterFormProps} />
              </div>
            </details>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="text-sm text-slate-600">
                <span className="text-base font-semibold text-[#1e3a5f]">{totalCount}</span> ilan
                {searchQuery && (
                  <span className="ml-1 text-slate-400">
                    &middot; &quot;{searchQuery}&quot;
                  </span>
                )}
              </p>
              {activeChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeChips.map((chip) => (
                    <Link
                      key={chip.label}
                      href={hrefWithoutKeys(searchParams, chip.clearKeys)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[#f97316] hover:text-[#f97316]"
                    >
                      <span>{chip.label}</span>
                      <span aria-hidden className="text-slate-400">
                        ×
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/ilanlar"
                    className="inline-flex items-center rounded-full px-2 py-1.5 text-xs font-semibold text-[#f97316] underline-offset-2 hover:underline"
                  >
                    Tümünü temizle
                  </Link>
                </div>
              )}
            </div>

            <FilterPreservingSortForm searchParams={searchParams} sort={sort} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => {
              const publicId = listing.images?.[0];
              return (
                <Link
                  key={listing.id}
                  href={`/ilan/${listing.id}`}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-100">
                    {publicId ? (
                      <Image
                        src={getCloudinaryImageUrl(publicId, {
                          width: 400,
                          height: 300,
                          crop: "fill",
                          gravity: "auto",
                        })}
                        alt={listing.title}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-500">
                        Görsel yok
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 text-base font-semibold">{listing.title}</h3>
                    <p className="mt-2 text-lg font-bold text-[#f97316]">{formatPrice(listing.price)}</p>
                    <p className="mt-2 text-base text-slate-700">
                      {listing.city ? getCityDisplayLabel(listing.city) : "Bilinmiyor"} · Yıl{" "}
                      {listing.year ?? "—"}
                    </p>
                    <p className="text-base text-slate-600">
                      Çalışma saati: {listing.working_hours ?? "—"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {listings.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              Aramanıza uygun ilan bulunamadı.
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {prevPage ? (
              <Link
                href={buildUrl(searchParams, { sayfa: String(prevPage) })}
                className="min-h-[44px] rounded-lg border border-slate-300 px-4 py-2 text-sm hover:border-[#f97316] hover:text-[#f97316]"
              >
                Önceki
              </Link>
            ) : (
              <span className="min-h-[44px] rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400">
                Önceki
              </span>
            )}

            <span className="text-sm text-slate-600">
              Sayfa {currentPage} / {totalPages}
            </span>

            {nextPage ? (
              <Link
                href={buildUrl(searchParams, { sayfa: String(nextPage) })}
                className="min-h-[44px] rounded-lg border border-slate-300 px-4 py-2 text-sm hover:border-[#f97316] hover:text-[#f97316]"
              >
                Sonraki
              </Link>
            ) : (
              <span className="min-h-[44px] rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400">
                Sonraki
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
