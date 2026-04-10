import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import TopLoader from "@/components/TopLoader";
import "./globals.css";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import UnreadBadge from "@/components/UnreadBadge";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makinepazari.com"),
  title: {
    default: "MakinePazarı - İş Makineleri Alım Satım İlanları",
    template: "%s | MakinePazarı",
  },
  description:
    "Türkiye'nin iş makineleri pazarı. Forklift, istif makinesi, transpalet, platform ve iş makinesi ilanları.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "MakinePazarı",
    title: "MakinePazarı - İş Makineleri Alım Satım İlanları",
    description:
      "Türkiye'nin iş makineleri pazarı. Forklift, istif makinesi, transpalet, platform ve iş makinesi ilanları.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(data.user);

  async function signOut() {
    "use server";
    try {
      const serverClient = createSupabaseServerClient();
      await serverClient.auth.signOut();
    } catch {
      // Proceed to redirect even if sign-out request fails
    }
    redirect("/");
  }

  return (
    <html lang="tr" className={`${dmSans.variable} ${plusJakarta.variable}`}>
      <body>
        <TopLoader />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[#f97316] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Ana içeriğe atla
        </a>
        <header className="site-header">
          <nav className="site-header-inner">
            <Link href="/" className="site-logo">
              <span>Makine</span>
              <span>Pazarı</span>
            </Link>
            <form action="/ilanlar" method="get" className="site-search desktop-only">
              <label htmlFor="header-search" className="sr-only">İlan ara</label>
              <input
                id="header-search"
                type="text"
                name="q"
                placeholder="Kelime, ilan no veya mağaza adı ile ara..."
                className="site-search-input"
              />
            </form>
            <div className="site-nav">
              <Link href="/ilanlar" className="site-nav-link desktop-only">
                İlanlar
              </Link>
              <Link href="/magazalar" className="site-nav-link desktop-only">
                Mağazalar
              </Link>
              <Link
                href="/ilan-ver"
                className="site-cta-button"
              >
                <span>+</span> İlan Ver
              </Link>
              {isLoggedIn ? (
                <>
                  <UnreadBadge />
                  <Link href="/hesabim" className="site-nav-link">
                    Hesabım
                  </Link>
                  <form action={signOut}>
                    <button type="submit" className="site-nav-link">
                      Çıkış
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/hesabim" className="site-nav-link">
                    Hesabım
                  </Link>
                </>
              )}
            </div>
          </nav>
          <div className="site-search-mobile">
            <form action="/ilanlar" method="get" className="site-search">
              <label htmlFor="mobile-search" className="sr-only">İlan ara</label>
              <input
                id="mobile-search"
                type="text"
                name="q"
                placeholder="Kelime, ilan no veya mağaza adı ile ara..."
                className="site-search-input"
              />
            </form>
          </div>
          <nav className="site-mobile-quick-nav" aria-label="Hızlı gezinme">
            <Link href="/ilanlar" className="site-mobile-quick-nav-link">
              İlanlar
            </Link>
            <Link href="/magazalar" className="site-mobile-quick-nav-link">
              Mağazalar
            </Link>
          </nav>
        </header>
        <div id="main-content">{children}</div>
        <Footer />
        <Toaster position="top-right" richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
