"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import CarCard from "@/components/listings/CarCard";
import Link from "next/link";
import { BETA_LISTINGS } from "@/lib/beta-listings";

interface SearchFilters {
  brand?: string;
  series?: string;
  model?: string;
  year_min?: string;
  year_max?: string;
  price_min?: string;
  price_max?: string;
  mileage_max?: string;
  city?: string;
  district?: string;
  fuel_type?: string;
  transmission?: string;
  body_type?: string;
  damage_status?: string;
  color?: string;
  reasoning?: string;
}

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
}

interface SearchResultsProps {
  filters: SearchFilters;
}

export default function SearchResults({ filters }: SearchResultsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch data
  useEffect(() => {
    async function fetchListings() {
      setIsLoading(true);
      const supabase = createClient();
      
      let query = supabase
        .from("listings")
        .select("id, brand, model, price, year, mileage, city, district, images")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (filters.brand) query = query.ilike("brand", `%${filters.brand}%`);
      if (filters.series) query = query.ilike("series", `%${filters.series}%`);
      if (filters.model) query = query.ilike("model", `%${filters.model}%`);
      if (filters.year_min) query = query.gte("year", parseInt(filters.year_min));
      if (filters.year_max) query = query.lte("year", parseInt(filters.year_max));
      if (filters.price_min) query = query.gte("price", parseInt(filters.price_min));
      if (filters.price_max) query = query.lte("price", parseInt(filters.price_max));
      if (filters.mileage_max) query = query.lte("mileage", parseInt(filters.mileage_max));
      if (filters.city) query = query.ilike("city", `%${filters.city}%`);
      if (filters.district) query = query.ilike("district", `%${filters.district}%`);
      if (filters.fuel_type) query = query.ilike("fuel_type", `%${filters.fuel_type}%`);
      if (filters.transmission) query = query.ilike("transmission", `%${filters.transmission}%`);
      if (filters.body_type) query = query.ilike("body_type", `%${filters.body_type}%`);
      if (filters.damage_status) query = query.ilike("damage_status", `%${filters.damage_status}%`);
      if (filters.color) query = query.ilike("color", `%${filters.color}%`);

      const { data } = await query.limit(50);
      setListings(data || []);
      setIsLoading(false);
    }

    fetchListings();
  }, [filters]);

  // Play sound effect when results load
  useEffect(() => {
    if (!isLoading && listings.length > 0 && !hasPlayed) {
      try {
        audioRef.current = new Audio("/sounds/processing.mp3");
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {});
        setHasPlayed(true);
      } catch {}
    }
  }, [isLoading, listings.length, hasPlayed]);

  const activeFilters = Object.entries(filters).filter(([key, value]) => value && key !== "reasoning");

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div>
      {/* Header */}
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-[13px] font-light mb-8 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Ana Sayfa
        </Link>

        <div className="flex items-center gap-6 mb-6">
          <div className="h-[1px] w-12 bg-gradient-to-r from-[#B8860B]/50 to-transparent" />
          <h1 className="text-[13px] text-[#B8860B] font-light tracking-[0.4em] uppercase">
            Arama Sonuçları
          </h1>
        </div>

        {/* AI Summary Box */}
        <AnimatePresence>
          {filters.reasoning && !isLoading && (
            <motion.div 
              className="relative mb-6 max-w-3xl"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B]/30 via-[#DAA520]/20 to-[#B8860B]/30 rounded-2xl blur-md opacity-60" />
              
              <div className="relative bg-gradient-to-b from-[#0f0f0f] to-[#080808] border border-[#B8860B]/20 rounded-2xl p-5 overflow-hidden">
                {/* Top Gold Line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B]/60 to-transparent" />
                
                {/* AI Icon */}
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/10 border border-[#B8860B]/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#DAA520]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    {/* Pulse Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-[#B8860B]/20"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] text-[#DAA520] font-medium tracking-wider uppercase">AI Analizi</span>
                      <span className="w-1 h-1 rounded-full bg-[#B8860B]/40" />
                      <span className="text-[10px] text-white/30">{listings.length} sonuç</span>
                    </div>
                    <p className="text-[14px] text-white/60 font-light leading-relaxed">
                      {decodeURIComponent(filters.reasoning)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {activeFilters.map(([key, value], index) => (
              <motion.span 
                key={key}
                className="px-3 py-1.5 bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-full text-[11px] text-[#B8860B]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                {formatFilterLabel(key)}: {formatFilterValue(key, value as string)}
              </motion.span>
            ))}
          </motion.div>
        )}

        {!isLoading && (
          <motion.p 
            className="text-white/30 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {listings.length + BETA_LISTINGS.length} araç bulundu
            <span className="ml-2 text-amber-400/50 text-[11px]">({BETA_LISTINGS.length} beta)</span>
          </motion.p>
        )}
      </motion.div>

      {/* Loading Skeleton */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(10)].map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── HER ZAMAN GÖSTER: BETA + GERÇEK İLANLAR ── */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {BETA_LISTINGS.map((listing) => (
                <motion.div key={listing.id} variants={cardVariants} className="relative">
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 backdrop-blur-sm">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
                    </span>
                    <span className="text-[9px] font-medium tracking-widest text-amber-400 uppercase">Beta</span>
                  </div>
                  <CarCard
                    id={listing.id}
                    brand={listing.brand}
                    model={listing.model}
                    price={listing.price}
                    year={listing.year}
                    mileage={listing.mileage}
                    city={listing.city}
                    district={listing.district}
                    images={listing.images}
                  />
                </motion.div>
              ))}
              {listings.map((listing) => (
                <motion.div key={listing.id} variants={cardVariants}>
                  <CarCard
                    id={listing.id}
                    brand={listing.brand}
                    model={listing.model}
                    price={listing.price}
                    year={listing.year}
                    mileage={listing.mileage}
                    city={listing.city}
                    district={listing.district}
                    images={listing.images}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Gerçek ilan yoksa bilgi notu */}
            {listings.length === 0 && (
              <div className="text-center mt-10 pb-4">
                <p className="text-white/20 text-[12px]">Aradığınız kriterlerde gerçek ilan bulunamadı — yukarıdaki ilanlar beta test amaçlıdır</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Skeleton Card Component
function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/[0.04]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Image Skeleton */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] animate-shimmer" />
        {/* Gold Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B8860B]/5 to-transparent animate-shimmer" />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <div className="h-4 rounded-full bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] animate-shimmer w-3/4" />
        
        {/* Price */}
        <div className="h-5 rounded-full bg-gradient-to-r from-[#B8860B]/10 via-[#B8860B]/20 to-[#B8860B]/10 animate-shimmer w-1/2" />
        
        {/* Details */}
        <div className="flex gap-2">
          <div className="h-3 rounded-full bg-white/[0.04] animate-shimmer w-1/3" />
          <div className="h-3 rounded-full bg-white/[0.04] animate-shimmer w-1/4" />
        </div>
      </div>
    </motion.div>
  );
}

function formatFilterLabel(key: string): string {
  const labels: Record<string, string> = {
    brand: "Marka",
    series: "Seri",
    model: "Model",
    year_min: "Min Yıl",
    year_max: "Max Yıl",
    price_min: "Min Fiyat",
    price_max: "Max Fiyat",
    mileage_max: "Max KM",
    city: "İl",
    district: "İlçe",
    fuel_type: "Yakıt",
    transmission: "Vites",
    body_type: "Kasa",
    damage_status: "Hasar",
    color: "Renk",
  };
  return labels[key] || key;
}

function formatFilterValue(key: string, value: string): string {
  if (key === "price_min" || key === "price_max") {
    const num = parseInt(value);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M ₺`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K ₺`;
    return `${num} ₺`;
  }
  if (key === "mileage_max") {
    const num = parseInt(value);
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return value;
  }
  return value;
}
