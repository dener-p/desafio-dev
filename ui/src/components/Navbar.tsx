"use client";

import Link from "next/link";
import { LogOut, LayoutDashboard, Tags } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
            >
              FinTrack
            </Link>
            <div className="hidden md:flex gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Tags size={18} />
                Categories
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Hello, {user.name}</span>
            <button
              onClick={}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-slate-800"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
