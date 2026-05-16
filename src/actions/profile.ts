"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Giriş yapılmamış" };

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return { error: error.message };
  }

  return { profile: data, user };
}

export async function checkOnboardingStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { needsOnboarding: false, user: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", user.id)
    .single();

  // Eğer account_type yoksa onboarding gerekli
  const needsOnboarding = !profile?.account_type;
  
  return { needsOnboarding, user };
}

export async function completeOnboarding(data: {
  account_type: "bireysel" | "kurumsal";
  phone: string;
  company_name?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Giriş yapılmamış" };

  // Slug oluştur (kurumsal için)
  let company_slug: string | undefined;
  if (data.account_type === "kurumsal" && data.company_name) {
    company_slug = data.company_name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      account_type: data.account_type,
      phone: data.phone.replace(/\s/g, ""),
      company_name: data.company_name || null,
      company_slug: company_slug || null,
      updated_at: new Date().toISOString(),
    });

  if (error) return { error: error.message };
  
  return { success: true };
}

export async function updateProfile(data: { full_name?: string; phone?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Giriş yapılmamış" };

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) return { error: error.message };
  
  return { success: true };
}

export async function getUserPhone() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { phone: null };

  const { data } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", user.id)
    .single();

  return { phone: data?.phone || null };
}

export async function saveUserPhone(phone: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Giriş yapılmamış" };

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      phone,
      updated_at: new Date().toISOString(),
    });

  if (error) return { error: error.message };
  
  return { success: true };
}


export async function updateCompanyProfile(data: {
  company_name?: string;
  company_description?: string;
  company_logo?: string;
  tax_no?: string;
  city?: string;
  district?: string;
  address?: string;
  phone?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Giriş yapılmamış" };

  // Slug güncelle (company_name değiştiyse)
  let company_slug: string | undefined;
  if (data.company_name) {
    company_slug = data.company_name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...data,
      company_slug: company_slug || undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  
  return { success: true };
}

export async function uploadCompanyLogo(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Giriş yapılmamış" };

  const file = formData.get("file") as File;
  if (!file) return { error: "Dosya bulunamadı" };

  // Dosya adı oluştur
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-logo-${Date.now()}.${fileExt}`;

  // Supabase Storage'a yükle
  const { error: uploadError } = await supabase.storage
    .from("car-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) return { error: uploadError.message };

  // Public URL al
  const { data: urlData } = supabase.storage
    .from("car-images")
    .getPublicUrl(fileName);

  const logoUrl = urlData.publicUrl;

  // Profili güncelle
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      company_logo: logoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) return { error: updateError.message };

  return { url: logoUrl };
}


export async function switchAccountType(data: {
  newType: "bireysel" | "kurumsal";
  companyName?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Giriş yapılmamış" };

  let updateData: Record<string, unknown> = {
    account_type: data.newType,
    updated_at: new Date().toISOString(),
  };

  if (data.newType === "kurumsal" && data.companyName) {
    // Slug oluştur
    const company_slug = data.companyName
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    updateData = {
      ...updateData,
      company_name: data.companyName,
      company_slug,
    };
  } else if (data.newType === "bireysel") {
    // Kurumsal bilgileri temizle
    updateData = {
      ...updateData,
      company_name: null,
      company_slug: null,
      company_description: null,
      company_logo: null,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) return { error: error.message };
  
  return { success: true, newType: data.newType };
}
