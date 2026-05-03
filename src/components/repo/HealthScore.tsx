import React, { useMemo } from 'react';

interface HealthScoreProps {
  metrics: {
    avgCycleTimeHours: number;
    prThroughput: number;
    stalePrsCount: number;
  };
}

export const HealthScore: React.FC<HealthScoreProps> = ({ metrics }) => {
  const score = useMemo(() => {
    // 1. Cycle Time Score (40%) - Target < 24h
    let cycleScore = 100;
    if (metrics.avgCycleTimeHours > 24) {
      cycleScore = Math.max(0, 100 - (metrics.avgCycleTimeHours - 24) * 2);
    }

    // 2. Stale Ratio Score (40%) - Target < 10%
    const totalPrs = metrics.prThroughput + metrics.stalePrsCount;
    const staleRatio = totalPrs > 0 ? (metrics.stalePrsCount / totalPrs) * 100 : 0;
    let staleScore = 100;
    if (staleRatio > 10) {
      staleScore = Math.max(0, 100 - (staleRatio - 10) * 3);
    }

    // 3. Throughput Score (20%) - Target >= 5
    const throughputScore = Math.min(100, (metrics.prThroughput / 5) * 100);

    return Math.round((cycleScore * 0.4) + (staleScore * 0.4) + (throughputScore * 0.2));
  }, [metrics]);

  const label = useMemo(() => {
    if (score >= 90) return { text: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
    if (score >= 70) return { text: 'Healthy', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' };
    return { text: 'Needs Attention', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
  }, [score]);

  const riskIndicator = useMemo(() => {
    if (score < 50 || (metrics.stalePrsCount > 5 && metrics.avgCycleTimeHours > 48)) {
      return { level: 'High Risk', dot: 'bg-rose-500' };
    }
    if (score < 70) {
      return { level: 'Medium Risk', dot: 'bg-amber-400' };
    }
    return { level: 'Low Risk', dot: 'bg-emerald-500' };
  }, [score, metrics]);

  // SVG Circle Logic
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-zinc-200/50 shadow-[0_2px_15px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group animate-in zoom-in-95 duration-700">
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90 overflow-visible">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-zinc-50"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-[1500ms] ease-out delay-300 ${
              score >= 90 ? 'text-emerald-500' : score >= 70 ? 'text-indigo-500' : 'text-rose-500'
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
          <span className="text-xl font-black text-zinc-900 tracking-tighter group-hover:scale-110 transition-transform duration-500">{score}</span>
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest -mt-1">Score</span>
        </div>
      </div>
      
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Repo Health</h3>
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${label.bg} ${label.color} ${label.border}`}>
            {label.text}
          </span>
        </div>
        <p className="text-[12px] text-zinc-500 font-medium max-w-[140px] leading-tight tracking-tight">
          Based on speed, stability, and team output volume.
        </p>
        
        <div className="pt-1 flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${riskIndicator.dot}`}></div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{riskIndicator.level}</span>
        </div>
      </div>
    </div>
  );
};
