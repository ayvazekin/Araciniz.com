"use client";

import { useEffect, useState, useRef } from "react";
import { getModelsByBrand } from "@/actions/listings";

interface ModelSelectProps {
  brand: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function ModelSelect({ brand, value, onChange, error }: ModelSelectProps) {
  const [models, setModels] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (brand) {
      setLoading(true);
      onChange("");
      getModelsByBrand(brand).then((data) => {
        setModels(data);
        setFiltered(data);
        setLoading(false);
      });
    } else {
      setModels([]);
      setFiltered([]);
    }
  }, [brand]);

  useEffect(() => {
    if (search) {
      setFiltered(models.filter((m) => 
        m.toLowerCase().includes(search.toLowerCase())
      ));
    } else {
      setFiltered(models);
    }
  }, [search, models]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (model: string) => {
    onChange(model);
    setSearch("");
    setOpen(false);
  };

  const isDisabled = !brand || loading;

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Model
      </label>
      
      <div
        onClick={() => !isDisabled && setOpen(true)}
        className={`w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl flex justify-between items-center ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className={value ? "text-white" : "text-zinc-500"}>
          {!brand ? "Önce marka seçin" : loading ? "Yükleniyor..." : value || "Model Seçiniz"}
        </span>
        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-zinc-700">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Model ara..."
              autoFocus
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-zinc-500 text-sm">Sonuç bulunamadı</div>
            ) : (
              filtered.map((model) => (
                <div
                  key={model}
                  onClick={() => handleSelect(model)}
                  className={`px-4 py-2.5 cursor-pointer transition-colors ${
                    model === value 
                      ? "bg-amber-500/20 text-amber-500" 
                      : "text-white hover:bg-zinc-700"
                  }`}
                >
                  {model}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
