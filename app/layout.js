"use client";

import { usePathname } from "next/navigation";
import SidebarWrapper from "@/components/sidebarWrapper/inedx";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // login sayfasında sidebar gösterme
  const hideSidebar = pathname === "/login";

  return (
    <html lang="en">
      <body className="min-h-screen flex">

        {!hideSidebar && <SidebarWrapper />}

        <main className="flex-1">
          {children}
        </main>

        <Toaster position="top-right" />

      </body>
    </html>
  );
}