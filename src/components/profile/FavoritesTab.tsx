"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Listing {
  id: string;
  title: string;
  brand: string;
  series: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  city: string;
  district: string;
}

interface Favorite {
  id: string;
  listings: Listing;
}

interface FavoritesTabProps {
  favorites: Favorite[];
}

export default function FavoritesTab({ favorites }: FavoritesTabProps) {
  if (favorites.length === 0) {
    return (
      <div className="border border-amber-500/10 rounded-2xl p-16 text-center">
        <div className="text-6xl mb-6">❤️</div>
        <h3 className="font-serif text-2xl font-bold text-white mb-3">Henüz favoriniz yok</h3>
        <p className="text-white/40 mb-8">Beğendiğiniz araçları favorilere ekleyin</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full transition-all"
        >
          Araçlara Göz At
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((fav, index) => {
        const listing = fav.listings;
        if (!listing) return null;
        
        return (
          <motion.div
            key={fav.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={`/ilan/${listing.id}`}
              className="block bg-black border border-amber-500/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3]">
                {listing.images?.[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center border-b border-amber-500/10">
                    <span className="text-5xl opacity-20">🚗</span>
                  </div>
                )}
                
                {/* Heart */}
                <div className="absolute top-3 right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-serif font-bold text-white truncate text-lg">
                  {listing.title || `${listing.brand} ${listing.series}`}
                </h3>
                <p className="text-sm text-white/40 mb-2">
                  {listing.brand} {listing.model} • {listing.year}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gradient">
                    {listing.price?.toLocaleString("tr-TR")} ₺
                  </p>
                  <p className="text-xs text-white/30">
                    {listing.city}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
