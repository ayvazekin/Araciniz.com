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

// Demo mode — Groq API olmadan çalışan local keyword parser
export async function parseSearchQuery(query: string): Promise<SearchResult> {
  const q = query.toLowerCase();
  const filters: SearchFilters = {};

  // Markalar
  const brands: Record<string, string> = {
    bmw: "BMW", mercedes: "Mercedes-Benz", "mercedes-benz": "Mercedes-Benz",
    audi: "Audi", toyota: "Toyota", honda: "Honda", volkswagen: "Volkswagen",
    vw: "Volkswagen", ford: "Ford", renault: "Renault", fiat: "Fiat",
    hyundai: "Hyundai", kia: "Kia", porsche: "Porsche", tesla: "Tesla",
    volvo: "Volvo", peugeot: "Peugeot", citroen: "Citroën", opel: "Opel",
    nissan: "Nissan", mazda: "Mazda", subaru: "Subaru", mitsubishi: "Mitsubishi",
    skoda: "Skoda", seat: "SEAT", alfa: "Alfa Romeo", jeep: "Jeep",
    land: "Land Rover", rover: "Land Rover", lexus: "Lexus", infiniti: "Infiniti",
    dacia: "Dacia", suzuki: "Suzuki", mini: "MINI", jaguar: "Jaguar",
  };
  for (const [key, val] of Object.entries(brands)) {
    if (q.includes(key)) { filters.brand = val; break; }
  }

  // Yakıt tipi
  if (q.includes("dizel") || q.includes("diesel") || q.includes("az yakan")) filters.fuel_type = "Dizel";
  else if (q.includes("benzin")) filters.fuel_type = "Benzin";
  else if (q.includes("lpg")) filters.fuel_type = "LPG";
  else if (q.includes("elektrik") || q.includes("elektrikli")) filters.fuel_type = "Elektrik";
  else if (q.includes("hibrit") || q.includes("hybrid")) filters.fuel_type = "Hibrit";

  // Vites
  if (q.includes("otomatik")) filters.transmission = "Otomatik";
  else if (q.includes("manuel")) filters.transmission = "Manuel";

  // Kasa tipi
  if (q.includes("suv")) filters.body_type = "SUV";
  else if (q.includes("sedan") || q.includes("aile arabası")) filters.body_type = "Sedan";
  else if (q.includes("hatchback") || q.includes("şehir içi")) filters.body_type = "Hatchback";
  else if (q.includes("station") || q.includes("kombi")) filters.body_type = "Station Wagon";
  else if (q.includes("coupe") || q.includes("coupé") || q.includes("sportif")) filters.body_type = "Coupe";
  else if (q.includes("cabrio") || q.includes("cabriolet")) filters.body_type = "Cabrio";
  else if (q.includes("pickup") || q.includes("pick-up")) filters.body_type = "Pick-up";

  // Hasar durumu
  if (q.includes("hasarsız") || q.includes("hatasız") || q.includes("boyasız") || q.includes("temiz")) {
    filters.damage_status = "Hasarsız";
  }

  // Şehirler
  const cities: Record<string, string> = {
    istanbul: "İstanbul", ankara: "Ankara", izmir: "İzmir", bursa: "Bursa",
    antalya: "Antalya", adana: "Adana", mersin: "Mersin", konya: "Konya",
    gaziantep: "Gaziantep", kayseri: "Kayseri", eskişehir: "Eskişehir",
  };
  for (const [key, val] of Object.entries(cities)) {
    if (q.includes(key)) { filters.city = val; break; }
  }

  // Fiyat — "X milyon", "X bin"
  const milMatch = q.match(/(\d+(?:[.,]\d+)?)\s*milyon/);
  const binMatch = q.match(/(\d+(?:[.,]\d+)?)\s*bin(?!\s*km)/);
  if (milMatch) {
    const val = Math.round(parseFloat(milMatch[1].replace(",", ".")) * 1_000_000);
    if (q.includes("üst") || q.includes("fazla") || q.includes("yukarı")) filters.price_min = val;
    else filters.price_max = val;
  } else if (binMatch) {
    const val = Math.round(parseFloat(binMatch[1].replace(",", ".")) * 1_000);
    if (q.includes("üst") || q.includes("fazla") || q.includes("yukarı")) filters.price_min = val;
    else filters.price_max = val;
  }

  // Kilometre — "X bin km"
  const kmMatch = q.match(/(\d+)\s*bin\s*km/);
  if (kmMatch) filters.mileage_max = parseInt(kmMatch[1]) * 1_000;

  // Yıl
  const yearMatch = q.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    const yr = parseInt(yearMatch[1]);
    if (q.includes("üst") || q.includes("sonrası")) filters.year_min = yr;
    else if (q.includes("alt") || q.includes("öncesi")) filters.year_max = yr;
    else filters.year_min = yr;
  }

  return {
    success: true,
    filters,
    reasoning: "Arama kriterleri analiz edildi.",
  };
}
