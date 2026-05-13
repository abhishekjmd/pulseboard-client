"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/src/lib/api";

const EXAMPLE_REPOS = [
  { label: "facebook/react", url: "https://github.com/facebook/react", tag: "Frontend" },
  { label: "vercel/next.js", url: "https://github.com/vercel/next.js", tag: "Framework" },
  { label: "microsoft/vscode", url: "https://github.com/microsoft/vscode", tag: "Editor" },
  { label: "tailwindlabs/tailwindcss", url: "https://github.com/tailwindlabs/tailwindcss", tag: "CSS" },
];

const TICKER = [
  "🟢 gaearon merged: fix concurrent mode edge case in Suspense  ·  react",
  "🔵 timneutkens opened: feat: improve App Router cache invalidation  ·  next.js",
  "⚡ RobinMafait merged: feat: add Combobox component  ·  headlessui",
  "🟡 nicolo-ribaudo stale (14d): chore: update babel peer deps  ·  babel",
  "🟢 antfu merged: fix: HMR flicker on file rename  ·  vite",
];

type AnalyzeResult = { success: boolean; repoId?: number; message?: string };

interface Props {
  onAnalyze: (url: string) => Promise<void>;
  loading: boolean;
  activeRepo: string | null;
  error: string;
}

export function HeroSection({ onAnalyze, loading, activeRepo, error }: Props) {
  const [url, setUrl] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % TICKER.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
      <div className="h-7 mb-6 overflow-hidden">
        <p key={tick} className="text-xs text-zinc-400 font-medium animate-in fade-in slide-in-from-top-2 duration-500">
          {TICKER[tick]}
        </p>
      </div>

      <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
          Live GitHub Intelligence · No Login Required
        </span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight leading-[1.1] sm:leading-[1.06] mb-5">
        Engineering health<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">at a glance</span>
      </h1>
      <p className="text-base sm:text-lg text-zinc-500 max-w-lg mx-auto mb-10 leading-relaxed px-4">
        Paste any public GitHub repository URL to instantly surface cycle time, PR throughput, stale PRs, and contributor velocity.
      </p>

      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={(e) => { e.preventDefault(); if (url.trim()) onAnalyze(url.trim()); }}
          className="flex flex-col sm:flex-row gap-2 bg-transparent sm:bg-white sm:border sm:border-zinc-200 rounded-2xl sm:p-2 sm:shadow-[0_4px_24px_rgb(0,0,0,0.07)] focus-within:border-zinc-400 focus-within:shadow-[0_8px_32px_rgb(0,0,0,0.10)] transition-all"
        >
          <div className="flex items-center gap-3 flex-1 px-4 py-3 sm:py-0 bg-white border border-zinc-200 sm:border-none rounded-2xl sm:rounded-none shadow-sm sm:shadow-none">
            <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              placeholder="https://github.com/facebook/react"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="flex-1 text-sm bg-transparent focus:outline-none text-zinc-900 placeholder-zinc-400 min-w-0"
            />
          </div>
          <button
            type="submit"
            disabled={!url.trim() || loading}
            className="w-full sm:w-auto shrink-0 bg-zinc-900 text-white text-sm font-bold rounded-2xl sm:rounded-xl px-6 py-4 sm:py-3 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg sm:shadow-none"
          >
            {loading && !activeRepo ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing…
              </span>
            ) : "Analyze →"}
          </button>
        </form>
        {error && <p className="mt-3 text-rose-500 text-sm font-medium">{error}</p>}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-zinc-400 font-medium">Try live:</span>
        {EXAMPLE_REPOS.map((r) => (
          <button
            key={r.url}
            onClick={() => onAnalyze(r.url)}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
              ${activeRepo === r.url
                ? "bg-zinc-900 border-zinc-900 text-white"
                : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {activeRepo === r.url && loading ? (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            {r.label}
          </button>
        ))}
      </div>
    </section>
  );
}
