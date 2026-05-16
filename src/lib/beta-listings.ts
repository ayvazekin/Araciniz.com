// ─── BETA TEST İLANLARI ───────────────────────────────────────────────────────
// Sadece görünürde test amaçlı sahte ilanlar. Supabase'e kaydedilmez.

export interface BetaListing {
  id: string;
  title: string;
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
  images: string[];
  phone: string;
  description: string;
  listing_type: string;
  damage_status: string;
  tramer_amount: number;
  is_exchangeable: boolean;
  engine_power: number;
  torque: number;
  max_speed: number;
  acceleration_0_100: number;
  engine_cc: number;
  fuel_consumption_avg: number;
  ai_enriched: boolean;
  created_at: string;
}

export const BETA_LISTINGS: BetaListing[] = [
  {
    id: "beta-1",
    title: "BMW M4 Competition — Sıfır Ayarında",
    brand: "BMW",
    series: "M4",
    model: "Competition",
    year: 2023,
    price: 4_850_000,
    mileage: 12_400,
    fuel_type: "Benzin",
    transmission: "Otomatik",
    city: "İstanbul",
    district: "Beşiktaş",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=800&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    ],
    phone: "+90 555 000 0001",
    description:
      "2023 model BMW M4 Competition, 12.400 km'de, hasarsız. Tüm bakımları BMW yetkili servisinde yapılmıştır. Isıtmalı koltuklar, harman kardon ses sistemi, M karbon koltuklar, lazer far mevcut. Takas görüşülür.",
    listing_type: "Sahibinden",
    damage_status: "Hasarsız",
    tramer_amount: 0,
    is_exchangeable: true,
    engine_power: 510,
    torque: 650,
    max_speed: 290,
    acceleration_0_100: 3.9,
    engine_cc: 2993,
    fuel_consumption_avg: 10.5,
    ai_enriched: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "beta-2",
    title: "Mercedes-Benz AMG GT 63 S — Full Paket",
    brand: "Mercedes-Benz",
    series: "AMG GT",
    model: "63 S",
    year: 2024,
    price: 8_200_000,
    mileage: 3_200,
    fuel_type: "Benzin",
    transmission: "Otomatik",
    city: "Ankara",
    district: "Çankaya",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    ],
    phone: "+90 555 000 0002",
    description:
      "2024 model Mercedes-AMG GT 63 S, 3.200 km'de, sıfır ayarında. Burmester ses sistemi, panoramik tavan, AMG performans egzoz, karbon fiber paket dahil. Fatura üzerinden satış.",
    listing_type: "Galeriden",
    damage_status: "Hasarsız",
    tramer_amount: 0,
    is_exchangeable: false,
    engine_power: 639,
    torque: 900,
    max_speed: 315,
    acceleration_0_100: 3.2,
    engine_cc: 3982,
    fuel_consumption_avg: 12.4,
    ai_enriched: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "beta-3",
    title: "Porsche 911 Carrera S — PDK",
    brand: "Porsche",
    series: "911",
    model: "Carrera S",
    year: 2023,
    price: 12_500_000,
    mileage: 8_750,
    fuel_type: "Benzin",
    transmission: "Otomatik",
    city: "İzmir",
    district: "Karşıyaka",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80",
    ],
    phone: "+90 555 000 0003",
    description:
      "2023 Porsche 911 Carrera S PDK, 8.750 km. Sport Chrono paketi, PASM, hava süspansiyonu, Bose ses sistemi, ısıtmalı/havalandırmalı koltuklar. Porsche Approved sertifikalı.",
    listing_type: "Galeriden",
    damage_status: "Hasarsız",
    tramer_amount: 0,
    is_exchangeable: false,
    engine_power: 450,
    torque: 530,
    max_speed: 308,
    acceleration_0_100: 3.7,
    engine_cc: 2981,
    fuel_consumption_avg: 10.9,
    ai_enriched: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "beta-5",
    title: "Tesla Model S Plaid — Tam Donanım",
    brand: "Tesla",
    series: "Model S",
    model: "Plaid",
    year: 2024,
    price: 5_400_000,
    mileage: 1_800,
    fuel_type: "Elektrik",
    transmission: "Otomatik",
    city: "İstanbul",
    district: "Şişli",
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
      "https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=800&q=80",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80",
    ],
    phone: "+90 555 000 0005",
    description:
      "2024 Tesla Model S Plaid, 1.800 km, neredeyse sıfır. Tam otonom sürüş paketi, 21 inç Arachnid jantlar, beyaz iç mekan, premium ses sistemi. Şarj kablosu ve adaptörler dahil.",
    listing_type: "Sahibinden",
    damage_status: "Hasarsız",
    tramer_amount: 0,
    is_exchangeable: false,
    engine_power: 1020,
    torque: 1420,
    max_speed: 322,
    acceleration_0_100: 2.1,
    engine_cc: 0,
    fuel_consumption_avg: 0,
    ai_enriched: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getBetaListingById(id: string): BetaListing | null {
  return BETA_LISTINGS.find((l) => l.id === id) ?? null;
}

export function isBetaListing(id: string): boolean {
  return id.startsWith("beta-");
}
