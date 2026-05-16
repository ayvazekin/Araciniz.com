"use client";

import { useEffect, useState, useRef } from "react";
import { getBrands } from "@/actions/listings";

interface BrandSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function BrandSelect({ value, onChange, error }: BrandSelectProps) {
  const [brands, setBrands] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getBrands().then((data) => {
      setBrands(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (search) {
      setFiltered(brands.filter((b) => b.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(brands);
    }
  }, [search, brands]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (brand: string) => {
    onChange(brand);
    setSearch("");
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[12px] font-light text-white/50 mb-2">Marka</label>
      
      <div
        onClick={() => !loading && setOpen(true)}
        className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white cursor-pointer flex justify-between items-center hover:border-white/[0.15] transition-all"
      >
        <span className={value ? "text-white text-[14px]" : "text-white/25 text-[14px]"}>
          {loading ? "Yükleniyor..." : value || "Marka Seçiniz"}
        </span>
        <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/[0.06]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Marka ara..."
              autoFocus
              className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-[#B8860B]/40"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-white/30 text-[13px]">Sonuç bulunamadı</div>
            ) : (
              filtered.map((brand) => (
                <div
                  key={brand}
                  onClick={() => handleSelect(brand)}
                  className={`px-4 py-2.5 cursor-pointer transition-colors text-[13px] ${
                    brand === value 
                      ? "bg-[#B8860B]/10 text-[#B8860B]" 
                      : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {brand}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
