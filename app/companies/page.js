"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const router = useRouter();

  const fetchCompanies = async () => {
    const { data, error } = await supabase.from("companies").select("*");

    if (error) {
      toast.error("Firmalar yüklenemedi");
      return;
    }

    setCompanies(data || []);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addCompany = async () => {
    if (!name.trim()) {
      toast.error("Firma adı boş olamaz");
      return;
    }

    const { error } = await supabase.from("companies").insert([{ name }]);

    if (error) {
      toast.error("Firma eklenemedi");
      return;
    }

    toast.success("Firma eklendi");

    setName("");
    fetchCompanies();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white p-8"
    >
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wide">
          Firma Yönetimi
        </h1>
        <p className="text-sm text-blue-300">
          Tüm firmaları buradan yönetebilirsin
        </p>
      </div>

      {/* ADD */}
      <div className="bg-blue-900/40 border border-blue-800 rounded-2xl p-5 mb-6 backdrop-blur-md shadow-md">
        <h2 className="text-sm font-semibold text-blue-200 mb-3">
          Yeni Firma Ekle
        </h2>

        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Firma adı..."
            className="flex-1 bg-blue-950/40 border border-blue-700 text-white placeholder-blue-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCompany}
            className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-sm font-medium shadow-md"
          >
            Ekle
          </motion.button>
        </div>
      </div>

      {/* EMPTY */}
      {companies.length === 0 && (
        <div className="text-center text-blue-300 mt-10">
          Henüz firma eklenmemiş
        </div>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {companies.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ y: -5, scale: 1.01 }}
              onClick={() => router.push(`/companies/${c.id}`)}
              className="cursor-pointer bg-blue-900/40 border border-blue-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition backdrop-blur-md"
            >
              <h3 className="font-semibold text-white text-lg">
                {c.name}
              </h3>

              <p className="text-xs text-blue-300 mt-2">
                Firma detaylarına gitmek için tıkla
              </p>

              <div className="mt-4 text-right">
                <span className="text-xs px-3 py-1 rounded bg-blue-500/20 text-blue-200">
                  Detay →
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}