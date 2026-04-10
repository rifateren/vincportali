import { z } from "zod";

const currentYear = new Date().getFullYear();

const sanitize = (val: string) =>
  val
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();

export const listingFormSchema = z.object({
  category: z.string().min(1, "Kategori seçiniz"),
  brand: z.string().min(1, "Marka giriniz"),
  model: z.string().min(1, "Model giriniz"),
  year: z
    .number({ error: "Yıl gerekli" })
    .int()
    .min(1950, "1950 ve sonrası")
    .max(currentYear + 1, `En fazla ${currentYear + 1}`),
  condition: z.enum(["sifir", "ikinci-el"], { message: "Durum seçiniz" }),
  working_hours: z.number().int().min(0).optional(),
  capacity_kg: z.number().int().min(0).optional(),
  lift_height_mm: z.number().int().min(0).optional(),
  fuel_type: z.enum(["elektrik", "lpg", "dizel", "benzin"], {
    message: "Yakıt tipi seçiniz",
  }),
  description: z
    .string()
    .max(5000, "Açıklama en fazla 5000 karakter olabilir")
    .transform(sanitize),
  price: z
    .number({ error: "Fiyat giriniz" })
    .min(0, "Fiyat negatif olamaz")
    .max(100_000_000, "Fiyat çok yüksek"),
  price_negotiable: z.boolean().default(false),
  city: z.string().min(1, "Şehir giriniz"),
  district: z.string().default(""),
  contact_name: z.string().min(1, "İletişim adı giriniz"),
  contact_phone: z.string().min(1, "Telefon numarası giriniz"),
  is_active: z.boolean().optional().default(true),
});

export type ListingFormInput = z.input<typeof listingFormSchema>;
export type ListingFormOutput = z.output<typeof listingFormSchema>;

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta giriniz"),
  password: z.string().min(1, "Şifre giriniz"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  userType: z.enum(["bireysel", "kurumsal"]),
  fullName: z.string().optional(),
  companyName: z.string().optional(),
  taxNumber: z.string().optional(),
  email: z.string().email("Geçerli bir e-posta giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  phone: z.string().optional(),
  city: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const messageSchema = z.object({
  body: z
    .string()
    .min(1, "Mesaj boş olamaz")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir")
    .transform(sanitize)
    .refine((val) => val.length >= 1, "Mesaj boş olamaz"),
});

export type MessageInput = z.infer<typeof messageSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(1, "Adınızı giriniz"),
  email: z.string().email("Geçerli bir e-posta giriniz"),
  subject: z.string().min(1, "Konu seçiniz"),
  message: z.string().min(1, "Mesajınızı giriniz").max(5000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
