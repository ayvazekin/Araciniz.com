import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="w-full px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-baseline">
          <span className="text-[17px] font-extralight text-white">
            Aracınız
          </span>
          <span className="text-[10px] font-extralight text-[#B8860B] ml-[1px]">.com</span>
        </Link>

        {/* Right Side */}
        {user ? (
          <div className="flex items-center gap-5">
            <UserMenu user={user} />
          </div>
        ) : (
          <Link
            href="/login"
            className="text-[13px] text-white/60 hover:text-white transition-colors"
          >
            Giriş Yap
          </Link>
        )}
      </div>
    </nav>
  );
}
