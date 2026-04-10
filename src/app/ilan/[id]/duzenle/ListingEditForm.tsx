"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CldImage } from "next-cloudinary";
import { Check, LoaderCircle, UploadCloud, X } from "lucide-react";
import ListingDynamicFields from "@/components/ListingDynamicFields";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { getCategoryFormSpec } from "@/lib/listingCategorySpecs";
import {
  buildListingSpecs,
  getInitialFormValues,
  type ListingFormValues,
  type ListingRecordLike,
  parseOptionalNumber,
} from "@/lib/listingFormSchema";
import { cityOptions, fetchBrandsByCategory } from "@/lib/listingFormOptions";

type ListingRow = ListingRecordLike & {
  id: string;
  user_id: string;
  images: string[] | null;
};

type UploadedImage = {
  public_id: string;
  secure_url: string;
};

const MAX_FILES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const STEPS = [
  { label: "Temel Bilgiler" },
  { label: "Teknik Özellikler" },
  { label: "Fiyat & Konum" },
];

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20";

function listingToUploadedImages(images: string[] | null): UploadedImage[] {
  if (!images?.length) return [];
  return images.map((public_id) => ({
    public_id,
    secure_url: "",
  }));
}

export default function ListingEditForm({
  listing,
  userId,
}: {
  listing: ListingRow;
  userId: string;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() =>
    listingToUploadedImages(listing.images),
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    defaultValues: getInitialFormValues(listing),
  });

  const selectedCategory = watch("category");
  const categorySpec = getCategoryFormSpec(selectedCategory);
  const stepFields = [
    ["category", ...categorySpec.step1Fields],
    [...categorySpec.step2Fields, "description"],
    ["price", "city", "district", "contact_name", "contact_phone"],
  ] as const;

  useEffect(() => {
    const supabase = createClient();
    const cat = selectedCategory || listing.category;
    if (!cat) return;
    fetchBrandsByCategory(supabase, cat).then(setFilteredBrands);
  }, [selectedCategory, listing.category]);

  const canGoForward = async () => {
    const fields = stepFields[currentStep - 1];
    return trigger(fields as unknown as (keyof ListingFormValues)[]);
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    setUploadError(null);

    const remainingSlots = MAX_FILES - uploadedImages.length;
    if (remainingSlots <= 0) {
      setUploadError("En fazla 8 fotoğraf yükleyebilirsiniz.");
      return;
    }

    const files = Array.from(fileList).slice(0, remainingSlots);
    const invalid = files.find(
      (file) => !file.type.startsWith("image/") || file.size > MAX_FILE_SIZE,
    );
    if (invalid) {
      setUploadError("Her fotoğraf image formatında ve en fazla 5MB olmalı.");
      return;
    }

    setUploading(true);
    try {
      const uploaded: UploadedImage[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = (await response.json()) as UploadedImage | { error?: string };

        if (!response.ok || !("public_id" in result)) {
          const message =
            "error" in result && result.error
              ? result.error
              : "Fotoğraf yükleme başarısız.";
          throw new Error(message);
        }

        uploaded.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
      }

      setUploadedImages((prev) => [...prev, ...uploaded]);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Fotoğraflar yüklenemedi.",
      );
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ListingFormValues) => {
    setSubmitError(null);
    const supabase = createClient();

    if (uploadedImages.length === 0) {
      setUploadError("En az 1 fotoğraf olmalı.");
      setCurrentStep(3);
      return;
    }

    const payload = {
      title: `${values.brand} ${values.model}`.trim(),
      category: values.category,
      brand: values.brand,
      model: values.model,
      year: parseOptionalNumber(values.year),
      condition: values.condition,
      working_hours:
        categorySpec.step2Fields.includes("working_hours") && values.condition === "ikinci-el"
          ? parseOptionalNumber(values.working_hours)
          : null,
      capacity_kg: categorySpec.step2Fields.includes("capacity_kg")
        ? parseOptionalNumber(values.capacity_kg)
        : null,
      lift_height_mm: categorySpec.step2Fields.includes("lift_height_mm")
        ? parseOptionalNumber(values.lift_height_mm)
        : null,
      fuel_type: categorySpec.step2Fields.includes("fuel_type") ? values.fuel_type : null,
      description: values.description,
      price: parseOptionalNumber(values.price),
      price_negotiable: values.price_negotiable,
      city: values.city,
      district: values.district,
      contact_name: values.contact_name,
      contact_phone: values.contact_phone,
      images: uploadedImages.map((image) => image.public_id),
      is_active: values.is_active,
      specs: buildListingSpecs(values.category, values),
    };

    const { error } = await supabase
      .from("listings")
      .update(payload)
      .eq("id", listing.id)
      .eq("user_id", userId);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    router.push(`/ilan/${listing.id}`);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?")) {
      return;
    }
    setSubmitError(null);
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("listings").delete().eq("id", listing.id);
    setDeleting(false);
    if (error) {
      setSubmitError(error.message);
      return;
    }
    router.push("/hesabim");
    router.refresh();
  };

  return (
    <main className="ilan-ver-page">
      <div className="mx-auto w-full max-w-3xl px-6 pb-2 pt-5">
        <div className="flex items-center justify-center">
          {STEPS.map((step, i) => {
            const stepNum = i + 1;
            const isCompleted = currentStep > stepNum;
            const isActive = currentStep === stepNum;
            return (
              <Fragment key={stepNum}>
                {i > 0 && (
                  <div
                    className={`mx-1.5 h-[2px] flex-1 rounded-full transition-colors sm:mx-3 ${
                      currentStep >= stepNum ? "bg-[#f97316]" : "bg-slate-200"
                    }`}
                  />
                )}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                      isCompleted
                        ? "bg-[#f97316] text-white"
                        : isActive
                          ? "bg-[#f97316] text-white shadow-lg shadow-orange-200"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : stepNum}
                  </div>
                  <span
                    className={`text-[11px] font-medium sm:text-xs ${
                      isActive
                        ? "text-[#1e3a5f]"
                        : isCompleted
                          ? "text-[#f97316]"
                          : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 py-4 lg:px-8">
            <section className="mb-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("is_active")} />
                <span>İlan yayında kalsın</span>
              </label>
            </section>

            {currentStep === 1 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Temel Bilgiler</h2>

                <div>
                  <p className="mb-2 text-sm font-medium">Kategori</p>
                  <div className="space-y-3">
                    {CATEGORY_GROUPS.map((group) => (
                      <div key={group.heading}>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          {group.heading}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                          {group.items.map((category) => {
                            const active = selectedCategory === category.value;
                            return (
                              <button
                                key={category.value}
                                type="button"
                                onClick={() =>
                                  setValue("category", category.value, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  })
                                }
                                className={`rounded-lg border px-3 py-2 text-left text-[13px] transition ${
                                  active
                                    ? "border-[#f97316] bg-orange-50 font-semibold text-[#f97316]"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                {category.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    {...register("category", { required: "Kategori seçin." })}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <ListingDynamicFields
                    fieldKeys={categorySpec.step1Fields}
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    brandOptions={filteredBrands}
                  />
                </div>
              </section>
            )}

            {currentStep === 2 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Teknik Özellikler</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <ListingDynamicFields
                    fieldKeys={categorySpec.step2Fields}
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    brandOptions={filteredBrands}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Açıklama</label>
                  <textarea
                    rows={4}
                    className={inputCls}
                    {...register("description", {
                      required: "Açıklama zorunlu.",
                      minLength: {
                        value: 50,
                        message: "Açıklama en az 50 karakter olmalı.",
                      },
                    })}
                  />
                  {errors.description && (
                    <p className="mt-0.5 text-xs text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </section>
            )}

            {currentStep === 3 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Fiyat, Konum, İletişim ve Fotoğraf</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Fiyat (TL)</label>
                    <input
                      type="number"
                      className={inputCls}
                      {...register("price", {
                        required: "Fiyat zorunlu.",
                        valueAsNumber: true,
                        min: { value: 0, message: "Negatif olamaz." },
                      })}
                    />
                    {errors.price && (
                      <p className="mt-0.5 text-xs text-red-600">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Şehir</label>
                    <select
                      className={inputCls}
                      {...register("city", { required: "Şehir seçin." })}
                    >
                      <option value="">Şehir seçin</option>
                      {cityOptions.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-0.5 text-xs text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">İlçe</label>
                    <input
                      type="text"
                      className={inputCls}
                      {...register("district", { required: "İlçe zorunlu." })}
                    />
                    {errors.district && (
                      <p className="mt-0.5 text-xs text-red-600">{errors.district.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">İletişim Adı</label>
                    <input
                      type="text"
                      className={inputCls}
                      {...register("contact_name", { required: "İletişim adı zorunlu." })}
                    />
                    {errors.contact_name && (
                      <p className="mt-0.5 text-xs text-red-600">{errors.contact_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Telefon</label>
                    <input
                      type="tel"
                      placeholder="05XXXXXXXXX"
                      className={inputCls}
                      {...register("contact_phone", {
                        required: "Telefon zorunlu.",
                        pattern: {
                          value: /^05\d{9}$/,
                          message: "Telefon 05XX formatında olmalı.",
                        },
                      })}
                    />
                    {errors.contact_phone && (
                      <p className="mt-0.5 text-xs text-red-600">
                        {errors.contact_phone.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" {...register("price_negotiable")} />
                      Fiyat görüşmeye açık
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Fotoğraflar</label>
                  <label
                    htmlFor="photo-input-edit"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      void handleFiles(e.dataTransfer.files);
                    }}
                    className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-[#f97316] hover:bg-orange-50/30"
                  >
                    <UploadCloud size={20} className="mb-1 text-slate-400" />
                    <p className="text-sm text-slate-500">Sürükleyip bırakın veya tıklayın</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      En fazla 8 fotoğraf, her biri max 5MB
                    </p>
                    <input
                      id="photo-input-edit"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => void handleFiles(e.target.files)}
                    />
                  </label>
                  {uploading && (
                    <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
                      <LoaderCircle className="animate-spin" size={14} />
                      Fotoğraflar yükleniyor...
                    </p>
                  )}
                  {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}

                  {uploadedImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {uploadedImages.map((image) => (
                        <div
                          key={image.public_id}
                          className="relative overflow-hidden rounded-lg border border-slate-200"
                        >
                          <CldImage
                            src={image.public_id}
                            alt="Fotoğraf"
                            width={240}
                            height={160}
                            quality="auto"
                            format="auto"
                            crop="fill"
                            gravity="auto"
                            className="h-16 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setUploadedImages((prev) =>
                                prev.filter((item) => item.public_id !== image.public_id),
                              )
                            }
                            className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white transition hover:bg-black/80"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {submitError && (
          <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-center text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div className="shrink-0 border-t border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 lg:px-8">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                disabled={currentStep === 1}
                className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-40"
              >
                Geri
              </button>
              <Link
                href={`/ilan/${listing.id}`}
                className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                İptal
              </Link>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting || isSubmitting}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
              >
                {deleting ? "Siliniyor..." : "İlanı Sil"}
              </button>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={async () => {
                    const valid = await canGoForward();
                    if (valid) setCurrentStep((prev) => Math.min(prev + 1, 3));
                  }}
                  className="rounded-lg bg-[#f97316] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
                >
                  İleri
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="rounded-lg bg-[#f97316] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:opacity-60"
                >
                  {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
