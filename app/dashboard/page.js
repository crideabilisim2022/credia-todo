"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [tasks, setTasks] = useState([]);
const todoTasks = tasks.filter((t) => t.status === "todo");
const doingTasks = tasks.filter((t) => t.status === "doing");
const doneTasks = tasks.filter((t) => t.status === "done");
  const fetchData = async () => {
    const [c, p, t] = await Promise.all([
      supabase.from("companies").select("*"),
      supabase.from("products").select("*"),
      supabase.from("todos").select("*"), // varsa
    ]);

    setCompanies(c.data || []);
    setProducts(p.data || []);
    setTasks(t.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cards = [
    {
      title: "Toplam Firma",
      value: companies.length,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Toplam Ürün",
      value: products.length,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Toplam Görev",
      value: tasks.length,
      color: "from-gray-500 to-green-500",
    },
    {
  title: "Aktif Görev",
  value: todoTasks.length,
  color: "from-gray-500 to-gray-700",
},
{
  title: "Yapılıyor",
  value: doingTasks.length,
  color: "from-yellow-500 to-yellow-700",
},
{
  title: "Tamamlanan",
  value: doneTasks.length,
  color: "from-green-500 to-green-700",
}
  ];

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 p-8 text-white">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-wide">
          Dashboard
        </h1>
        <p className="text-blue-300 text-sm">
          Sistem özeti ve istatistikler
        </p>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-2xl shadow-lg bg-gradient-to-r ${item.color}`}
          >
            <h2 className="text-sm opacity-80">
              {item.title}
            </h2>

            <p className="text-3xl font-bold mt-2">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

  

      {/* SON AKTİVİTELER */}
      <div className="mt-10 bg-blue-900/40 border border-blue-800 rounded-2xl p-5">
        <h2 className="font-semibold mb-4">
          Son Eklenen Firmalar
        </h2>

        <div className="space-y-2">
          {companies.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="flex justify-between text-sm text-blue-200"
            >
              <span>{c.name}</span>
              <span className="text-blue-400">
                {new Date(c.created_at).toLocaleString("tr-TR")}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}