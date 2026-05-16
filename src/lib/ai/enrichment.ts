"use server";

import { createClient } from "@/lib/supabase/server";

interface AIEnrichmentData {
  // Temel Performans
  acceleration_0_100?: number;
  acceleration_0_200?: number | null;
  max_speed?: number;
  torque?: number;
  engine_power?: number;
  engine_cc?: number;
  weight?: number;
  fuel_consumption_avg?: number;
  trunk_volume?: number;
  // Gelişmiş Performans
  drag_coefficient?: number | null;
  power_to_weight?: number | null;
  turning_radius?: number | null;
  cylinder_config?: string | null;
  emission_standard?: string | null;
}

export async function enrichListingWithAI(
  listingId: string, 
  brand: string, 
  series: string, 
  model: string, 
  year: number
): Promise<void> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("GROQ_API_KEY not found");
    return;
  }

  try {
    const prompt = `Sen bir otomotiv uzmanısın. ${brand} ${series} ${model} (${year}) aracının teknik özelliklerini ver.

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
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return;
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content;

    if (!textResponse) {
      console.error("No response from Groq:", JSON.stringify(data));
      return;
    }

    // JSON'u parse et
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not parse JSON from response:", textResponse);
      return;
    }

    const enrichmentData: AIEnrichmentData = JSON.parse(jsonMatch[0]);

    // Supabase'e kaydet
    const supabase = await createClient();
    const { error } = await supabase
      .from("listings")
      .update({
        acceleration_0_100: enrichmentData.acceleration_0_100,
        acceleration_0_200: enrichmentData.acceleration_0_200,
        max_speed: enrichmentData.max_speed,
        torque: enrichmentData.torque,
        engine_power: enrichmentData.engine_power,
        engine_cc: enrichmentData.engine_cc,
        weight: enrichmentData.weight,
        fuel_consumption_avg: enrichmentData.fuel_consumption_avg,
        trunk_volume: enrichmentData.trunk_volume,
        drag_coefficient: enrichmentData.drag_coefficient,
        power_to_weight: enrichmentData.power_to_weight,
        turning_radius: enrichmentData.turning_radius,
        cylinder_config: enrichmentData.cylinder_config,
        emission_standard: enrichmentData.emission_standard,
        ai_enriched: true,
        ai_enriched_at: new Date().toISOString(),
      })
      .eq("id", listingId);

    if (error) {
      console.error("Supabase update error:", error);
    } else {
      console.log(`Listing ${listingId} enriched successfully with advanced specs`);
    }
  } catch (error) {
    console.error("AI Enrichment error:", error);
  }
}
