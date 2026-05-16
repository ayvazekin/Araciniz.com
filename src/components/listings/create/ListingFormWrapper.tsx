"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ListingForm from "./ListingForm";

export default function ListingFormWrapper() {
  const router = useRouter();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleExitClick = () => {
    // Form boşsa direkt çık, doluysa onay iste
    if (isFormDirty) {
      setShowExitConfirm(true);
    } else {
      router.push("/");
    }
  };

  const handleExit = () => {
    setShowExitConfirm(false);
    router.push("/");
  };

  const handleFormDirtyChange = useCallback((dirty: boolean) => {
    setIsFormDirty(dirty);
  }, []);

  return (
    <>
      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowExitConfirm(false)} />
            <motion.div className="relative z-10 w-full max-w-xs mx-6" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.3 }}>
              <div className="absolute -inset-[1px] bg-gradient-to-b from-red-500/20 via-transparent to-transparent rounded-2xl blur-sm" />
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.08] p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-[15px] text-white font-light mb-2">Çıkmak istediğinize emin misiniz?</h3>
                <p className="text-[12px] text-white/40 mb-6">Girdiğiniz tüm bilgiler silinecektir.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-2.5 text-[13px] text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-lg transition-colors">Vazgeç</button>
                  <button onClick={handleExit} className="flex-1 py-2.5 text-[13px] text-white bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors">Çıkış Yap</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.button
        type="button"
        onClick={handleExitClick}
        className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-8 group"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-[13px] font-light">Geri</span>
      </motion.button>

      {/* Header with Close Button */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-[#B8860B]/50" />
            <p className="text-[11px] text-[#B8860B] tracking-[0.3em] uppercase">Yeni İlan</p>
          </div>
          <h1 className="text-[28px] font-extralight text-white">
            Aracınızı <span className="text-white/60">Satışa Çıkarın</span>
          </h1>
          <p className="text-[13px] text-white/40 mt-2">
            Binlerce alıcıya ulaşın
          </p>
        </div>

        {/* Close Button - Premium positioned */}
        <motion.button
          type="button"
          onClick={handleExitClick}
          className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-[12px] text-white/30 group-hover:text-white/50 transition-colors hidden sm:block">Vazgeç</span>
          <svg className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>

      {/* Form Card */}
      <div className="relative">
        <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 via-transparent to-transparent rounded-2xl blur-sm" />
        <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-8">
          <ListingForm onDirtyChange={handleFormDirtyChange} />
        </div>
      </div>
    </>
  );
}
