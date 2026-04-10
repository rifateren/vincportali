import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const BASE_URL = "https://makinepazari.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/ilanlar`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/magazalar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/hakkimizda`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/iletisim`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/kullanim-kosullari`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${BASE_URL}/gizlilik-politikasi`, changeFrequency: "monthly", priority: 0.2 },
  ];

  try {
    const supabase = createSupabaseServerClient();

    const { data: listings } = await supabase
      .from("listings")
      .select("id, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (listings) {
      for (const listing of listings) {
        entries.push({
          url: `${BASE_URL}/ilan/${listing.id}`,
          lastModified: new Date(listing.created_at),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    const { data: stores } = await supabase
      .from("profiles")
      .select("id, store_slug")
      .eq("user_type", "kurumsal");

    if (stores) {
      for (const store of stores) {
        entries.push({
          url: `${BASE_URL}/magaza/${store.store_slug || store.id}`,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // Return static entries if DB is unavailable
  }

  return entries;
}
