"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ProfileSettingsFormProps = {
  initialValues: {
    full_name: string | null;
    phone: string | null;
    city: string | null;
    email: string | null;
  };
};

export default function ProfileSettingsForm({ initialValues }: ProfileSettingsFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [formValues, setFormValues] = useState({
    full_name: initialValues.full_name ?? "",
    phone: initialValues.phone ?? "",
    city: initialValues.city ?? "",
    email: initialValues.email ?? "",
    new_password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/giris";
        return;
      }

      const profilePayload = {
        full_name: formValues.full_name.trim() || null,
        phone: formValues.phone.trim() || null,
        city: formValues.city.trim() || null,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(profilePayload)
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      const authPayload: { email?: string; password?: string } = {};

      if (formValues.email.trim() && formValues.email.trim() !== initialValues.email) {
        authPayload.email = formValues.email.trim();
      }

      if (formValues.new_password.trim()) {
        authPayload.password = formValues.new_password.trim();
      }

      if (Object.keys(authPayload).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(authPayload);

        if (authError) {
          throw authError;
        }
      }

      setFormValues((current) => ({ ...current, new_password: "" }));
      setMessage(
        authPayload.email
          ? "Profil güncellendi. E-posta değişikliği için gelen doğrulama mailini onaylayın."
          : "Profil bilgileriniz güncellendi.",
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil güncellenemedi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-[#1e3a5f]">Profil ayarları</h3>
      <p className="mt-2 text-sm text-slate-600">
        Ad soyad, telefon, şehir, e-posta ve şifre bilgilerinizi güncelleyin.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-slate-700">
          Ad soyad
          <input
            value={formValues.full_name}
            onChange={(event) => setFormValues((current) => ({ ...current, full_name: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Telefon
          <input
            value={formValues.phone}
            onChange={(event) => setFormValues((current) => ({ ...current, phone: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Şehir
          <input
            value={formValues.city}
            onChange={(event) => setFormValues((current) => ({ ...current, city: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700">
          E-posta
          <input
            type="email"
            value={formValues.email}
            onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700 md:col-span-2">
          Yeni şifre
          <input
            type="password"
            minLength={6}
            value={formValues.new_password}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, new_password: event.target.value }))
            }
            placeholder="Değiştirmek istemiyorsanız boş bırakın"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="mt-4 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSaving ? "Kaydediliyor..." : "Profili kaydet"}
      </button>
      {message ? <p className="mt-2 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
