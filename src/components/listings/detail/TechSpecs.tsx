"use client";

import { motion } from "framer-motion";

interface TechSpecsProps {
  // Temel
  acceleration_0_100?: number;
  acceleration_0_200?: number;
  max_speed?: number;
  torque?: number;
  engine_power?: number;
  engine_cc?: number;
  fuel_consumption_avg?: number;
  trunk_volume?: number;
  weight?: number;
  // Gelişmiş
  drag_coefficient?: number;
  power_to_weight?: number;
  turning_radius?: number;
  cylinder_config?: string;
  emission_standard?: string;
  ai_enriched?: boolean;
}

export default function TechSpecs({
  acceleration_0_100, acceleration_0_200, max_speed, torque, engine_power, engine_cc,
  fuel_consumption_avg, trunk_volume, weight, drag_coefficient, power_to_weight,
  turning_radius, cylinder_config, emission_standard, ai_enriched,
}: TechSpecsProps) {
  const hasBasicData = acceleration_0_100 || max_speed || torque || engine_power || fuel_consumption_avg || trunk_volume;
  const hasAdvancedData = acceleration_0_200 || drag_coefficient || power_to_weight || turning_radius || cylinder_config || emission_standard;
  
  if (!hasBasicData && !ai_enriched) {
    return (
      <div className="relative">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B]/5 via-transparent to-[#B8860B]/5 rounded-2xl blur-sm" />
        <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center gap-3 text-white/30">
            <div className="w-5 h-5 border-2 border-[#B8860B]/30 border-t-[#B8860B] rounded-full animate-spin" />
            <span className="text-[13px]">Teknik özellikler hesaplanıyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!hasBasicData) return null;

  const basicSpecs = [
    { label: "0-100 km/h", value: acceleration_0_100 ? `${acceleration_0_100} sn` : null, icon: "🚀" },
    { label: "Maksimum Hız", value: max_speed ? `${max_speed} km/h` : null, icon: "⚡" },
    { label: "Motor Gücü", value: engine_power ? `${engine_power} HP` : null, icon: "🔥" },
    { label: "Tork", value: torque ? `${torque} Nm` : null, icon: "💪" },
    { label: "Motor Hacmi", value: engine_cc ? `${engine_cc} cc` : null, icon: "🔧" },
    { label: "Yakıt Tüketimi", value: fuel_consumption_avg ? `${fuel_consumption_avg} lt/100km` : null, icon: "⛽" },
    { label: "Bagaj Hacmi", value: trunk_volume ? `${trunk_volume} lt` : null, icon: "🧳" },
    { label: "Ağırlık", value: weight ? `${weight} kg` : null, icon: "⚖️" },
  ].filter(spec => spec.value);

  const advancedSpecs = [
    { label: "0-200 km/h", value: acceleration_0_200 ? `${acceleration_0_200} sn` : null, icon: "🏎️", highlight: true },
    { label: "Rüzgar Direnci (Cd)", value: drag_coefficient ? `${drag_coefficient}` : null, icon: "💨" },
    { label: "Güç/Ağırlık", value: power_to_weight ? `${power_to_weight.toFixed(1)} kg/hp` : null, icon: "📊" },
    { label: "Dönüş Çapı", value: turning_radius ? `${turning_radius} m` : null, icon: "🔄" },
    { label: "Silindir Dizilimi", value: cylinder_config || null, icon: "⚙️" },
    { label: "Emisyon Standardı", value: emission_standard || null, icon: "🌿" },
  ].filter(spec => spec.value);

  return (
    <div className="space-y-4">
      {/* Temel Teknik Özellikler */}
      <div className="relative">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B]/10 via-transparent to-[#B8860B]/10 rounded-2xl blur-sm" />
        <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-light text-white">Teknik Özellikler</h2>
            {ai_enriched && (
              <span className="flex items-center gap-1.5 text-[10px] text-[#B8860B] bg-[#B8860B]/10 px-2.5 py-1 rounded-full border border-[#B8860B]/20">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                AI Zenginleştirildi
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {basicSpecs.map((spec, index) => (
              <motion.div key={spec.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-[#B8860B]/20 rounded-xl p-4 transition-all text-center group">
                <span className="text-xl mb-2 block opacity-60 group-hover:opacity-100 transition-opacity">{spec.icon}</span>
                <p className="text-[10px] text-white/30 mb-1">{spec.label}</p>
                <p className="text-[14px] text-white font-light">{spec.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gelişmiş Performans Verileri */}
      {hasAdvancedData && advancedSpecs.length > 0 && (
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B]/20 via-[#DAA520]/10 to-[#B8860B]/20 rounded-2xl blur-sm" />
          <div className="relative bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] rounded-2xl border border-[#B8860B]/20 p-6 overflow-hidden">
            {/* Premium Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-[#B8860B]/5 blur-3xl pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/10 border border-[#B8860B]/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#DAA520]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[15px] font-light text-white">Gelişmiş Performans Verileri</h2>
                  <p className="text-[11px] text-white/30">Detaylı mühendislik özellikleri</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {advancedSpecs.map((spec, index) => (
                  <motion.div 
                    key={spec.label} 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`relative group ${spec.highlight ? 'col-span-1' : ''}`}
                  >
                    {spec.highlight && (
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B] to-[#DAA520] rounded-xl opacity-50 blur-sm" />
                    )}
                    <div className={`relative bg-white/[0.02] hover:bg-white/[0.04] border rounded-xl p-4 transition-all text-center h-full ${
                      spec.highlight 
                        ? 'border-[#B8860B]/40 hover:border-[#DAA520]/60' 
                        : 'border-white/[0.04] hover:border-[#B8860B]/20'
                    }`}>
                      <span className={`text-lg mb-2 block transition-opacity ${spec.highlight ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`}>
                        {spec.icon}
                      </span>
                      <p className="text-[9px] text-white/30 mb-1 uppercase tracking-wider">{spec.label}</p>
                      <p className={`text-[13px] font-light ${spec.highlight ? 'text-[#DAA520]' : 'text-white'}`}>
                        {spec.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
