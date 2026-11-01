"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, MessageSquare, LogOut } from "lucide-react";

export default function Navigation({ showChat, onChatToggle }: { showChat?: boolean; onChatToggle?: () => void }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="glass-strong sticky top-0 z-50 !border-x-0 !border-t-0 !border-b-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900">
            <span className="glass-button flex h-8 w-8 items-center justify-center rounded-xl text-sm">T</span>
            TeamFlow
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/tasks"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition ${
                pathname === "/tasks"
                  ? "bg-white/80 text-indigo-600 shadow-sm ring-1 ring-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Tasks
            </Link>

            <button
              onClick={onChatToggle}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition ${
                showChat
                  ? "bg-white/80 text-indigo-600 shadow-sm ring-1 ring-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              AI Assistant
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-gray-600 hover:text-red-600 hover:bg-white/50 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
