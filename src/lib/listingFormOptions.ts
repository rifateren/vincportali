import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Fetches brand names for a given category slug from the DB.
 * Falls back to the static brandOptions list if no brands are found.
 */
export async function fetchBrandsByCategory(
  supabase: SupabaseClient,
  categorySlug: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("brand_categories")
    .select("brands(name)")
    .eq("category_slug", categorySlug);

  if (error || !data?.length) return brandOptions;

  const names = data
    .map((row: { brands: { name: string } | { name: string }[] | null }) => {
      const b = row.brands;
      if (Array.isArray(b)) return b[0]?.name;
      return b?.name;
    })
    .filter((n): n is string => Boolean(n))
    .sort((a, b) => a.localeCompare(b, "tr"));

  return names.length ? names : brandOptions;
}

export const brandOptions = [
  "Toyota",
  "Linde",
  "Still",
  "Hyster",
  "Jungheinrich",
  "Caterpillar",
  "Komatsu",
  "JCB",
  "Manitou",
  "Doosan",
  "Hyundai",
  "Kubota",
  "Bobcat",
  "Hidromek",
];

export const cityOptions = [
  "Adana",
  "Adiyaman",
  "Afyonkarahisar",
  "Agri",
  "Amasya",
  "Ankara",
  "Antalya",
  "Artvin",
  "Aydin",
  "Balikesir",
  "Bilecik",
  "Bingol",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Canakkale",
  "Cankiri",
  "Corum",
  "Denizli",
  "Diyarbakir",
  "Edirne",
  "Elazig",
  "Erzincan",
  "Erzurum",
  "Eskisehir",
  "Gaziantep",
  "Giresun",
  "Gumushane",
  "Hakkari",
  "Hatay",
  "Isparta",
  "Mersin",
  "Istanbul",
  "Izmir",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kirklareli",
  "Kirsehir",
  "Kocaeli",
  "Konya",
  "Kutahya",
  "Malatya",
  "Manisa",
  "Kahramanmaras",
  "Mardin",
  "Mugla",
  "Mus",
  "Nevsehir",
  "Nigde",
  "Ordu",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Tekirdag",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Sanliurfa",
  "Usak",
  "Van",
  "Yozgat",
  "Zonguldak",
  "Aksaray",
  "Bayburt",
  "Karaman",
  "Kirikkale",
  "Batman",
  "Sirnak",
  "Bartin",
  "Ardahan",
  "Igdir",
  "Yalova",
  "Karabuk",
  "Kilis",
  "Osmaniye",
  "Duzce",
];

export const craneTypeOptions = [
  "Teleskopik Vinç",
  "Katlanır Bomlu Vinç",
  "Sabit Bomlu Vinç",
  "Sepetli Vinç",
  "Paletli Vinç",
  "Arazi Tipi Vinç",
];

export const craneChassisTypeOptions = [
  "Kamyon Üstü",
  "Lastik Tekerlekli",
  "Paletli",
  "Arazi Tipi",
  "Özel Şasi",
];

export const craneAxleCountOptions = ["2", "3", "4", "5", "6", "7", "8+"];

export const conditionOptions = [
  { value: "sifir", label: "Sıfır" },
  { value: "ikinci-el", label: "İkinci El" },
] as const;

export const fuelTypeOptions = [
  { value: "elektrik", label: "Elektrik" },
  { value: "lpg", label: "LPG" },
  { value: "dizel", label: "Dizel" },
  { value: "benzin", label: "Benzin" },
] as const;

export const forkliftMastTypeOptions = [
  "Triplex",
  "Duplex",
  "Simplex",
  "Reach Mast",
];

export const driveTypeOptions = [
  "4x2",
  "4x4",
  "Lastik Tekerlekli",
  "Paletli",
];

export const platformTypeOptions = [
  "Makaslı Platform",
  "Eklemli Platform",
  "Teleskopik Platform",
  "Dikey Platform",
];

export const transpaletTypeOptions = [
  "Manuel",
  "Yarı Akülü",
  "Tam Akülü",
  "Ride-On",
];

export const powerSourceOptions = [
  "Manuel",
  "Akülü",
  "Dizel",
  "LPG",
];

export const attachmentTypeOptions = [
  "Çatal",
  "Kepçe",
  "Personel Sepeti",
  "Varil Taşıyıcı",
];

export const cabinTypeOptions = [
  "Kapalı Kabin",
  "Açık Kabin",
  "Klimalı Kabin",
];

export const pumpTypeOptions = [
  "Sabit",
  "Araç Üstü",
  "Römorklu",
];

export const walkingSystemOptions = [
  "Paletli",
  "Lastik Tekerlekli",
];

export const drillTypeOptions = [
  "Jeoteknik",
  "Su Kuyusu",
  "Fore Kazık",
  "Maden",
];

export const drumTypeOptions = [
  "Standart",
  "Yüksek Kapasiteli",
  "Hafif Seri",
];
