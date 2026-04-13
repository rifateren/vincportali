import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  user_type: "bireysel" | "kurumsal";
  full_name: string | null;
  company_name: string | null;
  tax_number: string | null;
  phone: string | null;
  city: string | null;
  is_admin: boolean;
  store_slug: string | null;
  store_description: string | null;
  created_at: string;
};

type ListingRow = {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
};

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const userId = params.id;

  const { data: profileData } = await supabase
    .from("profiles")
    .select(
      "id, user_type, full_name, company_name, tax_number, phone, city, is_admin, store_slug, store_description, created_at",
    )
    .eq("id", userId)
    .single();

  const profile = profileData as ProfileRow | null;
  if (!profile) {
    notFound();
  }

  const [{ count: listingCount }, { data: listingsData }] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase
      .from("listings")
      .select("id, title, is_active, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const listings = (listingsData ?? []) as ListingRow[];

  const displayName =
    profile.user_type === "kurumsal"
      ? profile.company_name || profile.full_name || "—"
      : profile.full_name || "—";

  return (
    <main className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <Link
          href="/admin/kullanicilar"
          className="w-fit text-sm font-semibold text-[#f97316] hover:underline"
        >
          ← Kullanıcı listesi
        </Link>
        <h1 className="text-2xl font-bold text-[#1e3a5f] sm:text-3xl">{displayName}</h1>
        <p className="text-sm text-slate-500">
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{profile.id}</code>
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1e3a5f]">Profil</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Hesap tipi</dt>
              <dd className="font-medium text-[#1e3a5f]">{profile.user_type}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Ad soyad</dt>
              <dd className="text-right font-medium text-[#1e3a5f]">{profile.full_name || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Şirket</dt>
              <dd className="text-right font-medium text-[#1e3a5f]">{profile.company_name || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Vergi no</dt>
              <dd className="text-right font-medium text-[#1e3a5f]">{profile.tax_number || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Telefon</dt>
              <dd className="text-right font-medium text-[#1e3a5f]">{profile.phone || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Şehir</dt>
              <dd className="text-right font-medium text-[#1e3a5f]">{profile.city || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Kayıt</dt>
              <dd className="font-medium text-[#1e3a5f]">
                {new Date(profile.created_at).toLocaleString("tr-TR")}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Mağaza slug</dt>
              <dd className="text-right font-medium text-[#1e3a5f]">
                {profile.store_slug ? (
                  <Link href={`/magaza/${encodeURIComponent(profile.store_slug)}`} className="text-[#f97316] hover:underline">
                    {profile.store_slug}
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4 pb-1">
              <dt className="text-slate-500">Rol</dt>
              <dd>
                {profile.is_admin ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    Platform admin
                  </span>
                ) : (
                  <span className="text-slate-600">Kullanıcı</span>
                )}
              </dd>
            </div>
          </dl>
          {profile.store_description ? (
            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              {profile.store_description}
            </p>
          ) : null}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold text-[#1e3a5f]">İlanlar</h2>
            <p className="text-sm text-slate-500">Toplam: {listingCount ?? 0}</p>
          </div>
          {listings.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-500">Bu kullanıcının ilanı yok.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {listings.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/ilan/${l.id}`} className="font-medium text-[#1e3a5f] hover:text-[#f97316] line-clamp-1">
                      {l.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {new Date(l.created_at).toLocaleDateString("tr-TR")} ·{" "}
                      <span className={l.is_active ? "text-green-600" : "text-slate-500"}>
                        {l.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/admin/ilanlar?q=${encodeURIComponent(l.id)}`}
                    className="shrink-0 text-xs font-semibold text-[#f97316] hover:underline"
                  >
                    Moderasyonda aç
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
