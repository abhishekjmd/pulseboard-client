"use client";

import React from 'react';
import { Card } from '@/src/components/ui/Card';

interface Contributor {
  name: string;
  count: number;
  source?: 'pr' | 'commit';
}

interface ContributorChartProps {
  contributors: Contributor[];
}

const PALETTE = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#64748b', '#a78bfa'];

export const ContributorChart: React.FC<ContributorChartProps> = ({ contributors }) => {
  const top = contributors.slice(0, 8);
  const maxCount = Math.max(...top.map(c => c.count), 1);

  if (top.length === 0) {
    return (
      <Card className="p-6 flex flex-col justify-center items-center gap-2 min-h-[180px]">
        <p className="text-zinc-400 text-sm">No contributor data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 flex flex-col gap-4">
      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Top Contributors</h3>

      <div className="flex flex-col gap-2.5">
        {top.map((contributor, i) => {
          const widthPct = (contributor.count / maxCount) * 100;
          const color = PALETTE[i % PALETTE.length];
          return (
            <div key={contributor.name} className="flex items-center gap-3">
              {/* Rank badge */}
              <span className="text-[10px] font-black text-zinc-300 w-4 shrink-0 text-right">{i + 1}</span>

              {/* Avatar-style initial */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0"
                style={{ backgroundColor: color }}
              >
                {contributor.name.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <span className="text-xs font-medium text-zinc-700 w-24 truncate shrink-0">{contributor.name}</span>

              {/* Bar */}
              <div className="flex-1 h-5 bg-zinc-100 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-700 ease-out"
                  style={{ width: `${widthPct}%`, backgroundColor: color, opacity: 0.85 }}
                />
              </div>

              {/* Count */}
              <span className="text-sm font-black text-zinc-700 w-5 shrink-0 text-right">{contributor.count}</span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-1">
        {top.length > 0 && top[0].source === 'commit' ? 'Commits in selected time window' : 'Merged PRs in selected time window'}
      </p>
    </Card>
  );
};
