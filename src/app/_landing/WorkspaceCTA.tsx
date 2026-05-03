"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { APP_ROUTES } from "@/src/routes/routes";

export function WorkspaceCTA() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 rounded-3xl p-10 sm:p-16 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full -mr-36 -mt-36 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-violet-500/10 rounded-full -ml-28 -mb-28 pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              For Engineering Teams
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Ready to track your own repos?
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto mb-8 leading-relaxed text-sm">
              Create a workspace to monitor private repositories, track org-level health scores, set cycle-time goals, and share live dashboards with your team.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["Private repo support", "Org-level health scores", "Team dashboards", "Slack alerts (soon)"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-zinc-400">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!mounted ? (
                <div className="h-12 w-56 rounded-xl bg-white/10 animate-pulse" />
              ) : (
                <>
                  <button
                    onClick={() => router.push(isAuthenticated ? APP_ROUTES.dashboard : APP_ROUTES.signup)}
                    className="bg-white text-zinc-900 font-bold text-sm rounded-xl px-8 py-3.5 hover:bg-zinc-100 transition-colors"
                  >
                    {isAuthenticated ? "Go to Dashboard →" : "Create Free Workspace →"}
                  </button>
                  {!isAuthenticated && (
                    <button
                      onClick={() => router.push(APP_ROUTES.login)}
                      className="text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors"
                    >
                      Already have an account? Sign in
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-[9px]">PB</span>
            </div>
            <span className="text-sm font-bold text-zinc-500">PulseBoard</span>
          </div>
          <p className="text-xs text-zinc-400">Engineering intelligence for high-performance teams · Built with Next.js + Express + Prisma</p>
        </div>
      </footer>
    </>
  );
}
