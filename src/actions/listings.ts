"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { enrichListingWithAI } from "@/lib/ai/enrichment";

export async function getBrands() {
  const supabase = await createClient();
  
  // Pagination ile tüm verileri çek
  let allBrands: string[] = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from("vehicle_catalog")
      .select("brand")
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error || !data || data.length === 0) break;
    
    allBrands = [...allBrands, ...data.map((item) => item.brand)];
    
    if (data.length < pageSize) break;
    page++;
  }
  
  const uniqueBrands = [...new Set(allBrands)];
  return uniqueBrands.sort((a, b) => a.localeCompare(b, 'tr'));
}

export async function getModelsByBrand(brand: string) {
  const supabase = await createClient();
  
  let allModels: string[] = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from("vehicle_catalog")
      .select("series")
      .eq("brand", brand)
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error || !data || data.length === 0) break;
    
    allModels = [...allModels, ...data.map((item) => item.series)];
    
    if (data.length < pageSize) break;
    page++;
  }
  
  const uniqueModels = [...new Set(allModels)];
  return uniqueModels.sort((a, b) => a.localeCompare(b, 'tr'));
}

export async function getSeriesByBrand(brand: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("vehicle_catalog")
    .select("series")
    .eq("brand", brand);

  if (error) return [];
  
  const uniqueSeries = [...new Set(data.map((item) => item.series))];
  return uniqueSeries.sort((a, b) => a.localeCompare(b, 'tr'));
}

export async function getTrimsBySeries(brand: string, series: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("vehicle_catalog")
    .select("id, model, fuel_type, gear_type, hp, engine_cc")
    .eq("brand", brand)
    .eq("series", series);

  if (error) return [];
  return data;
}

export async function getVariantsByModel(brand: string, model: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_catalog")
    .select("model, fuel_type")
    .eq("brand", brand)
    .eq("series", model);

  if (error) return [];
  
  return data;
}

export async function getCities() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cities")
    .select("id, name")
    .order("name");

  if (error) return [];
  return data;
}

export async function getDistrictsByCity(cityId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("districts")
    .select("id, name")
    .eq("city_id", cityId)
    .order("name");

  if (error) return [];
  return data;
}

export async function createListing(formData: {
  title: string;
  listing_type: string;
  phone: string;
  brand: string;
  series: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  city: string;
  district: string;
  damage_status: string;
  tramer_amount?: number;
  is_exchangeable: boolean;
  description?: string;
  images: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Giriş yapmalısınız" };
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({
      ...formData,
      user_id: user.id,
      status: "active",
      is_featured: false, // Yeni ilanlar vitrine otomatik düşmez
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Arka planda AI Enrichment başlat (await etmiyoruz, arka planda çalışsın)
  enrichListingWithAI(data.id, formData.brand, formData.series, formData.model, formData.year).catch(console.error);

  revalidatePath("/");
  return { data };
}

export async function getLatestListings(limit: number = 8) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data;
}

export async function getListingById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Listing fetch error:", error);
    return null;
  }
  return data;
}


export async function deleteListing(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Giriş yapmalısınız" };
  }

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profil");
  revalidatePath("/");
  return { success: true };
}

export async function updateListingStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Giriş yapmalısınız" };
  }

  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profil");
  revalidatePath("/");
  return { success: true };
}


export async function getShowcaseListings(limit: number = 6) {
  const supabase = await createClient();
  
  // Anonim kullanıcılar da görebilmeli - auth kontrolü yok
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .eq("is_featured", true)
    .order("featured_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data;
}

export async function getFeaturedListings(limit: number = 6) {
  const supabase = await createClient();
  
  // Anonim kullanıcılar da görebilmeli - auth kontrolü yok
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .eq("is_featured", true)
    .order("featured_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data;
}

export async function toggleFeatured(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Giriş yapmalısınız" };
  }

  // Mevcut durumu al
  const { data: listing } = await supabase
    .from("listings")
    .select("is_featured")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!listing) {
    return { error: "İlan bulunamadı" };
  }

  const newFeaturedStatus = !listing.is_featured;

  // Toggle yap - featured_at'i de güncelle
  const { error } = await supabase
    .from("listings")
    .update({ 
      is_featured: newFeaturedStatus,
      featured_at: newFeaturedStatus ? new Date().toISOString() : null
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profil");
  revalidatePath("/");
  return { success: true, is_featured: newFeaturedStatus };
}

// Eski fonksiyon uyumluluk için
export async function toggleShowcase(id: string) {
  return toggleFeatured(id);
}
