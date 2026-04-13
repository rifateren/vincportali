import Link from "next/link";
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

function buildQuery(parts: { sayfa?: string; tip?: string; q?: string }) {
  const sp = new URLSearchParams();
  if (parts.sayfa && parts.sayfa !== "1") sp.set("sayfa", parts.sayfa);
  if (parts.tip) sp.set("tip", parts.tip);
  if (parts.q?.trim()) sp.set("q", parts.q.trim());
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { sayfa?: string; tip?: string; q?: string };
}) {
  const supabase = createSupabaseServerClient();

  const currentPage = Math.max(Number(searchParams?.sayfa) || 1, 1);
  const typeFilter = searchParams?.tip;
  const qRaw = (searchParams?.q ?? "").trim().slice(0, 120);
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

  if (qRaw) {
    query = query.or(
      `full_name.ilike.%${qRaw}%,company_name.ilike.%${qRaw}%,phone.ilike.%${qRaw}%,city.ilike.%${qRaw}%`,
    );
  }

  const from = (currentPage - 1) * PAGE_SIZE;
  const { data, count } = await query.range(from, from + PAGE_SIZE - 1);

  const users = (data ?? []) as UserProfile[];
  const totalPages = Math.max(Math.ceil((count ?? 0) / PAGE_SIZE), 1);

  const qPersist = qRaw;
  const baseNav = { tip: typeFilter, q: qPersist };

  return (
    <main className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f] sm:text-3xl">Kullanıcı yönetimi</h1>
          <p className="mt-1 text-sm text-slate-600">{count ?? 0} kullanıcı</p>
        </div>
      </div>

      <form
        action="/admin/kullanicilar"
        method="get"
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        role="search"
      >
        <label className="sr-only" htmlFor="admin-user-q">
          Kullanıcı ara
        </label>
        <input
          id="admin-user-q"
          type="search"
          name="q"
          defaultValue={qPersist}
          placeholder="Ad, şirket, telefon, şehir…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#1e3a5f] shadow-sm focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/25"
        />
        {typeFilter ? <input type="hidden" name="tip" value={typeFilter} /> : null}
        <button
          type="submit"
          className="rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#163252]"
        >
          Ara
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: "Tümü", value: undefined as string | undefined },
          { label: "Bireysel", value: "bireysel" },
          { label: "Kurumsal", value: "kurumsal" },
        ].map((opt) => (
          <Link
            key={opt.label}
            href={`/admin/kullanicilar${buildQuery({ ...baseNav, tip: opt.value })}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              typeFilter === opt.value || (!typeFilter && !opt.value)
                ? "bg-[#1e3a5f] text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left">
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Ad / Şirket</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Tip</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Şehir</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Telefon</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Kayıt</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Rol</th>
              <th className="px-4 py-3 font-semibold text-[#1e3a5f]">Detay</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  Kriterlere uyan kullanıcı yok.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/80">
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
                    {user.is_admin ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        Admin
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/kullanicilar/${user.id}`}
                      className="font-semibold text-[#f97316] hover:underline"
                    >
                      Aç
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {currentPage > 1 ? (
          <Link
            href={`/admin/kullanicilar${buildQuery({ sayfa: String(currentPage - 1), ...baseNav })}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-[#f97316]"
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
            href={`/admin/kullanicilar${buildQuery({ sayfa: String(currentPage + 1), ...baseNav })}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-[#f97316]"
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
