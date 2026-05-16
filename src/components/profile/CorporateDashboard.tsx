"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { deleteListing, toggleFeatured, updateListingStatus } from "@/actions/listings";
import BrandLogo from "@/components/ui/BrandLogo";

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

interface Profile {
  id: string;
  company_name?: string;
  company_slug?: string;
  company_description?: string;
  company_logo?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
}

interface CorporateDashboardProps {
  user: User;
  profile: Profile;
  listings: Listing[];
  stats: { active: number; sold: number; total: number; featured: number };
}

export default function CorporateDashboard({ user, profile, listings: initialListings, stats }: CorporateDashboardProps) {
  const [listings, setListings] = useState(initialListings);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "sold">("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Modal states
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [featuredAction, setFeaturedAction] = useState<"added" | "removed">("added");
  const [fadeOut, setFadeOut] = useState(false);
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);
  const [soldListingId, setSoldListingId] = useState<string | null>(null);
  const [soldListingInfo, setSoldListingInfo] = useState<{ brand: string; series: string } | null>(null);
  const [isSelling, setIsSelling] = useState(false);
  const [showSoldSuccess, setShowSoldSuccess] = useState(false);
  const [soldFadeOut, setSoldFadeOut] = useState(false);
  
  // Preview drawer state
  const [previewListing, setPreviewListing] = useState<Listing | null>(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  const storeUrl = `araciniz.com/galeri/${profile.company_slug}`;

  const filteredListings = listings.filter(l => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return l.status === "active";
    if (activeTab === "sold") return l.status === "sold";
    return true;
  });

  const copyStoreUrl = () => {
    navigator.clipboard.writeText(`https://${storeUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFeatured = async (id: string) => {
    setLoading(id);
    const result = await toggleFeatured(id);
    if (!result.error) {
      setListings(listings.map(item => item.id === id ? { ...item, is_featured: result.is_featured } : item));
      setFeaturedAction(result.is_featured ? "added" : "removed");
      setShowFeaturedModal(true);
      setFadeOut(false);
      setTimeout(() => setFadeOut(true), 1500);
      setTimeout(() => { setShowFeaturedModal(false); setFadeOut(false); }, 2200);
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await updateListingStatus(soldListingId, "sold");
    setIsSelling(false);
    if (!result.error) {
      setListings(listings.map(item => item.id === soldListingId ? { ...item, status: "sold" } : item));
      setShowSoldConfirm(false);
      setShowSoldSuccess(true);
      setSoldFadeOut(false);
      setTimeout(() => setSoldFadeOut(true), 2000);
      setTimeout(() => { setShowSoldSuccess(false); setSoldFadeOut(false); setSoldListingId(null); setSoldListingInfo(null); }, 2700);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    setLoading(id);
    const result = await deleteListing(id);
    if (!result.error) setListings(listings.filter(item => item.id !== id));
    setLoading(null);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("tr-TR").format(price);
  const formatDate = (date: string) => new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  const formatMileage = (km: number) => new Intl.NumberFormat("tr-TR").format(km);

  const openPreview = (listing: Listing) => {
    setPreviewListing(listing);
    setPreviewImageIndex(0);
  };

  return (
    <>
      {/* Featured Modal */}
      <AnimatePresence>
        {showFeaturedModal && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: fadeOut ? 0 : 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div className="relative z-10 flex flex-col items-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <motion.div className="relative w-24 h-24 mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <div className={`absolute inset-2 rounded-full flex items-center justify-center ${featuredAction === "added" ? "bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/10 border border-[#B8860B]/30" : "bg-white/5 border border-white/10"}`}>
                  <svg className={`w-10 h-10 ${featuredAction === "added" ? "text-[#DAA520]" : "text-white/40"}`} fill={featuredAction === "added" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                {featuredAction === "added" && [...Array(8)].map((_, i) => (
                  <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-[#DAA520]" style={{ left: "50%", top: "50%" }} initial={{ x: "-50%", y: "-50%", opacity: 1 }} animate={{ x: `calc(-50% + ${Math.cos(i * 45 * Math.PI / 180) * 50}px)`, y: `calc(-50% + ${Math.sin(i * 45 * Math.PI / 180) * 50}px)`, opacity: 0 }} transition={{ duration: 0.6, delay: 0.3 }} />
                ))}
              </motion.div>
              <p className={`text-[17px] font-light ${featuredAction === "added" ? "text-[#DAA520]" : "text-white/60"}`}>{featuredAction === "added" ? "Vitrine Eklendi" : "Vitrinden Kaldırıldı"}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sold Confirmation Modal */}
      <AnimatePresence>
        {showSoldConfirm && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isSelling && setShowSoldConfirm(false)} />
            <motion.div className="relative z-10 w-full max-w-sm mx-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className="absolute -inset-[1px] bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent rounded-2xl blur-sm" />
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.08] p-8 text-center">
                {!isSelling ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-[17px] text-white font-light mb-2">Aracınız satıldı mı?</h3>
                    <p className="text-[13px] text-white/40 mb-2">{soldListingInfo?.brand} {soldListingInfo?.series}</p>
                    <p className="text-[12px] text-white/30 mb-8">Bu işlem geri alınamaz.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowSoldConfirm(false)} className="flex-1 py-3 text-[13px] text-white/60 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors">Vazgeç</button>
                      <button onClick={handleSoldConfirm} className="flex-1 py-3 text-[13px] text-black bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium transition-colors">Evet, Satıldı</button>
                    </div>
                  </>
                ) : (
                  <div className="py-6">
                    <motion.div className="w-12 h-12 mx-auto mb-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    <p className="text-[14px] text-white/50">İşleniyor...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sold Success Modal */}
      <AnimatePresence>
        {showSoldSuccess && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: soldFadeOut ? 0 : 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div className="relative z-10 flex flex-col items-center" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <motion.div className="relative w-24 h-24 mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                  <motion.svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} /></motion.svg>
                </div>
                {[...Array(12)].map((_, i) => (
                  <motion.div key={i} className="absolute w-2 h-2 rounded-full" style={{ left: "50%", top: "50%", backgroundColor: i % 3 === 0 ? "#10B981" : i % 3 === 1 ? "#34D399" : "#6EE7B7" }} initial={{ x: "-50%", y: "-50%", opacity: 1 }} animate={{ x: `calc(-50% + ${Math.cos(i * 30 * Math.PI / 180) * 60}px)`, y: `calc(-50% + ${Math.sin(i * 30 * Math.PI / 180) * 60}px)`, opacity: 0 }} transition={{ duration: 0.8, delay: 0.3 }} />
                ))}
              </motion.div>
              <p className="text-[20px] font-light text-emerald-400">Tebrikler!</p>
              <p className="text-[15px] text-white/60 mt-2">Aracınız satıldı olarak işaretlendi</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Drawer */}
      <AnimatePresence>
        {previewListing && (
          <motion.div className="fixed inset-0 z-[90] flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Backdrop */}
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewListing(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            
            {/* Drawer */}
            <motion.div 
              className="relative w-full max-w-4xl mx-4 mb-4 max-h-[90vh] overflow-hidden"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-[2px] bg-gradient-to-t from-[#B8860B]/30 via-[#B8860B]/10 to-transparent rounded-3xl blur-md" />
              
              <div className="relative bg-gradient-to-b from-[#111] to-[#0a0a0a] rounded-3xl border border-white/[0.08] overflow-hidden">
                {/* Top Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <BrandLogo brandName={previewListing.brand} size="lg" />
                    <div>
                      <h3 className="text-[18px] font-light text-white">{previewListing.brand} {previewListing.series}</h3>
                      <p className="text-[13px] text-white/40">{previewListing.model} • {previewListing.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/ilan/${previewListing.id}`} className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 text-[12px] rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      Tam Sayfa
                    </Link>
                    <button onClick={() => setPreviewListing(null)} className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image Gallery */}
                    <div>
                      {/* Main Image */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/[0.02] mb-3">
                        {previewListing.images?.[previewImageIndex] ? (
                          <motion.img 
                            key={previewImageIndex}
                            src={previewListing.images[previewImageIndex]} 
                            alt="" 
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl opacity-20">🚗</span>
                          </div>
                        )}
                        
                        {/* Navigation Arrows */}
                        {previewListing.images && previewListing.images.length > 1 && (
                          <>
                            <button 
                              onClick={() => setPreviewImageIndex(i => i === 0 ? previewListing.images.length - 1 : i - 1)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button 
                              onClick={() => setPreviewImageIndex(i => i === previewListing.images.length - 1 ? 0 : i + 1)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                          </>
                        )}
                        
                        {/* Image Counter */}
                        {previewListing.images && previewListing.images.length > 1 && (
                          <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-[11px] text-white/80">
                            {previewImageIndex + 1} / {previewListing.images.length}
                          </div>
                        )}
                        
                        {/* Featured Badge */}
                        {previewListing.is_featured && (
                          <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-[#B8860B] to-[#DAA520] rounded-full text-[10px] font-bold text-black flex items-center gap-1.5">
                            <span>⭐</span> VİTRİNDE
                          </div>
                        )}
                      </div>
                      
                      {/* Thumbnails */}
                      {previewListing.images && previewListing.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {previewListing.images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setPreviewImageIndex(i)}
                              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${i === previewImageIndex ? "ring-2 ring-[#B8860B]" : "opacity-60 hover:opacity-100"}`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-5">
                      {/* Price Card */}
                      <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B]/30 to-transparent rounded-xl" />
                        <div className="relative bg-[#0f0f0f] rounded-xl p-5">
                          <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Fiyat</p>
                          <p className="text-[32px] font-light text-[#DAA520]">{formatPrice(previewListing.price)} <span className="text-[18px]">₺</span></p>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium ${previewListing.status === "active" ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : previewListing.status === "sold" ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20" : "bg-white/5 text-white/50"}`}>
                          <span className={`w-2 h-2 rounded-full ${previewListing.status === "active" ? "bg-emerald-400 animate-pulse" : previewListing.status === "sold" ? "bg-blue-400" : "bg-white/40"}`} />
                          {previewListing.status === "active" ? "Yayında" : previewListing.status === "sold" ? "Satıldı" : "Pasif"}
                        </span>
                        <span className="text-[12px] text-white/30">{formatDate(previewListing.created_at)} tarihinde eklendi</span>
                      </div>
                      
                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Marka", value: previewListing.brand, icon: "🏷️" },
                          { label: "Seri", value: previewListing.series, icon: "📋" },
                          { label: "Model", value: previewListing.model, icon: "🚗" },
                          { label: "Yıl", value: previewListing.year.toString(), icon: "📅" },
                          { label: "Konum", value: previewListing.city || "-", icon: "📍" },
                          { label: "İlan No", value: previewListing.id.slice(0, 8).toUpperCase(), icon: "#️⃣" },
                        ].map((spec) => (
                          <div key={spec.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <span>{spec.icon}</span> {spec.label}
                            </p>
                            <p className="text-[14px] text-white font-light">{spec.value}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="pt-4 border-t border-white/[0.04] space-y-3">
                        <p className="text-[11px] text-white/30 uppercase tracking-wider">Hızlı İşlemler</p>
                        <div className="flex flex-wrap gap-2">
                          {previewListing.status === "active" && (
                            <div className="relative group/btn">
                              {/* Neon Gold Border Glow */}
                              <div className={`absolute -inset-[1px] rounded-xl transition-all ${previewListing.is_featured ? "bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] opacity-100" : "bg-gradient-to-r from-[#B8860B]/60 via-[#DAA520] to-[#B8860B]/60 opacity-70 group-hover/btn:opacity-100"}`} />
                              <button 
                                onClick={() => { handleToggleFeatured(previewListing.id); }}
                                className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all bg-black"
                              >
                                {/* Shimmer Effect */}
                                <span className="absolute inset-0 overflow-hidden rounded-xl">
                                  <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
                                </span>
                                <span className="relative flex items-center gap-2 text-[#DAA520]">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                  {previewListing.is_featured ? "Vitrinden Kaldır" : "Vitrine Ekle"}
                                </span>
                              </button>
                            </div>
                          )}
                          {previewListing.status === "active" && (
                            <button 
                              onClick={() => { setPreviewListing(null); handleSoldClick(previewListing.id, previewListing.brand, previewListing.series); }}
                              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/20 rounded-xl text-[12px] font-medium transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                              Satıldı İşaretle
                            </button>
                          )}
                          <button 
                            onClick={() => { setPreviewListing(null); handleDelete(previewListing.id); }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 ring-1 ring-red-500/20 rounded-xl text-[12px] font-medium transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-20 pb-20 relative min-h-screen">
        {/* Premium Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-[0.07]" style={{ background: "radial-gradient(ellipse, rgba(184,134,11,1) 0%, transparent 70%)", filter: "blur(100px)" }} />
          <div className="absolute top-1/2 -left-60 w-[400px] h-[400px] opacity-[0.04]" style={{ background: "radial-gradient(circle, rgba(218,165,32,1) 0%, transparent 60%)", filter: "blur(80px)" }} />
          <div className="absolute top-1/3 -right-60 w-[400px] h-[400px] opacity-[0.04]" style={{ background: "radial-gradient(circle, rgba(218,165,32,1) 0%, transparent 60%)", filter: "blur(80px)" }} />
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Premium Header */}
          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute -inset-[2px] bg-gradient-to-r from-[#B8860B]/30 via-[#DAA520]/10 to-[#B8860B]/30 rounded-3xl blur-md" />
              
              <div className="relative bg-gradient-to-b from-[#0f0f0f] to-[#080808] rounded-3xl border border-[#B8860B]/20 overflow-hidden">
                {/* Top Gold Line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
                
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    {/* Logo & Company Info */}
                    <div className="flex items-center gap-6 flex-1">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#B8860B] to-[#DAA520] rounded-2xl opacity-40 blur-sm group-hover:opacity-60 transition-opacity" />
                        {profile.company_logo ? (
                          <img src={profile.company_logo} alt={profile.company_name || ""} className="relative w-20 h-20 rounded-2xl object-cover ring-2 ring-[#B8860B]/50" />
                        ) : (
                          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#B8860B]/30 flex items-center justify-center">
                            <span className="text-3xl">🏢</span>
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-black text-[9px] font-bold rounded-full shadow-lg shadow-[#B8860B]/30">PRO</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h1 className="text-[26px] font-light text-white">{profile.company_name || "Galeri Adı"}</h1>
                          <svg className="w-5 h-5 text-[#B8860B]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <p className="text-[13px] text-white/40 font-light">Kurumsal Satış Paneli</p>
                      </div>
                    </div>

                    {/* Store Link Card */}
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative px-5 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Mağaza Linki</p>
                          <p className="text-[14px] text-[#DAA520] font-light">{storeUrl}</p>
                        </div>
                      </div>
                      <button onClick={copyStoreUrl} className={`p-3.5 rounded-xl transition-all ${copied ? "bg-emerald-500/20 text-emerald-400 scale-95" : "bg-white/[0.03] hover:bg-white/[0.06] text-white/50 hover:text-white"}`}>
                        {copied ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <Link href="/profil/magaza" className="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/70 hover:text-white text-[13px] font-light rounded-xl transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Mağaza Ayarları
                      </Link>
                      <Link href="/ilan-ver" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B8860B] to-[#DAA520] hover:from-[#DAA520] hover:to-[#B8860B] text-black text-[13px] font-medium rounded-xl transition-all shadow-lg shadow-[#B8860B]/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Yeni İlan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
            {[
              { label: "Toplam Görüntülenme", value: "0", icon: "👁️", color: "text-white", bg: "from-white/5 to-white/[0.02]" },
              { label: "Aktif İlan", value: stats.active.toString(), icon: "🚗", color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-500/[0.02]" },
              { label: "Vitrinde", value: stats.featured.toString(), icon: "⭐", color: "text-[#DAA520]", bg: "from-[#B8860B]/10 to-[#B8860B]/[0.02]" },
              { label: "Satılan", value: stats.sold.toString(), icon: "✅", color: "text-blue-400", bg: "from-blue-500/10 to-blue-500/[0.02]" },
            ].map((stat, i) => (
              <motion.div key={stat.label} className="relative group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`relative bg-gradient-to-b ${stat.bg} border border-white/[0.06] rounded-2xl p-6 h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl">{stat.icon}</span>
                    <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <p className={`text-[36px] font-extralight ${stat.color} mb-1`}>{stat.value}</p>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Listings Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-2xl" />
              <div className="relative bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/[0.04] rounded-2xl overflow-hidden">
                {/* Section Header */}
                <div className="px-6 py-5 border-b border-white/[0.04]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-gradient-to-b from-[#B8860B] to-[#DAA520] rounded-full" />
                      <h2 className="text-[17px] font-light text-white">İlanlarım</h2>
                      <span className="px-2.5 py-1 bg-white/[0.04] rounded-full text-[11px] text-white/40">{listings.length} araç</span>
                    </div>
                    
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-white/[0.02] rounded-xl">
                      {[
                        { key: "all", label: "Tümü", count: listings.length },
                        { key: "active", label: "Aktif", count: stats.active },
                        { key: "sold", label: "Satılan", count: stats.sold },
                      ].map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`px-4 py-2 rounded-lg text-[12px] font-light transition-all ${activeTab === tab.key ? "bg-[#B8860B] text-black" : "text-white/50 hover:text-white"}`}>
                          {tab.label} ({tab.count})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table */}
                {filteredListings.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#B8860B]/10 to-transparent border border-[#B8860B]/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#B8860B]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h3 className="text-[18px] font-light text-white mb-2">Henüz ilanınız yok</h3>
                    <p className="text-[13px] text-white/40 mb-8 max-w-sm mx-auto">İlk ilanınızı vererek satışa başlayın ve müşterilerinize ulaşın</p>
                    <Link href="/ilan-ver" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#B8860B] to-[#DAA520] hover:from-[#DAA520] hover:to-[#B8860B] text-black text-[14px] font-medium rounded-xl transition-all shadow-lg shadow-[#B8860B]/20">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      İlk İlanınızı Verin
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.03]">
                    {/* Table Header */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] text-white/30 uppercase tracking-wider">
                      <div className="col-span-4">Araç</div>
                      <div className="col-span-2">Fiyat</div>
                      <div className="col-span-2">Durum</div>
                      <div className="col-span-2">Tarih</div>
                      <div className="col-span-2 text-right">İşlemler</div>
                    </div>
                    
                    {/* Listings */}
                    {filteredListings.map((listing, index) => (
                      <motion.div key={listing.id} className="group" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
                        <div 
                          onClick={() => openPreview(listing)}
                          className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors cursor-pointer"
                        >
                          {/* Car Info */}
                          <div className="lg:col-span-4 flex items-center gap-4">
                            <div className="relative">
                              {listing.images?.[0] ? (
                                <img src={listing.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/[0.06]" />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-white/[0.03] flex items-center justify-center"><svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                              )}
                              {listing.is_featured && <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#DAA520] rounded-full flex items-center justify-center"><span className="text-[10px]">⭐</span></div>}
                            </div>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <BrandLogo brandName={listing.brand} size="md" />
                              <div className="min-w-0">
                                <p className="text-[15px] text-white font-light truncate">{listing.brand} {listing.series}</p>
                                <p className="text-[12px] text-white/40 truncate">{listing.model} • {listing.year}</p>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="lg:col-span-2">
                            <p className="text-[16px] text-[#DAA520] font-medium">{formatPrice(listing.price)} ₺</p>
                          </div>

                          {/* Status */}
                          <div className="lg:col-span-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium ${listing.status === "active" ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : listing.status === "sold" ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20" : "bg-white/5 text-white/50"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${listing.status === "active" ? "bg-emerald-400" : listing.status === "sold" ? "bg-blue-400" : "bg-white/40"}`} />
                              {listing.status === "active" ? "Yayında" : listing.status === "sold" ? "Satıldı" : "Pasif"}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="lg:col-span-2">
                            <p className="text-[13px] text-white/40">{formatDate(listing.created_at)}</p>
                          </div>

                          {/* Actions */}
                          <div className="lg:col-span-2 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            {listing.status === "active" && (
                              <div className="relative group/btn flex-shrink-0">
                                {/* Neon Gold Border Glow */}
                                <div className={`absolute -inset-[1px] rounded-lg transition-all ${listing.is_featured ? "bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] opacity-100" : "bg-gradient-to-r from-[#B8860B]/60 via-[#DAA520] to-[#B8860B]/60 opacity-70 group-hover/btn:opacity-100"}`} />
                                <button onClick={() => handleToggleFeatured(listing.id)} disabled={loading === listing.id} className="relative overflow-hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all bg-black whitespace-nowrap">
                                  {/* Shimmer Effect */}
                                  <span className="absolute inset-0 overflow-hidden rounded-lg">
                                    <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
                                  </span>
                                  <svg className="relative w-3.5 h-3.5 text-[#DAA520] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                  <span className="relative text-[#DAA520]">{listing.is_featured ? "Vitrinde" : "Vitrine Ekle"}</span>
                                </button>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Link href={`/ilan/${listing.id}`} onClick={(e) => e.stopPropagation()} className="p-2 bg-white/[0.03] hover:bg-white/[0.06] text-white/50 hover:text-white rounded-lg transition-all" title="Görüntüle">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              </Link>
                              {listing.status === "active" && (
                                <button onClick={() => handleSoldClick(listing.id, listing.brand, listing.series)} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all" title="Satıldı İşaretle">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                                </button>
                              )}
                              <button onClick={() => handleDelete(listing.id)} disabled={loading === listing.id} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all" title="Sil">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
