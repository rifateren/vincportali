import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ListingDetailClient from "./ListingDetailClient";
import { getCloudinaryImageUrl } from "@/lib/cloudinary/url";
import { getCategoryLabel } from "@/lib/categories";
import {
  formatFieldValue,
  getCategoryFormSpec,
  getFieldDefinition,
  type ListingFieldKey,
} from "@/lib/listingCategorySpecs";
import FavoriteButton from "@/components/FavoriteButton";
import ListingMessageComposer from "@/components/ListingMessageComposer";
import ListingSellerPanel from "@/components/ListingSellerPanel";
import { getCityDisplayLabel } from "@/lib/cityDisplayLabels";

type Listing = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  price: number | null;
  year: number | null;
  working_hours: number | null;
  capacity_kg: number | null;
  lift_height_mm: number | null;
  fuel_type: string | null;
  condition: string | null;
  city: string | null;
  district: string | null;
  images: string[] | null;
  contact_name: string | null;
  contact_phone: string | null;
  created_at: string;
  view_count: number | null;
  favorite_count: number | null;
  message_count: number | null;
  specs?: Record<string, string | number> | null;
};

type FavoriteListRow = {
  id: string;
  title: string;
};

type SellerProfileRow = {
  user_type: string | null;
  full_name: string | null;
  company_name: string | null;
  store_slug: string | null;
};

function formatPrice(price: number | null) {
  if (price === null) return "Fiyat sorunuz";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

const LISTING_DETAIL_COLUMNS =
  "id, user_id, title, description, category, brand, model, price, year, working_hours, capacity_kg, lift_height_mm, fuel_type, condition, city, district, images, contact_name, contact_phone, created_at, view_count, favorite_count, message_count";

function parseListingSpecs(raw: unknown): Record<string, string | number> | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return null;
    try {
      const parsed = JSON.parse(t) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, string | number>;
      }
    } catch {
      return null;
    }
    return null;
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, string | number>;
  }
  return null;
}

async function getListingById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select(`${LISTING_DETAIL_COLUMNS}, specs`)
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (data) {
    const row = data as Listing & { specs?: unknown };
    return {
      ...row,
      specs: parseListingSpecs(row.specs),
    };
  }

  // İlk sorgu başarısız (ör. `specs` sütunu yok / şema uyumsuz); satır yok hariç yedek sorgu dene
  if (error?.code === "PGRST116") {
    return null;
  }

  const retry = await supabase
    .from("listings")
    .select(LISTING_DETAIL_COLUMNS)
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (retry.error || !retry.data) {
    return null;
  }

  return {
    ...(retry.data as Listing),
    specs: null,
  };
}

function getCoreFieldValue(listing: Listing, fieldKey: ListingFieldKey) {
  switch (fieldKey) {
    case "brand":
      return listing.brand;
    case "model":
      return listing.model;
    case "year":
      return listing.year;
    case "condition":
      return listing.condition;
    case "working_hours":
      return listing.working_hours;
    case "capacity_kg":
      return listing.capacity_kg;
    case "lift_height_mm":
      return listing.lift_height_mm;
    case "fuel_type":
      return listing.fuel_type;
    default:
      return null;
  }
}

async function increaseViewCount(id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.rpc("increment_listing_view_count", {
    listing_id: id,
  });
}

async function getSimilarListings(category: string | null, id: string) {
  if (!category) return [];

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("listings")
    .select("id, title, price, images")
    .eq("is_active", true)
    .eq("category", category)
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(4);

  return (data ?? []) as Array<{
    id: string;
    title: string;
    price: number | null;
    images: string[] | null;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const listing = await getListingById(params.id);

  if (!listing) {
    return {
      title: "İlan bulunamadı | MakinePazarı",
      description: "Aradığınız ilan bulunamadı.",
    };
  }

  const description =
    listing.description?.slice(0, 160) ??
    `${listing.title} ilan detaylarını MakinePazarı'nda inceleyin.`;

  return {
    title: `${listing.title} | MakinePazarı`,
    description,
    openGraph: {
      title: `${listing.title} | MakinePazarı`,
      description,
      images: listing.images?.[0]
          ? [{ url: getCloudinaryImageUrl(listing.images[0], { width: 1200 }) }]
          : [],
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  await increaseViewCount(listing.id);
  const similarListings = await getSimilarListings(listing.category, listing.id);
  const displayViewCount = (listing.view_count ?? 0) + 1;
  const supabase = createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData.user?.id ?? null;
  const isOwner = currentUserId === listing.user_id;
  let sellerDisplayName = listing.contact_name ?? "Bilinmiyor";
  let storeHref: string | null = null;
  let favoriteLists: FavoriteListRow[] = [];
  let favoriteItemListIds = new Set<string>();
  let existingConversationId: string | null = null;

  {
    let profileData: SellerProfileRow | null = null;

    const full = await supabase
      .from("profiles")
      .select("user_type, full_name, company_name, store_slug")
      .eq("id", listing.user_id)
      .maybeSingle();

    if (full.data) {
      profileData = full.data as SellerProfileRow;
    } else if (full.error) {
      const basic = await supabase
        .from("profiles")
        .select("user_type, full_name, company_name")
        .eq("id", listing.user_id)
        .maybeSingle();
      if (basic.data) {
        profileData = { ...(basic.data as Omit<SellerProfileRow, "store_slug">), store_slug: null };
      }
    }

    const preferredName =
      profileData?.user_type === "kurumsal"
        ? profileData.company_name || profileData.full_name
        : profileData?.full_name;

    if (preferredName) {
      sellerDisplayName = preferredName;
    }

    if (profileData?.user_type === "kurumsal") {
      storeHref = profileData.store_slug
        ? `/magaza/${encodeURIComponent(profileData.store_slug)}`
        : `/magaza/${listing.user_id}`;
    }
  }
  if (currentUserId) {
    const [{ data: listData }, { data: itemData }, { data: conversationData }] = await Promise.all([
      supabase
        .from("favorite_lists")
        .select("id, title")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false }),
      supabase
        .from("favorite_list_items")
        .select("favorite_list_id")
        .eq("listing_id", listing.id),
      isOwner
        ? Promise.resolve({ data: null })
        : supabase
            .from("listing_conversations")
            .select("id")
            .eq("listing_id", listing.id)
            .eq("buyer_id", currentUserId)
            .maybeSingle(),
    ]);

    favoriteLists = (listData ?? []) as FavoriteListRow[];
    favoriteItemListIds = new Set(
      (itemData ?? []).map((item: { favorite_list_id: string }) => item.favorite_list_id),
    );
    existingConversationId = conversationData?.id ?? null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description ?? undefined,
    image: listing.images?.map((img) =>
      img.startsWith("http") ? img : getCloudinaryImageUrl(img, { width: 1200 }),
    ),
    offers: {
      "@type": "Offer",
      price: listing.price ?? undefined,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      itemCondition:
        listing.condition === "sifir"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    },
    brand: listing.brand
      ? { "@type": "Brand", name: listing.brand }
      : undefined,
    countryOfOrigin: { "@type": "Country", name: "TR" },
  };
  const categorySpec = getCategoryFormSpec(listing.category);
  const technicalFields = categorySpec.detailFieldOrder
    .map((fieldKey) => {
      const definition = getFieldDefinition(fieldKey);
      const rawValue =
        definition.source === "core"
          ? getCoreFieldValue(listing, fieldKey)
          : listing.specs?.[fieldKey] ?? null;

      return {
        key: fieldKey,
        label: definition.label,
        value: formatFieldValue(fieldKey, rawValue),
      };
    })
    .filter((item) => item.value !== "-");

  const returnToListing = `/ilan/${listing.id}`;

  const sellerExtras = (
    <>
      {!currentUserId && !isOwner ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">Satıcıya mesaj veya favorilere eklemek için giriş yapın</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href={`/giris?next=${encodeURIComponent(returnToListing)}`}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white"
            >
              Giriş yap
            </Link>
            <Link
              href="/kayit"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#1e3a5f]"
            >
              Kayıt ol
            </Link>
          </div>
        </div>
      ) : null}
      {currentUserId ? (
        <FavoriteButton
          listingId={listing.id}
          isLoggedIn={Boolean(currentUserId)}
          initialLists={favoriteLists.map((list) => ({
            id: list.id,
            title: list.title,
            containsListing: favoriteItemListIds.has(list.id),
          }))}
        />
      ) : null}
      {currentUserId ? (
        <ListingMessageComposer
          listingId={listing.id}
          sellerId={listing.user_id}
          isLoggedIn={Boolean(currentUserId)}
          isOwner={isOwner}
          initialConversationId={existingConversationId}
        />
      ) : null}
    </>
  );

  const sellerPanelProps = {
    sellerDisplayName,
    listingTitle: listing.title,
    contactPhone: listing.contact_phone,
    city: listing.city,
    district: listing.district,
    viewCount: displayViewCount,
    storeHref,
    listedAtLabel: formatDate(listing.created_at),
  };

  const cityShort = listing.city ? getCityDisplayLabel(listing.city) : "—";

  return (
    <main className="min-h-screen bg-white text-[#1e3a5f]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <nav className="mb-6 text-sm text-slate-600">
          <Link href="/" className="hover:text-[#f97316]">
            Ana Sayfa
          </Link>
          <span> &gt; </span>
          <Link
            href={
              listing.category
                ? `/ilanlar?kategori=${encodeURIComponent(listing.category)}`
                : "/ilanlar"
            }
            className="hover:text-[#f97316]"
          >
            {getCategoryLabel(listing.category)}
          </Link>
          <span> &gt; </span>
          <span>{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <ListingDetailClient title={listing.title} images={listing.images ?? []} />

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-2xl font-bold text-[#f97316]">{formatPrice(listing.price)}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-base font-medium text-slate-800">
                <span>Yıl: {listing.year ?? "—"}</span>
                <span>Çalışma saati: {listing.working_hours ?? "—"}</span>
                <span>{cityShort}</span>
                {listing.district ? <span>{listing.district}</span> : null}
              </div>
            </div>

            <div className="mt-6 lg:hidden">
              <ListingSellerPanel {...sellerPanelProps}>{sellerExtras}</ListingSellerPanel>
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold sm:text-3xl">{listing.title}</h1>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {technicalFields.map((field) => (
                <div key={field.key} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">{field.label}</p>
                  <p className="text-base font-semibold">{field.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold">Açıklama</h2>
              <p className="mt-3 whitespace-pre-line text-base text-slate-700">
                {listing.description ?? "Bu ilan için açıklama girilmemiş."}
              </p>
            </div>
          </section>

          <aside className="hidden lg:col-span-1 lg:block">
            <div className="space-y-4 lg:sticky lg:top-6">
              <ListingSellerPanel {...sellerPanelProps}>{sellerExtras}</ListingSellerPanel>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Benzer İlanlar</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similarListings.map((item) => (
              <Link
                key={item.id}
                href={`/ilan/${item.id}`}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="h-40 bg-slate-100">
                  {item.images?.[0] ? (
                    <Image
                      src={getCloudinaryImageUrl(item.images[0], {
                        width: 400,
                        height: 260,
                        crop: "fill",
                        gravity: "auto",
                      })}
                      alt={item.title}
                      width={400}
                      height={260}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      Görsel yok
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm font-bold text-[#f97316]">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

