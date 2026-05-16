"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SellerCardProps {
  price: number;
  phone?: string;
  brand: string;
  model: string;
  listingType?: string;
}

export default function SellerCard({
  price,
  phone,
  brand,
  model,
  listingType,
}: SellerCardProps) {
  const [showPhone, setShowPhone] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR").format(price);
  };

  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7, 9)} ${phone.slice(9)}`;
    }
    return phone;
  };

  const whatsappMessage = encodeURIComponent(
    `Merhaba, Aracınız.com'da yayınlanan ${brand} ${model} ilanınızla ilgileniyorum.`
  );

  const whatsappLink = phone
    ? `https://wa.me/90${phone.replace(/\D/g, "")}?text=${whatsappMessage}`
    : "#";

  return (
    <div className="relative sticky top-24">
      {/* Premium Glow Effect */}
      <div className="absolute -inset-[2px] bg-gradient-to-b from-[#B8860B]/30 via-[#B8860B]/10 to-transparent rounded-2xl blur-md" />
      
      <div className="relative bg-gradient-to-b from-[#0f0f0f] to-[#080808] rounded-2xl border border-[#B8860B]/20 overflow-hidden">
        {/* Top Gold Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />

        {/* Header - Price Section */}
        <div className="p-6 border-b border-white/[0.04]">
          {listingType && (
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium ${
                listingType === "rent" 
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${listingType === "rent" ? "bg-blue-400" : "bg-emerald-400"}`} />
                {listingType === "rent" ? "Kiralık" : "Satılık"}
              </span>
            </div>
          )}

          <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">
            {listingType === "rent" ? "Aylık Kira" : "Satış Fiyatı"}
          </p>
          
          {/* Premium Price Display */}
          <div className="relative">
            <div className="flex items-baseline gap-2">
              <motion.span 
                className="text-[42px] font-light bg-gradient-to-r from-[#D4AF37] via-[#F4E4BC] to-[#D4AF37] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {formatPrice(price)}
              </motion.span>
              <span className="text-[20px] text-[#D4AF37]/60">₺</span>
            </div>
            {/* Subtle shimmer on price */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          {/* WhatsApp Button - Premium */}
          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#0F7A6D] text-white text-[15px] font-semibold rounded-xl transition-all overflow-hidden group shadow-lg shadow-[#25D366]/20"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
            
            <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="relative z-10">WhatsApp ile İletişime Geç</span>
          </motion.a>

          {/* Phone Button */}
          {phone && (
            <motion.button
              onClick={() => setShowPhone(!showPhone)}
              className="relative w-full py-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#B8860B]/30 text-white/80 hover:text-white text-[14px] font-medium rounded-xl transition-all flex items-center justify-center gap-3 overflow-hidden group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Gold border on hover */}
              <motion.div
                className="absolute inset-0 border-2 border-[#B8860B]/0 group-hover:border-[#B8860B]/20 rounded-xl transition-colors"
              />
              
              <svg className="w-5 h-5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              
              {showPhone ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[#DAA520] font-semibold tracking-wide"
                >
                  {formatPhone(phone)}
                </motion.span>
              ) : (
                <span>Telefonu Göster</span>
              )}
            </motion.button>
          )}

          {/* Call Direct Button - appears after showing phone */}
          {phone && showPhone && (
            <motion.a
              href={`tel:+90${phone.replace(/\D/g, "")}`}
              className="w-full py-3 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 border border-[#B8860B]/20 text-[#DAA520] text-[13px] font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hemen Ara
            </motion.a>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 pb-6 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-white/30">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Güvenli iletişim
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Çevrimiçi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
