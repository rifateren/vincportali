"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/hesabim");
    }, 2000);
  };

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">Yeni Şifre Belirle</h1>
      <p className="mt-2 text-sm text-slate-600">
        Yeni şifrenizi aşağıya girin.
      </p>

      {success ? (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
          <p className="font-semibold text-green-800">
            Şifreniz başarıyla güncellendi!
          </p>
          <p className="mt-2 text-sm text-green-700">
            Hesabınıza yönlendiriliyorsunuz...
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="reset-password" className="mb-2 block text-sm font-medium text-[#1e3a5f]">
              Yeni Şifre
            </label>
            <input
              id="reset-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
            />
          </div>
          <div>
            <label htmlFor="reset-confirm" className="mb-2 block text-sm font-medium text-[#1e3a5f]">
              Şifre Tekrar
            </label>
            <input
              id="reset-confirm"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#f97316] px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
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
