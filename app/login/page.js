"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 GİRİŞ YAPMIŞ KULLANICIYI ANA SAYFAYA AT
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        router.replace("/");
      }
    };

    checkUser();
  }, [router]);

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) router.push("/");
    else alert(error.message);
  };

  const register = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) alert("Kayıt başarılı, giriş yapabilirsiniz");
    else alert(error.message);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >

        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Credia Görev Sistemi
        </h1>

        <p className="text-gray-300 text-center text-sm mb-6">
          Kurumsal görev yönetim paneli
        </p>

        <div className="space-y-3">

          <input
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-blue-400 transition"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-blue-400 transition"
            placeholder="Şifre"
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        <div className="mt-6 space-y-3">

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={login}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
          >
            Giriş Yap
          </motion.button>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © Credia Bilişim - Görev Yönetim Sistemi
        </p>

      </motion.div>

    </div>
  );
}