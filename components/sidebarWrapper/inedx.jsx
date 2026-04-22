"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "../sidebar";

export default function SidebarWrapper() {
  const [user, setUser] = useState(null);

  const adminList = [
    "berat.dimen@cridea.com.tr",
    "safa.dalgicoglu@cridea.com.tr",
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  const isAdmin =
    user && adminList.includes(user.email.toLowerCase());

  return <Sidebar user={user} isAdmin={isAdmin} />;
}