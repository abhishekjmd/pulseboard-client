"use client";

import React, { useMemo } from 'react';
import { Card } from '@/src/components/ui/Card';

interface PRDistributionChartProps {
  openCount: number;
  mergedCount: number;
  closedCount: number;
}

interface Segment {
  label: string;
  count: number;
  color: string;
  textColor: string;
  bg: string;
}

export const PRDistributionChart: React.FC<PRDistributionChartProps> = ({
  openCount,
  mergedCount,
  closedCount,
}) => {
  const segments: Segment[] = useMemo(() => [
    { label: 'Merged', count: mergedCount, color: '#10b981', textColor: 'text-emerald-600', bg: 'bg-emerald-500' },
    { label: 'Open',   count: openCount,   color: '#f59e0b', textColor: 'text-amber-500',   bg: 'bg-amber-400' },
    { label: 'Closed', count: closedCount, color: '#94a3b8', textColor: 'text-slate-400',   bg: 'bg-slate-400' },
  ], [openCount, mergedCount, closedCount]);

  const total = openCount + mergedCount + closedCount;

  const cx = 80;
  const cy = 80;
  const radius = 60;
  const innerRadius = 38;
  const circumference = 2 * Math.PI * radius;

  const arcs = useMemo(() => {
    if (total === 0) return [];
    let cumulativeAngle = -Math.PI / 2; // start at 12 o'clock
    return segments.map(seg => {
      const fraction = seg.count / total;
      const startAngle = cumulativeAngle;
      const endAngle = startAngle + fraction * 2 * Math.PI;
      cumulativeAngle = endAngle;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const ix1 = cx + innerRadius * Math.cos(startAngle);
      const iy1 = cy + innerRadius * Math.sin(startAngle);
      const ix2 = cx + innerRadius * Math.cos(endAngle);
      const iy2 = cy + innerRadius * Math.sin(endAngle);
      const large = fraction > 0.5 ? 1 : 0;

      // skip tiny slices
      if (seg.count === 0) return null;

      return {
        ...seg,
        fraction,
        d: `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${large} 0 ${ix1} ${iy1} Z`,
      };
    }).filter(Boolean);
  }, [segments, total]);

  if (total === 0) {
    return (
      <Card className="p-6 flex flex-col justify-center items-center gap-2 min-h-[180px]">
        <p className="text-zinc-400 text-sm">No PR data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 flex flex-col gap-4">
      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">PR Distribution</h3>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <svg width={160} height={160} viewBox="0 0 160 160" className="shrink-0">
          {arcs.map((arc, i) => arc && (
            <path key={i} d={arc.d} fill={arc.color} className="transition-opacity hover:opacity-80" />
          ))}
          {/* Center label */}
          <text x={cx} y={cy - 6} textAnchor="middle" className="fill-zinc-900" fontSize={22} fontWeight={900}>{total}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" className="fill-zinc-400" fontSize={9} fontWeight={700} letterSpacing={1.5}>TOTAL</text>
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1">
          {segments.map(seg => (
            <div key={seg.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${seg.bg} shrink-0`} />
                <span className="text-xs font-medium text-zinc-600">{seg.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-black ${seg.textColor}`}>{seg.count}</span>
                <span className="text-[10px] text-zinc-400 font-medium">
                  {total > 0 ? `${Math.round((seg.count / total) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
