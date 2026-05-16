"use client";

import { useState } from "react";

interface BrandLogoProps {
  brandName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Marka adını slug formatına çevir
function toSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Size mapping
const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-10 h-10",
};

const textSizeMap = {
  sm: "text-[8px]",
  md: "text-[10px]",
  lg: "text-[14px]",
};

export default function BrandLogo({ brandName, size = "md", className = "" }: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);
  const slug = toSlug(brandName);
  const logoPath = `/logos/${slug}.svg`;
  const initial = brandName.charAt(0).toUpperCase();

  if (hasError) {
    // Fallback: Baş harf göster
    return (
      <div 
        className={`${sizeMap[size]} rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center justify-center ${className}`}
      >
        <span className={`${textSizeMap[size]} font-medium text-white/40`}>
          {initial}
        </span>
      </div>
    );
  }

  return (
    <div className={`${sizeMap[size]} flex items-center justify-center ${className}`}>
      <img
        src={logoPath}
        alt={`${brandName} logo`}
        className="w-full h-full object-contain brightness-0 invert"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
