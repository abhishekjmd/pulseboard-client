"use client";

import React, { useState, useEffect } from "react";

const STEPS = [
  {
    step: "01",
    title: "Paste a GitHub URL",
    description: "Drop any public repo URL — no sign-up, no OAuth, no setup. We hit the GitHub API directly.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "We sync PR data instantly",
    description: "PulseBoard ingests PR lifecycle data — open, merged, closed, stale — in the background via incremental sync.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "See your health dashboard",
    description: "Cycle time, PR throughput, stale PRs, contributor velocity — all derived from real GitHub data, not estimates.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    emoji: "⏱",
    title: "Cycle Time Analysis",
    description: "Time from PR open to merge, broken into review wait, code change, and merge stages. Identify where PRs get stuck.",
    badge: "Core Signal",
  },
  {
    emoji: "📊",
    title: "PR Throughput",
    description: "Count of merged PRs over 7, 14, or 30-day windows. See if velocity is trending up or decaying.",
    badge: "Velocity",
  },
  {
    emoji: "🔴",
    title: "Stale PR Detection",
    description: "Automatically surfaces PRs open > 7 days. Review debt is the #1 hidden drag on team velocity.",
    badge: "Risk Signal",
  },
  {
    emoji: "🔥",
    title: "Contributor Heatmap",
    description: "GitHub-style contribution calendar. Spot who is active, quiet periods, and single-points-of-failure.",
    badge: "Team Health",
  },
  {
    emoji: "📈",
    title: "Velocity Trend Charts",
    description: "Weekly merged PR activity over time. See delivery momentum at a glance, not just point-in-time snapshots.",
    badge: "Trends",
  },
  {
    emoji: "⚡",
    title: "AI-Driven Insights",
    description: "Plain-language summaries like 'Cycle time up 32% — review bottleneck detected.' No dashboards to interpret.",
    badge: "Intelligence",
  },
];

const STATS = [
  { value: 1200, suffix: "+", label: "Repos analyzed" },
  { value: 50, suffix: "K+", label: "PRs processed" },
  { value: 99, suffix: "%", label: "Uptime SLA" },
  { value: 15, suffix: "min", label: "Avg sync time" },
];

function useCounter(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const step = target / (duration / 16);
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(Math.floor(cur));
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return count;
}

export function HowItWorksSection() {
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), 800); return () => clearTimeout(t); }, []);
  const c = [
    useCounter(STATS[0].value, 2000, started),
    useCounter(STATS[1].value, 2000, started),
    useCounter(STATS[2].value, 2000, started),
    useCounter(STATS[3].value, 2000, started),
  ];

  return (
    <>
      {/* Stats bar */}
      <section className="border-y border-zinc-100 bg-zinc-50/60 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <div key={s.label}>
              <p className="text-3xl font-black text-zinc-900">{c[i]}{s.suffix}</p>
              <p className="text-xs font-medium text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">How it works</h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">From URL to full health dashboard in under 30 seconds.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 mb-20">
          {STEPS.map((s, i) => (
            <div key={s.step} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block absolute top-5 left-[calc(50%+32px)] right-0 h-px bg-zinc-200" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-4 relative z-10">
                  {s.icon}
                </div>
                <span className="text-[10px] font-black text-zinc-300 tracking-widest mb-2">{s.step}</span>
                <h3 className="text-sm font-bold text-zinc-900 mb-2">{s.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">What PulseBoard tracks</h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">The six signals that separate high-performing engineering teams from the rest.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="group bg-white border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 hover:shadow-[0_6px_24px_rgb(0,0,0,0.06)] transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{f.emoji}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-200 rounded px-2 py-0.5">{f.badge}</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 mb-2">{f.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
