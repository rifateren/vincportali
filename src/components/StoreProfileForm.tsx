"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type StoreProfileFormProps = {
  initialValues: {
    company_name: string | null;
    phone: string | null;
    city: string | null;
    store_slug: string | null;
    store_description: string | null;
    store_logo_url: string | null;
    store_banner_url: string | null;
  };
};

export default function StoreProfileForm({ initialValues }: StoreProfileFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [formValues, setFormValues] = useState({
    company_name: initialValues.company_name ?? "",
    phone: initialValues.phone ?? "",
    city: initialValues.city ?? "",
    store_slug: initialValues.store_slug ?? "",
    store_description: initialValues.store_description ?? "",
    store_logo_url: initialValues.store_logo_url ?? "",
    store_banner_url: initialValues.store_banner_url ?? "",
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

      const payload = {
        company_name: formValues.company_name.trim() || null,
        phone: formValues.phone.trim() || null,
        city: formValues.city.trim() || null,
        store_slug: formValues.store_slug.trim() || null,
        store_description: formValues.store_description.trim() || null,
        store_logo_url: formValues.store_logo_url.trim() || null,
        store_banner_url: formValues.store_banner_url.trim() || null,
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id);

      if (updateError) throw updateError;

      setMessage("Mağaza bilgileri güncellendi.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mağaza bilgileri kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-[#1e3a5f]">Mağaza ayarları</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-slate-700">
          Şirket adı
          <input
            value={formValues.company_name}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, company_name: event.target.value }))
            }
            placeholder="Örnek Makine A.Ş."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Telefon
          <input
            value={formValues.phone}
            onChange={(event) => setFormValues((current) => ({ ...current, phone: event.target.value }))}
            placeholder="0(5xx) xxx xx xx"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Şehir
          <input
            value={formValues.city}
            onChange={(event) => setFormValues((current) => ({ ...current, city: event.target.value }))}
            placeholder="İstanbul"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Mağaza kısa adresi
          <input
            value={formValues.store_slug}
            onChange={(event) => setFormValues((current) => ({ ...current, store_slug: event.target.value }))}
            placeholder="ornek-magaza"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Logo URL
          <input
            value={formValues.store_logo_url}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, store_logo_url: event.target.value }))
            }
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700 md:col-span-2">
          Banner URL
          <input
            value={formValues.store_banner_url}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, store_banner_url: event.target.value }))
            }
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#f97316]"
          />
        </label>
        <label className="block text-sm text-slate-700 md:col-span-2">
          Mağaza açıklaması
          <textarea
            value={formValues.store_description}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, store_description: event.target.value }))
            }
            rows={4}
            placeholder="Firmanız, uzmanlık alanlarınız ve sunduğunuz makineler..."
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
        {isSaving ? "Kaydediliyor..." : "Mağaza bilgilerini kaydet"}
      </button>
      {message ? <p className="mt-2 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
