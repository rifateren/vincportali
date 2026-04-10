"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/sifre-sifirla`,
      },
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(true);
  };

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">Şifremi Unuttum</h1>
      <p className="mt-2 text-sm text-slate-600">
        E-posta adresinizi girin, şifre sıfırlama bağlantısı göndereceğiz.
      </p>

      {success ? (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
          <p className="font-semibold text-green-800">
            Şifre sıfırlama bağlantısı gönderildi!
          </p>
          <p className="mt-2 text-sm text-green-700">
            Lütfen e-posta kutunuzu kontrol edin. Bağlantıya tıklayarak yeni
            şifrenizi belirleyebilirsiniz.
          </p>
          <Link
            href="/giris"
            className="mt-4 inline-block text-sm font-semibold text-[#f97316] hover:underline"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="forgot-email" className="mb-2 block text-sm font-medium text-[#1e3a5f]">
              E-posta
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
              placeholder="ornek@email.com"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#f97316] px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
          </button>

          <p className="text-center text-sm text-slate-600">
            <Link
              href="/giris"
              className="font-semibold text-[#f97316] hover:underline"
            >
              Giriş sayfasına dön
            </Link>
          </p>
        </form>
      )}
    </main>
  );
}
