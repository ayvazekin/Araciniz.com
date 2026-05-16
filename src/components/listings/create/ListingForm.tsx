"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { listingSchema, ListingFormData } from "@/lib/validations/listing";
import { createListing } from "@/actions/listings";
import { getUserPhone, saveUserPhone } from "@/actions/profile";
import BrandSelect from "./BrandSelect";
import SeriesSelect from "./SeriesSelect";
import TrimSelect from "./TrimSelect";
import CitySelect from "./CitySelect";
import DistrictSelect from "./DistrictSelect";
import ImageUpload from "./ImageUpload";
import Toast from "@/components/ui/Toast";

const FUEL_TYPES = ["Benzin", "Dizel", "LPG", "Elektrik", "Hibrit"];
const TRANSMISSIONS = ["Manuel", "Otomatik", "Yarı Otomatik"];
const DAMAGE_OPTIONS = ["Hatasız", "Boyalı", "Değişen Parça Var", "Ağır Hasarlı"];
const YEARS = Array.from({ length: 37 }, (_, i) => 2026 - i);

const inputClass = "w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-[14px] placeholder:text-white/25 focus:outline-none focus:border-[#B8860B]/40 focus:bg-white/[0.05] transition-all";
const labelClass = "block text-[12px] font-light text-white/50 mb-2";
const selectClass = "w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-[14px] focus:outline-none focus:border-[#B8860B]/40 transition-all appearance-none cursor-pointer";

const STEPS = [
  { id: 1, title: "Temel Bilgiler", subtitle: "İlan başlığı ve iletişim" },
  { id: 2, title: "Araç Bilgileri", subtitle: "Marka, model ve özellikler" },
  { id: 3, title: "Konum & Detaylar", subtitle: "Şehir ve hasar durumu" },
  { id: 4, title: "Fotoğraflar", subtitle: "Araç görselleri" },
];

interface ListingFormProps {
  onDirtyChange?: (isDirty: boolean) => void;
}

export default function ListingForm({ onDirtyChange }: ListingFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [autoFilledFuel, setAutoFilledFuel] = useState(false);
  const [autoFilledGear, setAutoFilledGear] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [checkAnimating, setCheckAnimating] = useState(false);
  const [phoneFromProfile, setPhoneFromProfile] = useState(false);

  const { register, control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: { images: [], listing_type: "sale", is_exchangeable: false, tramer_amount: 0 },
  });

  const selectedBrand = watch("brand");
  const selectedSeries = watch("series");
  const damageStatus = watch("damage_status");
  const watchedImages = watch("images");
  const watchedTitle = watch("title");
  const watchedPhone = watch("phone");
  const watchedPrice = watch("price");
  const watchedMileage = watch("mileage");
  const watchedCity = watch("city");
  const watchedDescription = watch("description");

  // Form dirty state'ini parent'a bildir - sadece gerçek kullanıcı girişi varsa
  useEffect(() => {
    const hasUserInput = Boolean(
      (watchedTitle && watchedTitle.length > 0) ||
      (watchedPhone && watchedPhone.length > 0 && !phoneFromProfile) || // Profilden gelen telefon sayılmasın
      (watchedImages && watchedImages.length > 0) ||
      (selectedBrand && selectedBrand.length > 0) ||
      (watchedPrice && watchedPrice > 0) ||
      (watchedMileage && watchedMileage > 0) ||
      (watchedCity && watchedCity.length > 0) ||
      (watchedDescription && watchedDescription.length > 0)
    );
    
    onDirtyChange?.(hasUserInput);
  }, [watchedTitle, watchedPhone, watchedImages, selectedBrand, watchedPrice, watchedMileage, watchedCity, watchedDescription, phoneFromProfile, onDirtyChange]);

  // Fetch phone from profile on mount
  useEffect(() => {
    const fetchPhone = async () => {
      const { phone } = await getUserPhone();
      if (phone) {
        setValue("phone", phone);
        setPhoneFromProfile(true);
      }
    };
    fetchPhone();
  }, [setValue]);

  useEffect(() => {
    if (damageStatus === "Hatasız") setValue("tramer_amount", 0);
  }, [damageStatus, setValue]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 9)} ${numbers.slice(9, 11)}`;
  };

  const formatNumber = (value: number | string) => {
    const num = typeof value === "string" ? value.replace(/\D/g, "") : String(value || "");
    if (!num) return "";
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value: string) => {
    const num = value.replace(/\./g, "").replace(/\D/g, "");
    return num ? parseInt(num, 10) : 0;
  };

  const handleTrimSelect = (model: string, autoFillData: { fuel_type: string | null; gear_type: string | null } | null) => {
    setValue("model", model);
    if (autoFillData) {
      if (autoFillData.fuel_type) { setValue("fuel_type", autoFillData.fuel_type); setAutoFilledFuel(true); }
      else { setValue("fuel_type", ""); setAutoFilledFuel(false); }
      if (autoFillData.gear_type) { setValue("transmission", autoFillData.gear_type); setAutoFilledGear(true); }
      else { setValue("transmission", ""); setAutoFilledGear(false); }
    }
  };

  const nextStep = async () => {
    let fields: (keyof ListingFormData)[] = [];
    if (currentStep === 1) fields = ["title", "phone", "listing_type"];
    else if (currentStep === 2) fields = ["brand", "series", "model", "fuel_type", "transmission", "year", "price", "mileage"];
    else if (currentStep === 3) fields = ["city", "district", "damage_status"];
    const isValid = await trigger(fields);
    if (isValid) setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleTermsToggle = () => {
    if (!termsAccepted) {
      setCheckAnimating(true);
      setTimeout(() => setCheckAnimating(false), 600);
    }
    setTermsAccepted(!termsAccepted);
    setTermsError(false);
  };

  const onSubmit = async (data: ListingFormData) => {
    if (!termsAccepted) { setTermsError(true); return; }
    setSubmitting(true);
    
    const phoneNumber = data.phone.replace(/\s/g, "");
    
    // Save phone to profile if it's new
    if (!phoneFromProfile && phoneNumber) {
      await saveUserPhone(phoneNumber);
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    const result = await createListing({ ...data, phone: phoneNumber });
    setSubmitting(false);
    if (result.error) { setToast({ message: result.error, type: "error" }); return; }
    setShowSuccess(true);
    setTimeout(() => router.push("/profil"), 2000);
  };

  if (showSuccess) {
    return (
      <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="flex flex-col items-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <motion.div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <motion.svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.4 }} />
            </motion.svg>
          </motion.div>
          <motion.p className="text-[18px] font-light text-white mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>İlanınız Yayınlandı</motion.p>
          <motion.p className="text-[13px] text-white/40" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>Satış panelinize yönlendiriliyorsunuz...</motion.p>
        </motion.div>
      </motion.div>
    );
  }

  if (submitting) {
    return (
      <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col items-center">
          <motion.div className="w-12 h-12 border-2 border-[#B8860B]/20 border-t-[#B8860B] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
          <p className="mt-6 text-[14px] text-white/50">İlanınız yayınlanıyor...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium transition-all ${currentStep >= step.id ? "bg-[#B8860B] text-black" : "bg-white/[0.05] text-white/30"}`}>
                {currentStep > step.id ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : step.id}
              </div>
              {index < STEPS.length - 1 && <div className={`w-12 md:w-20 h-[2px] mx-2 transition-all ${currentStep > step.id ? "bg-[#B8860B]" : "bg-white/[0.05]"}`} />}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-[15px] text-white font-light">{STEPS[currentStep - 1].title}</p>
          <p className="text-[12px] text-white/40 mt-1">{STEPS[currentStep - 1].subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div><label className={labelClass}>İlan Başlığı</label><input type="text" {...register("title")} placeholder="Örn: Temiz, Bakımlı, Garaj Arabası" className={inputClass} />{errors.title && <p className="mt-1.5 text-[11px] text-red-400">{errors.title.message}</p>}</div>
              <div><label className={labelClass}>İlan Tipi</label><div className="flex gap-3"><label className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border cursor-pointer transition-all ${watch("listing_type") === "sale" ? "border-[#B8860B]/40 bg-[#B8860B]/10 text-[#B8860B]" : "border-white/[0.08] text-white/40 hover:border-white/[0.15]"}`}><input type="radio" value="sale" {...register("listing_type")} className="hidden" /><span className="text-[13px]">Satılık</span></label><label className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border cursor-pointer transition-all ${watch("listing_type") === "rent" ? "border-[#B8860B]/40 bg-[#B8860B]/10 text-[#B8860B]" : "border-white/[0.08] text-white/40 hover:border-white/[0.15]"}`}><input type="radio" value="rent" {...register("listing_type")} className="hidden" /><span className="text-[13px]">Kiralık</span></label></div></div>
              <div>
                <label className={labelClass}>Telefon Numarası {phoneFromProfile && <span className="text-[10px] text-emerald-400 ml-1">• Profilden</span>}</label>
                <Controller name="phone" control={control} render={({ field }) => (
                  <input type="tel" value={formatPhone(field.value || "")} onChange={(e) => { field.onChange(e.target.value.replace(/\D/g, "").slice(0, 11)); setPhoneFromProfile(false); }} placeholder="05XX XXX XX XX" className={inputClass} />
                )} />
                {phoneFromProfile && <p className="mt-1.5 text-[11px] text-white/30">Profilinizdeki numara kullanılacaktır. <Link href="/profil/ayarlar" className="text-[#B8860B] hover:underline">Değiştir</Link></p>}
                {errors.phone && <p className="mt-1.5 text-[11px] text-red-400">{errors.phone.message}</p>}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Controller name="brand" control={control} render={({ field }) => (<BrandSelect value={field.value || ""} onChange={(val) => { field.onChange(val); setValue("series", ""); setValue("model", ""); setValue("fuel_type", ""); setValue("transmission", ""); setAutoFilledFuel(false); setAutoFilledGear(false); }} error={errors.brand?.message} />)} />
                <Controller name="series" control={control} render={({ field }) => (<SeriesSelect brand={selectedBrand} value={field.value || ""} onChange={(val) => { field.onChange(val); setValue("model", ""); setValue("fuel_type", ""); setValue("transmission", ""); setAutoFilledFuel(false); setAutoFilledGear(false); }} error={errors.series?.message} />)} />
                <Controller name="model" control={control} render={({ field }) => (<TrimSelect brand={selectedBrand} series={selectedSeries} value={field.value || ""} onChange={handleTrimSelect} error={errors.model?.message} />)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Yakıt Tipi{autoFilledFuel && <span className="ml-2 text-[10px] text-emerald-400">• Otomatik</span>}</label><div className="relative"><select {...register("fuel_type")} className={selectClass}><option value="">Seçiniz</option>{FUEL_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}</select><svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg></div>{errors.fuel_type && <p className="mt-1.5 text-[11px] text-red-400">{errors.fuel_type.message}</p>}</div>
                <div><label className={labelClass}>Vites{autoFilledGear && <span className="ml-2 text-[10px] text-emerald-400">• Otomatik</span>}</label><div className="relative"><select {...register("transmission")} className={selectClass}><option value="">Seçiniz</option>{TRANSMISSIONS.map((type) => (<option key={type} value={type}>{type}</option>))}</select><svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg></div>{errors.transmission && <p className="mt-1.5 text-[11px] text-red-400">{errors.transmission.message}</p>}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelClass}>Yıl</label><div className="relative"><select {...register("year", { valueAsNumber: true })} className={selectClass}><option value="">Seçiniz</option>{YEARS.map((year) => (<option key={year} value={year}>{year}</option>))}</select><svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg></div>{errors.year && <p className="mt-1.5 text-[11px] text-red-400">{errors.year.message}</p>}</div>
                <div><label className={labelClass}>Fiyat (₺)</label><Controller name="price" control={control} render={({ field }) => (<input type="text" inputMode="numeric" value={formatNumber(field.value || "")} onChange={(e) => field.onChange(parseNumber(e.target.value))} placeholder="1.500.000" className={inputClass} />)} />{errors.price && <p className="mt-1.5 text-[11px] text-red-400">{errors.price.message}</p>}</div>
                <div><label className={labelClass}>Kilometre</label><Controller name="mileage" control={control} render={({ field }) => (<input type="text" inputMode="numeric" value={formatNumber(field.value || "")} onChange={(e) => field.onChange(parseNumber(e.target.value))} placeholder="50.000" className={inputClass} />)} />{errors.mileage && <p className="mt-1.5 text-[11px] text-red-400">{errors.mileage.message}</p>}</div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Controller name="city" control={control} render={({ field }) => (<CitySelect value={field.value || ""} onChange={(value, cityId) => { field.onChange(value); setSelectedCityId(cityId); setValue("district", ""); }} error={errors.city?.message} />)} />
                <Controller name="district" control={control} render={({ field }) => (<DistrictSelect cityId={selectedCityId} value={field.value || ""} onChange={field.onChange} error={errors.district?.message} />)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Hasar Durumu</label><div className="relative"><select {...register("damage_status")} className={selectClass}><option value="">Seçiniz</option>{DAMAGE_OPTIONS.map((option) => (<option key={option} value={option}>{option}</option>))}</select><svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg></div>{errors.damage_status && <p className="mt-1.5 text-[11px] text-red-400">{errors.damage_status.message}</p>}</div>
                <div><label className={labelClass}>Tramer Kaydı (₺){damageStatus === "Hatasız" && <span className="ml-2 text-[10px] text-emerald-400">• Otomatik 0</span>}</label><Controller name="tramer_amount" control={control} render={({ field }) => (<input type="text" inputMode="numeric" value={damageStatus === "Hatasız" ? "0" : formatNumber(field.value || "")} onChange={(e) => field.onChange(parseNumber(e.target.value))} placeholder="0" disabled={damageStatus === "Hatasız"} className={`${inputClass} disabled:opacity-40`} />)} /></div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer group"><div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${watch("is_exchangeable") ? "bg-[#B8860B] border-[#B8860B]" : "border-white/[0.15] group-hover:border-white/[0.25]"}`}>{watch("is_exchangeable") && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}</div><input type="checkbox" {...register("is_exchangeable")} className="hidden" /><span className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors">Takasa Uygun</span></label>
              <div><label className={labelClass}>Açıklama (Opsiyonel)</label><textarea {...register("description")} rows={3} placeholder="Aracınız hakkında detaylı bilgi verin..." className={`${inputClass} resize-none`} /></div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Controller name="images" control={control} render={({ field }) => (<ImageUpload images={field.value} onChange={field.onChange} error={errors.images?.message} />)} />
              
              {/* Terms Checkbox with Animation */}
              <div className="mt-8 pt-6 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={handleTermsToggle}
                  className={`group flex items-start gap-4 w-full text-left transition-all ${termsError ? "animate-shake" : ""}`}
                >
                  {/* Animated Checkbox */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    <motion.div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        termsAccepted 
                          ? "bg-[#B8860B] border-[#B8860B]" 
                          : termsError 
                            ? "border-red-500/50 bg-red-500/5" 
                            : "border-white/20 group-hover:border-white/40"
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence>
                        {termsAccepted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <motion.svg 
                              className="w-4 h-4 text-black" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <motion.path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              />
                            </motion.svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    
                    {/* Particle Effect */}
                    <AnimatePresence>
                      {checkAnimating && (
                        <>
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full bg-[#B8860B]"
                              initial={{ 
                                x: 12, 
                                y: 12, 
                                opacity: 1,
                                scale: 1
                              }}
                              animate={{ 
                                x: 12 + Math.cos(i * 45 * Math.PI / 180) * 20,
                                y: 12 + Math.sin(i * 45 * Math.PI / 180) * 20,
                                opacity: 0,
                                scale: 0
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Text */}
                  <span className={`text-[13px] leading-relaxed transition-colors ${termsError ? "text-red-400" : "text-white/50 group-hover:text-white/70"}`}>
                    <Link href="/legal/kullanim-kosullari" className="text-[#B8860B] hover:underline" onClick={(e) => e.stopPropagation()}>Kullanım Koşullarını</Link>
                    {" "}ve{" "}
                    <Link href="/legal/kvkk" className="text-[#B8860B] hover:underline" onClick={(e) => e.stopPropagation()}>KVKK Aydınlatma Metnini</Link>
                    {" "}okudum, onaylıyorum.
                  </span>
                </button>
                
                {termsError && (
                  <motion.p 
                    className="mt-2 ml-10 text-[11px] text-red-400"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Devam etmek için koşulları kabul etmelisiniz
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex gap-3 mt-10">
          {currentStep > 1 && <button type="button" onClick={prevStep} className="flex-1 py-3.5 bg-white/[0.05] hover:bg-white/[0.08] text-white/60 text-[13px] font-light rounded-xl transition-all">Geri</button>}
          {currentStep < 4 ? (
            <button type="button" onClick={nextStep} className="flex-1 py-3.5 bg-[#B8860B] hover:bg-[#DAA520] text-black text-[13px] font-medium rounded-xl transition-all">Devam Et</button>
          ) : (
            <button type="submit" className="flex-1 py-3.5 bg-[#B8860B] hover:bg-[#DAA520] text-black text-[13px] font-medium rounded-xl transition-all">İlanı Yayınla</button>
          )}
        </div>
      </form>
    </>
  );
}
