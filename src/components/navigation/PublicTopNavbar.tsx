"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { APP_ROUTES } from "@/src/routes/routes";
import { useDashboard, TimeWindow } from "@/src/lib/DashboardContext";
import { TimeRangeSelector } from "@/src/components/repo/TimeRangeSelector";

export function PublicTopNavbar() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { window, setWindow } = useDashboard();

  // Defer auth-dependent render to avoid SSR/client hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 flex h-[60px] w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">PB</span>
          </div>
          <span className="text-[14px] font-black text-zinc-900 tracking-tight hidden sm:block">
            PulseBoard
          </span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <TimeRangeSelector value={window} onChange={(val) => setWindow(val as TimeWindow)} />
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 min-w-[120px] justify-end">
          {!mounted ? (
            // Neutral placeholder — matches server render, no mismatch
            <div className="h-8 w-28 rounded-xl bg-zinc-100 animate-pulse" />
          ) : isAuthenticated ? (
            <button
              onClick={() => router.push(APP_ROUTES.dashboard)}
              className="h-8 px-4 text-xs font-bold bg-white border border-zinc-200 rounded-xl text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push(APP_ROUTES.login)}
                className="text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push(APP_ROUTES.signup)}
                className="h-8 px-4 text-xs font-bold bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 transition-colors"
              >
                Create Workspace
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
