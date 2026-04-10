"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/ilan-ver")) return null;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-logo">{"MakinePazarı"}</p>
            <p className="footer-copy-text">
              {"Türkiye'nin iş makineleri pazarı. Sıfır ve ikinci el makinelerde hızlı, güvenli ve kolay alım satım deneyimi."}
            </p>
          </div>
          <div>
            <h4>Kategoriler</h4>
            <Link href="/ilanlar?kategori=forklift">Forklift</Link>
            <Link href="/ilanlar?kategori=terminal-cekici">{"Terminal Çekici"}</Link>
            <Link href="/ilanlar?kategori=platformlar-manlift">Platform - Manlift</Link>
            <Link href="/ilanlar?kategori=ekskavator-kepce">{"Ekskavatör"}</Link>
            <Link href="/ilanlar?kategori=dozer">Dozer</Link>
          </div>
          <div>
            <h4>{"Hızlı Erişim"}</h4>
            <Link href="/ilanlar">{"Tüm İlanlar"}</Link>
            <Link href="/magazalar">{"Mağazalar"}</Link>
            <Link href="/ilan-ver">{"İlan Ver"}</Link>
            <Link href="/hesabim">{"Hesabım"}</Link>
          </div>
          <div>
            <h4>Destek</h4>
            <Link href="/hakkimizda">{"Hakkımızda"}</Link>
            <Link href="/iletisim">{"İletişim"}</Link>
            <Link href="/kullanim-kosullari">{"Kullanım Koşulları"}</Link>
            <Link href="/gizlilik-politikasi">{"Gizlilik Politikası"}</Link>
          </div>
        </div>
        <div className="footer-copy">{"\u00A9 2026 MakinePazarı. Tüm hakları saklıdır."}</div>
      </div>
    </footer>
  );
}
