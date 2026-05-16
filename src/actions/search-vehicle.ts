"use server";

interface SearchFilters {
  brand?: string;
  series?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  mileage_max?: number;
  city?: string;
  district?: string;
  fuel_type?: string;
  transmission?: string;
  body_type?: string;
  damage_status?: string;
  color?: string;
}

interface SearchResult {
  success: boolean;
  filters?: SearchFilters;
  reasoning?: string;
  error?: string;
  isInvalidQuery?: boolean;
}

export async function parseSearchQuery(query: string): Promise<SearchResult> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("GROQ_API_KEY not found");
    return { success: false, error: "API yapılandırması eksik" };
  }

  try {
    const prompt = `Sen Türkiye'nin en akıllı araç arama asistanısın. Kullanıcının doğal dildeki aramasını analiz et ve veritabanı filtrelerine dönüştür.

Kullanıcı Metni: "${query}"

GÖREV:
1. Metni analiz et ve araç aramasıyla ilgili TÜM kriterleri çıkar.
2. Kullanıcı dolaylı ifadeler kullanıyorsa (örn: "az yakan" = Dizel, "aile arabası" = Sedan/SUV) bunları akıllıca yorumla.
3. Türkiye'deki şehir/ilçe bilgisini doğru eşleştir (örn: Tarsus = Mersin'in ilçesi).

⚠️ SAYI PARSE KURALLARI (ZORUNLU - KESİNLİKLE UYMALISIN):
Kullanıcı "Milyon" kelimesini kullandığında şu çarpanları uygula:
- "15 Milyon" veya "15 milyon" → 15 * 1,000,000 = 15000000
- "1.5 Milyon" veya "1,5 milyon" veya "1 buçuk milyon" → 1.5 * 1,000,000 = 1500000
- "On beş milyon" → 15 * 1,000,000 = 15000000
- "2 milyon" → 2 * 1,000,000 = 2000000
- "500 bin" veya "500K" → 500 * 1,000 = 500000
- "1 milyon 500 bin" → 1,500,000 = 1500000

Kullanıcı "Bin" veya "K" kelimesini kullandığında:
- "500 bin" → 500 * 1,000 = 500000
- "100 bin km" → 100 * 1,000 = 100000
- "750K" → 750 * 1,000 = 750000

ASLA sıfır eksiltme veya artırma yapma!
Sayısal çıktı her zaman INTEGER (Tam sayı) olmalıdır, ondalık OLMAMALI.

VERİTABANI ALANLARI:
- brand: Marka (BMW, Mercedes-Benz, Audi, Toyota, Honda, Volkswagen, Ford, Renault, Fiat, Hyundai, Kia, vb.)
- series: Seri (3 Serisi, A4, Corolla, Civic, Golf, Focus, Clio, Egea, vb.)
- model: Alt model
- year_min: Minimum yıl (tam sayı)
- year_max: Maksimum yıl (tam sayı)
- price_min: Minimum fiyat TL (tam sayı, ondalık YOK)
- price_max: Maksimum fiyat TL (tam sayı, ondalık YOK)
- mileage_max: Maksimum kilometre (tam sayı)
- city: İl adı (İstanbul, Ankara, İzmir, Mersin, Adana, vb.)
- district: İlçe adı (Kadıköy, Çankaya, Tarsus, vb.)
- fuel_type: Benzin, Dizel, LPG, Elektrik, Hibrit
- transmission: Manuel, Otomatik, Yarı Otomatik
- body_type: Sedan, Hatchback, SUV, Crossover, Station Wagon, Coupe, Cabrio, MPV, Pick-up
- damage_status: Hasarsız, Boyalı, Değişenli, Ağır Hasarlı
- color: Beyaz, Siyah, Gri, Kırmızı, Mavi, Lacivert, Yeşil, Kahverengi, Bej, Gümüş, vb.

AKILLI YORUMLAMA ÖRNEKLERİ:
- "az yakan" → fuel_type: "Dizel" (dizel arabalar daha az yakar)
- "aile arabası" → body_type: "Sedan" veya "SUV" (geniş ve konforlu)
- "ekonomik" → price_max düşük veya fuel_type: "LPG"
- "sportif" → body_type: "Coupe" veya "Hatchback"
- "geniş bagaj" → body_type: "Station Wagon" veya "SUV"
- "şehir içi" → body_type: "Hatchback" (park kolaylığı)
- "hatasız" veya "temiz" → damage_status: "Hasarsız"
- "boyasız" → damage_status: "Hasarsız"
- "düşük km" → mileage_max: 100000

TÜRKİYE İLÇE-İL EŞLEŞTİRMESİ:
- Tarsus, Erdemli, Silifke → city: "Mersin"
- Kadıköy, Beşiktaş, Şişli, Üsküdar → city: "İstanbul"
- Çankaya, Keçiören, Mamak → city: "Ankara"
- Konak, Karşıyaka, Bornova → city: "İzmir"
- Seyhan, Çukurova, Yüreğir → city: "Adana"

YANIT FORMATI (sadece JSON döndür):

Araç araması ise:
{
  "is_valid_search": true,
  "filters": {
    "brand": "değer veya null",
    "series": "değer veya null",
    "model": "değer veya null",
    "year_min": tam sayı veya null,
    "year_max": tam sayı veya null,
    "price_min": tam sayı veya null,
    "price_max": tam sayı veya null,
    "mileage_max": tam sayı veya null,
    "city": "değer veya null",
    "district": "değer veya null",
    "fuel_type": "değer veya null",
    "transmission": "değer veya null",
    "body_type": "değer veya null",
    "damage_status": "değer veya null",
    "color": "değer veya null"
  },
  "reasoning": "Filtrelerin neden seçildiğini kısa açıkla"
}

Araç araması DEĞİLSE:
{
  "is_valid_search": false,
  "message": "Nazik bir açıklama"
}

ÖRNEKLER (FİYAT HESAPLAMASI DİKKAT!):
- "15 milyon altı mercedes" → 
  {"is_valid_search": true, "filters": {"brand": "Mercedes-Benz", "price_max": 15000000}, "reasoning": "15 milyon = 15.000.000 TL altı Mercedes araçlar."}

- "1.5 milyon - 3 milyon arası bmw" → 
  {"is_valid_search": true, "filters": {"brand": "BMW", "price_min": 1500000, "price_max": 3000000}, "reasoning": "1.5 milyon ile 3 milyon TL arası BMW araçlar."}

- "Tarsus'ta 500 bin altı az yakan hatasız aile arabası" → 
  {"is_valid_search": true, "filters": {"city": "Mersin", "district": "Tarsus", "price_max": 500000, "fuel_type": "Dizel", "damage_status": "Hasarsız", "body_type": "Sedan"}, "reasoning": "500 bin = 500.000 TL. Az yakan için Dizel, aile arabası için Sedan. Tarsus, Mersin iline bağlı."}

- "2 milyon altı 2020 üstü audi" → 
  {"is_valid_search": true, "filters": {"brand": "Audi", "price_max": 2000000, "year_min": 2020}, "reasoning": "2 milyon = 2.000.000 TL altı, 2020 ve üzeri Audi araçlar."}

- "100 bin km altı beyaz golf" →
  {"is_valid_search": true, "filters": {"brand": "Volkswagen", "series": "Golf", "mileage_max": 100000, "color": "Beyaz"}, "reasoning": "100 bin km = 100.000 km altı Volkswagen Golf."}

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
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", response.status);
      return { success: false, error: "Arama servisi şu an kullanılamıyor" };
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content;

    if (!textResponse) {
      return { success: false, error: "Yanıt alınamadı" };
    }

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "Yanıt işlenemedi" };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Geçersiz arama kontrolü
    if (!parsed.is_valid_search) {
      return { 
        success: false, 
        isInvalidQuery: true,
        error: parsed.message || "Sadece araç aramalarına yardımcı olabilirim."
      };
    }

    // Filtreleri temizle
    const filters: SearchFilters = parsed.filters || {};
    Object.keys(filters).forEach(key => {
      const k = key as keyof SearchFilters;
      if (filters[k] === null || filters[k] === undefined || filters[k] === "" || filters[k] === "null") {
        delete filters[k];
      }
    });

    return { 
      success: true, 
      filters,
      reasoning: parsed.reasoning || undefined
    };
  } catch (error) {
    console.error("Search parse error:", error);
    return { success: false, error: "Bir hata oluştu, lütfen tekrar deneyin" };
  }
}
