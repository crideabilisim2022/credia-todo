"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ArchivePage() {
  const { id } = useParams();
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [grouped, setGrouped] = useState({});
  const [openMonth, setOpenMonth] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);
    d.setHours(d.getHours() + 3);

    return d.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMonthKey = (date) => {
    const d = new Date(date);
    d.setHours(d.getHours() + 3);

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const fetchData = async () => {
    const companyRes = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    const productRes = await supabase
      .from("products")
      .select("*")
      .eq("company_id", id)
      .eq("archived", true)
      .order("updated_at", { ascending: false });

    setCompany(companyRes.data);

    // 🔥 GROUP BY MONTH
    const groupedData = {};

    (productRes.data || []).forEach((item) => {
      const key = getMonthKey(item.updated_at);

      if (!groupedData[key]) {
        groupedData[key] = [];
      }

      groupedData[key].push(item);
    });

    setGrouped(groupedData);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {company?.name} Arşiv
          </h1>
          <p className="text-blue-300 text-sm">
            Aylara göre gruplanmış arşiv kayıtları
          </p>
        </div>

        <button
          onClick={() => router.push(`/companies/${id}`)}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          ← Geri
        </button>
      </div>

      {/* MONTH GROUPS */}
      <div className="space-y-4">

        {Object.keys(grouped)
          .sort((a, b) => b.localeCompare(a)) // en yeni ay üstte
          .map((month) => (
            <div
              key={month}
              className="bg-blue-900/40 border border-blue-800 rounded-xl overflow-hidden"
            >
              {/* MONTH HEADER */}
              <div
                onClick={() =>
                  setOpenMonth(openMonth === month ? null : month)
                }
                className="p-4 flex justify-between cursor-pointer hover:bg-blue-800/30"
              >
                <h2 className="font-semibold">
                  📅 {month}
                </h2>

                <span className="text-blue-300 text-sm">
                  {grouped[month].length} ürün
                </span>
              </div>

              {/* ITEMS */}
              <AnimatePresence>
                {openMonth === month && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-3">

                      {grouped[month].map((p) => (
                        <div
                          key={p.id}
                          className="bg-blue-950/40 border border-blue-800 p-3 rounded-lg"
                        >
                          <h3 className="font-semibold">
                            {p.name}
                          </h3>

                          <p className="text-sm text-blue-300">
                            {p.note}
                          </p>

                          <div className="text-[11px] text-blue-400 mt-2 space-y-1">
                            <p>📅 Oluşturma: {formatDate(p.created_at)}</p>
                            <p>🗑️ Arşiv: {formatDate(p.updated_at)}</p>
                          </div>
                        </div>
                      ))}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
      </div>
    </div>
  );
}