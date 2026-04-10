import { createClient } from "@supabase/supabase-js";

type SeedListing = {
  title: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  price_negotiable: boolean;
  condition: "sifir" | "ikinci-el";
  working_hours: number;
  capacity_kg: number;
  lift_height_mm: number;
  fuel_type: "elektrik" | "lpg" | "dizel" | "benzin";
  city: string;
  district: string;
  images: string[];
  contact_name: string;
  contact_phone: string;
  is_active: boolean;
};

async function runSeed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Seed requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (RLS blocks anonymous inserts).",
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const listings: SeedListing[] = [
    {
      title: "Toyota 8FBE15 Elektrikli Forklift",
      category: "forklift",
      brand: "Toyota",
      model: "8FBE15",
      year: 2019,
      condition: "ikinci-el",
      working_hours: 4200,
      capacity_kg: 1500,
      lift_height_mm: 4800,
      fuel_type: "elektrik",
      price: 485000,
      city: "Izmir",
      district: "Cigli",
      contact_name: "Ahmet Yılmaz",
      contact_phone: "05321234567",
      description:
        "Bakımlı, hasarsız Toyota elektrikli forklift. Aküsü yenilenmiştir. Fatura ve garanti belgesi mevcuttur.",
      images: [],
      is_active: true,
      price_negotiable: false,
    },
    {
      title: "Linde E20 İstif Makinesi",
      category: "istif-makineleri",
      brand: "Linde",
      model: "E20",
      year: 2021,
      condition: "ikinci-el",
      working_hours: 1800,
      capacity_kg: 2000,
      lift_height_mm: 5500,
      fuel_type: "elektrik",
      price: 320000,
      city: "Istanbul",
      district: "Esenyurt",
      contact_name: "Mehmet Demir",
      contact_phone: "05419876543",
      description:
        "Az kullanılmış Linde istif makinesi. Servisi yapılmıştır. Takas düşünülmez.",
      images: [],
      is_active: true,
      price_negotiable: false,
    },
    {
      title: "Still EXU18 Transpalet",
      category: "transpaletler",
      brand: "Still",
      model: "EXU18",
      year: 2020,
      condition: "ikinci-el",
      working_hours: 2900,
      capacity_kg: 1800,
      lift_height_mm: 0,
      fuel_type: "elektrik",
      price: 95000,
      city: "Ankara",
      district: "Ostim",
      contact_name: "Ali Kaya",
      contact_phone: "05554443322",
      description:
        "Çalışır durumda Still elektrikli transpalet. Şarj ünitesi dahildir.",
      images: [],
      is_active: true,
      price_negotiable: false,
    },
  ];

  const { data, error } = await supabase
    .from("listings")
    .insert(listings)
    .select("id, title");

  if (error) {
    throw new Error(`Seed failed: ${error.message}`);
  }

  console.log("Seed completed. Inserted listings:");
  console.table(data);
}

runSeed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
