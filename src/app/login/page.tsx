"use client";

import { motion } from "framer-motion";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Gold Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Gold Glow */}
        <div 
          className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)",
            filter: "blur(100px)"
          }}
        />
        {/* Top Right Gold Glow */}
        <div 
          className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)",
            filter: "blur(100px)"
          }}
        />
        {/* Center subtle glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 50%)",
            filter: "blur(80px)"
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-sm mx-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Card glow effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 via-transparent to-transparent rounded-2xl blur-sm" />
        
        <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-10">
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-[32px] font-extralight text-white tracking-tight">
              Aracınız<span className="text-[20px] font-extralight text-[#B8860B]">.com</span>
            </h1>
            <p className="mt-3 text-white/40 text-[13px] font-light">
              Hesabınıza giriş yapın
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-white/20 text-[10px] tracking-widest uppercase">Devam Et</span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/10" />
          </motion.div>

          {/* Google Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GoogleLoginButton />
          </motion.div>

          {/* Terms */}
          <motion.p
            className="mt-8 text-center text-[11px] text-white/25 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Giriş yaparak{" "}
            <a href="#" className="text-[#B8860B]/70 hover:text-[#B8860B] transition-colors">
              Kullanım Şartları
            </a>
            'nı kabul etmiş olursunuz.
          </motion.p>
        </div>
      </motion.div>

      {/* Back to home link */}
      <motion.a
        href="/"
        className="absolute top-8 left-8 text-white/30 hover:text-white/60 transition-colors text-[13px] font-light flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Ana Sayfa
      </motion.a>
    </div>
  );
}
