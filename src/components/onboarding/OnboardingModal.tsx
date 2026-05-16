"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { completeOnboarding } from "@/actions/profile";

interface OnboardingModalProps {
  user: User;
  onComplete: () => void;
}

type Step = "select" | "form";
type AccountType = "bireysel" | "kurumsal";

export default function OnboardingModal({ user, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0];

  const handleSelectType = (type: AccountType) => {
    setAccountType(type);
    setStep("form");
  };

  const handleSubmit = async () => {
    if (!phone || (accountType === "kurumsal" && !companyName)) return;
    
    setIsSubmitting(true);
    
    const result = await completeOnboarding({
      account_type: accountType!,
      phone,
      company_name: accountType === "kurumsal" ? companyName : undefined,
    });

    if (!result.error) {
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
    
    setIsSubmitting(false);
  };

  const formatPhone = (value: string, type: AccountType | null) => {
    const numbers = value.replace(/\D/g, "");
    
    if (type === "kurumsal") {
      // Kurumsal: 0XXX XXX XX XX formatı
      if (numbers.length <= 4) return numbers;
      if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
      return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9, 11)}`;
    } else {
      // Bireysel: 5XX XXX XX XX formatı
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
      if (numbers.length <= 8) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
      
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {/* Checkmark Circle */}
              <motion.div
                className="relative w-24 h-24 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/10 border border-[#B8860B]/30" />
                <motion.svg
                  className="absolute inset-0 w-full h-full p-6 text-[#DAA520]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />
                </motion.svg>
                
                {/* Particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-[#DAA520]"
                    style={{ left: "50%", top: "50%" }}
                    initial={{ x: "-50%", y: "-50%", opacity: 1 }}
                    animate={{
                      x: `calc(-50% + ${Math.cos(i * 45 * Math.PI / 180) * 60}px)`,
                      y: `calc(-50% + ${Math.sin(i * 45 * Math.PI / 180) * 60}px)`,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  />
                ))}
              </motion.div>
              
              <motion.p
                className="text-[20px] font-light text-[#DAA520]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Hoş Geldiniz!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Content */}
      {!showSuccess && (
        <motion.div
          className="relative z-10 w-full max-w-2xl mx-6"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Gold glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/30 via-[#B8860B]/10 to-transparent rounded-3xl blur-sm" />
          
          <div className="relative bg-[#0a0a0a] rounded-3xl border border-white/[0.08] overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-10 pb-6 text-center border-b border-white/[0.04]">
              <motion.div
                className="flex items-center justify-center gap-2 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-[24px] font-extralight text-white">Aracınız</span>
                <span className="text-[18px] font-light text-[#B8860B]">.com</span>
              </motion.div>
              
              <motion.h2
                className="text-[22px] font-extralight text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                Hoş Geldiniz, <span className="text-white/60">{fullName}</span>
              </motion.h2>
              
              <motion.p
                className="text-[14px] text-white/40 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {step === "select" 
                  ? "Hesabınızı nasıl kullanacaksınız?" 
                  : accountType === "kurumsal" 
                    ? "Galeri bilgilerinizi girin" 
                    : "İletişim bilgilerinizi girin"}
              </motion.p>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {step === "select" ? (
                  <motion.div
                    key="select"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Bireysel */}
                    <motion.button
                      onClick={() => handleSelectType("bireysel")}
                      className="group relative p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-14 h-14 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4 group-hover:bg-white/[0.08] transition-colors">
                        <span className="text-3xl">👤</span>
                      </div>
                      <h3 className="text-[16px] font-light text-white mb-1">Bireysel</h3>
                      <p className="text-[13px] text-white/40 font-light">Kendi aracımı satacağım</p>
                    </motion.button>

                    {/* Kurumsal - Parlayan */}
                    <motion.button
                      onClick={() => handleSelectType("kurumsal")}
                      className="group relative p-6 rounded-2xl border border-[#B8860B]/30 bg-gradient-to-br from-[#B8860B]/10 to-transparent hover:from-[#B8860B]/15 transition-all text-left overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: "radial-gradient(circle at 50% 0%, rgba(184,134,11,0.4) 0%, transparent 60%)"
                        }}
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-[#B8860B]/20 flex items-center justify-center mb-4 border border-[#B8860B]/30">
                          <span className="text-3xl">🏢</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[16px] font-light text-[#DAA520]">Kurumsal / Galeri</h3>
                          <span className="px-2 py-0.5 text-[10px] bg-[#B8860B] text-black rounded-full font-medium">PRO</span>
                        </div>
                        <p className="text-[13px] text-white/50 font-light">Profesyonel satış yapacağım</p>
                      </div>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    className="space-y-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Back button */}
                    <button
                      onClick={() => setStep("select")}
                      className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-[13px] font-light">Geri</span>
                    </button>

                    {/* Company Name (only for kurumsal) */}
                    {accountType === "kurumsal" && (
                      <div>
                        <label className="block text-[12px] text-white/40 mb-2 font-light">
                          Galeri / Şirket Adı <span className="text-[#B8860B]">*</span>
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Örn: Vatan Motors"
                          className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#B8860B]/50 transition-colors"
                        />
                      </div>
                    )}

                    {/* Phone */}
                    <div>
                      <label className="block text-[12px] text-white/40 mb-2 font-light">
                        Telefon Numarası <span className="text-[#B8860B]">*</span>
                      </label>
                      <div className="relative">
                        {accountType === "bireysel" && (
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-white/40">+90</span>
                        )}
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(formatPhone(e.target.value, accountType))}
                          placeholder={accountType === "kurumsal" ? "0XXX XXX XX XX" : "5XX XXX XX XX"}
                          maxLength={accountType === "kurumsal" ? 15 : 14}
                          className={`w-full ${accountType === "bireysel" ? "pl-14" : "pl-4"} pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#B8860B]/50 transition-colors`}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !phone || (accountType === "kurumsal" && !companyName)}
                      className="w-full py-4 mt-4 bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-black text-[14px] font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          Başlayalım
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
