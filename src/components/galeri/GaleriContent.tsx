"use client";

import { motion } from "framer-motion";
import CarCard from "@/components/listings/CarCard";

interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  company_name?: string;
  company_description?: string;
  company_logo?: string;
  address?: string;
  city?: string;
  district?: string;
  created_at?: string;
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
  is_featured?: boolean;
}

interface GaleriContentProps {
  profile: Profile;
  listings: Listing[];
}

export default function GaleriContent({ profile, listings }: GaleriContentProps) {
  const memberSince = profile.created_at 
    ? new Date(profile.created_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long" })
    : null;

  // Tam adres oluştur
  const fullAddress = [profile.address, profile.district, profile.city]
    .filter(Boolean)
    .join(", ");

  // Google Maps linki
  const mapsLink = fullAddress 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  return (
    <main className="flex-1 pt-20 pb-20 relative">
      {/* Premium Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top Gold Glow */}
        <div 
          className="absolute -top-60 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.12]"
          style={{
            background: "radial-gradient(ellipse, rgba(184,134,11,1) 0%, transparent 70%)",
            filter: "blur(80px)"
          }}
        />
        {/* Side Glows */}
        <div 
          className="absolute top-1/3 -left-40 w-[400px] h-[400px] opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, rgba(218,165,32,1) 0%, transparent 60%)",
            filter: "blur(100px)"
          }}
        />
        <div 
          className="absolute top-1/3 -right-40 w-[400px] h-[400px] opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, rgba(218,165,32,1) 0%, transparent 60%)",
            filter: "blur(100px)"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Premium Header Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            {/* Outer Glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-[#B8860B]/40 via-[#DAA520]/20 to-[#B8860B]/40 rounded-3xl blur-md" />
            
            {/* Card */}
            <div className="relative bg-gradient-to-b from-[#0f0f0f] to-[#080808] rounded-3xl border border-[#B8860B]/20 overflow-hidden">
              {/* Top Gold Line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
              
              <div className="p-8 md:p-10">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Logo & Info */}
                  <div className="flex flex-col sm:flex-row items-start gap-6 flex-1">
                    {/* Logo */}
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#B8860B] to-[#DAA520] rounded-2xl opacity-50 blur-sm group-hover:opacity-70 transition-opacity" />
                      {profile.company_logo ? (
                        <img
                          src={profile.company_logo}
                          alt={profile.company_name || "Galeri"}
                          className="relative w-28 h-28 rounded-2xl object-cover ring-2 ring-[#B8860B]/50"
                        />
                      ) : (
                        <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#B8860B]/30 flex items-center justify-center">
                          <span className="text-5xl">🏢</span>
                        </div>
                      )}
                      {/* PRO Badge */}
                      <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-black text-[10px] font-bold rounded-full shadow-lg shadow-[#B8860B]/30">
                        PRO GALERİ
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-[32px] md:text-[36px] font-light text-[#DAA520]">
                          {profile.company_name}
                        </h1>
                        <svg className="w-6 h-6 text-[#B8860B]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      
                      {profile.company_description && (
                        <p className="text-[15px] text-white/50 font-light leading-relaxed mb-4 max-w-xl">
                          {profile.company_description}
                        </p>
                      )}
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/40">
                        {memberSince && (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#B8860B]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {memberSince}'den beri üye
                          </span>
                        )}
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#B8860B]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Onaylı Galeri
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Contact Card */}
                  <div className="lg:w-72">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                      <h3 className="text-[13px] text-[#B8860B] font-medium mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        İletişim
                      </h3>
                      
                      <div className="space-y-3 mb-5">
                        {profile.phone && (
                          <div className="flex items-start gap-3">
                            <svg className="w-4 h-4 text-white/30 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-[14px] text-white/70 font-light">{profile.phone}</span>
                          </div>
                        )}
                        
                        {fullAddress && (
                          <div className="flex items-start gap-3">
                            <svg className="w-4 h-4 text-white/30 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-[14px] text-white/70 font-light">{fullAddress}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        {profile.phone && (
                          <a
                            href={`tel:${profile.phone}`}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#B8860B] to-[#DAA520] hover:from-[#DAA520] hover:to-[#B8860B] text-black text-[13px] font-medium rounded-xl transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Hemen Ara
                          </a>
                        )}
                        
                        {profile.phone && (
                          <a
                            href={`https://wa.me/90${profile.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-medium rounded-xl transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            WhatsApp
                          </a>
                        )}
                        
                        {mapsLink && (
                          <a
                            href={mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 text-[13px] font-medium rounded-xl transition-colors border border-white/[0.06]"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Haritada Göster
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center">
              <p className="text-[32px] font-light text-[#DAA520]">{listings.length}</p>
              <p className="text-[12px] text-white/40 mt-1">Aktif İlan</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center">
              <p className="text-[32px] font-light text-white/60">
                {listings.filter(l => l.is_featured).length}
              </p>
              <p className="text-[12px] text-white/40 mt-1">Vitrinde</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-6 h-6 text-[#B8860B]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-[12px] text-white/40 mt-1">Onaylı Galeri</p>
            </div>
          </div>
        </motion.div>

        {/* Listings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-[#B8860B]/50" />
              <h2 className="text-[15px] font-light text-white">Araçlar</h2>
            </div>
            <span className="text-[13px] text-white/30">{listings.length} araç</span>
          </div>

          {/* Listings Grid */}
          {listings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                >
                  <CarCard {...listing} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#B8860B]/10 to-transparent border border-[#B8860B]/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#B8860B]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-white/40 text-[16px] font-light mb-2">Henüz ilan yok</p>
              <p className="text-white/20 text-[13px]">Bu galeri yakında araçlarını yayınlayacak</p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
