"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "../sidebar";

export default function SidebarWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // 🔥 gerçek zamanlı auth dinle
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;

  if (!user) return null;

  const isAdmin = adminList.includes(user.email.toLowerCase());

  return <Sidebar user={user} isAdmin={isAdmin} />;
}