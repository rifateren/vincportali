import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ListingCreateForm from "./ListingCreateForm";

export default async function ListingCreatePage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/giris");
  }

  return <ListingCreateForm userId={data.user.id} />;
}

