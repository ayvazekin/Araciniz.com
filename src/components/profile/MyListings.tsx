"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  created_at: string;
}

interface MyListingsProps {
  listings: Listing[];
}

export default function MyListings({ listings }: MyListingsProps) {
  const [items, setItems] = useState(listings);
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    
    setLoading(id);
    const result = await deleteListing(id);
    if (!result.error) {
      setItems(items.filter(item => item.id !== id));
    }
    setLoading(null);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(id);
    const result = await updateListingStatus(id, newStatus);
    if (!result.error) {
      setItems(items.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
    }
    setLoading(null);
  };

  const handleToggleFeatured = async (id: string) => {
    setLoading(id);
    const result = await toggleFeatured(id);
    if (!result.error) {
      setItems(items.map(item => 
        item.id === id ? { ...item, is_featured: result.is_featured } : item
      ));
    }
    setLoading(null);
  };

  if (items.length === 0) {
    return (
      <div className="border border-amber-500/10 rounded-2xl p-16 text-center">
        <div className="text-6xl mb-6">🚗</div>
        <h3 className="font-serif text-2xl font-bold text-white mb-3">Henüz ilanınız yok</h3>
        <p className="text-white/40 mb-8">İlk ilanınızı vererek satışa başlayın</p>
        <Link
          href="/ilan-ver"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold rounded-full glow-amber"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          İlan Ver
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((listing, index) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`bg-black border rounded-2xl overflow-hidden ${
            listing.is_featured ? "border-amber-500/50 glow-amber" : "border-amber-500/10"
          }`}
        >
          {/* Image */}
          <div className="relative aspect-[4/3]">
            {listing.images?.[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center border-b border-amber-500/10">
                <span className="text-5xl opacity-20">🚗</span>
              </div>
            )}
            
            {/* Status Badge */}
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
              listing.status === "active" 
                ? "bg-emerald-500 text-black"
                : listing.status === "sold"
                ? "bg-blue-500 text-white"
                : "bg-white/20 text-white"
            }`}>
              {listing.status === "active" ? "Yayında" : listing.status === "sold" ? "Satıldı" : "Pasif"}
            </div>

            {/* Featured Badge */}
            {listing.is_featured && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-500 text-black text-xs font-bold rounded-full">
                VİTRİN
              </div>
            )}

            {/* Views (dummy) */}
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/80 backdrop-blur rounded-full text-xs text-white/60 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {Math.floor(Math.random() * 200) + 50}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-serif font-bold text-white truncate text-lg">
              {listing.title || `${listing.brand} ${listing.series}`}
            </h3>
            <p className="text-sm text-white/40 mb-3">
              {listing.brand} {listing.model} • {listing.year}
            </p>
            <p className="text-xl font-bold text-gradient">
              {listing.price.toLocaleString("tr-TR")} ₺
            </p>

            {/* Actions */}
            <div className="flex gap-2 mt-5 pt-5 border-t border-amber-500/10">
              {/* Featured Toggle */}
              <button
                onClick={() => handleToggleFeatured(listing.id)}
                disabled={loading === listing.id}
                className={`p-2.5 rounded-xl transition-all ${
                  listing.is_featured 
                    ? "bg-amber-500 text-black" 
                    : "bg-white/5 text-white/40 hover:text-amber-500 hover:bg-amber-500/10"
                }`}
                title={listing.is_featured ? "Vitrinden Çıkar" : "Vitrine Ekle"}
              >
                <svg className="w-4 h-4" fill={listing.is_featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>

              <Link
                href={`/ilan/${listing.id}`}
                className="flex-1 py-2.5 text-center text-sm bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-all"
              >
                Görüntüle
              </Link>
              
              {listing.status === "active" && (
                <button
                  onClick={() => handleStatusChange(listing.id, "sold")}
                  disabled={loading === listing.id}
                  className="flex-1 py-2.5 text-center text-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all disabled:opacity-50"
                >
                  Satıldı
                </button>
              )}
              
              <button
                onClick={() => handleDelete(listing.id)}
                disabled={loading === listing.id}
                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
