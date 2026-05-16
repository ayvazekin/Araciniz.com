"use client";

import { motion } from "framer-motion";

export default function GizlilikContent() {
  return (
    <main className="flex-1 pt-24 pb-16 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, rgba(184,134,11,1) 0%, transparent 60%)", filter: "blur(100px)" }} />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={() => window.history.back()}
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-[#B8860B]/50" />
            <span className="text-[10px] text-[#B8860B] tracking-[0.3em] uppercase">Legal</span>
          </div>
          <h1 className="text-[32px] font-extralight text-white mb-2">Gizlilik ve Çerez Politikası</h1>
          <p className="text-[14px] text-white/40 mb-12">Privacy & Cookies Policy</p>
        </motion.div>

        <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Section title="Veri Güvenliği">
            Aracınız.com, kullanıcı verilerini en yüksek endüstri standartlarında (Supabase & Google Cloud Encryption) şifreleyerek saklar.
          </Section>
          <Section title="Giriş Yöntemi">
            Google login sistemi kullanılarak şifreleriniz bizim tarafımızda tutulmaz, doğrudan Google altyapısı üzerinden doğrulanır.
          </Section>
          <Section title="Çerezler (Cookies)">
            Platform, sadece kullanıcı deneyimini iyileştirmek, oturum yönetimini sağlamak ve ilan filtrelerini hatırlamak amacıyla sınırlı sayıda çerez kullanır.
          </Section>
          <Section title="Üçüncü Taraf Servisler">
            Sitemizde kullanılan analiz araçları (Google Analytics vb.) sadece anonim trafik verisi toplar.
          </Section>
          <Section title="Değişiklik Hakkı">
            Gizlilik politikamız, teknolojik gelişmelere uyum sağlamak adına her zaman güncellenebilir.
          </Section>
        </motion.div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
      <h2 className="text-[15px] font-light text-white mb-3">{title}</h2>
      <p className="text-[14px] text-white/50 font-light leading-relaxed">{children}</p>
    </div>
  );
}
