import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCloudinaryImageUrl } from "@/lib/cloudinary/url";
import { ALL_CATEGORIES, getCategoryLabel } from "@/lib/categories";
import ImageWithFallback from "@/components/ImageWithFallback";

export const revalidate = 60;

type Listing = {
  id: string;
  title: string;
  price: number | null;
  city: string | null;
  category: string | null;
  year: number | null;
  working_hours: number | null;
  images: string[] | null;
  condition: string | null;
  contact_name: string | null;
  created_at: string;
};

const mockListings: Listing[] = [
  {
    id: "mock-hero-1",
    title: "Toyota 8FBN25 Elektrikli Forklift",
    price: 485000,
    city: "İstanbul",
    category: "forklift",
    year: 2021,
    working_hours: 1800,
    images: [
      "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=1200&q=80",
    ],
    condition: "ikinci-el",
    contact_name: "Akış Makine",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-hero-2",
    title: "CAT 320 GC Paletli Ekskavatör",
    price: 3250000,
    city: "Ankara",
    category: "ekskavator-kepce",
    year: 2019,
    working_hours: 4200,
    images: [
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80",
    ],
    condition: "sifir",
    contact_name: "Borusan Makina",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-hero-3",
    title: "JLG 860SJ Teleskopik Platform",
    price: 1120000,
    city: "Kocaeli",
    category: "platformlar-manlift",
    year: 2022,
    working_hours: 600,
    images: [
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80",
    ],
    condition: "ikinci-el",
    contact_name: "Yüksel Kiralama",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-hero-4",
    title: "Linde T20 Elektrikli Transpalet",
    price: 215000,
    city: "Bursa",
    category: "transpaletler",
    year: 2020,
    working_hours: 1250,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    ],
    condition: "sifir",
    contact_name: "Depo Lojistik",
    created_at: new Date().toISOString(),
  },
];

function formatPrice(price: number | null) {
  if (price === null) return "Fiyat sorunuz";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

async function getLatestListings(): Promise<Listing[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("listings")
      .select("id, title, price, city, category, year, working_hours, images, condition, contact_name, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(18);

    if (error || !data) {
      return [];
    }

    return data as Listing[];
  } catch {
    return [];
  }
}

function formatRelativeTime(dateString: string) {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffHours = Math.max(1, Math.floor((now - then) / (1000 * 60 * 60)));

  if (diffHours < 24) return `${diffHours} saat önce`;
  return `${Math.floor(diffHours / 24)} gün önce`;
}

function formatCount(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

function getBadge(listing: Listing) {
  const hoursAgo = (Date.now() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 24) return { label: "Yeni", className: "badge-new" };
  if (listing.condition === "sifir") return { label: "Sıfır", className: "badge-featured" };
  return null;
}

async function getHomepageStats() {
  try {
    const supabase = createSupabaseServerClient();
    const [{ count: activeCount }, { data: facets }] = await Promise.all([
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("listings")
        .select("category, city, contact_name")
        .eq("is_active", true),
    ]);

    const categorySet = new Set(
      (facets ?? [])
        .map((item) => item.category)
        .filter((value): value is string => Boolean(value)),
    );
    const citySet = new Set(
      (facets ?? [])
        .map((item) => item.city)
        .filter((value): value is string => Boolean(value)),
    );
    const sellerSet = new Set(
      (facets ?? [])
        .map((item) => item.contact_name)
        .filter((value): value is string => Boolean(value)),
    );

    return {
      activeListings: activeCount ?? 0,
      registeredSellers: sellerSet.size,
      categoryCount: categorySet.size,
      cityCount: citySet.size,
    };
  } catch {
    return {
      activeListings: 0,
      registeredSellers: 0,
      categoryCount: 0,
      cityCount: 0,
    };
  }
}

export default async function HomePage() {
  const [latestListings, homepageStats] = await Promise.all([
    getLatestListings(),
    getHomepageStats(),
  ]);
  const newestListings = latestListings.slice(0, 8);
  const stats = [
    { value: formatCount(homepageStats.activeListings), label: "Aktif İlan" },
    { value: formatCount(homepageStats.registeredSellers), label: "Kayıtlı Mağaza" },
    { value: formatCount(homepageStats.categoryCount), label: "Kategori" },
    { value: formatCount(homepageStats.cityCount), label: "İlden Hizmet" },
  ];
  const heroTags = [
    { label: "Forklift", emoji: "\u{1F3D7}\uFE0F", value: "forklift" },
    { label: "Terminal Çekici", emoji: "\u{1F69B}", value: "terminal-cekici" },
    { label: "Platform - Manlift", emoji: "\u{1F3E2}", value: "platformlar-manlift" },
    { label: "Transpaletler", emoji: "\u{1F4E6}", value: "transpaletler" },
    { label: "İstif Makineleri", emoji: "\u{1F527}", value: "istif-makineleri" },
    { label: "Beko Loder", emoji: "\u26CF\uFE0F", value: "beko-loder-kazici-yukleyici" },
  ];
  const categoryCards = [
    { label: "Forklift", emoji: "\u{1F3D7}\uFE0F", bg: "#fef3c7", value: "forklift" },
    { label: "Terminal Çekici", emoji: "\u{1F69B}", bg: "#dbeafe", value: "terminal-cekici" },
    { label: "Platform / Manlift", emoji: "\u{1F3E2}", bg: "#e0e7ff", value: "platformlar-manlift" },
    { label: "Transpaletler", emoji: "\u{1F4E6}", bg: "#fce7f3", value: "transpaletler" },
    { label: "İstif Makineleri", emoji: "\u{1F527}", bg: "#f3e8ff", value: "istif-makineleri" },
    { label: "Beko Loder", emoji: "\u26CF\uFE0F", bg: "#fed7aa", value: "beko-loder-kazici-yukleyici" },
    { label: "Ekskavatör", emoji: "\u{1F3D7}\uFE0F", bg: "#fef9c3", value: "ekskavator-kepce" },
    { label: "Mobil Vinç", emoji: "\u{1F3D7}\uFE0F", bg: "#dbeafe", value: "mobil-vinc" },
    { label: "Teleskopik Yükleyici", emoji: "\u{1F69C}", bg: "#d1fae5", value: "teleskopik-yukleyici" },
    { label: "Dozer", emoji: "\u{1F6A7}", bg: "#e2e8f0", value: "dozer" },
    { label: "Loder", emoji: "\u26CF\uFE0F", bg: "#fce4ec", value: "loder-yukleyici" },
    { label: "Transmikser", emoji: "\u{1F3ED}", bg: "#e8eaf6", value: "transmikser" },
  ];
  const supabase = createSupabaseServerClient();
  const categoryCounts = await Promise.all(
    categoryCards.map(async (category) => {
      const { count } = await supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .eq("category", category.value);
      return { ...category, count: count ?? 0 };
    }),
  );

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content fade-up">
            <h1>
              {"Türkiye'nin"} <span>{"İş Makineleri"}</span> {"Pazarı"}
            </h1>
            <p>
              {"Doğru makineyi hızlıca bulun, güvenle ilan verin. Sıfır ve ikinci el iş makinelerinde tek adres."}
            </p>
          </div>
          <form action="/ilanlar" method="get" className="hero-search fade-up-delay-1">
            <input name="q" type="text" placeholder="Hangi makineyi arıyorsunuz?" />
            <select name="kategori" defaultValue="">
              <option value="">{"Tüm Kategoriler"}</option>
              <option value="forklift">Forklift</option>
              <option value="terminal-cekici">{"Terminal Çekici"}</option>
              <option value="platformlar-manlift">Platform - Manlift</option>
              <option value="transpaletler">Transpaletler</option>
              <option value="istif-makineleri">{"İstif Makineleri"}</option>
              <option value="beko-loder-kazici-yukleyici">Beko Loder</option>
              <option value="ekskavator-kepce">{"Ekskavatör"}</option>
              <option value="dozer">Dozer</option>
            </select>
            <select name="sehir" defaultValue="">
              <option value="">{"Tüm İller"}</option>
              <option value="İstanbul">{"İstanbul"}</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">{"İzmir"}</option>
              <option value="Bursa">Bursa</option>
              <option value="Kocaeli">Kocaeli</option>
            </select>
            <button type="submit">{"\u{1F50D} Ara"}</button>
          </form>
          <div className="quick-tags fade-up-delay-2">
            {heroTags.map((tag) => (
              <Link key={tag.value} href={`/ilanlar?kategori=${tag.value}`} className="quick-tag">
                {tag.emoji} {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container stats-wrap">
        <div className="stats-bar">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container content-section">
        <div className="section-head">
          <h2>Kategoriler</h2>
          <Link href="/ilanlar">{"Tümünü Gör >"}</Link>
        </div>
        <div className="categories-grid">
          {categoryCounts.map((category, index) => (
            <Link
              key={category.value}
              href={`/ilanlar?kategori=${category.value}`}
              className="category-card"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <span className="category-icon" style={{ backgroundColor: category.bg }}>
                {category.emoji}
              </span>
              <h3>{category.label}</h3>
              <p>{formatCount(category.count)} ilan</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container content-section">
        <div className="section-head">
          <h2>{"Son Eklenen İlanlar"}</h2>
          <Link href="/ilanlar">{"Tüm İlanlar >"}</Link>
        </div>
        <div className="listings-grid">
          {newestListings.map((listing, index) => {
            const badge = getBadge(listing);
            const maybeCloudinary = listing.images?.[0];
            const imageUrl =
              maybeCloudinary && maybeCloudinary.startsWith("http")
                ? maybeCloudinary
                : maybeCloudinary
                  ? getCloudinaryImageUrl(maybeCloudinary, {
                      width: 900,
                      height: 600,
                      crop: "fill",
                      gravity: "auto",
                    })
                  : "";
            return (
              <Link
                key={`latest-${listing.id}`}
                href={`/ilan/${listing.id}`}
                className="listing-card"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className="listing-media">
                  <ImageWithFallback src={imageUrl} alt={listing.title} className="listing-image" />
                  {badge ? <span className={`listing-badge ${badge.className}`}>{badge.label}</span> : null}
                  <span className="listing-condition">
                    {listing.condition === "sifir" ? "Sıfır" : "İkinci El"}
                  </span>
                </div>
                <div className="listing-body">
                  <p className="listing-category">
                    {getCategoryLabel(listing.category || ALL_CATEGORIES[0]?.value)}
                  </p>
                  <h3>{listing.title}</h3>
                  <div className="listing-meta">
                    <span>{"\u{1F4CD}"} {listing.city ?? "Bilinmiyor"}</span>
                    <span>{"\u{1F552}"} {formatRelativeTime(listing.created_at)}</span>
                  </div>
                  <div className="listing-footer">
                    <strong>{formatPrice(listing.price)}</strong>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container content-section why-section">
        <div className="section-head">
          <h2>{"Neden MakinePazarı?"}</h2>
        </div>
        <div className="why-grid">
          <article className="why-card" style={{ animationDelay: "0.1s" }}>
            <div className="why-icon icon-blue">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3 5 6v6c0 4.2 2.9 8 7 9 4.1-1 7-4.8 7-9V6l-7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
            <h3>{"Güvenli Alışveriş"}</h3>
            <p>{"Doğrulanmış mağazalar ve detaylı ilan bilgileri ile güvenli bir alım satım deneyimi."}</p>
          </article>
          <article className="why-card" style={{ animationDelay: "0.15s" }}>
            <div className="why-icon icon-green">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>
            <h3>{"Hızlı İletişim"}</h3>
            <p>{"Satıcılarla tek tıkla iletişime geçin. WhatsApp, telefon ve platform içi mesajlaşma ile anında bağlanın."}</p>
          </article>
          <article className="why-card" style={{ animationDelay: "0.2s" }}>
            <div className="why-icon icon-gold">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="m8 13 2.5-2.5L14 14l2-2 2 2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
            <h3>{"Fotoğraf Odaklı İlanlar"}</h3>
            <p>{"Her ilan detaylı fotoğraflarla desteklenir. Makineyi görmeden karar vermeyin."}</p>
          </article>
          <article className="why-card" style={{ animationDelay: "0.25s" }}>
            <div className="why-icon icon-purple">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 19V9m8 10V5m8 14v-7" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
            <h3>{"Geniş Kategori Yelpazesi"}</h3>
            <p>{"Forklift, vinç, ekskavatör ve daha fazlası. Sıfır ve ikinci el makineleri tek platformda bulun."}</p>
          </article>
        </div>
      </section>

      <section className="container cta-wrap">
        <div className="cta-banner">
          <div>
            <h2>{"Makinenizi Hemen Satışa Çıkarın"}</h2>
            <p>{"Ücretsiz ilan verin, binlerce alıcıya ulaşın."}</p>
          </div>
          <Link href="/ilan-ver" className="cta-button">
            <span>+</span> {"Ücretsiz İlan Ver"}
          </Link>
        </div>
      </section>

    </main>
  );
}
