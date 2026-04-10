import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type UserProfile = {
  id: string;
  user_type: "bireysel" | "kurumsal";
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  city: string | null;
  is_admin: boolean;
  created_at: string;
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { sayfa?: string; tip?: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/giris");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", authData.user.id)
    .single();

  if (!adminProfile?.is_admin) {
    notFound();
  }

  const currentPage = Math.max(Number(searchParams?.sayfa) || 1, 1);
  const typeFilter = searchParams?.tip;
  const PAGE_SIZE = 20;

  let query = supabase
    .from("profiles")
    .select("id, user_type, full_name, company_name, phone, city, is_admin, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (typeFilter === "bireysel" || typeFilter === "kurumsal") {
    query = query.eq("user_type", typeFilter);
  }

  const from = (currentPage - 1) * PAGE_SIZE;
  const { data, count } = await query.range(from, from + PAGE_SIZE - 1);

  const users = (data ?? []) as UserProfile[];
  const totalPages = Math.max(Math.ceil((count ?? 0) / PAGE_SIZE), 1);

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a5f]">Kullanıcı Yönetimi</h1>
          <p className="mt-1 text-sm text-slate-600">{count ?? 0} kullanıcı toplam</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-[#f97316] hover:underline">
          Panel
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        {[
          { label: "Tümü", value: undefined },
          { label: "Bireysel", value: "bireysel" },
          { label: "Kurumsal", value: "kurumsal" },
        ].map((opt) => (
          <Link
            key={opt.label}
            href={opt.value ? `/admin/kullanicilar?tip=${opt.value}` : "/admin/kullanicilar"}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              typeFilter === opt.value || (!typeFilter && !opt.value)
                ? "bg-[#1e3a5f] text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left">
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Ad / Şirket</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Tip</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Şehir</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Telefon</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Kayıt</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-[#1e3a5f]">
                  {user.user_type === "kurumsal"
                    ? user.company_name || user.full_name || "-"
                    : user.full_name || "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      user.user_type === "kurumsal"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.user_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{user.city || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{user.phone || "-"}</td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(user.created_at).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-4 py-3">
                  {user.is_admin && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      Admin
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {currentPage > 1 ? (
          <Link
            href={`/admin/kullanicilar?sayfa=${currentPage - 1}${typeFilter ? `&tip=${typeFilter}` : ""}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:border-[#f97316]"
          >
            Önceki
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400">Önceki</span>
        )}
        <span className="text-sm text-slate-600">
          {currentPage} / {totalPages}
        </span>
        {currentPage < totalPages ? (
          <Link
            href={`/admin/kullanicilar?sayfa=${currentPage + 1}${typeFilter ? `&tip=${typeFilter}` : ""}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:border-[#f97316]"
          >
            Sonraki
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400">Sonraki</span>
        )}
      </div>
    </main>
  );
}
