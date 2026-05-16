"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { updateProfile, switchAccountType } from "@/actions/profile";

interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  account_type?: string;
  company_name?: string;
}

interface Props {
  user: User;
  profile: Profile | null;
}

export default function ProfileSettingsContent({ user, profile }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile?.full_name || user.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [error, setError] = useState("");

  // Account type switch states
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);
  const [showSwitchSuccess, setShowSwitchSuccess] = useState(false);
  const [switchFadeOut, setSwitchFadeOut] = useState(false);

  const isKurumsal = profile?.account_type === "kurumsal";
  const avatarUrl = user.user_metadata?.avatar_url;
  const email = user.email;

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9, 11)}`;
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    
    // 2 saniye loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = await updateProfile({
      full_name: fullName,
      phone: phone.replace(/\s/g, ""),
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
    } else {
      setShowSuccess(true);
      // 1.5 saniye sonra fade out başlat
      setTimeout(() => setFadeOut(true), 1500);
      // 2.5 saniye sonra kapat
      setTimeout(() => {
        setShowSuccess(false);
        setFadeOut(false);
      }, 2500);
    }
  };

  const handleSwitchAccount = async () => {
    if (!isKurumsal && !companyName.trim()) return;
    
    setIsSwitching(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await switchAccountType({
      newType: isKurumsal ? "bireysel" : "kurumsal",
      companyName: !isKurumsal ? companyName : undefined,
    });
    
    setIsSwitching(false);
    
    if (!result.error) {
      setShowSwitchModal(false);
      setShowSwitchSuccess(true);
      setSwitchFadeOut(false);
      
      setTimeout(() => setSwitchFadeOut(true), 1500);
      setTimeout(() => {
        setShowSwitchSuccess(false);
        setSwitchFadeOut(false);
        router.refresh();
      }, 2200);
    }
  };

  return (
    <>
      {/* Account Switch Modal */}
      <AnimatePresence>
        {showSwitchModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => !isSwitching && setShowSwitchModal(false)}
            />
            
            <motion.div
              className="relative z-10 w-full max-w-md mx-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`absolute -inset-[1px] bg-gradient-to-b ${isKurumsal ? "from-white/10" : "from-[#B8860B]/30"} via-transparent to-transparent rounded-2xl blur-sm`} />
              
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.08] p-8">
                <AnimatePresence mode="wait">
                  {!isSwitching ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Icon */}
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${isKurumsal ? "bg-white/[0.05]" : "bg-[#B8860B]/10"}`}>
                        {isKurumsal ? (
                          <span className="text-3xl">👤</span>
                        ) : (
                          <span className="text-3xl">🏢</span>
                        )}
                      </div>
                      
                      <h3 className={`text-[18px] font-light text-center mb-2 ${isKurumsal ? "text-white" : "text-[#DAA520]"}`}>
                        {isKurumsal ? "Bireysel Hesaba Dön" : "Kurumsal Hesaba Yükselt"}
                      </h3>
                      
                      {isKurumsal ? (
                        <>
                          <p className="text-[13px] text-white/40 text-center mb-8">
                            Kurumsal özellikler (İstatistikler, Mağaza Sayfası) devre dışı kalacak. Bireysele dönmek istiyor musunuz?
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowSwitchModal(false)}
                              className="flex-1 py-3 text-[13px] text-white/60 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors"
                            >
                              Vazgeç
                            </button>
                            <button
                              onClick={handleSwitchAccount}
                              className="flex-1 py-3 text-[13px] text-white bg-white/[0.08] hover:bg-white/[0.12] rounded-xl font-medium transition-colors"
                            >
                              Evet, Değiştir
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-[13px] text-white/40 text-center mb-6">
                            Profesyonel satış paneli, mağaza sayfası ve istatistiklere erişin.
                          </p>
                          
                          <div className="mb-6">
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
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowSwitchModal(false)}
                              className="flex-1 py-3 text-[13px] text-white/60 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors"
                            >
                              Vazgeç
                            </button>
                            <button
                              onClick={handleSwitchAccount}
                              disabled={!companyName.trim()}
                              className="flex-1 py-3 text-[13px] text-black bg-gradient-to-r from-[#B8860B] to-[#DAA520] hover:from-[#DAA520] hover:to-[#B8860B] rounded-xl font-medium transition-all disabled:opacity-50"
                            >
                              Yükselt
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-8"
                    >
                      <motion.div
                        className={`w-12 h-12 mx-auto mb-5 border-2 ${isKurumsal ? "border-white/20 border-t-white" : "border-[#B8860B]/30 border-t-[#B8860B]"} rounded-full`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-[14px] text-white/50 text-center font-light">
                        Hesap türü değiştiriliyor...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Switch Success Modal */}
      <AnimatePresence>
        {showSwitchSuccess && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: switchFadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.div
                className="relative w-24 h-24 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/10 border border-[#B8860B]/30 flex items-center justify-center">
                  <motion.svg
                    className="w-12 h-12 text-[#DAA520]"
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
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </motion.svg>
                </div>
                
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
                className="text-[18px] font-light text-[#DAA520]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Hesap Türü Değiştirildi
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Success Circle */}
              <motion.div
                className="w-20 h-20 rounded-full bg-[#B8860B]/10 flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <motion.svg
                  className="w-10 h-10 text-[#B8860B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  />
                </motion.svg>
              </motion.div>
              
              {/* Text */}
              <motion.p
                className="text-[17px] font-light text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Değişiklikler Güncellendi
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-24 pb-20 relative">
        {/* Background Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-[0.08]"
            style={{ background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)", filter: "blur(100px)" }} />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-[0.08]"
            style={{ background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)", filter: "blur(100px)" }} />
        </div>

        <div className="max-w-xl mx-auto px-6 relative z-10">
          {/* Back Button */}
          <motion.a
            href="/profil"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-8 group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[13px] font-light">Satış Paneli</span>
          </motion.a>

          {/* Header */}
          <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-8 bg-[#B8860B]/50" />
              <p className="text-[11px] text-[#B8860B] tracking-[0.3em] uppercase">Hesap</p>
            </div>
            <h1 className="text-[28px] font-extralight text-white">Profil Ayarları</h1>
          </motion.div>

          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 via-transparent to-transparent rounded-2xl blur-sm" />
              
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-10">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full ring-4 ring-[#B8860B]/20 mb-4" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-3xl font-light text-[#B8860B] mb-4">
                      {fullName?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="text-[18px] font-light text-white">{fullName || "İsimsiz Kullanıcı"}</h2>
                  <p className="text-[13px] text-white/40 mt-1">{email}</p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Email - Disabled */}
                  <div>
                    <label className="block text-[12px] font-light text-white/50 mb-2">E-posta</label>
                    <input type="email" value={email || ""} disabled
                      className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white/40 text-[14px] cursor-not-allowed" />
                    <p className="mt-1.5 text-[11px] text-white/30">Google hesabınızla bağlantılı</p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-[12px] font-light text-white/50 mb-2">Ad Soyad</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Adınız Soyadınız"
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-[14px] placeholder:text-white/25 focus:outline-none focus:border-[#B8860B]/40 transition-all" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[12px] font-light text-white/50 mb-2">Telefon Numarası</label>
                    <input type="tel" value={formatPhone(phone)} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="05XX XXX XX XX"
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-[14px] placeholder:text-white/25 focus:outline-none focus:border-[#B8860B]/40 transition-all" />
                    <p className="mt-1.5 text-[11px] text-white/30">İlan verirken bu numara kullanılacaktır</p>
                  </div>

                  {/* Error */}
                  {error && <p className="text-[12px] text-red-400">{error}</p>}

                  {/* Save Button */}
                  <motion.button onClick={handleSave} disabled={saving}
                    className="w-full py-3.5 bg-[#B8860B] hover:bg-[#DAA520] disabled:opacity-50 text-black text-[14px] font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.98 }}>
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      "Değişiklikleri Kaydet"
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Type Card */}
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className={`absolute -inset-[1px] bg-gradient-to-b ${isKurumsal ? "from-[#B8860B]/20" : "from-white/5"} via-transparent to-transparent rounded-2xl blur-sm`} />
              
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isKurumsal ? "bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/10 border border-[#B8860B]/30" : "bg-white/[0.04] border border-white/[0.08]"}`}>
                      {isKurumsal ? <span className="text-xl">🏢</span> : <span className="text-xl">👤</span>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-light text-white">
                          {isKurumsal ? "Kurumsal Hesap" : "Bireysel Hesap"}
                        </h3>
                        {isKurumsal && (
                          <span className="px-2 py-0.5 text-[9px] bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-black rounded-full font-bold">PRO</span>
                        )}
                      </div>
                      <p className="text-[12px] text-white/40 mt-0.5">
                        {isKurumsal 
                          ? profile?.company_name || "Galeri sayfası ve istatistikler aktif" 
                          : "Kendi aracınızı satın"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowSwitchModal(true)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all ${
                      isKurumsal 
                        ? "bg-white/[0.04] hover:bg-white/[0.08] text-white/60 border border-white/[0.08]" 
                        : "bg-[#B8860B]/10 hover:bg-[#B8860B]/20 text-[#DAA520] border border-[#B8860B]/30"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    {isKurumsal ? "Bireysele Dön" : "Kurumsala Yükselt"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
