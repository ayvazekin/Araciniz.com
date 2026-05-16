"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { deleteListing, updateListingStatus, toggleFeatured } from "@/actions/listings";

interface Listing {
  id: string;
  title: string;
  brand: string;
  series: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  status: string;
  is_featured?: boolean;
  featured_at?: string;
  created_at: string;
  city?: string;
}

interface ProfileContentProps {
  user: User;
  listings: Listing[];
  stats: { active: number; sold: number; total: number };
}

export default function ProfileContent({ user, listings: initialListings, stats }: ProfileContentProps) {
  const [listings, setListings] = useState(initialListings);
  const [loading, setLoading] = useState<string | null>(null);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [featuredAction, setFeaturedAction] = useState<"added" | "removed">("added");
  const [fadeOut, setFadeOut] = useState(false);
  
  // Sold modal states
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);
  const [soldListingId, setSoldListingId] = useState<string | null>(null);
  const [soldListingInfo, setSoldListingInfo] = useState<{ brand: string; series: string } | null>(null);
  const [isSelling, setIsSelling] = useState(false);
  const [showSoldSuccess, setShowSoldSuccess] = useState(false);
  const [soldFadeOut, setSoldFadeOut] = useState(false);

  const avatarUrl = user.user_metadata?.avatar_url;
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0];

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    setLoading(id);
    const result = await deleteListing(id);
    if (!result.error) {
      setListings(listings.filter(item => item.id !== id));
    }
    setLoading(null);
  };

  const handleSoldClick = (id: string, brand: string, series: string) => {
    setSoldListingId(id);
    setSoldListingInfo({ brand, series });
    setShowSoldConfirm(true);
  };

  const handleSoldConfirm = async () => {
    if (!soldListingId) return;
    
    setIsSelling(true);
    
    // 1.5s loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await updateListingStatus(soldListingId, "sold");
    
    setIsSelling(false);
    
    if (!result.error) {
      setListings(listings.map(item => 
        item.id === soldListingId ? { ...item, status: "sold" } : item
      ));
      
      // Show success animation
      setShowSoldConfirm(false);
      setShowSoldSuccess(true);
      setSoldFadeOut(false);
      
      // Auto close
      setTimeout(() => setSoldFadeOut(true), 2000);
      setTimeout(() => {
        setShowSoldSuccess(false);
        setSoldFadeOut(false);
        setSoldListingId(null);
        setSoldListingInfo(null);
      }, 2700);
    }
  };

  const handleToggleFeatured = async (id: string, currentlyFeatured: boolean) => {
    setLoading(id);
    const result = await toggleFeatured(id);
    if (!result.error) {
      setListings(listings.map(item => 
        item.id === id ? { ...item, is_featured: result.is_featured } : item
      ));
      // Show success modal
      setFeaturedAction(result.is_featured ? "added" : "removed");
      setShowFeaturedModal(true);
      setFadeOut(false);
      // Auto close after 1.5s
      setTimeout(() => setFadeOut(true), 1500);
      setTimeout(() => {
        setShowFeaturedModal(false);
        setFadeOut(false);
      }, 2200);
    }
    setLoading(null);
  };

  return (
    <>
      {/* Sold Confirmation Modal */}
      <AnimatePresence>
        {showSoldConfirm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => !isSelling && setShowSoldConfirm(false)}
            />
            
            <motion.div
              className="relative z-10 w-full max-w-sm mx-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute -inset-[1px] bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent rounded-2xl blur-sm" />
              
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.08] p-8 text-center">
                <AnimatePresence mode="wait">
                  {!isSelling ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Icon */}
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-[17px] text-white font-light mb-2">
                        Aracınız satıldı mı?
                      </h3>
                      
                      <p className="text-[13px] text-white/40 mb-2">
                        {soldListingInfo?.brand} {soldListingInfo?.series}
                      </p>
                      
                      <p className="text-[12px] text-white/30 mb-8">
                        Bu işlem geri alınamaz. İlan "Satıldı" olarak işaretlenecek.
                      </p>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowSoldConfirm(false)}
                          className="flex-1 py-3 text-[13px] text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors"
                        >
                          Vazgeç
                        </button>
                        <button
                          onClick={handleSoldConfirm}
                          className="flex-1 py-3 text-[13px] text-black bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors font-medium"
                        >
                          Evet, Satıldı
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-6"
                    >
                      <motion.div
                        className="w-12 h-12 mx-auto mb-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-[14px] text-white/50 font-light">
                        İşleniyor...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sold Success Modal */}
      <AnimatePresence>
        {showSoldSuccess && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: soldFadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Success Circle */}
              <motion.div
                className="relative w-24 h-24 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
              >
                {/* Outer glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)"
                  }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Inner circle */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                  <motion.svg
                    className="w-12 h-12 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    />
                  </motion.svg>
                </div>

                {/* Confetti particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      backgroundColor: i % 3 === 0 ? "#10B981" : i % 3 === 1 ? "#34D399" : "#6EE7B7"
                    }}
                    initial={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
                    animate={{ 
                      x: `calc(-50% + ${Math.cos(i * 30 * Math.PI / 180) * 60}px)`,
                      y: `calc(-50% + ${Math.sin(i * 30 * Math.PI / 180) * 60}px)`,
                      opacity: 0,
                      scale: 0
                    }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  />
                ))}
              </motion.div>
              
              {/* Text */}
              <motion.p
                className="text-[20px] font-light text-emerald-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Tebrikler!
              </motion.p>
              
              <motion.p
                className="text-[15px] text-white/60 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Aracınız satıldı olarak işaretlendi
              </motion.p>
              
              <motion.p
                className="text-[13px] text-white/30 mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {soldListingInfo?.brand} {soldListingInfo?.series}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Success Modal - Face ID Style */}
      <AnimatePresence>
        {showFeaturedModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Animated Circle with Star */}
              <motion.div
                className="relative w-24 h-24 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: featuredAction === "added" 
                      ? "radial-gradient(circle, rgba(184,134,11,0.3) 0%, transparent 70%)"
                      : "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
                  }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Inner circle */}
                <div className={`absolute inset-2 rounded-full flex items-center justify-center ${
                  featuredAction === "added" 
                    ? "bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/10 border border-[#B8860B]/30" 
                    : "bg-white/5 border border-white/10"
                }`}>
                  {featuredAction === "added" ? (
                    <motion.svg
                      className="w-10 h-10 text-[#DAA520]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      className="w-10 h-10 text-white/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </motion.svg>
                  )}
                </div>

                {/* Particle effects for "added" */}
                {featuredAction === "added" && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-[#DAA520]"
                        style={{
                          left: "50%",
                          top: "50%",
                        }}
                        initial={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
                        animate={{ 
                          x: `calc(-50% + ${Math.cos(i * 45 * Math.PI / 180) * 50}px)`,
                          y: `calc(-50% + ${Math.sin(i * 45 * Math.PI / 180) * 50}px)`,
                          opacity: 0,
                          scale: 0
                        }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
              
              {/* Text */}
              <motion.p
                className={`text-[17px] font-light ${featuredAction === "added" ? "text-[#DAA520]" : "text-white/60"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {featuredAction === "added" ? "Vitrine Eklendi" : "Vitrinden Kaldırıldı"}
              </motion.p>
              
              <motion.p
                className="text-[13px] text-white/30 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {featuredAction === "added" ? "İlanınız ana sayfada görünecek" : "İlan artık vitrinde değil"}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    <main className="flex-1 pt-24 pb-20 relative">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)",
            filter: "blur(100px)"
          }}
        />
        <div 
          className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)",
            filter: "blur(100px)"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Back Button */}
        <motion.a
          href="/"
          className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-8 group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-[13px] font-light">Ana Sayfa</span>
        </motion.a>

        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-[#B8860B]/50" />
            <p className="text-[11px] text-[#B8860B] tracking-[0.3em] uppercase">Satış Paneli</p>
          </div>
          <h1 className="text-[28px] font-extralight text-white">
            Hoş geldin, <span className="text-white/60">{fullName}</span>
          </h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B]/20 via-transparent to-[#B8860B]/20 rounded-2xl blur-sm" />
            
            <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-[#B8860B]/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-xl font-light text-[#B8860B]">
                      {fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-[18px] font-light text-white">{fullName}</h2>
                  <p className="text-[13px] text-white/40 mt-0.5">{user.email}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-[24px] font-light text-[#B8860B]">{stats.active}</p>
                    <p className="text-[11px] text-white/30 mt-1">Aktif</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[24px] font-light text-emerald-400">{stats.sold}</p>
                    <p className="text-[11px] text-white/30 mt-1">Satılan</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[24px] font-light text-white/50">{stats.total}</p>
                    <p className="text-[11px] text-white/30 mt-1">Toplam</p>
                  </div>
                </div>

                {/* New Listing Button */}
                <Link
                  href="/ilan-ver"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#B8860B] hover:bg-[#DAA520] text-black text-[13px] font-medium rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Yeni İlan
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Listings Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-[15px] font-light text-white">İlanlarım</h2>
          <span className="text-[13px] text-white/30">{listings.length} ilan</span>
        </motion.div>

        {/* Listings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {listings.length === 0 ? (
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/10 via-transparent to-transparent rounded-2xl blur-sm" />
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-16 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/[0.03] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-light text-white mb-2">Henüz ilanınız yok</h3>
                <p className="text-[13px] text-white/40 mb-8">İlk ilanınızı vererek satışa başlayın</p>
                <Link
                  href="/ilan-ver"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8860B] hover:bg-[#DAA520] text-black text-[13px] font-medium rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  İlan Ver
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-[1px] rounded-xl blur-sm transition-opacity ${
                    listing.is_featured 
                      ? "bg-gradient-to-b from-[#B8860B]/30 to-transparent opacity-100" 
                      : "bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100"
                  }`} />
                  
                  <div className="relative bg-[#0a0a0a] rounded-xl border border-white/[0.06] overflow-hidden">
                    {/* Image */}
                    <div className="relative aspect-[16/10]">
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                          <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Status */}
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-medium ${
                        listing.status === "active" 
                          ? "bg-emerald-500/90 text-white"
                          : listing.status === "sold"
                          ? "bg-blue-500/90 text-white"
                          : "bg-white/20 text-white"
                      }`}>
                        {listing.status === "active" ? "Yayında" : listing.status === "sold" ? "Satıldı" : "Pasif"}
                      </div>

                      {/* Featured Badge */}
                      {listing.is_featured && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-black text-[10px] font-medium rounded-md flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          VİTRİN
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-[14px] font-light text-white truncate">
                        {listing.brand} {listing.series}
                      </h3>
                      <p className="text-[12px] text-white/40 mt-0.5">
                        {listing.model} • {listing.year}
                      </p>
                      <p className="text-[16px] font-medium text-[#B8860B] mt-2">
                        {listing.price?.toLocaleString("tr-TR")} ₺
                      </p>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                        {/* Featured Button - Premium Gold Glow */}
                        <motion.button
                          onClick={() => handleToggleFeatured(listing.id, listing.is_featured || false)}
                          disabled={loading === listing.id}
                          className={`relative w-full py-2.5 rounded-lg text-[12px] font-medium transition-all overflow-hidden ${
                            listing.is_featured 
                              ? "bg-gradient-to-r from-[#B8860B]/20 to-[#DAA520]/20 text-[#DAA520] border border-[#B8860B]/30" 
                              : "bg-white/[0.03] text-white/50 hover:text-[#B8860B] border border-white/[0.06] hover:border-[#B8860B]/30"
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {/* Gold glow effect for featured */}
                          {listing.is_featured && (
                            <motion.div
                              className="absolute inset-0 opacity-30"
                              style={{
                                background: "radial-gradient(circle at center, rgba(184,134,11,0.4) 0%, transparent 70%)"
                              }}
                              animate={{ opacity: [0.2, 0.4, 0.2] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <span className="relative flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill={listing.is_featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {listing.is_featured ? "Vitrinden Kaldır" : "Vitrinde Öne Çıkar"}
                          </span>
                        </motion.button>

                        {/* Other Actions Row */}
                        <div className="flex gap-2">
                          <Link
                            href={`/ilan/${listing.id}`}
                            className="flex-1 py-2 text-center text-[12px] bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white rounded-lg transition-all"
                          >
                            Görüntüle
                          </Link>
                          
                          {listing.status === "active" && (
                            <button
                              onClick={() => handleSoldClick(listing.id, listing.brand, listing.series)}
                              disabled={loading === listing.id}
                              className="px-3 py-2 text-[12px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all"
                            >
                              Satıldı
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(listing.id)}
                            disabled={loading === listing.id}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
    </>
  );
}
