"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const supabase = createClient();

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const rawNext = params.get("next");
    const nextPath =
      rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
        ? rawNext
        : "/hesabim";
    router.push(nextPath);
    router.refresh();
  };

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">Giriş Yap</h1>
      <p className="mt-2 text-sm text-slate-600">Hesabınıza giriş yaparak devam edin.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-[#1e3a5f]">E-posta</label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-[#1e3a5f]">Şifre</label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#f97316] px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link
          href="/sifremi-unuttum"
          className="text-sm font-medium text-[#1e3a5f] hover:text-[#f97316] hover:underline"
        >
          Şifremi unuttum
        </Link>
      </div>

      <p className="mt-6 text-sm text-slate-600">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-[#f97316] hover:underline">
          Kayıt ol
        </Link>
      </p>
    </main>
  );
}
