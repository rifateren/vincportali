import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getSafeRedirectPath(raw: string | null): string {
  if (!raw) return "/hesabim";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/hesabim";
  try {
    const url = new URL(raw, "http://localhost");
    if (url.hostname !== "localhost") return "/hesabim";
  } catch {
    return "/hesabim";
  }
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/giris?error=auth`);
}
