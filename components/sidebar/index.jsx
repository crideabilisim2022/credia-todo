"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Sidebar({ user, isAdmin }) {
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="w-72 h-screen sticky top-0 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col justify-between border-r border-blue-800">

      {/* TOP */}
      <div className="p-5">

        {/* LOGO / BRAND */}
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-wide">
            CREDIA SYSTEMS
          </h1>
          <p className="text-xs text-blue-300">
            Bilişim & Yazılım Çözümleri
          </p>
        </div>

        {/* USER CARD */}
        <div className="bg-blue-900/40 border border-blue-700 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold break-all">
            {user.email}
          </p>

          <div className="flex items-center justify-between mt-2">
            {/* <span className="text-xs text-blue-300">
              {isAdmin ? "Admin" : "Kullanıcı"}
            </span> */}

            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              isAdmin
                ? "bg-green-500/20 text-green-300"
                : "bg-gray-500/20 text-gray-300"
            }`}>
              {isAdmin ? "ADMIN" : "KULLANICI"}
            </span>
          </div>
        </div>

        {/* MENU */}
        <div className="space-y-2">

          <div className="text-xs text-blue-400 uppercase mb-2">
            Menü
          </div>

          <div
            onClick={() => router.push("/")}
            className="p-3 rounded-xl bg-blue-800/40 hover:bg-blue-700 transition cursor-pointer"
          >
            📋 Görevler
          </div>

          <div className="p-3 rounded-xl hover:bg-blue-800/40 transition cursor-pointer">
            📊 Kontrol Paneli
          </div>

          <div
            onClick={() => router.push("/archive")}
            className="p-3 rounded-xl hover:bg-blue-800/40 transition cursor-pointer"
          >
            📦 Arşiv
          </div>

          {isAdmin && (
            <div className="p-3 rounded-xl hover:bg-blue-800/40 transition cursor-pointer">
              👥 Kullanıcılar
            </div>
          )}

          <div className="p-3 rounded-xl hover:bg-blue-800/40 transition cursor-pointer">
            ⚙️ Ayarlar
          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="p-5 border-t border-blue-800">

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="w-full bg-red-500 hover:bg-red-600 transition py-2 rounded-lg text-sm font-medium shadow-md"
        >
          🚪 Çıkış Yap
        </button>

        <p className="text-[10px] text-blue-400 mt-3 text-center">
          Credia Görev Sistemi v1.0
        </p>

      </div>

    </div>
  );
}