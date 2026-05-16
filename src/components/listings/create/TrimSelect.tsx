"use client";

import { useEffect, useState, useRef } from "react";
import { getTrimsBySeries } from "@/actions/listings";

interface Trim {
  id: number;
  model: string;
  fuel_type: string;
  gear_type: string;
  hp: number;
  engine_cc: number;
}

interface AutoFillData {
  fuel_type: string | null;
  gear_type: string | null;
  hasMultipleFuels: boolean;
  hasMultipleGears: boolean;
}

interface TrimSelectProps {
  brand: string;
  series: string;
  value: string;
  onChange: (value: string, autoFillData: AutoFillData | null) => void;
  error?: string;
}

export default function TrimSelect({ brand, series, value, onChange, error }: TrimSelectProps) {
  const [trims, setTrims] = useState<Trim[]>([]);
  const [filtered, setFiltered] = useState<Trim[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (brand && series) {
      setLoading(true);
      onChange("", null);
      getTrimsBySeries(brand, series).then((data) => {
        setTrims(data);
        setFiltered(data);
        setLoading(false);
      });
    } else {
      setTrims([]);
      setFiltered([]);
    }
  }, [brand, series]);

  useEffect(() => {
    if (search) {
      setFiltered(trims.filter((t) => t.model.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(trims);
    }
  }, [search, trims]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (trim: Trim) => {
    const sameModelTrims = trims.filter(t => t.model === trim.model);
    const uniqueFuels = [...new Set(sameModelTrims.map(t => t.fuel_type).filter(Boolean))];
    const uniqueGears = [...new Set(sameModelTrims.map(t => t.gear_type).filter(Boolean))];
    
    const autoFillData: AutoFillData = {
      fuel_type: uniqueFuels.length === 1 ? uniqueFuels[0] : null,
      gear_type: uniqueGears.length === 1 ? uniqueGears[0] : null,
      hasMultipleFuels: uniqueFuels.length > 1,
      hasMultipleGears: uniqueGears.length > 1,
    };

    onChange(trim.model, autoFillData);
    setSearch("");
    setOpen(false);
  };

  const isDisabled = !brand || !series || loading;
  const uniqueModels = [...new Map(filtered.map(t => [t.model, t])).values()];

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[12px] font-light text-white/50 mb-2">Model / Paket</label>
      
      <div
        onClick={() => !isDisabled && setOpen(true)}
        className={`w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl flex justify-between items-center transition-all ${
          isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-white/[0.15]"
        }`}
      >
        <span className={value ? "text-white text-[14px]" : "text-white/25 text-[14px]"}>
          {!series ? "Önce seri seçin" : loading ? "Yükleniyor..." : value || "Model Seçiniz"}
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
              placeholder="Model ara..."
              autoFocus
              className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-[#B8860B]/40"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {uniqueModels.length === 0 ? (
              <div className="px-4 py-3 text-white/30 text-[13px]">Sonuç bulunamadı</div>
            ) : (
              uniqueModels.map((trim) => {
                const variants = trims.filter(t => t.model === trim.model);
                const fuels = [...new Set(variants.map(v => v.fuel_type).filter(Boolean))];
                const gears = [...new Set(variants.map(v => v.gear_type).filter(Boolean))];
                
                return (
                  <div
                    key={trim.id}
                    onClick={() => handleSelect(trim)}
                    className={`px-4 py-2.5 cursor-pointer transition-colors ${
                      trim.model === value 
                        ? "bg-[#B8860B]/10 text-[#B8860B]" 
                        : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <div className="text-[13px]">{trim.model}</div>
                    <div className="text-[11px] text-white/30 mt-0.5">
                      {fuels.join(" / ")} • {gears.join(" / ")}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
