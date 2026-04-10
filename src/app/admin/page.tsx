import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", authData.user.id)
    .single();

  if (!profile?.is_admin) {
    notFound();
  }

  const [
    { count: totalListings },
    { count: activeListings },
    { count: totalUsers },
    { count: corporateUsers },
  ] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("user_type", "kurumsal"),
  ]);

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">Yönetim Paneli</h1>
      <p className="mt-2 text-sm text-slate-600">Platform yönetimi ve moderasyon araçları.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Toplam İlan</p>
          <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{totalListings ?? 0}</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Aktif İlan</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{activeListings ?? 0}</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Toplam Kullanıcı</p>
          <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{totalUsers ?? 0}</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Kurumsal Hesap</p>
          <p className="mt-2 text-3xl font-bold text-[#f97316]">{corporateUsers ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/ilanlar"
          className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-[#f97316] hover:shadow-md"
        >
          <h2 className="text-xl font-bold text-[#1e3a5f]">İlan Moderasyonu</h2>
          <p className="mt-2 text-sm text-slate-600">
            İlanları inceleyin, pasife alın veya silin. Uygunsuz içerikleri kaldırın.
          </p>
        </Link>
        <Link
          href="/admin/kullanicilar"
          className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-[#f97316] hover:shadow-md"
        >
          <h2 className="text-xl font-bold text-[#1e3a5f]">Kullanıcı Yönetimi</h2>
          <p className="mt-2 text-sm text-slate-600">
            Kullanıcı listesini inceleyin, profil bilgilerini görüntüleyin.
          </p>
        </Link>
      </div>
    </main>
  );
}
