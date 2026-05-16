"use client";

import { motion } from "framer-motion";

interface DamageCardProps {
  damageStatus: string;
  tramerAmount?: number;
  isExchangeable?: boolean;
}

export default function DamageCard({ damageStatus, tramerAmount, isExchangeable }: DamageCardProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat("tr-TR").format(price);

  const getDamageStyle = (status: string) => {
    switch (status) {
      case "Hatasız": return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "Boyalı": return { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
      case "Değişen Parça Var": return { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
      case "Ağır Hasarlı": return { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
      default: return { color: "text-white/50", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  const style = getDamageStyle(damageStatus);

  return (
    <div className="relative">
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#B8860B]/10 via-transparent to-[#B8860B]/10 rounded-2xl blur-sm" />
      <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-6">
        <h2 className="text-[15px] font-light text-white mb-6">Hasar & Tramer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
            className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 text-center">
            <p className="text-[11px] text-white/30 mb-3">Hasar Durumu</p>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium ${style.bg} ${style.color} ${style.border} border`}>
              {damageStatus === "Hatasız" && <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
              {damageStatus}
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 text-center">
            <p className="text-[11px] text-white/30 mb-3">Tramer Kaydı</p>
            <p className={`text-[14px] font-light ${tramerAmount && tramerAmount > 0 ? "text-orange-400" : "text-emerald-400"}`}>
              {tramerAmount && tramerAmount > 0 ? `${formatPrice(tramerAmount)} ₺` : "Kayıt Yok"}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 text-center">
            <p className="text-[11px] text-white/30 mb-3">Takas</p>
            <div className="flex items-center justify-center gap-2">
              {isExchangeable ? (
                <span className="flex items-center gap-1.5 text-[13px] text-emerald-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Takasa Uygun
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[13px] text-white/40">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  Takas Yok
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
