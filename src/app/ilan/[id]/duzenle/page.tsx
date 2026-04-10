import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ListingEditForm from "./ListingEditForm";

type ListingRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  price: number | null;
  price_negotiable: boolean | null;
  condition: string | null;
  working_hours: number | null;
  capacity_kg: number | null;
  lift_height_mm: number | null;
  fuel_type: string | null;
  city: string | null;
  district: string | null;
  images: string[] | null;
  contact_name: string | null;
  contact_phone: string | null;
  is_active: boolean | null;
  specs: Record<string, string | number> | null;
};

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect(`/giris?next=/ilan/${params.id}/duzenle`);
  }

  const { data: row, error } = await supabase
    .from("listings")
    .select(
      "id, user_id, title, description, category, brand, model, year, price, price_negotiable, condition, working_hours, capacity_kg, lift_height_mm, fuel_type, city, district, images, contact_name, contact_phone, is_active, specs",
    )
    .eq("id", params.id)
    .single();

  if (error || !row) {
    notFound();
  }

  const listing = row as ListingRow;
  if (listing.user_id !== authData.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <nav className="mb-6 text-sm text-slate-600">
        <Link href="/hesabim" className="hover:text-[#f97316]">
          Hesabım
        </Link>
        <span> &gt; </span>
        <Link href={`/ilan/${listing.id}`} className="hover:text-[#f97316]">
          {listing.title}
        </Link>
        <span> &gt; </span>
        <span>Düzenle</span>
      </nav>
      <ListingEditForm listing={listing} userId={authData.user.id} />
    </div>
  );
}
