import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResearchPro AI - Academic Research Assistant",
  description: "AI-powered platform to develop and write high-quality research papers and thesis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  primary: {
                    DEFAULT: '#3b82f6',
                    foreground: '#ffffff',
                  },
                }
              }
            }
          }
        `}} />
        <style dangerouslySetInnerHTML={{
          __html: `
          :root { --background: #020617; --foreground: #ffffff; }
          body { background: #020617 !important; color: white !important; margin: 0; font-family: sans-serif; }
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .gap-2 { gap: 0.5rem; }
          .gap-4 { gap: 1rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .min-h-screen { min-height: 100vh; }
          header { height: 4rem; display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); background: #020617; }
          nav { margin-left: auto; display: flex; align-items: center; gap: 1.5rem; }
          a { color: inherit; text-decoration: none; }
          .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
          .text-primary { color: #3b82f6; }
          .bg-primary { background: #3b82f6; color: white; }
        `}} />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
