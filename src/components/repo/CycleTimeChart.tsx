"use client";

import React, { useMemo } from 'react';
import { Card } from '@/src/components/ui/Card';

interface MergedPR {
  createdAt: string;
  mergedAt: string | null;
}

interface CycleTimeChartProps {
  mergedPrs: MergedPR[];
}

const BUCKETS = [
  { label: '< 1 day',  maxHours: 24,   color: '#10b981', textColor: 'text-emerald-600' },
  { label: '1–3 days', maxHours: 72,   color: '#6366f1', textColor: 'text-indigo-500' },
  { label: '3–7 days', maxHours: 168,  color: '#f59e0b', textColor: 'text-amber-500' },
  { label: '7+ days',  maxHours: Infinity, color: '#f43f5e', textColor: 'text-rose-500' },
];

export const CycleTimeChart: React.FC<CycleTimeChartProps> = ({ mergedPrs }) => {
  const bucketCounts = useMemo(() => {
    const counts = [0, 0, 0, 0];
    mergedPrs.forEach(pr => {
      if (!pr.mergedAt) return;
      const hours = (new Date(pr.mergedAt).getTime() - new Date(pr.createdAt).getTime()) / (1000 * 60 * 60);
      if (hours < 0) return;
      const idx = BUCKETS.findIndex((b, i) => hours < b.maxHours);
      const bucket = idx === -1 ? 3 : idx;
      counts[bucket]++;
    });
    return counts;
  }, [mergedPrs]);

  const maxCount = Math.max(...bucketCounts, 1);

  if (mergedPrs.length === 0) {
    return (
      <Card className="p-6 flex flex-col justify-center items-center gap-2 min-h-[180px]">
        <p className="text-zinc-400 text-sm">No merged PR data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 flex flex-col gap-4">
      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Cycle Time Distribution</h3>

      <div className="flex flex-col gap-3 flex-1 justify-end">
        {/* Bar chart — horizontal layout for readability */}
        {BUCKETS.map((bucket, i) => {
          const count = bucketCounts[i];
          const widthPct = (count / maxCount) * 100;
          return (
            <div key={bucket.label} className="flex items-center gap-3">
              <span className="text-[11px] text-zinc-500 font-medium w-16 shrink-0 text-right">{bucket.label}</span>
              <div className="flex-1 h-6 bg-zinc-100 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-700 ease-out"
                  style={{ width: `${widthPct}%`, backgroundColor: bucket.color }}
                />
              </div>
              <span
                className={`text-sm font-black w-6 shrink-0 ${count > 0 ? bucket.textColor : 'text-zinc-300'}`}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-1">
        Based on {mergedPrs.length} merged PR{mergedPrs.length !== 1 ? 's' : ''} in selected window
      </p>
    </Card>
  );
};
