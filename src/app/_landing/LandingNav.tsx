"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { APP_ROUTES } from "@/src/routes/routes";

export function LandingNav() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">PB</span>
          </div>
          <span className="font-black text-zinc-900 tracking-tight text-[15px]">PulseBoard</span>
          <span className="hidden sm:inline text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 uppercase tracking-widest">Beta</span>
        </div>
        <div className="flex items-center gap-3 min-w-[160px] justify-end">
          {!mounted ? (
            <div className="h-9 w-36 rounded-xl bg-zinc-100 animate-pulse" />
          ) : isAuthenticated ? (
            <button onClick={() => router.push(APP_ROUTES.dashboard)}
              className="bg-zinc-900 text-white text-[13px] font-bold rounded-xl px-5 py-2 hover:bg-zinc-700 transition-colors">
              Go to Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => router.push(APP_ROUTES.login)}
                className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                Sign In
              </button>
              <button onClick={() => router.push(APP_ROUTES.signup)}
                className="bg-zinc-900 text-white text-[13px] font-bold rounded-xl px-5 py-2 hover:bg-zinc-700 transition-colors">
                Create Workspace
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
