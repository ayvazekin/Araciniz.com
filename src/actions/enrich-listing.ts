"use server";

import { createClient } from "@/lib/supabase/server";

interface AIEnrichmentData {
  acceleration_0_100?: number;
  acceleration_0_200?: number | null;
  max_speed?: number;
  torque?: number;
  engine_power?: number;
  engine_cc?: number;
  fuel_consumption_avg?: number;
  trunk_volume?: number;
  weight?: number;
  drag_coefficient?: number | null;
  power_to_weight?: number | null;
  turning_radius?: number | null;
  cylinder_config?: string | null;
  emission_standard?: string | null;
}

export async function enrichListing(listingId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  // İlan bilgilerini al
  const { data: listing, error: fetchError } = await supabase
    .from("listings")
    .select("brand, series, model, year, fuel_type, price")
    .eq("id", listingId)
    .single();

  if (fetchError || !listing) {
    return { success: false, error: "İlan bulunamadı" };
  }

  // TSB Price Index'ten resmi kasko fiyatını çek
  let marketReferencePrice: number | null = null;
  let priceSource = "TSB Resmi Kasko Veritabanı";
  
  // Önce tam eşleşme dene
  let { data: tsbData } = await supabase
    .from("tsb_price_index")
    .select("price")
    .ilike("brand_name", listing.brand)
    .ilike("model_name", listing.model)
    .eq("year", listing.year)
    .limit(1)
    .maybeSingle();

  // Tam eşleşme yoksa fuzzy matching dene
  if (!tsbData) {
    const { data: fuzzyData } = await supabase
      .from("tsb_price_index")
      .select("price, brand_name, model_name")
      .ilike("brand_name", `%${listing.brand}%`)
      .eq("year", listing.year)
      .limit(10);

    if (fuzzyData && fuzzyData.length > 0) {
      // Model adını normalize et ve en yakın eşleşmeyi bul
      const normalizedModel = listing.model.toLowerCase().trim();
      const bestMatch = fuzzyData.find(item => 
        item.model_name.toLowerCase().includes(normalizedModel) ||
        normalizedModel.includes(item.model_name.toLowerCase())
      );
      
      if (bestMatch) {
        tsbData = bestMatch;
      }
    }
  }

  if (tsbData?.price) {
    marketReferencePrice = tsbData.price;
  } else {
    // TSB'de bulunamadıysa eski vehicle_catalog'a bak
    const { data: catalogData } = await supabase
      .from("vehicle_catalog")
      .select("kasko_bedeli")
      .ilike("marka", `%${listing.brand}%`)
      .ilike("seri", `%${listing.series || ""}%`)
      .eq("yil", listing.year)
      .limit(1)
      .maybeSingle();

    if (catalogData?.kasko_bedeli) {
      marketReferencePrice = catalogData.kasko_bedeli;
      priceSource = "Alternatif Kasko Veritabanı";
    }
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { success: false, error: "API key bulunamadı" };
  }

  try {
    let priceContext = marketReferencePrice 
      ? `📊 FİYAT KARŞILAŞTIRMASI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resmi Kasko Değeri (${priceSource}): ${marketReferencePrice.toLocaleString("tr-TR")} TL
İlan Fiyatı: ${listing.price.toLocaleString("tr-TR")} TL
Fark: ${((listing.price - marketReferencePrice) / marketReferencePrice * 100).toFixed(1)}%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ GÖREV: Bu fiyat farkını analiz et ve kullanıcıya profesyonel bir değerlendirme sun:
- Eğer ilan fiyatı kasko değerinin üzerindeyse: "Bu araç kasko değerinin %X üzerinde fiyatlandırılmış. Pazarlık payı sorgulanabilir."
- Eğer ilan fiyatı kasko değerinin altındaysa: "Bu araç kasko değerinin %X altında fiyatlandırılmış. Dikkatli inceleme önerilir."
- Eğer fark ±5% içindeyse: "Fiyat piyasa ortalamasına uygun görünüyor."

Analizi Türkçe, profesyonel ve net bir dille yap.`
      : `İlan Fiyatı: ${listing.price.toLocaleString("tr-TR")} TL

⚠️ NOT: Bu araç için TSB resmi kasko veritabanında fiyat bulunamadı. Genel piyasa bilgini kullanarak tahmini bir değerlendirme yapabilirsin, ancak bunun tahmini olduğunu belirt.`;

    const prompt = `Sen bir otomobil teknik uzmanısın. ${listing.brand} ${listing.series || ""} ${listing.model} (${listing.year}) - ${listing.fuel_type} aracının teknik özelliklerini ver.

${priceContext}

KURALLAR:
1. Sadece gerçek, doğrulanabilir verileri kullan. Emin olmadığın değerleri null yap.
2. acceleration_0_200: SADECE 300 HP üzeri sportif araçlar için ver. Aile arabaları, SUV'lar ve standart sedanlar için null yap.
3. drag_coefficient (Cd): Aerodinamik katsayı, genelde 0.25-0.40 arası.
4. power_to_weight: Beygir başına düşen ağırlık (kg/hp). weight / engine_power formülüyle hesapla.
5. cylinder_config: Motor silindir dizilimi (Örn: "I4", "V6", "V8", "I6", "W12", "Boxer 4")
6. emission_standard: Avrupa emisyon standardı (Örn: "Euro 6", "Euro 6d", "Euro 5")

JSON formatında döndür:
{
  "acceleration_0_100": number veya null,
  "acceleration_0_200": number veya null,
  "max_speed": number veya null,
  "torque": number (Nm),
  "engine_power": number (HP),
  "engine_cc": number (cc),
  "weight": number (kg),
  "fuel_consumption_avg": number (lt/100km),
  "trunk_volume": number (litre),
  "drag_coefficient": number veya null,
  "power_to_weight": number veya null,
  "turning_radius": number (metre) veya null,
  "cylinder_config": string veya null,
  "emission_standard": string veya null
}

Sadece JSON döndür, başka bir şey yazma.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return { success: false, error: `API hatası: ${response.status}` };
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content;

    if (!textResponse) {
      return { success: false, error: "API yanıt vermedi" };
    }

    // JSON'u parse et
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "JSON parse hatası" };
    }

    const enrichmentData: AIEnrichmentData = JSON.parse(jsonMatch[0]);

    // Supabase'e kaydet
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        acceleration_0_100: enrichmentData.acceleration_0_100,
        acceleration_0_200: enrichmentData.acceleration_0_200,
        max_speed: enrichmentData.max_speed,
        torque: enrichmentData.torque,
        engine_power: enrichmentData.engine_power,
        engine_cc: enrichmentData.engine_cc,
        fuel_consumption_avg: enrichmentData.fuel_consumption_avg,
        trunk_volume: enrichmentData.trunk_volume,
        weight: enrichmentData.weight,
        drag_coefficient: enrichmentData.drag_coefficient,
        power_to_weight: enrichmentData.power_to_weight,
        turning_radius: enrichmentData.turning_radius,
        cylinder_config: enrichmentData.cylinder_config,
        emission_standard: enrichmentData.emission_standard,
        ai_enriched: true,
        ai_enriched_at: new Date().toISOString(),
      })
      .eq("id", listingId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function checkEnrichmentStatus(listingId: string): Promise<{ enriched: boolean }> {
  const supabase = await createClient();
  
  const { data } = await supabase
    .from("listings")
    .select("ai_enriched")
    .eq("id", listingId)
    .single();

  return { enriched: data?.ai_enriched || false };
}
