"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { signOut } from "@/actions/auth";

interface UserMenuProps {
  user: {
    email?: string;
    user_metadata?: {
      avatar_url?: string;
      full_name?: string;
    };
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoggingOut(false);
    setLogoutSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await signOut();
  };

  const menuItems = [
    { label: "İlan Ver", href: "/ilan-ver", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ), highlight: true },
    { label: "Satış Paneli", href: "/profil", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { label: "Profil Ayarları", href: "/profil/ayarlar", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  const LogoutModal = () => (
    <AnimatePresence>
      {showLogoutConfirm && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: logoutSuccess ? 0 : 1 }}
          transition={{ duration: 0.8, delay: logoutSuccess ? 1.2 : 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoggingOut && !logoutSuccess && setShowLogoutConfirm(false)}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-xs mx-6"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Card glow */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 via-transparent to-transparent rounded-2xl blur-sm" />
            
            <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.08] p-8 text-center">
              <AnimatePresence mode="wait">
                {!isLoggingOut && !logoutSuccess && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-white/[0.04] flex items-center justify-center">
                      <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <h3 className="text-[15px] text-white font-light mb-2">
                      Çıkış yapmak istiyor musunuz?
                    </h3>
                    <p className="text-[12px] text-white/40 mb-6">
                      Hesabınızdan güvenli çıkış yapılacak.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 py-2.5 text-[13px] text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-lg transition-colors"
                      >
                        Vazgeç
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex-1 py-2.5 text-[13px] text-black bg-[#B8860B] hover:bg-[#DAA520] rounded-lg transition-colors font-medium"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </motion.div>
                )}

                {isLoggingOut && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-4"
                  >
                    <motion.div
                      className="w-10 h-10 mx-auto mb-5 border border-[#B8860B]/30 border-t-[#B8860B] rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-[13px] text-white/60 font-light">
                      Çıkış yapılıyor...
                    </p>
                  </motion.div>
                )}

                {logoutSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-4"
                  >
                    <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                      <motion.svg
                        className="w-7 h-7 text-[#B8860B]"
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
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </motion.svg>
                    </div>
                    <motion.p 
                      className="text-[15px] text-white font-light"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      Görüşmek üzere!
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-1.5 focus:outline-none group"
        >
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="w-7 h-7 rounded-full ring-2 ring-transparent group-hover:ring-[#B8860B]/30 transition-all"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/15 flex items-center justify-center text-[11px] text-white transition-colors">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Dropdown indicator */}
          <motion.svg 
            className="w-3 h-3 text-white/30 group-hover:text-white/50 transition-colors"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 mt-3 w-52 origin-top-right"
            >
              <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/20 via-transparent to-transparent rounded-xl blur-sm" />
              
              <div className="relative bg-[#0a0a0a] rounded-xl border border-white/[0.08] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-[13px] text-white font-light truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-[11px] text-white/40 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                <div className="py-2">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      onClick={() => {
                        setIsOpen(false);
                        router.push(item.href);
                      }}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors ${
                        item.highlight 
                          ? "text-[#B8860B] hover:text-[#DAA520] hover:bg-[#B8860B]/[0.06]" 
                          : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className={item.highlight ? "text-[#B8860B]/70" : "text-white/40"}>{item.icon}</span>
                      <span className="text-[13px] font-light">{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="border-t border-white/[0.06] py-2">
                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-[13px] font-light">Çıkış Yap</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Portal modal to body */}
      {mounted && createPortal(<LogoutModal />, document.body)}
    </>
  );
}
