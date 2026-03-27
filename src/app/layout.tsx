import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContentOS — Dashboard",
  description: "Content management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`body { font-family: 'Manrope', system-ui, sans-serif; }`}</style>
      </head>
      <body className="min-h-screen bg-[#07070a] text-[#eaeaf0] antialiased">
        <Sidebar />
        <main className="ml-[60px] min-h-screen transition-all duration-300 lg:ml-[220px]">
          {children}
        </main>
      </body>
    </html>
  );
}
