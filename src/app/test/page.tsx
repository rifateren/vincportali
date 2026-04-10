import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  let supabaseStatus = "FAILED";
  let listingCount = 0;

  try {
    const supabase = createSupabaseServerClient();
    const { count, error } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true });

    if (!error) {
      supabaseStatus = "OK";
      listingCount = count ?? 0;
    }
  } catch {
    supabaseStatus = "FAILED";
  }

  const cloudinaryName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "MISSING";

  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>Bağlantı Testi</h1>
      <p>
        Supabase: <strong>{supabaseStatus}</strong> ({listingCount} ilan)
      </p>
      <p>
        Cloudinary: <strong>{cloudinaryName}</strong>
      </p>
    </div>
  );
}

