"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CarCard from "@/components/listings/CarCard";
import { parseSearchQuery } from "@/actions/search-vehicle";
import { buildSearchUrl } from "@/lib/utils/search";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { User } from "@supabase/supabase-js";

interface Listing {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  city: string;
  district: string;
  images: string[];
  is_featured?: boolean;
}

interface HomeContentProps {
  featuredListings: Listing[];
  user?: User | null;
  needsOnboarding?: boolean;
}

export default function HomeContent({ featuredListings, user, needsOnboarding = false }: HomeContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(needsOnboarding);
  const [searchError, setSearchError] = useState<string | null>(null);
  const router = useRouter();

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.refresh();
  };

  // Groq API olmadan çalışan basit keyword parser (fallback)
  const parseQueryLocally = (query: string) => {
    const q = query.toLowerCase();
    const filters: Record<string, string | number> = {};

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
    if (q.includes("dizel") || q.includes("diesel")) filters.fuel_type = "Dizel";
    else if (q.includes("benzin")) filters.fuel_type = "Benzin";
    else if (q.includes("lpg")) filters.fuel_type = "LPG";
    else if (q.includes("elektrik") || q.includes("elektrikli")) filters.fuel_type = "Elektrik";
    else if (q.includes("hibrit") || q.includes("hybrid")) filters.fuel_type = "Hibrit";

    // Vites
    if (q.includes("otomatik")) filters.transmission = "Otomatik";
    else if (q.includes("manuel")) filters.transmission = "Manuel";

    // Kasa tipi
    if (q.includes("suv")) filters.body_type = "SUV";
    else if (q.includes("sedan")) filters.body_type = "Sedan";
    else if (q.includes("hatchback")) filters.body_type = "Hatchback";
    else if (q.includes("station") || q.includes("kombi")) filters.body_type = "Station Wagon";
    else if (q.includes("coupe") || q.includes("coupé")) filters.body_type = "Coupe";
    else if (q.includes("cabrio") || q.includes("cabriolet")) filters.body_type = "Cabrio";
    else if (q.includes("pickup") || q.includes("pick-up")) filters.body_type = "Pick-up";

    // Hasar durumu
    if (q.includes("hasarsız") || q.includes("hatasız") || q.includes("boyasız")) filters.damage_status = "Hasarsız";

    // Şehirler
    const cities: Record<string, string> = {
      istanbul: "İstanbul", ankara: "Ankara", izmir: "İzmir", bursa: "Bursa",
      antalya: "Antalya", adana: "Adana", mersin: "Mersin", konya: "Konya",
      gaziantep: "Gaziantep", kayseri: "Kayseri", eskişehir: "Eskişehir",
    };
    for (const [key, val] of Object.entries(cities)) {
      if (q.includes(key)) { filters.city = val; break; }
    }

    // Fiyat — "X milyon", "X bin", "X milyon altı/üstü"
    const milMatch = q.match(/(\d+(?:[.,]\d+)?)\s*milyon/);
    const binMatch = q.match(/(\d+(?:[.,]\d+)?)\s*bin/);
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

    // Yıl — "2020 model", "2019 üstü", "2022 altı"
    const yearMatch = q.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      const yr = parseInt(yearMatch[1]);
      if (q.includes("üst") || q.includes("sonrası") || q.includes("model")) filters.year_min = yr;
      else if (q.includes("alt") || q.includes("öncesi")) filters.year_max = yr;
      else filters.year_min = yr;
    }

    return filters;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const result = await parseSearchQuery(searchQuery);
      
      if (!result.success) {
        // API başarısız olduysa (servis hatası) → local parse ile yine de git
        if (!result.isInvalidQuery) {
          const localFilters = parseQueryLocally(searchQuery);
          const url = buildSearchUrl(localFilters);
          setIsSearching(false);
          setIsTransitioning(true);
          setTimeout(() => router.push(url), 600);
          return;
        }
        // Gerçekten araç araması değilse hata göster
        setIsSearching(false);
        setSearchError(result.error || "Sadece araç aramalarına yardımcı olabilirim.");
        return;
      }
      
      const url = buildSearchUrl(result.filters || {}, result.reasoning);
      
      setIsSearching(false);
      setIsTransitioning(true);
      setTimeout(() => router.push(url), 600);
    } catch (error) {
      console.error("Search error:", error);
      // Exception durumunda da local parse ile git
      const localFilters = parseQueryLocally(searchQuery);
      const url = buildSearchUrl(localFilters);
      setIsSearching(false);
      setIsTransitioning(true);
      setTimeout(() => router.push(url), 600);
    }
  };

  return (
    <>
      {/* Onboarding Modal */}
      {showOnboarding && user && (
        <OnboardingModal user={user} onComplete={handleOnboardingComplete} />
      )}

      {/* Gold Mist Transition */}
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {/* Gold mist cloud sweeping across */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(184,134,11,0.03) 20%, rgba(184,134,11,0.12) 40%, rgba(184,134,11,0.2) 50%, rgba(184,134,11,0.12) 60%, rgba(184,134,11,0.03) 80%, transparent 100%)",
              filter: "blur(40px)"
            }}
          />
          
          {/* Secondary mist layer - slightly delayed */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(184,134,11,0.02) 30%, rgba(184,134,11,0.08) 50%, rgba(184,134,11,0.02) 70%, transparent 100%)",
              filter: "blur(60px)"
            }}
          />

          {/* Black fade that follows the mist */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      <motion.main
        className="flex-1 relative"
        animate={{ 
          opacity: isTransitioning ? 0 : 1
        }}
        transition={{ duration: 0.4, delay: isTransitioning ? 0.2 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Gold Glow */}
        <div 
          className="absolute -top-40 -left-40 w-[600px] h-[600px] opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)",
            filter: "blur(120px)"
          }}
        />
        {/* Top Center Gold Glow */}
        <div 
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.1]"
          style={{
            background: "radial-gradient(ellipse, rgba(184,134,11,1) 0%, transparent 60%)",
            filter: "blur(120px)"
          }}
        />
        {/* Top Right Gold Glow */}
        <div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)",
            filter: "blur(120px)"
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-[75vh] flex flex-col items-center justify-center px-6 relative">
        <div className="relative z-10 text-center max-w-2xl -mt-16">
          {/* Tagline above logo */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <svg className="w-4 h-[1px] bg-gradient-to-r from-transparent to-[#B8860B]" />
            <p className="text-[10px] text-[#B8860B] tracking-[0.4em] uppercase font-light">
              Yeni Nesil Deneyim
            </p>
            <svg className="w-4 h-[1px] bg-gradient-to-l from-transparent to-[#B8860B]" />
          </motion.div>

          {/* Main Logo */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-[52px] md:text-[72px] font-extralight text-white tracking-tight">
              Aracınız<span className="text-[24px] md:text-[32px] font-extralight text-[#B8860B]">.com</span>
            </h1>
          </motion.div>

          {/* Tagline with Shimmer */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-white/60 text-[15px] font-light shimmer-left">
              Karmaşık filtreler yok.
            </p>
            <p className="text-white/40 text-[15px] font-light mt-1 shimmer-right">
              Siz arayın, biz bulalım.
            </p>
          </motion.div>

          {/* Search Input - Minimal Apple Style */}
          <motion.div
            className="relative w-full max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative group">
              {/* Gold glow on focus */}
              <div className={`absolute -inset-2 rounded-full blur-xl transition-all duration-500 ${searchError ? "bg-red-500/20" : "bg-[#B8860B]/0 group-focus-within:bg-[#B8860B]/30"}`} />
              
              {/* Neon Gold Border */}
              <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-[#B8860B]/60 via-[#DAA520] to-[#B8860B]/60 opacity-70 group-focus-within:opacity-100 transition-opacity" />
              
              <div className={`relative flex items-center gap-4 px-8 py-5 rounded-full transition-all duration-300 bg-black`}>
                {/* AI Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#B8860B]/20 to-[#DAA520]/10 rounded-full flex-shrink-0 border border-[#B8860B]/30">
                  <svg className="w-4 h-4 text-[#B8860B]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-[11px] text-[#DAA520] font-medium tracking-wider">AI</span>
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchError) setSearchError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="500 bin altı BMW, İstanbul dizel Mercedes, 2020 model otomatik Audi..."
                  className="flex-1 bg-transparent text-[17px] text-white placeholder:text-white/30 focus:outline-none min-w-0"
                  disabled={isSearching}
                />
                
                {/* Loading or Clear */}
                {isSearching ? (
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[12px] text-[#DAA520]/70 hidden sm:block">Analiz ediliyor</span>
                    <div className="w-6 h-6 border-2 border-[#B8860B]/30 border-t-[#DAA520] rounded-full animate-spin" />
                  </div>
                ) : searchQuery.length > 0 ? (
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setSearchError(null);
                    }}
                    className="text-white/40 hover:text-white transition-colors flex-shrink-0 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : null}

                {/* Search Button */}
                <button 
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="px-7 py-3 bg-gradient-to-r from-[#B8860B] to-[#DAA520] hover:from-[#DAA520] hover:to-[#B8860B] disabled:opacity-30 disabled:cursor-not-allowed rounded-full text-[14px] font-semibold text-black transition-all flex-shrink-0 shadow-lg shadow-[#B8860B]/20"
                >
                  Ara
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {searchError && (
                <motion.div
                  className="absolute left-0 right-0 mt-4 z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start gap-3 px-5 py-4 bg-gradient-to-r from-[#0a0a0a] to-[#111] border border-[#B8860B]/20 rounded-2xl max-w-xl mx-auto">
                    <div className="w-9 h-9 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-white/70 font-light leading-relaxed">{searchError}</p>
                      <p className="text-[12px] text-white/30 mt-1.5">Örnek: "500 bin altı BMW" veya "İstanbul dizel Mercedes"</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ücretsiz İlan Ver */}
            <motion.p
              className="mt-6 text-[13px] font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-white/30">Aracınızı satmak mı istiyorsunuz? </span>
              <button
                onClick={() => router.push(user ? "/ilan-ver" : "/login")}
                className="text-[#B8860B] hover:text-[#DAA520] transition-colors cursor-pointer"
              >
                Ücretsiz İlan Verin
              </button>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Araç Vitrini - Sadece is_featured=true olanlar */}
      <section className="py-10 px-6 -mt-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-6">
              <div className="h-[1px] flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B8860B]/60 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <h2 className="text-[13px] font-light tracking-[0.5em] uppercase">
                <span className="text-white">Araç</span> <span className="text-[#B8860B]">Vitrini</span>
              </h2>
              <div className="h-[1px] flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B8860B]/60 to-transparent"
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>

          {featuredListings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CarCard {...listing} isShowcase />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#B8860B]/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#B8860B]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-white/30 text-[15px] font-light mb-2">Vitrin hazırlanıyor</p>
              <p className="text-white/20 text-[13px] font-light">Seçkin araçlar yakında burada</p>
            </motion.div>
          )}
        </div>
      </section>
    </motion.main>
    </>
  );
}
