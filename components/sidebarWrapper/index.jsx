"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "../sidebar";

export default function SidebarWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const adminList = [
    "berat.dimen@cridea.com.tr",
    "safa.dalgicoglu@cridea.com.tr",
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (loading || !user) return null;

  const isAdmin = adminList.includes(user.email.toLowerCase());

  return (
    <>
      {/* MOBILE TOP BAR (HAMBURGER) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex items-center justify-between px-4 z-50 border-b border-blue-800">
        <span className="font-bold">CREDIA</span>

        <button
          onClick={() => setOpen(true)}
          className="text-2xl"
        >
          ☰
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64">
        <Sidebar user={user} isAdmin={isAdmin} />
      </div>

      {/* MOBILE DRAWER */}
{open && (
  <div className="md:hidden fixed inset-0 z-[999] flex">

    {/* BACKDROP */}
    <div
      onClick={() => setOpen(false)}
      className="absolute inset-0 bg-black/50"
    />

    {/* SIDEBAR */}
    <div className="relative w-72 h-full bg-blue-950 z-[1000]">

      {/* X BUTTON */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 text-white text-2xl z-[1001]"
      >
        ✕
      </button>

      <Sidebar user={user} isAdmin={isAdmin} />
    </div>

  </div>
)}
    </>
  );
}