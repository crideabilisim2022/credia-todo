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
  const isAdmin = adminList.includes(user?.email);

  // USER CHECK
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

  // FETCH
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
    if (!text || !user) return;

    await supabase.from("todos").insert([
      {
        text,
        status: "todo",
        user_id: user.id,
        user_email: user.email,
        assigned_to: isAdmin ? assignedTo : user.email,
      },
    ]);
if (error) {
  toast.error("Görev eklenemedi");
} else {
  toast.success("Görev eklendi");
}
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
      <div className="h-screen flex items-center justify-center">
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
        ? "bg-gray-200 text-gray-700"
        : status === "doing"
        ? "bg-yellow-200 text-yellow-800"
        : "bg-green-200 text-green-800";

    return (
      <span className={`px-2 py-1 text-xs rounded ${color}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white p-5">
        <h1 className="text-xl font-bold mb-6">
          TASK PANEL
        </h1>

        <div className="text-sm opacity-70 mb-4">
          {user.email}
        </div>

        {isAdmin && (
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full p-2 text-black rounded"
          >
            <option value="">Kullanıcı seç</option>
            <option value="berat.dimen@cridea.com.tr">BERAT</option>
            <option value="sehmus@cridea.com.tr">ŞEHMUS</option>
            <option value="deniz@cridea.com.tr">DENİZ</option>
          </select>
        )}

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="mt-5 w-full bg-red-500 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* TOP BAR */}
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Ofis Task Board
          </h2>
        </div>

        {/* ADD */}
        <div className="flex gap-2 mb-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-3 rounded border"
            placeholder="Görev yaz..."
          />
          <button
            onClick={addTodo}
            className="bg-black text-white px-6 rounded"
          >
            Ekle
          </button>
        </div>

        {/* BOARD */}
       <div className="flex gap-6 items-start overflow-x-auto">

          {Object.entries(columns).map(([key, items]) => (
            <div key={key} className="min-w-[300px] bg-white rounded-xl p-4 shadow">

              <h3 className="font-bold mb-4 capitalize text-center">
                {key}
              </h3>

              <div className="space-y-3">

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-3 bg-gray-50"
                  >

                    <div className="flex justify-between items-center mb-2">
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="font-medium">
                      {item.text}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Atanan: {item.assigned_to || "Atanmamış"}
                    </p>

                    <p className="text-xs text-gray-400">
                      Oluşturan: {item.user_email}
                    </p>

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
                        onClick={() => updateStatus(item.id, "doing", item.assigned_to)}
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
            await supabase
              .from("todos")
              .update({ status: confirm.status })
              .eq("id", confirm.id);

            toast.success("Durum güncellendi");

            setConfirm({ open: false });
          }}
          className="px-3 py-1 bg-black text-white rounded"
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