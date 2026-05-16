"use client";

import { User } from "@supabase/supabase-js";

interface ProfileCardProps {
  user: User;
  stats: { active: number; sold: number; favorites: number };
}

export default function ProfileCard({ user, stats }: ProfileCardProps) {
  const avatarUrl = user.user_metadata?.avatar_url;
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0];
  const email = user.email;

  return (
    <div className="border border-amber-500/10 rounded-2xl p-8 mb-8">
      <div className="flex items-center gap-8">
        {/* Avatar */}
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover border-2 border-amber-500/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center text-3xl font-bold text-black">
              {fullName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-black" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="font-serif text-3xl font-bold text-white">{fullName}</h2>
          <p className="text-white/40 mt-1">{email}</p>
          <p className="text-sm text-white/20 mt-2">
            Üyelik: {new Date(user.created_at).toLocaleDateString("tr-TR", {
              month: "long",
              year: "numeric"
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-amber-500/10">
        <div className="text-center">
          <p className="text-3xl font-bold text-gradient">{stats.active}</p>
          <p className="text-sm text-white/40 mt-1">Aktif İlan</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-emerald-400">{stats.sold}</p>
          <p className="text-sm text-white/40 mt-1">Satılan</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-white/60">{stats.favorites}</p>
          <p className="text-sm text-white/40 mt-1">Favori</p>
        </div>
      </div>
    </div>
  );
}
