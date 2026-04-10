"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className="rounded-lg bg-[#f97316] px-4 py-2 text-sm font-semibold text-white"
    >
      Çıkış Yap
    </button>
  );
}
