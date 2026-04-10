export type CategoryGroup = {
  heading: string;
  items: Array<{
    label: string;
    value: string;
  }>;
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    heading: "Taşıma & İstifleme",
    items: [
      { label: "Forklift", value: "forklift" },
      { label: "Terminal Çekici", value: "terminal-cekici" },
      { label: "Platformlar - Manlift", value: "platformlar-manlift" },
      { label: "Transpaletler", value: "transpaletler" },
      { label: "İstif Makineleri", value: "istif-makineleri" },
    ],
  },
  {
    heading: "İş Makineleri",
    items: [
      { label: "Beko Loder (Kazıcı-Yükleyici)", value: "beko-loder-kazici-yukleyici" },
      { label: "Beton Pompası", value: "beton-pompasi" },
      { label: "Dozer", value: "dozer" },
      { label: "Ekskavatör (Kepçe)", value: "ekskavator-kepce" },
      { label: "Loder (Yükleyici)", value: "loder-yukleyici" },
      { label: "Mobil Vinç", value: "mobil-vinc" },
      { label: "Sondaj Makinesi", value: "sondaj-makinesi" },
      { label: "Teleskopik Yükleyici", value: "teleskopik-yukleyici" },
      { label: "Transmikser", value: "transmikser" },
    ],
  },
];

export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap((group) => group.items);

const categoryLabelMap = new Map<string, string>(
  ALL_CATEGORIES.map((item) => [item.value, item.label]),
);

const LEGACY_CATEGORY_LABELS: Record<string, string> = {
  "istif-makinesi": "İstif Makineleri",
  transpalet: "Transpaletler",
  platform: "Platformlar - Manlift",
  "is-makinesi": "İş Makineleri",
  diger: "Diğer",
};

Object.entries(LEGACY_CATEGORY_LABELS).forEach(([value, label]) => {
  categoryLabelMap.set(value, label);
});

export function getCategoryLabel(categoryValue: string | null | undefined) {
  if (!categoryValue) return "Kategori";
  return categoryLabelMap.get(categoryValue) ?? categoryValue;
}
