import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Aracınız.com | Premium Araç Deneyimi",
  description: "Hayalinizdeki araca bir adım uzaktasınız",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased bg-black`}>
        {/* Dev Badge */}
        <div className="fixed top-4 right-4 z-[9999] pointer-events-none select-none">
          <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            {/* Pulse dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="text-[11px] font-light tracking-[0.2em] text-white/50 uppercase">
              Geliştirme Aşamasında
            </span>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
