import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/lib/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dev Fullstack Challenge",
  description: "Financial Management Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-background  text-foreground min-h-screen antialiased flex flex-col`}
      >
        <QueryProvider>
          <Navbar />
          <Toaster />
          <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 space-y-8 min-h-dvh">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
