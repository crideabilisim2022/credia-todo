"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ user, isAdmin }) {
  const pathname = usePathname();

  if (!user) return null;

  const menuItem = (href, label, icon) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`p-3 rounded-xl flex items-center gap-2 transition
        ${
          active
            ? "bg-blue-700 text-white"
            : "hover:bg-blue-800/40 text-blue-100"
        }`}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="w-72 h-screen sticky top-0 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col justify-between border-r border-blue-800">

      {/* TOP */}
      <div className="p-5">

        {/* LOGO */}
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-wide">
            CREDIA SYSTEMS
          </h1>
          <p className="text-xs text-blue-300">
            Bilişim & Yazılım Çözümleri
          </p>
        </div>

        {/* USER */}
        <div className="bg-blue-900/40 border border-blue-700 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold break-all">
            {user.email}
          </p>

          <span
            className={`text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block ${
              isAdmin
                ? "bg-green-500/20 text-green-300"
                : "bg-gray-500/20 text-gray-300"
            }`}
          >
            {isAdmin ? "ADMIN" : "KULLANICI"}
          </span>
        </div>

        {/* MENU */}
        <div className="space-y-2">

          <div className="text-xs text-blue-400 uppercase mb-2">
            Menü
          </div>

          {menuItem("/", "Görevler", "📋")}

          {menuItem("/dashboard", "Kontrol Paneli", "📊")}

          {menuItem("/archive", "Arşiv", "📦")}

          {menuItem("/companies", "Firmalar", "🏢")}

          {isAdmin && menuItem("/users", "Kullanıcılar", "👥")}

          {menuItem("/settings", "Ayarlar", "⚙️")}

        </div>
      </div>

      {/* BOTTOM */}
      <div className="p-5 border-t border-blue-800">

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="w-full bg-red-500 hover:bg-red-600 transition py-2 rounded-lg text-sm font-medium shadow-md"
        >
          🚪 Çıkış Yap
        </button>

        <p className="text-[10px] text-blue-400 mt-3 text-center">
          Credia Görev Sistemi v1.2
        </p>

      </div>

    </div>
  );
}