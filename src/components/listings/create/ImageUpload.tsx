"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

const MIN_IMAGES = 5;
const MAX_IMAGES = 20;

export default function ImageUpload({ images, onChange, error }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const uploadFile = async (file: File) => {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("car-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("car-images")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleFiles = async (files: FileList) => {
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) return;

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    setUploading(true);
    try {
      const uploadPromises = filesToUpload.map(uploadFile);
      const urls = await Promise.all(uploadPromises);
      onChange([...images, ...urls]);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [images]);

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setCoverImage = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onChange(newImages);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-[12px] font-light text-white/50">Fotoğraflar</label>
        <span className={`text-[11px] ${images.length >= MIN_IMAGES ? "text-emerald-400" : "text-white/30"}`}>
          {images.length} / {MAX_IMAGES}
        </span>
      </div>
      
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive 
            ? "border-[#B8860B] bg-[#B8860B]/5" 
            : "border-white/[0.1] hover:border-white/[0.2]"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={images.length >= MAX_IMAGES}
        />
        <label htmlFor="image-upload" className={images.length >= MAX_IMAGES ? "cursor-not-allowed" : "cursor-pointer"}>
          <div className="text-white/40">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-[#B8860B]/20 border-t-[#B8860B] rounded-full animate-spin mb-3" />
                <p className="text-[13px]">Yükleniyor...</p>
              </div>
            ) : images.length >= MAX_IMAGES ? (
              <p className="text-[13px]">Maksimum fotoğraf sayısına ulaşıldı</p>
            ) : (
              <>
                <svg className="w-10 h-10 mx-auto mb-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[13px]">Fotoğrafları sürükleyin veya <span className="text-[#B8860B]">seçin</span></p>
                <p className="text-[11px] text-white/25 mt-1">En az {MIN_IMAGES}, en fazla {MAX_IMAGES} fotoğraf</p>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Hint for reordering */}
      {images.length > 1 && (
        <p className="text-[11px] text-white/25 mt-3 text-center">
          💡 Sürükleyerek sıralayın • İlk fotoğraf kapak olur • Tıklayarak kapak seçin
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
          {images.map((url, index) => (
            <motion.div
              key={url}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              draggable
              onDragStart={() => setDraggingIndex(index)}
              onDragEnd={() => setDraggingIndex(null)}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggingIndex !== null && draggingIndex !== index) {
                  moveImage(draggingIndex, index);
                  setDraggingIndex(index);
                }
              }}
              className={`relative group aspect-square cursor-grab active:cursor-grabbing ${
                draggingIndex === index ? "opacity-50 scale-95" : ""
              }`}
            >
              {/* Gold glow for cover */}
              {index === 0 && (
                <div className="absolute -inset-[2px] bg-gradient-to-b from-[#B8860B]/40 to-[#B8860B]/10 rounded-xl blur-sm" />
              )}
              
              <div className={`relative w-full h-full rounded-lg overflow-hidden border-2 transition-all ${
                index === 0 
                  ? "border-[#B8860B]" 
                  : "border-transparent hover:border-white/20"
              }`}>
                <img
                  src={url}
                  alt={`Resim ${index + 1}`}
                  className="w-full h-full object-cover"
                  onClick={() => setCoverImage(index)}
                />
                
                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center ${
                  index === 0 ? "" : "cursor-pointer"
                }`}>
                  {index !== 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); setCoverImage(index); }}
                    >
                      <div className="px-2 py-1 bg-[#B8860B] rounded text-[9px] font-medium text-black whitespace-nowrap">
                        Kapak Yap
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Drag handle indicator */}
                <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>

                {/* Cover badge */}
                {index === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-black text-[9px] font-semibold rounded flex items-center gap-1"
                  >
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Kapak
                  </motion.div>
                )}

                {/* Order number */}
                <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-[9px] text-white/50 font-medium">
                  {index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
