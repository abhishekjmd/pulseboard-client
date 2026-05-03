"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { APP_ROUTES } from "@/src/routes/routes";
import { useDashboard, TimeWindowDays } from "@/src/lib/DashboardContext";
import { TimeRangeSelector } from "@/src/components/repo/TimeRangeSelector";

export function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { window, setWindow, setIsSidebarOpen } = useDashboard();

  const handleLogout = () => {
    logout();
    router.push(APP_ROUTES.login);
  };

  const getContextLabel = () => {
    if (pathname.includes("/repos/")) return "Repository Health";
    if (pathname.includes("/dashboard")) return "Organization Overview";
    return "Pulseboard";
  };

  return (
    <header className="sticky top-0 z-40 flex h-[60px] w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 md:hidden"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-zinc-500">
            {getContextLabel()}
          </span>
          <span className="text-zinc-300">/</span>
          <span className="text-[13px] font-semibold text-zinc-900">
            Dashboard
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <TimeRangeSelector value={window} onChange={(val) => setWindow(val as TimeWindowDays)} />
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200">
          <button 
            onClick={handleLogout}
            className="text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Sign Out
          </button>
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            PB
          </div>
        </div>
      </div>
    </header>
  );
}
