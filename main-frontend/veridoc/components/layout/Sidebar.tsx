"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareCode,
  FolderOpen,
  CheckCircle2,
  GitCompare,
  BarChart3,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Shield,
  FileText,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    // Check initial dark mode from document or localStorage
    const savedTheme = localStorage.getItem("verity_theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }

    // Check backend health
    apiClient.checkHealth().then((health) => {
      setBackendStatus(health ? "online" : "offline");
    });
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("verity_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("verity_theme", "dark");
      setIsDark(true);
    }
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/workspace", label: "Document Workspace", icon: MessageSquareCode, badge: "3-Panel" },
    { href: "/documents", label: "My Documents", icon: FolderOpen },
    { href: "/claims", label: "Claim Verification", icon: CheckCircle2 },
    { href: "/comparison", label: "Answer Comparison", icon: GitCompare },
    { href: "/evaluation", label: "Evaluation & Metrics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] transition-all duration-300 z-30 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header / Brand Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200/80 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Verity AI
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
                  v2.0
                </span>
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[130px]">
                Evidence-Grounded QA
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Action Button: New Workspace */}
      <div className="p-3">
        <Link
          href="/workspace"
          className={`flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-3 shadow-sm hover:scale-[1.01] transition-all ${
            collapsed ? "w-10 h-10 p-0 mx-auto" : "w-full"
          }`}
          title="New Document Workspace"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && <span>New Workspace</span>}
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Backend API status & Theme Controls */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
        {/* Status Pill */}
        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px]">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === "online"
                    ? "bg-emerald-500 animate-pulse"
                    : backendStatus === "checking"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
              />
              <span className="text-slate-600 dark:text-slate-400">
                {backendStatus === "online"
                  ? "FastAPI 8000 Online"
                  : backendStatus === "checking"
                  ? "Connecting..."
                  : "Offline (Local Mock)"}
              </span>
            </div>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-slate-500 shrink-0" />
          )}
          {!collapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        {/* User Profile */}
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[11px] text-slate-700 dark:text-slate-200 shrink-0">
            VA
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Verity Research</span>
              <span className="text-[10px] text-slate-400 truncate">Major Project</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
