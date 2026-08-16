"use client";

import React, { useState, useEffect } from "react";

// ── SVG Sparkline ─────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#6366f1", good = true }: { data: number[]; color?: string; good?: boolean }) {
  if (data.length < 2) return null;
  const w = 72; const h = 28;
  const min = Math.min(...data); const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const c = good ? "#10b981" : "#f59e0b";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Health Ring ───────────────────────────────────────────────────────────────
function HealthRing({ score, animated }: { score: number; animated: boolean }) {
  const r = 34; const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#e11d48";
  const label = score >= 70 ? "Healthy" : score >= 50 ? "Needs attention" : "Critical";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="-rotate-90" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#f4f4f5" strokeWidth="8" />
          <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={animated ? offset : circ}
            style={{ transition: "stroke-dashoffset 1.2s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black text-zinc-900">{animated ? score : 0}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
    </div>
  );
}

// ── Mini Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-10 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm bg-indigo-500/20 hover:bg-indigo-500/40 transition-colors"
          style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

// ── Mock data ────────────────────────────────────────────────────────────────
const PR_BARS = [12, 18, 9, 23, 15, 28, 21, 16, 24, 31, 19, 26];
const METRICS = [
  { label: "Avg Cycle Time", value: "—", unit: "", trend: "", good: true, spark: [28, 24, 30, 22, 19, 21, 18] },
  { label: "PR Throughput", value: "—", unit: "", trend: "", good: true, spark: [14, 18, 15, 20, 23, 21, 26] },
  { label: "Open PRs", value: "—", unit: "", trend: "", good: false, spark: [30, 32, 28, 35, 38, 40, 41] },
  { label: "Active Contributors", value: "—", unit: "", trend: "", good: true, spark: [4, 5, 5, 6, 6, 7, 7] },
];
const ACTIVITY = [
  { type: "merged", label: "feat: add concurrent rendering support", user: "gaearon", pr: "#8201", time: "4m ago" },
  { type: "opened", label: "fix: SSR hydration mismatch on dynamic routes", user: "timneutkens", pr: "#8203", time: "22m ago" },
  { type: "stale", label: "chore: upgrade all peer dependencies", user: "dependabot", pr: "#8190", time: "8d ago" },
  { type: "merged", label: "refactor: split Context into smaller modules", user: "sebmarkbage", pr: "#8198", time: "1h ago" },
];
const BADGES: Record<string, string> = {
  merged: "bg-emerald-50 text-emerald-700",
  opened: "bg-blue-50 text-blue-700",
  stale: "bg-amber-50 text-amber-700",
};
const DOTS: Record<string, string> = { merged: "bg-emerald-500", opened: "bg-blue-500", stale: "bg-amber-400" };

export function PreviewSection() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t); }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="rounded-2xl border border-zinc-200 shadow-[0_8px_48px_rgb(0,0,0,0.08)] overflow-hidden bg-white">

        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 bg-zinc-50/80">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <div className="flex-1 mx-4">
            <div className="bg-white border border-zinc-200 rounded-md px-3 py-1 text-xs text-zinc-400 font-mono max-w-xs">
              pulseboard.app/repos/42
            </div>
          </div>
          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 rounded px-2 py-0.5 uppercase tracking-wider">
            Example Preview
          </span>
        </div>

        {/* Repo header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-50">
          <div className="flex items-center gap-4">
            <HealthRing score={72} animated={animated} />
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">facebook · Example</p>
              <h2 className="text-2xl font-black text-zinc-900">react</h2>
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">PR Activity (12 weeks)</p>
            <BarChart data={PR_BARS} />
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-100 border-b border-zinc-100">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-white px-5 py-4">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{m.label}</p>
              <div className="flex items-end justify-between mb-1">
                <span className="text-2xl font-black text-zinc-900">{m.value} <span className="text-xs font-semibold text-zinc-400">{m.unit}</span></span>
                <Sparkline data={m.spark} good={m.good} />
              </div>
              <p className={`text-[11px] font-semibold ${m.good ? "text-emerald-600" : "text-amber-500"}`}>{m.trend}</p>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="grid sm:grid-cols-2 gap-3 px-6 py-4 bg-zinc-50/50 border-b border-zinc-100">
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <span className="text-lg">⚡</span>
            <p className="text-xs font-semibold text-emerald-800">Example insight: identify PR bottlenecks and review delays</p>
          </div>
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <span className="text-lg">🔴</span>
            <p className="text-xs font-semibold text-amber-800">Example insight: surface stale PRs that need attention</p>
          </div>
        </div>

        {/* Activity feed */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Engineering Activity</p>
          </div>
          <div className="space-y-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 group py-1">
                <div className={`w-2 h-2 rounded-full shrink-0 ${DOTS[a.type]}`} />
                <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 uppercase tracking-wide shrink-0 ${BADGES[a.type]}`}>{a.type}</span>
                <span className="text-sm text-zinc-700 font-medium truncate flex-1">{a.label}</span>
                <span className="text-[11px] text-zinc-400 font-mono shrink-0">{a.pr}</span>
                <span className="text-[11px] text-zinc-300 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
