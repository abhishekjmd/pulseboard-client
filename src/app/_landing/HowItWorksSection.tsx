"use client";

import React from "react";

const STEPS = [
  {
    step: "01",
    title: "Connect",
    description: "Paste a public GitHub URL or connect your account for private repository access.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Sync",
    description: "Pulseboard ingests commits and PR history directly via GitHub API.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Understand",
    description: "View PR throughput, cycle times, stale PRs, and contributor activity in one place.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "Cycle Time Tracking",
    description: "Time from pull request creation to merge, identifying review bottlenecks.",
    badge: "PR Health",
  },
  {
    title: "PR Throughput",
    description: "Track merged PR volume across custom 7, 14, or 30-day time windows.",
    badge: "Delivery",
  },
  {
    title: "Stale PR Detection",
    description: "Surface pull requests open longer than 7 days that need review attention.",
    badge: "Risk Signal",
  },
  {
    title: "Contributor Activity",
    description: "Track active contributors and commit frequency across repositories.",
    badge: "Team",
  },
  {
    title: "Commit History",
    description: "Commit frequency trends independent of PR lifecycle history.",
    badge: "Activity",
  },
  {
    title: "Automated Insights",
    description: "Rule-based summary cards for repository health and bottlenecks.",
    badge: "Insights",
  },
];

export function HowItWorksSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">Connect → Sync → Understand</h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">Straightforward engineering visibility without spreadsheets or complex configuration.</p>
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
              <span className="text-[10px] font-bold text-zinc-400 tracking-widest mb-1">{s.step}</span>
              <h3 className="text-base font-bold text-zinc-900 mb-1">{s.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">Capabilities</h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">Core metrics derived directly from your GitHub repository history.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-white border border-zinc-200/80 rounded-xl p-5 hover:border-zinc-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-900">{f.title}</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 rounded px-2 py-0.5">{f.badge}</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
