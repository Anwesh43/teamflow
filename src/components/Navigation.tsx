"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, MessageSquare, LogOut } from "lucide-react";
import { authHelper } from "@/app/lib/appwrite";
import { useState } from "react";

const authHelperObj = authHelper();

export default function Navigation() {
  const pathname = usePathname();
  const [userMenu, setUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl text-indigo-600">
            TeamFlow
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/tasks"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                pathname === "/tasks"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Tasks
            </Link>

            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                pathname === "/" || pathname === "/register" || pathname === "/login"
                  ? "text-gray-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              } ${pathname === "/" ? "bg-indigo-100 text-indigo-600" : ""}`}
            >
              <MessageSquare className="w-4 h-4" />
              AI Assistant
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-red-50 transition"
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
