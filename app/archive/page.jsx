"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ArchivePage() {
  const [todos, setTodos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchArchive();
  }, []);

  const adminList = [
  "berat.dimen@cridea.com.tr",
  "safa.dalgicoglu@cridea.com.tr",
];

const [user, setUser] = useState(null);

const isAdmin =
  !!user &&
  adminList.includes(user.email?.toLowerCase());

useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  getUser();
}, []);


  // ✅ DATE FIX (TR + 3 saat düzeltme)
  const fixDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);
    d.setHours(d.getHours() + 3);
    return d.toLocaleString("tr-TR");
  };

  const fetchArchive = async () => {
    const { data } = await supabase
      .from("todos")
      .select("*")
      .eq("archived", true)
      .order("completed_at", { ascending: false });

    setTodos(data || []);
  };

  // 🔁 GERİ AL
const restoreTask = async (id) => {
  if (!isAdmin) {
    toast.error("Sadece admin geri alabilir");
    return;
  }

  const { error } = await supabase
    .from("todos")
    .update({
      archived: false,
      status: "done",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    toast.error("Geri alınamadı");
    return;
  }

  toast.success("Task geri alındı");
  fetchArchive();
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            📦 ARŞİVLER
          </h1>
          <p className="text-sm text-gray-500">
            Arşivlenmiş görevler
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          ← Anasayfaya Dön
        </button>

      </div>

      {/* LIST */}
      <div className="grid gap-4">

        {todos.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            Arşiv boş
          </div>
        )}

        {todos.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >

            {/* TITLE */}
            <div className="flex justify-between items-start">

              <div>
                <p className="font-semibold text-gray-800">
                  {item.text}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  👤 {item.user_email}
                </p>
              </div>

              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                ARŞİV
              </span>

            </div>

            {/* DATES */}
            <div className="text-xs text-gray-500 mt-3 space-y-1">

              <p>
                📅 Oluşturulma: {fixDate(item.created_at)}
              </p>

              <p>
                ⏱ Bitiş: {fixDate(item.completed_at)}
              </p>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4">

           {isAdmin && (
  <button
    onClick={() => restoreTask(item.id)}
    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
  >
    ↩ Geri Al
  </button>
)}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}