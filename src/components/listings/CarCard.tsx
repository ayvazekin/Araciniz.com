"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BrandLogo from "@/components/ui/BrandLogo";

interface CarCardProps {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  city: string;
  district: string;
  images: string[];
  isShowcase?: boolean;
}

export default function CarCard({
  id,
  brand,
  model,
  price,
  year,
  mileage,
  city,
  district,
  images,
  isShowcase,
}: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR").format(price);
  };

  const formatMileage = (km: number) => {
    return new Intl.NumberFormat("tr-TR").format(km);
  };

  return (
    <Link href={`/ilan/${id}`}>
      <motion.div
        className={`relative bg-white/[0.02] border rounded-xl overflow-hidden group ${
          isShowcase 
            ? "border-[#B8860B]/20" 
            : "border-white/5 hover:border-white/10"
        }`}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={`${brand} ${model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl opacity-10">🚗</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-center gap-2">
            <BrandLogo brandName={brand} size="sm" />
            <h3 className="text-[13px] font-medium text-white truncate flex-1">
              {brand} {model}
            </h3>
          </div>

          <p className="text-[14px] font-medium text-[#B8860B] mt-1">
            ₺{formatPrice(price)}
          </p>

          <div className="flex items-center gap-2 mt-2 text-[10px] text-white/30">
            <span>{year}</span>
            <span>•</span>
            <span>{formatMileage(mileage)} km</span>
          </div>

          <p className="text-[10px] text-white/20 mt-1">
            {city}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
