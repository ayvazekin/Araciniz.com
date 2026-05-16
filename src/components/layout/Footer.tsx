import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-baseline">
            <span className="text-[14px] font-extralight text-white/60">Aracınız</span>
            <span className="text-[8px] font-extralight text-[#B8860B]/60 ml-[1px]">.com</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-[12px]">
            <Link href="/legal/kullanim-kosullari" className="text-white/30 hover:text-white/60 transition-colors">
              Kullanım Koşulları
            </Link>
            <Link href="/legal/kvkk" className="text-white/30 hover:text-white/60 transition-colors">
              KVKK
            </Link>
            <Link href="/legal/gizlilik" className="text-white/30 hover:text-white/60 transition-colors">
              Gizlilik Politikası
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-white/20 text-[11px]">
            © {new Date().getFullYear()} Aracınız.com
          </p>
        </div>
      </div>
    </footer>
  );
}
