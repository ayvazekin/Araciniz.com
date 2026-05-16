"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateCompanyProfile, uploadCompanyLogo } from "@/actions/profile";

interface Profile {
  id: string;
  company_name?: string;
  company_slug?: string;
  company_description?: string;
  company_logo?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  tax_no?: string;
}

interface City {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
}

interface Props {
  profile: Profile;
  cities: City[];
  districts: District[];
}

export default function MagazaAyarlariContent({ profile, cities, districts: initialDistricts }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [companyLogo, setCompanyLogo] = useState(profile.company_logo || "");
  const [companyName, setCompanyName] = useState(profile.company_name || "");
  const [companyDescription, setCompanyDescription] = useState(profile.company_description || "");
  const [taxNo, setTaxNo] = useState(profile.tax_no || "");
  const [selectedCity, setSelectedCity] = useState(profile.city || "");
  const [selectedDistrict, setSelectedDistrict] = useState(profile.district || "");
  const [address, setAddress] = useState(profile.address || "");

  // UI states
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [taxNoError, setTaxNoError] = useState("");

  // Tax No validation - sadece rakam ve 10 hane
  const handleTaxNoChange = (value: string) => {
    // Sadece rakamları al
    const digitsOnly = value.replace(/\D/g, "");
    setTaxNo(digitsOnly);
    
    // Validasyon
    if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
      setTaxNoError("Vergi numarası tam 10 haneli olmalıdır");
    } else {
      setTaxNoError("");
    }
  };

  const handleCityChange = async (cityName: string) => {
    setSelectedCity(cityName);
    setSelectedDistrict("");
    
    if (!cityName) {
      setDistricts([]);
      return;
    }

    const selectedCityObj = cities.find(c => c.name === cityName);
    if (!selectedCityObj) {
      setDistricts([]);
      return;
    }

    setLoadingDistricts(true);
    try {
      const { getDistrictsByCity } = await import("@/actions/listings");
      const result = await getDistrictsByCity(selectedCityObj.id);
      setDistricts(result || []);
    } catch (error) {
      console.error("Error loading districts:", error);
      setDistricts([]);
    }
    setLoadingDistricts(false);
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo dosyası 2MB'dan küçük olmalıdır.");
      return;
    }

    setUploadingLogo(true);
    
    const formData = new FormData();
    formData.append("file", file);
    
    const result = await uploadCompanyLogo(formData);
    
    if (result.url) {
      setCompanyLogo(result.url);
    } else if (result.error) {
      alert(result.error);
    }
    
    setUploadingLogo(false);
  };

  const handleSave = async () => {
    // Tax No validasyonu
    if (taxNo && taxNo.length !== 10) {
      setTaxNoError("Vergi numarası tam 10 haneli olmalıdır");
      return;
    }
    
    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = await updateCompanyProfile({
      company_name: companyName,
      company_description: companyDescription,
      company_logo: companyLogo,
      tax_no: taxNo,
      city: selectedCity,
      district: selectedDistrict,
      address,
    });
    
    setIsSaving(false);
    
    if (!result.error) {
      setShowSuccess(true);
      setFadeOut(false);
      setTimeout(() => setFadeOut(true), 1500);
      setTimeout(() => {
        setShowSuccess(false);
        setFadeOut(false);
      }, 2500);
    }
  };

  return (
    <>
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
            <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-[#B8860B]/10 flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <motion.svg className="w-10 h-10 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              
              <motion.p
                className="text-[17px] font-light text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Mağaza Bilgileri Güncellendi
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-24 pb-20 relative">
        {/* Background Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-[0.08]" style={{ background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)", filter: "blur(100px)" }} />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-[0.08]" style={{ background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)", filter: "blur(100px)" }} />
        </div>

        <div className="max-w-2xl mx-auto px-6 relative z-10">
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
              <p className="text-[11px] text-[#B8860B] tracking-[0.3em] uppercase">Kurumsal</p>
            </div>
            <h1 className="text-[28px] font-extralight text-white">Mağaza Ayarları</h1>
          </motion.div>

          {/* Logo Upload Card */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 via-transparent to-transparent rounded-2xl blur-sm" />
              
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-8">
                <h3 className="text-[15px] font-light text-white mb-6">Galeri Logosu</h3>
                
                <div className="flex items-center gap-6">
                  {/* Logo Preview */}
                  <div 
                    onClick={handleLogoClick}
                    className="relative w-24 h-24 rounded-xl overflow-hidden cursor-pointer group"
                  >
                    {companyLogo ? (
                      <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/10 border-2 border-dashed border-[#B8860B]/30 flex items-center justify-center">
                        <span className="text-3xl">🏢</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {uploadingLogo ? (
                        <motion.div
                          className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  
                  <div>
                    <p className="text-[13px] text-white/60 mb-1">Logonuzu yükleyin</p>
                    <p className="text-[11px] text-white/30">PNG, JPG (max 2MB)</p>
                    <button
                      onClick={handleLogoClick}
                      disabled={uploadingLogo}
                      className="mt-3 px-4 py-2 text-[12px] bg-white/[0.04] hover:bg-white/[0.08] text-white/60 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {uploadingLogo ? "Yükleniyor..." : "Resim Seç"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 via-transparent to-transparent rounded-2xl blur-sm" />
              
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-8">
                <h3 className="text-[15px] font-light text-white mb-6">Mağaza Bilgileri</h3>
                
                <div className="space-y-5">
                  {/* Galeri Adı */}
                  <div>
                    <label className="block text-[12px] text-white/40 mb-2 font-light">Galeri Adı</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Örn: Vatan Motors"
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#B8860B]/50 transition-colors"
                    />
                  </div>

                  {/* Açıklama */}
                  <div>
                    <label className="block text-[12px] text-white/40 mb-2 font-light">Hakkımızda</label>
                    <textarea
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      rows={4}
                      placeholder="Galeriniz hakkında kısa bir açıklama..."
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#B8860B]/50 transition-colors resize-none"
                    />
                  </div>

                  {/* Vergi No */}
                  <div>
                    <label className="block text-[12px] text-white/40 mb-2 font-light">Vergi No</label>
                    <input
                      type="text"
                      value={taxNo}
                      onChange={(e) => handleTaxNoChange(e.target.value)}
                      placeholder="10 haneli vergi numaranız"
                      maxLength={10}
                      className={`w-full px-4 py-3.5 bg-white/[0.03] border rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none transition-colors ${
                        taxNoError ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-[#B8860B]/50"
                      }`}
                    />
                    {taxNoError && (
                      <p className="mt-1.5 text-[11px] text-red-400">{taxNoError}</p>
                    )}
                  </div>

                  {/* İl - İlçe */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] text-white/40 mb-2 font-light">İl</label>
                      <select
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[14px] text-white focus:outline-none focus:border-[#B8860B]/50 appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "20px" }}
                      >
                        <option value="" className="bg-[#0a0a0a]">İl Seçin</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.name} className="bg-[#0a0a0a]">{city.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] text-white/40 mb-2 font-light">İlçe</label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={!selectedCity || loadingDistricts}
                        className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[14px] text-white focus:outline-none focus:border-[#B8860B]/50 appearance-none cursor-pointer disabled:opacity-50"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "20px" }}
                      >
                        <option value="" className="bg-[#0a0a0a]">{loadingDistricts ? "Yükleniyor..." : "İlçe Seçin"}</option>
                        {districts.map((district) => (
                          <option key={district.id} value={district.name} className="bg-[#0a0a0a]">{district.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Açık Adres */}
                  <div>
                    <label className="block text-[12px] text-white/40 mb-2 font-light">Açık Adres</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      placeholder="Mahalle, Sokak, Kapı No..."
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#B8860B]/50 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <motion.button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full mt-8 py-4 bg-gradient-to-r from-[#B8860B] to-[#DAA520] hover:from-[#DAA520] hover:to-[#B8860B] text-black text-[14px] font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  {isSaving ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    "Değişiklikleri Kaydet"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
