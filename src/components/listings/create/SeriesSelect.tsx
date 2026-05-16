"use client";

import { useEffect, useState, useRef } from "react";
import { getSeriesByBrand } from "@/actions/listings";

interface SeriesSelectProps {
  brand: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function SeriesSelect({ brand, value, onChange, error }: SeriesSelectProps) {
  const [series, setSeries] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (brand) {
      setLoading(true);
      onChange("");
      getSeriesByBrand(brand).then((data) => {
        setSeries(data);
        setFiltered(data);
        setLoading(false);
      });
    } else {
      setSeries([]);
      setFiltered([]);
    }
  }, [brand]);

  useEffect(() => {
    if (search) {
      setFiltered(series.filter((s) => s.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(series);
    }
  }, [search, series]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (s: string) => {
    onChange(s);
    setSearch("");
    setOpen(false);
  };

  const isDisabled = !brand || loading;

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[12px] font-light text-white/50 mb-2">Seri</label>
      
      <div
        onClick={() => !isDisabled && setOpen(true)}
        className={`w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl flex justify-between items-center transition-all ${
          isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-white/[0.15]"
        }`}
      >
        <span className={value ? "text-white text-[14px]" : "text-white/25 text-[14px]"}>
          {!brand ? "Önce marka seçin" : loading ? "Yükleniyor..." : value || "Seri Seçiniz"}
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
              placeholder="Seri ara..."
              autoFocus
              className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-[#B8860B]/40"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-white/30 text-[13px]">Sonuç bulunamadı</div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s}
                  onClick={() => handleSelect(s)}
                  className={`px-4 py-2.5 cursor-pointer transition-colors text-[13px] ${
                    s === value 
                      ? "bg-[#B8860B]/10 text-[#B8860B]" 
                      : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {s}
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
