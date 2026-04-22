"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");

  const [confirm, setConfirm] = useState({
    open: false,
    id: null,
    status: null,
    assignedTo: null,
  });

  const router = useRouter();

  const adminList = [
    "berat.dimen@cridea.com.tr",
    "safa.dalgicoglu@cridea.com.tr",
  ];

  const userMap = {
    "berat.dimen@cridea.com.tr": "BERAT",
    "sehmus@cridea.com.tr": "ŞEHMUS",
    "deniz@cridea.com.tr": "DENİZ",
    "safa.dalgicoglu@cridea.com.tr": "SAFA",
  };

  const isAdmin =
    !!user &&
    adminList.includes(user?.email?.toLowerCase());

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
    };

    getUser();
  }, []);

  const fetchTodos = async () => {
    const { data } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setTodos(data);
  };

  useEffect(() => {
    if (!user) return;

    fetchTodos();

    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        fetchTodos
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // ADD
 const addTodo = async () => {
  if (!text.trim() || !user) return;

  const now = new Date().toISOString();

  // 👇 güvenli atama
  const assignedUser = isAdmin
    ? assignedTo || user.email
    : user.email;

  const { error } = await supabase.from("todos").insert([
    {
      text: text.trim(),
      status: "todo",
      user_id: user.id,
      user_email: user.email,
      assigned_to: assignedUser,
      created_at: now,
    },
  ]);

  if (error) {
    toast.error("Görev eklenemedi");
    return;
  }

  toast.success("Görev eklendi");

  setText("");
  setAssignedTo("");
};

  // UPDATE
  const updateStatus = (id, status, assignedTo) => {
    const currentEmail = user?.email?.toLowerCase();
    const taskOwner = assignedTo?.toLowerCase();

    if (taskOwner !== currentEmail && !isAdmin) {
      toast.error("Sadece sana atanan taski değiştirebilirsin");
      return;
    }

    setConfirm({
      open: true,
      id,
      status,
      assignedTo,
    });
  };

  // DELETE
  const deleteTodo = async (id) => {
    if (!isAdmin) return toast.error("Sadece admin silebilir");

    await supabase.from("todos").delete().eq("id", id);
    toast.success("Görev silindi");
  };

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center text-blue-700 font-semibold">
        Loading...
      </div>
    );

  const columns = {
    todo: todos.filter((t) => t.status === "todo"),
    doing: todos.filter((t) => t.status === "doing"),
    done: todos.filter((t) => t.status === "done"),
  };

  const StatusBadge = ({ status }) => {
    const color =
      status === "todo"
        ? "bg-blue-100 text-blue-700"
        : status === "doing"
        ? "bg-indigo-100 text-indigo-700"
        : "bg-green-100 text-green-700";

    return (
      <span className="px-2 py-1 text-xs rounded-full font-semibold">
        {status.toUpperCase()}
      </span>
    );
  };
  const fixDate = (date) => {
  const d = new Date(date);
  d.setHours(d.getHours() + 3);
  return d.toLocaleString("tr-TR");
};

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white">

      {/* SIDEBAR */}
<div className="w-72 h-screen sticky top-0 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col justify-between border-r border-blue-800">

  {/* TOP */}
  <div className="p-5">

    {/* LOGO / BRAND */}
    <div className="mb-8">
      <h1 className="text-xl font-bold tracking-wide">
        CRIDEA SYSTEMS
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
        <span className="text-xs text-blue-300">
          {isAdmin ? "Admin User" : "Standard User"}
        </span>

        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
          isAdmin
            ? "bg-green-500/20 text-green-300"
            : "bg-gray-500/20 text-gray-300"
        }`}>
          {isAdmin ? "ADMIN" : "USER"}
        </span>
      </div>
    </div>

    {/* MENU */}
    <div className="space-y-2">

      <div className="text-xs text-blue-400 uppercase mb-2">
        Menü
      </div>

      <div className="p-3 rounded-xl bg-blue-800/40 hover:bg-blue-700 transition cursor-pointer">
        📋 Tasks
      </div>

      <div className="p-3 rounded-xl hover:bg-blue-800/40 transition cursor-pointer">
        📊 Dashboard
      </div>

      {isAdmin && (
        <div className="p-3 rounded-xl hover:bg-blue-800/40 transition cursor-pointer">
          👥 Users
        </div>
      )}

      <div className="p-3 rounded-xl hover:bg-blue-800/40 transition cursor-pointer">
        ⚙️ Settings
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
      Cridea Task System v1.0
    </p>

  </div>

</div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Ofis Task Board
        </h2>

        {/* ADD */}
{/* ADD */}
<div className="flex flex-col md:flex-row gap-2 mb-6">

  {/* INPUT */}
  <input
    value={text}
    onChange={(e) => setText(e.target.value)}
    className="flex-1 p-3 rounded border border-blue-200 focus:outline-blue-500"
    placeholder="Görev yaz..."
  />

  {/* ADMIN İSE GÖSTER */}
  {isAdmin && (
    <select
      value={assignedTo}
      onChange={(e) => setAssignedTo(e.target.value)}
      className="p-3 rounded border border-blue-200 bg-white text-sm focus:outline-blue-500"
    >
      <option value="">Kişi seç</option>
      <option value="berat.dimen@cridea.com.tr">BERAT</option>
      <option value="sehmus@cridea.com.tr">ŞEHMUS</option>
      <option value="deniz@cridea.com.tr">DENİZ</option>
      <option value="safa.dalgicoglu@cridea.com.tr">SAFA</option>
    </select>
  )}

  {/* BUTTON */}
  <button
    onClick={addTodo}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded"
  >
    Ekle
  </button>

</div>
        {/* BOARD */}
        <div className="flex gap-6 items-start overflow-x-auto">

          {Object.entries(columns).map(([key, items]) => (
            <div
              key={key}
              className="min-w-[300px] bg-white rounded-xl p-4 shadow-md border border-blue-100"
            >
              <h3 className="font-bold mb-4 text-center text-blue-800 capitalize">
                {key}
              </h3>

              <div className="space-y-3">

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-blue-100 rounded-lg p-3 bg-blue-50"
                  >

                    <StatusBadge status={item.status} />

                    <p className="font-medium mt-2 text-blue-900">
                      {item.text}
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      Atanan: {userMap[item.assigned_to] || item.assigned_to || "Atanmamış"}
                    </p>

                    <p className="text-xs text-gray-400">
                      Oluşturan: {item.user_email}
                    </p>

                    {/* TARİHLER */}
                {item.created_at && (
  <p className="text-[10px] text-blue-500 mt-2">
    Oluşturulma: {fixDate(item.created_at)}
  </p>
)}

{item.started_at && (
  <p className="text-[10px] text-yellow-600">
    Başlama: {fixDate(item.started_at)}
  </p>
)}

{item.completed_at && (
  <p className="text-[10px] text-green-600">
    Bitiş: {fixDate(item.completed_at)}
  </p>
)}
                    {/* ACTIONS */}
                    <div className="flex gap-2 mt-3 flex-wrap">

                      <button
                        onClick={() =>
                          updateStatus(item.id, "todo", item.assigned_to)
                        }
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                      >
                        Todo
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(item.id, "doing", item.assigned_to)
                        }
                        className="text-xs bg-yellow-200 px-2 py-1 rounded"
                      >
                        Doing
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(item.id, "done", item.assigned_to)
                        }
                        className="text-xs bg-green-200 px-2 py-1 rounded"
                      >
                        Done
                      </button>

                      <button
                        onClick={() => deleteTodo(item.id)}
                        className="text-xs bg-red-200 px-2 py-1 rounded"
                      >
                        Sil
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl">

            <h2 className="text-lg font-bold mb-3">
              Durumu değiştirmek istiyor musun?
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              {confirm.status} olarak güncellenecek
            </p>

            <div className="flex gap-2 justify-end">

              <button
                onClick={() =>
                  setConfirm({ open: false })
                }
                className="px-3 py-1 bg-gray-200 rounded"
              >
                İptal
              </button>

              <button
                onClick={async () => {
                  const now = new Date().toISOString();

                  let updateData = { status: confirm.status };

                  if (confirm.status === "doing") {
                    updateData.started_at = now;
                  }

                  if (confirm.status === "done") {
                    updateData.completed_at = now;
                  }

                  await supabase
                    .from("todos")
                    .update(updateData)
                    .eq("id", confirm.id);

                  toast.success("Durum güncellendi");

                  setConfirm({
                    open: false,
                    id: null,
                    status: null,
                    assignedTo: null,
                  });
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Onayla
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}