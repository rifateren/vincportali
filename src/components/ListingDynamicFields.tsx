"use client";

import { useMemo, useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import {
  getFieldDefinition,
  type ListingFieldDefinition,
  type ListingFieldKey,
} from "@/lib/listingCategorySpecs";
import type { ListingFormValues } from "@/lib/listingFormSchema";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20";

function getRegisterRules(field: ListingFieldDefinition) {
  const rules: Record<string, unknown> = {};

  if (field.required) {
    rules.required = `${field.label} zorunlu.`;
  }
  if (field.type === "number") {
    rules.valueAsNumber = true;
    if (typeof field.min === "number") {
      rules.min = { value: field.min, message: "Negatif olamaz." };
    }
    if (typeof field.max === "number") {
      rules.max = { value: field.max, message: `${field.label} sınırı aşıldı.` };
    }
  }

  return rules;
}

export default function ListingDynamicFields({
  fieldKeys,
  register,
  errors,
  watch,
  setValue,
  brandOptions,
}: {
  fieldKeys: ListingFieldKey[];
  register: UseFormRegister<ListingFormValues>;
  errors: FieldErrors<ListingFormValues>;
  watch: UseFormWatch<ListingFormValues>;
  setValue: UseFormSetValue<ListingFormValues>;
  brandOptions: string[];
}) {
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const selectedBrand = (watch("brand") as string | undefined) ?? "";

  const visibleBrands = useMemo(() => {
    const query = selectedBrand.trim().toLocaleLowerCase("tr");
    return query
      ? brandOptions.filter((brand) => brand.toLocaleLowerCase("tr").includes(query))
      : brandOptions;
  }, [brandOptions, selectedBrand]);

  return (
    <>
      {fieldKeys.map((fieldKey) => {
        const field = getFieldDefinition(fieldKey);
        const dependentValue = field.showWhen ? watch(field.showWhen.key) : undefined;

        if (field.showWhen && dependentValue !== field.showWhen.equals) {
          return null;
        }

        if (field.key === "brand") {
          return (
            <div key={field.key} className="relative">
              <label className="mb-1 block text-sm font-medium">{field.label}</label>
              <input
                placeholder={field.placeholder}
                className={inputCls}
                value={selectedBrand}
                onFocus={() => setBrandMenuOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setBrandMenuOpen(false), 120);
                }}
                onChange={(e) =>
                  setValue("brand", e.target.value, { shouldValidate: true, shouldDirty: true })
                }
              />
              <input type="hidden" {...register("brand", getRegisterRules(field))} />
              {brandMenuOpen && visibleBrands.length > 0 && (
                <div className="absolute z-20 mt-1 max-h-[20.5rem] w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {visibleBrands.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-orange-50 hover:text-[#f97316]"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setValue("brand", brand, { shouldValidate: true, shouldDirty: true });
                        setBrandMenuOpen(false);
                      }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
              {errors.brand && (
                <p className="mt-0.5 text-xs text-red-600">{String(errors.brand.message ?? "")}</p>
              )}
            </div>
          );
        }

        if (field.type === "radio") {
          return (
            <div key={field.key}>
              <label className="mb-1 block text-sm font-medium">{field.label}</label>
              <div className="flex flex-wrap gap-4 pt-2">
                {field.options?.map((option) => (
                  <label key={option.value} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      value={option.value}
                      {...register(field.key, getRegisterRules(field))}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              {errors[field.key] && (
                <p className="mt-0.5 text-xs text-red-600">
                  {String(errors[field.key]?.message ?? "")}
                </p>
              )}
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.key}>
              <label className="mb-1 block text-sm font-medium">{field.label}</label>
              <select className={inputCls} {...register(field.key, getRegisterRules(field))}>
                <option value="">Seçiniz</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors[field.key] && (
                <p className="mt-0.5 text-xs text-red-600">
                  {String(errors[field.key]?.message ?? "")}
                </p>
              )}
            </div>
          );
        }

        return (
          <div key={field.key}>
            <label className="mb-1 block text-sm font-medium">{field.label}</label>
            {field.type === "number" ? (
              <input
                type="number"
                step={field.step}
                className={inputCls}
                {...register(field.key, getRegisterRules(field))}
              />
            ) : (
              <input
                type="text"
                placeholder={field.placeholder}
                className={inputCls}
                {...register(field.key, getRegisterRules(field))}
              />
            )}
            {errors[field.key] && (
              <p className="mt-0.5 text-xs text-red-600">
                {String(errors[field.key]?.message ?? "")}
              </p>
            )}
          </div>
        );
      })}
    </>
  );
}
