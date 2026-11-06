"use client";

import React from "react";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#070A0F] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Left Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
