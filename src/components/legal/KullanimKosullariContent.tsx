"use client";

import { motion } from "framer-motion";

export default function KullanimKosullariContent() {
  return (
    <main className="flex-1 pt-24 pb-16 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-[0.06]"
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
          <h1 className="text-[32px] font-extralight text-white mb-2">Kullanım Koşulları</h1>
          <p className="text-[14px] text-white/40 mb-12">Aracınız.com Kullanım Sözleşmesi</p>
        </motion.div>

        <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Section title="Taraflar ve Amaç">
            İşbu sözleşme, Aracınız.com (bundan böyle "Platform" olarak anılacaktır) ile Platform'a üye olan veya ziyaret eden kullanıcı ("Kullanıcı") arasındaki kullanım şartlarını belirler. Aracınız.com, bir "Aracı Hizmet Sağlayıcı"dır.
          </Section>
          <Section title="Hizmetin Kapsamı">
            Platform, satıcıların araç ilanı yayınladığı, alıcıların ise bu ilanları incelediği bir pazaryeridir. Platform, ilanlardaki araçların mülkiyetine sahip değildir ve satış sürecinde taraf değildir.
          </Section>
          <Section title="Kullanıcı Yükümlülükleri">
            Kullanıcı, verdiği bilgilerin (telefon, araç detayları, hasar durumu) %100 doğru olduğunu taahhüt eder. Yanıltıcı ilan girişi yapan kullanıcıların hesapları süresiz askıya alınır ve doğacak hukuki sorumluluk tamamen Kullanıcı'ya aittir.
          </Section>
          <Section title="Sorumluluk Sınırı">
            Platform, ilanlarda yer alan araçların teknik durumundan, kaza geçmişinden veya satıcının beyanlarından sorumlu tutulamaz. "AI Analizi" özelliği bir tavsiye niteliğindedir, resmi bir ekspertiz raporu yerine geçmez.
          </Section>
          <Section title="Fikri Mülkiyet">
            Aracınız.com ismi, logosu, yazılım kodları ve tasarım dili Ayvek Teknoloji'ye aittir. İzinsiz kopyalanması durumunda yasal işlem başlatılır.
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
