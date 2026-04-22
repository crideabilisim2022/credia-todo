import SidebarWrapper from "@/components/sidebarWrapper/inedx";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Credia Task System",
  description: "Task yönetim sistemi",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex">

        <SidebarWrapper />

        <main className="flex-1">
          {children}
        </main>

        <Toaster position="top-right" />

      </body>
    </html>
  );
}