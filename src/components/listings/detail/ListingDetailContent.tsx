"use client";

import { motion } from "framer-motion";
import ImageGallery from "./ImageGallery";
import SellerCard from "./SellerCard";
import SpecsGrid from "./SpecsGrid";
import DamageCard from "./DamageCard";
import TechSpecs from "./TechSpecs";
import AIAdvisorChat from "./AIAdvisorChat";
import BrandLogo from "@/components/ui/BrandLogo";

interface Listing {
  id: string;
  title?: string;
  brand: string;
  series?: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  city: string;
  district: string;
  images: string[];
  phone?: string;
  description?: string;
  listing_type?: string;
  damage_status?: string;
  tramer_amount?: number;
  is_exchangeable?: boolean;
  // Temel Teknik
  acceleration_0_100?: number;
  acceleration_0_200?: number;
  max_speed?: number;
  torque?: number;
  engine_power?: number;
  engine_cc?: number;
  fuel_consumption_avg?: number;
  trunk_volume?: number;
  weight?: number;
  // Gelişmiş Performans
  drag_coefficient?: number;
  power_to_weight?: number;
  turning_radius?: number;
  cylinder_config?: string;
  emission_standard?: string;
  ai_enriched?: boolean;
  created_at: string;
}

interface Props {
  listing: Listing;
}

export default function ListingDetailContent({ listing }: Props) {
  // AI Advisor için araç verisi - tüm teknik detaylar dahil
  const vehicleData = {
    brand: listing.brand,
    series: listing.series,
    model: listing.model,
    year: listing.year,
    price: listing.price,
    mileage: listing.mileage,
    fuel_type: listing.fuel_type,
    transmission: listing.transmission,
    damage_status: listing.damage_status,
    tramer_amount: listing.tramer_amount,
    engine_power: listing.engine_power,
    torque: listing.torque,
    max_speed: listing.max_speed,
    acceleration_0_100: listing.acceleration_0_100,
    fuel_consumption_avg: listing.fuel_consumption_avg,
    engine_cc: listing.engine_cc,
    city: listing.city,
    description: listing.description,
  };

  return (
    <main className="flex-1 pt-24 pb-16 relative">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] opacity-[0.1]"
          style={{ background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)", filter: "blur(120px)" }} />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] opacity-[0.1]"
          style={{ background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)", filter: "blur(120px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.05]"
          style={{ background: "radial-gradient(circle, rgba(218,165,32,1) 0%, transparent 50%)", filter: "blur(100px)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Back Button */}
        <motion.a
          href="/araclar"
          className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-6 group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-[13px] font-light">Araçlar</span>
        </motion.a>

        {/* Breadcrumb */}
        <motion.nav className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <ol className="flex items-center gap-2 text-[12px]">
            <li><a href="/" className="text-white/30 hover:text-white/60 transition-colors">Ana Sayfa</a></li>
            <li className="text-white/20">/</li>
            <li><a href="/araclar" className="text-white/30 hover:text-white/60 transition-colors">Araçlar</a></li>
            <li className="text-white/20">/</li>
            <li className="text-[#B8860B]">{listing.brand} {listing.series || listing.model}</li>
          </ol>
        </motion.nav>

        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-6 bg-[#B8860B]/50" />
            <span className="text-[10px] text-[#B8860B] tracking-[0.3em] uppercase">İlan Detayı</span>
          </div>
          {listing.title && (
            <h1 className="text-[28px] md:text-[36px] font-extralight text-white mb-2">{listing.title}</h1>
          )}
          <div className="flex items-center gap-3 text-white/40">
            <BrandLogo brandName={listing.brand} size="lg" className="opacity-80" />
            <span className="text-[16px] font-light">{listing.brand} {listing.series || ""} {listing.model}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[16px] font-light">{listing.year}</span>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gallery */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <ImageGallery images={listing.images} title={`${listing.brand} ${listing.model}`} />
          </motion.div>

          {/* Seller Card */}
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <SellerCard price={listing.price} phone={listing.phone} brand={listing.brand} model={listing.model} listingType={listing.listing_type} />
          </motion.div>
        </div>

        {/* Damage Card */}
        {(listing.damage_status || listing.tramer_amount !== undefined) && (
          <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <DamageCard damageStatus={listing.damage_status || ""} tramerAmount={listing.tramer_amount} isExchangeable={listing.is_exchangeable} />
          </motion.div>
        )}

        {/* Specs Grid */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <SpecsGrid brand={listing.brand} model={listing.model} year={listing.year} mileage={listing.mileage}
            fuel_type={listing.fuel_type} transmission={listing.transmission} city={listing.city} district={listing.district} />
        </motion.div>

        {/* Tech Specs */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <TechSpecs 
            acceleration_0_100={listing.acceleration_0_100} 
            acceleration_0_200={listing.acceleration_0_200}
            max_speed={listing.max_speed} 
            torque={listing.torque}
            engine_power={listing.engine_power} 
            engine_cc={listing.engine_cc} 
            fuel_consumption_avg={listing.fuel_consumption_avg}
            trunk_volume={listing.trunk_volume} 
            weight={listing.weight} 
            drag_coefficient={listing.drag_coefficient}
            power_to_weight={listing.power_to_weight}
            turning_radius={listing.turning_radius}
            cylinder_config={listing.cylinder_config}
            emission_standard={listing.emission_standard}
            ai_enriched={listing.ai_enriched} 
          />
        </motion.div>

        {/* Description */}
        {listing.description && (
          <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B]/10 via-transparent to-[#B8860B]/10 rounded-2xl blur-sm" />
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-6">
                <h2 className="text-[15px] font-light text-white mb-4">Açıklama</h2>
                <p className="text-[14px] text-white/50 font-light leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Meta Info */}
        <motion.div className="flex items-center justify-between pt-6 border-t border-white/[0.04]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
          <div className="flex items-center gap-2 text-[11px] text-white/20">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span>İlan No: {listing.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/20">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(listing.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </motion.div>
      </div>

      {/* AI Advisor Floating Button & Chat */}
      <AIAdvisorChat vehicle={vehicleData} />
    </main>
  );
}
