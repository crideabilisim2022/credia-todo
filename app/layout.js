import SidebarWrapper from "@/components/sidebarWrapper";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen">

        {/* SIDEBAR (fixed kalacak ama içeriden kontrol edilecek) */}
        <SidebarWrapper />

        {/* MAIN AREA */}
            <main className="flex-1 min-w-0 md:ml-64 xl:pl-4 md:pl-10 pt-14 md:pt-0">
          {children}
        </main>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}