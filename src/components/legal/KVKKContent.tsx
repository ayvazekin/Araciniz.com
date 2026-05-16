"use client";

import { motion } from "framer-motion";

export default function KVKKContent() {
  return (
    <main className="flex-1 pt-24 pb-16 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-[0.06]"
          style={{ background: "radial-gradient(circle, rgba(184,134,11,1) 0%, transparent 60%)", filter: "blur(100px)" }} />
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
          <h1 className="text-[32px] font-extralight text-white mb-2">KVKK Aydınlatma Metni</h1>
          <p className="text-[14px] text-white/40 mb-12">6698 Sayılı KVKK Kapsamında Aydınlatma Metni</p>
        </motion.div>

        <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Section title="Veri Sorumlusu">
            Aracınız.com olarak, kişisel verilerinizin güvenliği hususunda azami hassasiyet göstermekteyiz.
          </Section>
          <Section title="İşlenen Veriler">
            Google Auth üzerinden alınan ad-soyad, e-posta, profil fotoğrafı ve kullanıcı tarafından sağlanan telefon numarası ile araç bilgileri.
          </Section>
          <Section title="İşleme Amacı">
            İlanların yayınlanması, alıcı ve satıcı arasındaki iletişimin (WhatsApp/Telefon) sağlanması ve platform güvenliğinin takibi.
          </Section>
          <Section title="Veri Aktarımı">
            Kişisel verileriniz, yasal zorunluluklar (savcılık, emniyet talebi) haricinde hiçbir üçüncü taraf kuruma veya reklam şirketine satılmaz/aktarılmaz.
          </Section>
          <Section title="Haklarınız">
            KVKK'nın 11. maddesi uyarınca; verilerinizin silinmesini isteme, işlenip işlenmediğini öğrenme ve düzeltme hakkına sahipsiniz. Taleplerinizi info@araciniz.com adresine iletebilirsiniz.
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
