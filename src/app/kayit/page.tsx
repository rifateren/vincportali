"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type UserType = "bireysel" | "kurumsal";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<UserType>("bireysel");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitLabel = useMemo(
    () => (loading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"),
    [loading],
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    const supabase = createClient();

    setLoading(true);
    const metadata =
      userType === "bireysel"
        ? { user_type: userType, full_name: fullName, phone, city }
        : { user_type: userType, full_name: companyName, company_name: companyName, tax_number: taxNumber, phone, city };

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(true);
  };

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">Kayıt Ol</h1>
      <p className="mt-2 text-sm text-slate-600">Yeni bir hesap oluşturun.</p>

      {step === 1 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">Kullanıcı Tipi Seçin</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setUserType("bireysel");
                setStep(2);
              }}
              className="rounded-xl border border-slate-200 p-8 text-left hover:border-[#f97316]"
            >
              <p className="text-xl font-semibold text-[#1e3a5f]">Bireysel</p>
              <p className="mt-2 text-sm text-slate-600">Kendi adınıza ilan yayınlayın.</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setUserType("kurumsal");
                setStep(2);
              }}
              className="rounded-xl border border-slate-200 p-8 text-left hover:border-[#f97316]"
            >
              <p className="text-xl font-semibold text-[#1e3a5f]">Kurumsal</p>
              <p className="mt-2 text-sm text-slate-600">Şirket hesabı ile ilan yayınlayın.</p>
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Seçilen tip: <span className="font-semibold text-[#1e3a5f]">{userType}</span>
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm font-medium text-[#f97316] hover:underline"
            >
              Değiştir
            </button>
          </div>

          {userType === "bireysel" ? (
            <div>
              <label htmlFor="reg-fullname" className="mb-2 block text-sm font-medium text-[#1e3a5f]">Ad Soyad</label>
              <input
                id="reg-fullname"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
              />
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="reg-company" className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                  Şirket Adı
                </label>
                <input
                  id="reg-company"
                  required
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
                />
              </div>
              <div>
                <label htmlFor="reg-tax" className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                  Vergi Numarası
                </label>
                <input
                  id="reg-tax"
                  required
                  value={taxNumber}
                  onChange={(event) => setTaxNumber(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="reg-email" className="mb-2 block text-sm font-medium text-[#1e3a5f]">E-posta</label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="mb-2 block text-sm font-medium text-[#1e3a5f]">Şifre</label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
            />
          </div>
          <div>
            <label htmlFor="reg-phone" className="mb-2 block text-sm font-medium text-[#1e3a5f]">Telefon</label>
            <input
              id="reg-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
            />
          </div>
          <div>
            <label htmlFor="reg-city" className="mb-2 block text-sm font-medium text-[#1e3a5f]">Şehir</label>
            <input
              id="reg-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#f97316]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <p className="text-sm font-medium text-green-700">E-posta adresinizi doğrulayın.</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#f97316] px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {submitLabel}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-slate-600">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-semibold text-[#f97316] hover:underline">
          Giriş yap
        </Link>
      </p>
    </main>
  );
}
