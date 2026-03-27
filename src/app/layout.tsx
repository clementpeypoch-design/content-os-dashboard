import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContentOS",
  description: "Content management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#a78bfa", colorBackground: "#07070a", colorText: "#eaeaf0", colorInputBackground: "#111116", colorInputText: "#eaeaf0" } }}>
      <html lang="fr" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
          <style>{`body { font-family: 'Manrope', system-ui, sans-serif; }`}</style>
        </head>
        <body className="min-h-screen bg-[#07070a] text-[#eaeaf0] antialiased">
          <SignedOut>
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>ContentOS</h1>
              <p style={{ color: "#666", fontSize: 14 }}>Connectez-vous pour acceder au dashboard</p>
              <SignInButton mode="modal">
                <button style={{ padding: "12px 32px", borderRadius: 10, fontSize: 14, fontWeight: 600, background: "#a78bfa", border: "none", color: "#fff", cursor: "pointer" }}>
                  Se connecter
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <Sidebar />
            <main className="ml-[60px] min-h-screen transition-all duration-300 lg:ml-[220px]">
              <div style={{ position: "fixed", top: 16, right: 20, zIndex: 50 }}>
                <UserButton afterSignOutUrl="/" />
              </div>
              {children}
            </main>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
