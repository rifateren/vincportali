"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, LayoutDashboard, ListOrdered, Menu, Users, X } from "lucide-react";

const nav = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard, match: (p: string) => p === "/admin" },
  {
    href: "/admin/ilanlar",
    label: "İlanlar",
    icon: ListOrdered,
    match: (p: string) => p.startsWith("/admin/ilanlar"),
  },
  {
    href: "/admin/kullanicilar",
    label: "Kullanıcılar",
    icon: Users,
    match: (p: string) => p.startsWith("/admin/kullanicilar"),
  },
];

export default function AdminAppShell({
  children,
  displayName,
}: {
  children: React.ReactNode;
  displayName: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div data-admin-layout className="admin-app-shell min-h-screen bg-slate-100">
      <div
        className={`fixed inset-0 z-[140] bg-slate-900/40 transition-opacity lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-[150] flex h-full w-[260px] flex-col border-r border-slate-200 bg-[#0f2744] text-white shadow-xl transition-transform duration-200 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 lg:h-16">
          <Link href="/admin" className="font-semibold tracking-tight text-white">
            Yönetim
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white/80 hover:bg-white/10 lg:hidden"
            aria-label="Menüyü kapat"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Yönetim menüsü">
          {nav.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-[#f97316] text-white" : "text-white/85 hover:bg-white/10"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
            Siteye dön
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-[130] flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 shadow-sm lg:h-16 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-[#1e3a5f] hover:bg-slate-100 lg:hidden"
              aria-label="Menüyü aç"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">MakinePazarı</p>
              <p className="text-sm font-semibold text-[#1e3a5f]">Yönetim paneli</p>
            </div>
          </div>
          <p className="max-w-[50%] truncate text-right text-sm text-slate-600" title={displayName}>
            {displayName}
          </p>
        </header>

        <div className="px-4 py-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
