import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold text-[#1e3a5f]">404</h1>
      <p className="mt-4 text-xl font-semibold text-slate-700">
        Sayfa bulunamadı
      </p>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak
        kullanım dışı olabilir.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          href="/ilanlar"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#1e3a5f] transition hover:border-[#f97316] hover:text-[#f97316]"
        >
          İlanları Gör
        </Link>
      </div>
    </main>
  );
}
