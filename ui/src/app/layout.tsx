import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dev Fullstack Challenge',
  description: 'Financial Management Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen antialiased flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
