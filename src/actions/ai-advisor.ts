"use server";

import { createClient } from "@/lib/supabase/server";

interface VehicleData {
  brand: string;
  series?: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  damage_status?: string;
  engine_power?: number;
  torque?: number;
  max_speed?: number;
  acceleration_0_100?: number;
  fuel_consumption_avg?: number;
  engine_cc?: number;
  city?: string;
  description?: string;
  tramer_amount?: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AdvisorResponse {
  success: boolean;
  analysis?: string;
  error?: string;
}

export async function getAIAdvisorAnalysis(
  vehicle: VehicleData,
  userQuestion: string,
  chatHistory: ChatMessage[] = []
): Promise<AdvisorResponse> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return { success: false, error: "API yapılandırması eksik" };
  }

  try {
    // Vehicle catalog'dan kasko bedelini çek
    const supabase = await createClient();
    let marketReferencePrice: number | null = null;
    
    const { data: catalogData } = await supabase
      .from("vehicle_catalog")
      .select("kasko_bedeli")
      .ilike("marka", `%${vehicle.brand}%`)
      .ilike("seri", `%${vehicle.series || ""}%`)
      .eq("yil", vehicle.year)
      .limit(1)
      .single();

    if (catalogData?.kasko_bedeli) {
      marketReferencePrice = catalogData.kasko_bedeli;
    }

    // Detaylı araç bilgisi
    const vehicleInfo = `
═══════════════════════════════════════
ARAÇ TEKNİK VERİLERİ
═══════════════════════════════════════
Marka/Model: ${vehicle.brand} ${vehicle.series || ""} ${vehicle.model}
Model Yılı: ${vehicle.year}
İlan Fiyatı: ${vehicle.price.toLocaleString("tr-TR")} TL
Kilometre: ${vehicle.mileage.toLocaleString("tr-TR")} km
Yakıt Tipi: ${vehicle.fuel_type}
Vites: ${vehicle.transmission}
${vehicle.damage_status ? `Hasar Durumu: ${vehicle.damage_status}` : "Hasar Durumu: Belirtilmemiş"}
${vehicle.tramer_amount !== undefined ? `Tramer Kaydı: ${vehicle.tramer_amount.toLocaleString("tr-TR")} TL` : ""}
${vehicle.city ? `Konum: ${vehicle.city}` : ""}

${vehicle.engine_power || vehicle.torque || vehicle.max_speed || vehicle.acceleration_0_100 ? `
PERFORMANS VERİLERİ:
${vehicle.engine_power ? `• Motor Gücü: ${vehicle.engine_power} HP` : ""}
${vehicle.torque ? `• Tork: ${vehicle.torque} Nm` : ""}
${vehicle.engine_cc ? `• Motor Hacmi: ${vehicle.engine_cc} cc` : ""}
${vehicle.max_speed ? `• Maksimum Hız: ${vehicle.max_speed} km/h` : ""}
${vehicle.acceleration_0_100 ? `• 0-100 km/h: ${vehicle.acceleration_0_100} sn` : ""}
${vehicle.fuel_consumption_avg ? `• Ortalama Tüketim: ${vehicle.fuel_consumption_avg} lt/100km` : ""}
` : ""}

${marketReferencePrice ? `
PİYASA REFERANSI:
• TSB Kasko Bedeli: ${marketReferencePrice.toLocaleString("tr-TR")} TL
• Fiyat Farkı: ${((vehicle.price - marketReferencePrice) / marketReferencePrice * 100).toFixed(1)}%
` : ""}

${vehicle.description ? `
SATICI AÇIKLAMASI:
"${vehicle.description.slice(0, 500)}${vehicle.description.length > 500 ? "..." : ""}"
` : ""}
═══════════════════════════════════════`.trim();

    const priceAnalysisInstruction = marketReferencePrice 
      ? `
📊 FİYAT ANALİZİ:
TSB Kasko Bedeli: ${marketReferencePrice.toLocaleString("tr-TR")} TL
İlan Fiyatı: ${vehicle.price.toLocaleString("tr-TR")} TL
Fark: ${vehicle.price > marketReferencePrice ? "+" : ""}${((vehicle.price - marketReferencePrice) / marketReferencePrice * 100).toFixed(1)}%

Bu veriyi kullanarak fiyat değerlendirmesi yap:
- %10'dan fazla üstte: "Piyasa üstü fiyat"
- %10'dan fazla altta: "Avantajlı fiyat"
- ±%10 arası: "Piyasa ortalamasında"`
      : `
⚠️ Bu araç için güncel kasko bedeli verisi bulunamadı. Genel piyasa bilgine göre değerlendir ve TAHMİNİ olduğunu belirt.`;

    // Chat history'yi formatla
    const historyContext = chatHistory.length > 0 
      ? `\n\nÖNCEKİ KONUŞMA:\n${chatHistory.map(m => `${m.role === "user" ? "Kullanıcı" : "Sen"}: ${m.content}`).join("\n")}\n`
      : "";

    const systemPrompt = `Sen bu aracın UZMAN DANIŞMANISIN. Kullanıcı sana bu araçla ilgili ne sorarsa sorsun, elindeki teknik verilere dayanarak profesyonel ve samimi bir şekilde cevap ver.

${vehicleInfo}
${priceAnalysisInstruction}
${historyContext}

KURALLAR:
1. Her zaman bu aracın verilerine dayanarak cevap ver
2. Emin olmadığın konularda "Bu konuda kesin bilgi veremiyorum" de
3. Fiyat sorularında mutlaka kasko bedeli karşılaştırması yap (varsa)
4. Türkiye piyasa koşullarını göz önünde bulundur
5. Samimi ama profesyonel bir dil kullan
6. Maksimum 200 kelime ile yanıtla
7. "Merhaba" gibi gereksiz girişler yapma, direkt konuya gir`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuestion }
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Analiz yapılamadı" };
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      return { success: false, error: "Yanıt alınamadı" };
    }

    return { success: true, analysis };
  } catch (error) {
    console.error("AI Advisor error:", error);
    return { success: false, error: "Bir hata oluştu" };
  }
}
