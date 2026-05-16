import { z } from "zod";

export const listingSchema = z.object({
  // Temel Bilgiler
  title: z.string().min(5, "Başlık en az 5 karakter olmalı").max(100),
  listing_type: z.enum(["sale", "rent"]),
  phone: z.string().min(10, "Geçerli telefon numarası giriniz"),
  
  // Araç Bilgileri
  brand: z.string().min(1, "Marka seçiniz"),
  series: z.string().min(1, "Seri seçiniz"),
  model: z.string().min(1, "Model seçiniz"),
  year: z.number().min(1990, "Geçerli bir yıl seçiniz").max(2026),
  price: z.number().min(1, "Fiyat giriniz"),
  mileage: z.number().min(0, "Kilometre giriniz"),
  fuel_type: z.string().min(1, "Yakıt tipi seçiniz"),
  transmission: z.string().min(1, "Vites tipi seçiniz"),
  
  // Konum
  city: z.string().min(1, "İl seçiniz"),
  district: z.string().min(1, "İlçe seçiniz"),
  
  // Detaylar
  damage_status: z.string().min(1, "Hasar durumu seçiniz"),
  tramer_amount: z.number().min(0).optional(),
  is_exchangeable: z.boolean().default(false),
  
  // Diğer
  description: z.string().optional(),
  images: z.array(z.string()).min(5, "En az 5 fotoğraf yükleyin").max(20, "En fazla 20 fotoğraf"),
});

export type ListingFormData = z.infer<typeof listingSchema>;
