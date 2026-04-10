"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY_GROUPS } from "@/lib/categories";

export type CityOption = { value: string; label: string };

type ListingsFilterFormProps = {
  searchQuery?: string;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedCondition?: string;
  selectedCity?: string;
  districtQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  maxWorkingHours?: number;
  minYear?: number;
  maxYear?: number;
  minCapacityKg?: number;
  maxCapacityKg?: number;
  sort: string;
  allBrands: string[];
  cityOptions: CityOption[];
};

const touchRow = "flex min-h-[44px] cursor-pointer items-center gap-3 py-1";

export default function ListingsFilterForm({
  searchQuery,
  selectedCategories,
  selectedBrands,
  selectedCondition,
  selectedCity,
  districtQuery,
  minPrice,
  maxPrice,
  maxWorkingHours,
  minYear,
  maxYear,
  minCapacityKg,
  maxCapacityKg,
  sort,
  allBrands,
  cityOptions,
}: ListingsFilterFormProps) {
  const [brandSearch, setBrandSearch] = useState("");
  const filteredBrands = useMemo(() => {
    const q = brandSearch.trim().toLocaleLowerCase("tr-TR");
    if (!q) return allBrands;
    return allBrands.filter((b) => b.toLocaleLowerCase("tr-TR").includes(q));
  }, [allBrands, brandSearch]);

  return (
    <form action="/ilanlar" method="get" className="space-y-6">
      {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
      <input type="hidden" name="sirala" value={sort} />

      <div>
        <h3 className="mb-3 font-semibold text-[#1e3a5f]">Kategori</h3>
        <div className="space-y-3 text-sm">
          {CATEGORY_GROUPS.map((group) => (
            <details key={group.heading} className="rounded-lg border border-slate-200 open:bg-slate-50/80">
              <summary className="cursor-pointer select-none px-3 py-2.5 font-medium text-[#1e3a5f]">
                {group.heading}
              </summary>
              <div className="space-y-1 border-t border-slate-100 px-2 pb-2 pt-1">
                {group.items.map((category) => (
                  <label key={category.value} className={touchRow}>
                    <input
                      type="checkbox"
                      name="kategori"
                      value={category.value}
                      defaultChecked={selectedCategories.includes(category.value)}
                      className="h-5 w-5 shrink-0 accent-[#f97316]"
                    />
                    <span>{category.label}</span>
                  </label>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-[#1e3a5f]">Marka</h3>
        <input
          type="search"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          placeholder="Marka ara..."
          className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
          autoComplete="off"
        />
        <div className="max-h-56 space-y-1 overflow-y-auto text-sm">
          {allBrands.length === 0 ? (
            <p className="text-slate-500">Marka bulunamadı</p>
          ) : filteredBrands.length === 0 ? (
            <p className="text-slate-500">Aramanıza uygun marka yok</p>
          ) : (
            filteredBrands.map((brand) => (
              <label key={brand} className={touchRow}>
                <input
                  type="checkbox"
                  name="marka"
                  value={brand}
                  defaultChecked={selectedBrands.includes(brand)}
                  className="h-5 w-5 shrink-0 accent-[#f97316]"
                />
                <span>{brand}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-[#1e3a5f]">Durum</h3>
        <div className="space-y-1 text-sm">
          <label className={touchRow}>
            <input
              type="radio"
              name="durum"
              value=""
              defaultChecked={!selectedCondition}
              className="h-5 w-5 shrink-0 accent-[#f97316]"
            />
            <span>Tümü</span>
          </label>
          <label className={touchRow}>
            <input
              type="radio"
              name="durum"
              value="sifir"
              defaultChecked={selectedCondition === "sifir"}
              className="h-5 w-5 shrink-0 accent-[#f97316]"
            />
            <span>Sıfır</span>
          </label>
          <label className={touchRow}>
            <input
              type="radio"
              name="durum"
              value="ikinci-el"
              defaultChecked={selectedCondition === "ikinci-el"}
              className="h-5 w-5 shrink-0 accent-[#f97316]"
            />
            <span>İkinci El</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-[#1e3a5f]">Şehir</h3>
        <select
          name="sehir"
          defaultValue={selectedCity ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
        >
          <option value="">Tüm şehirler</option>
          {cityOptions.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-[#1e3a5f]">İlçe</h3>
        <input
          type="text"
          name="ilce"
          defaultValue={districtQuery ?? ""}
          placeholder="İlçe adı (içerir)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
        />
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-[#1e3a5f]">Model yılı</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="yilMin"
            defaultValue={minYear}
            placeholder="Min"
            min={1950}
            max={2100}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
          />
          <input
            type="number"
            name="yilMax"
            defaultValue={maxYear}
            placeholder="Max"
            min={1950}
            max={2100}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-[#1e3a5f]">Taşıma kapasitesi (kg)</h3>
        <p className="mb-2 text-xs text-slate-500">Forklift / vinç tonajına yaklaşık: 1000 kg ≈ 1 ton</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="kapasiteMin"
            defaultValue={minCapacityKg}
            placeholder="Min kg"
            min={0}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
          />
          <input
            type="number"
            name="kapasiteMax"
            defaultValue={maxCapacityKg}
            placeholder="Max kg"
            min={0}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-[#1e3a5f]">Fiyat (TL)</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="fiyatMin"
            defaultValue={minPrice}
            placeholder="Min"
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
          />
          <input
            type="number"
            name="fiyatMax"
            defaultValue={maxPrice}
            placeholder="Max"
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-[#1e3a5f]">Çalışma saati (max)</h3>
        <input
          type="number"
          name="saatMax"
          defaultValue={maxWorkingHours}
          placeholder="Örn: 2000"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="min-h-[44px] rounded-lg bg-[#f97316] px-5 py-2 text-sm font-semibold text-white"
        >
          Filtrele
        </button>
        <Link
          href="/ilanlar"
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-600 hover:text-[#f97316]"
        >
          Temizle
        </Link>
      </div>
    </form>
  );
}
