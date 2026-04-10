import {
  getCategoryFormSpec,
  getFieldDefinition,
  type ListingFieldKey,
} from "@/lib/listingCategorySpecs";

export type ListingFormValues = {
  category: string;
  brand: string;
  model: string;
  year: number;
  condition: "sifir" | "ikinci-el";
  working_hours?: number;
  capacity_kg?: number;
  lift_height_mm?: number;
  fuel_type: "elektrik" | "lpg" | "dizel" | "benzin";
  description: string;
  price: number;
  price_negotiable: boolean;
  city: string;
  district: string;
  contact_name: string;
  contact_phone: string;
  is_active?: boolean;
} & Partial<Record<ListingFieldKey, string | number | undefined>>;

export type ListingSpecs = Partial<Record<ListingFieldKey, string | number>>;

export type ListingRecordLike = {
  category: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  condition: string | null;
  working_hours: number | null;
  capacity_kg: number | null;
  lift_height_mm: number | null;
  fuel_type: string | null;
  description: string | null;
  price: number | null;
  price_negotiable: boolean | null;
  city: string | null;
  district: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  is_active?: boolean | null;
  specs?: ListingSpecs | null;
};

export function parseOptionalNumber(value: unknown): number | null {
  if (typeof value !== "number") return null;
  if (Number.isNaN(value)) return null;
  return value;
}

export function buildListingSpecs(category: string, values: ListingFormValues): ListingSpecs {
  const spec = getCategoryFormSpec(category);
  const keys = [...spec.step1Fields, ...spec.step2Fields];
  const result: ListingSpecs = {};

  keys.forEach((key) => {
    const definition = getFieldDefinition(key);
    if (definition.source !== "spec") return;

    const value = values[key];
    if (definition.type === "number") {
      const parsed = parseOptionalNumber(value);
      if (parsed !== null) result[key] = parsed;
      return;
    }

    if (typeof value === "string" && value.trim()) {
      result[key] = value.trim();
    }
  });

  return result;
}

export function getInitialFormValues(listing: ListingRecordLike): ListingFormValues {
  const specs = listing.specs ?? {};

  return {
    ...specs,
    category: listing.category ?? "",
    brand: listing.brand != null ? String(listing.brand) : "",
    model: listing.model != null ? String(listing.model) : "",
    year: listing.year ?? new Date().getFullYear(),
    condition: listing.condition === "sifir" ? "sifir" : "ikinci-el",
    working_hours: listing.working_hours ?? undefined,
    capacity_kg: listing.capacity_kg ?? undefined,
    lift_height_mm: listing.lift_height_mm ?? undefined,
    fuel_type:
      listing.fuel_type === "lpg" ||
      listing.fuel_type === "dizel" ||
      listing.fuel_type === "benzin" ||
      listing.fuel_type === "elektrik"
        ? listing.fuel_type
        : "elektrik",
    description: listing.description ?? "",
    price: listing.price != null ? Number(listing.price) : 0,
    price_negotiable: listing.price_negotiable ?? false,
    city: listing.city ?? "",
    district: listing.district ?? "",
    contact_name: listing.contact_name ?? "",
    contact_phone: listing.contact_phone ?? "",
    is_active: listing.is_active ?? true,
  };
}
