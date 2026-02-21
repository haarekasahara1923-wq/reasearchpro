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
        <style dangerouslySetInnerHTML={{
          __html: `
          :root { --background: #020617; --foreground: #ffffff; }
          body { background: var(--background); color: var(--foreground); margin: 0; font-family: sans-serif; }
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .gap-2 { gap: 0.5rem; }
          .gap-4 { gap: 1rem; }
          .gap-8 { gap: 2rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-24 { padding-top: 6rem; padding-bottom: 6rem; }
          .min-h-screen { min-height: 100vh; }
          .w-full { width: 100%; }
          .container { max-width: 1200px; margin: 0 auto; }
          .grid { display: grid; }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
          header { height: 4rem; display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
          nav { margin-left: auto; display: flex; align-items: center; gap: 1.5rem; }
          a { color: inherit; text-decoration: none; }
          button { cursor: pointer; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; }
          .bg-primary { background: #3b82f6; }
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
