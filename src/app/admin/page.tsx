import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient();
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceIso = since.toISOString();

  const [
    { count: totalListings },
    { count: activeListings },
    { count: inactiveListings },
    { count: totalUsers },
    { count: corporateUsers },
    { count: newListings7d },
    { count: newUsers7d },
    { count: totalConversations },
    { count: newConversations7d },
    { count: newMessages7d },
    recentListingsRes,
    recentUsersRes,
  ] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("is_active", false),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("user_type", "kurumsal"),
    supabase.from("listings").select("id", { count: "exact", head: true }).gte("created_at", sinceIso),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", sinceIso),
    supabase.from("listing_conversations").select("id", { count: "exact", head: true }),
    supabase.from("listing_conversations").select("id", { count: "exact", head: true }).gte("created_at", sinceIso),
    supabase.from("listing_messages").select("id", { count: "exact", head: true }).gte("created_at", sinceIso),
    supabase
      .from("listings")
      .select("id, title, is_active, created_at, city")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("profiles")
      .select("id, full_name, company_name, user_type, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const recentListings = recentListingsRes.data ?? [];
  const recentUsers = recentUsersRes.data ?? [];

  return (
    <main className="mx-auto w-full max-w-7xl">
      <h1 className="text-2xl font-bold text-[#1e3a5f] sm:text-3xl">Özet</h1>
      <p className="mt-1 text-sm text-slate-600">Platform istatistikleri ve son aktivite.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Toplam ilan</p>
          <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{totalListings ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Aktif ilan</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{activeListings ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pasif ilan</p>
          <p className="mt-2 text-3xl font-bold text-slate-600">{inactiveListings ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Toplam kullanıcı</p>
          <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{totalUsers ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Kurumsal hesap</p>
          <p className="mt-2 text-3xl font-bold text-[#f97316]">{corporateUsers ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Son 7 gün — ilan</p>
          <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{newListings7d ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Son 7 gün — kullanıcı</p>
          <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{newUsers7d ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Konuşma (toplam)</p>
          <p className="mt-2 text-2xl font-bold text-[#1e3a5f]">{totalConversations ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">
            Son 7 gün: {newConversations7d ?? 0} konuşma · {newMessages7d ?? 0} mesaj
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#1e3a5f]">Son ilanlar</h2>
            <Link href="/admin/ilanlar" className="text-sm font-semibold text-[#f97316] hover:underline">
              Tümü
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {recentListings.length === 0 ? (
              <li className="py-6 text-center text-sm text-slate-500">Henüz ilan yok.</li>
            ) : (
              recentListings.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/ilan/${row.id}`}
                      className="font-medium text-[#1e3a5f] hover:text-[#f97316] line-clamp-1"
                    >
                      {row.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {row.city || "—"} · {formatShortDate(row.created_at)} ·{" "}
                      <span className={row.is_active ? "text-green-600" : "text-slate-500"}>
                        {row.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </p>
                  </div>
                  <code className="shrink-0 text-[10px] text-slate-400" title={row.id}>
                    {row.id.slice(0, 8)}…
                  </code>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#1e3a5f]">Son kayıtlar</h2>
            <Link href="/admin/kullanicilar" className="text-sm font-semibold text-[#f97316] hover:underline">
              Tümü
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {recentUsers.length === 0 ? (
              <li className="py-6 text-center text-sm text-slate-500">Henüz kullanıcı yok.</li>
            ) : (
              recentUsers.map((row) => {
                const label =
                  row.user_type === "kurumsal"
                    ? row.company_name || row.full_name || "—"
                    : row.full_name || "—";
                return (
                  <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/kullanicilar/${row.id}`}
                        className="font-medium text-[#1e3a5f] hover:text-[#f97316] line-clamp-1"
                      >
                        {label}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {row.user_type} · {formatShortDate(row.created_at)}
                      </p>
                    </div>
                    <code className="shrink-0 text-[10px] text-slate-400" title={row.id}>
                      {row.id.slice(0, 8)}…
                    </code>
                  </li>
                );
              })
            )}
          </ul>
        </section>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/ilanlar"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#f97316] hover:shadow-md"
        >
          <h2 className="text-xl font-bold text-[#1e3a5f]">İlan moderasyonu</h2>
          <p className="mt-2 text-sm text-slate-600">
            İlanları arayın, pasife alın veya silin. Uygunsuz içerikleri kaldırın.
          </p>
        </Link>
        <Link
          href="/admin/kullanicilar"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#f97316] hover:shadow-md"
        >
          <h2 className="text-xl font-bold text-[#1e3a5f]">Kullanıcı yönetimi</h2>
          <p className="mt-2 text-sm text-slate-600">
            Kullanıcıları arayın, profil ve ilan özetlerini görüntüleyin.
          </p>
        </Link>
      </div>
    </main>
  );
}
