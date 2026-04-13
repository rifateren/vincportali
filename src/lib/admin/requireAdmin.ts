import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminProfile = {
  is_admin: boolean;
  full_name: string | null;
  company_name: string | null;
  user_type: "bireysel" | "kurumsal";
};

export async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/giris?next=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name, company_name, user_type")
    .eq("id", authData.user.id)
    .single();

  const p = profile as AdminProfile | null;
  if (!p?.is_admin) {
    notFound();
  }

  return {
    supabase,
    user: authData.user,
    profile: p,
  };
}

export function adminDisplayName(profile: AdminProfile) {
  if (profile.user_type === "kurumsal") {
    return profile.company_name || profile.full_name || "Yönetici";
  }
  return profile.full_name || "Yönetici";
}
