import React, { useMemo } from 'react';
import { Card } from '@/src/components/ui/Card';
import { formatShortDate } from '@/src/lib/dateUtils';

interface ActivityPoint {
  date: string;
  count: number;
}

interface ActivityChartProps {
  data: ActivityPoint[];
  loading?: boolean;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data, loading }) => {
  const chartHeight = 200;
  const chartWidth = 800;
  const padding = 20;

  const points = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const xStep = (chartWidth - padding * 2) / (data.length - 1 || 1);
    
    return data.map((d, i) => ({
      x: padding + i * xStep,
      y: chartHeight - padding - (d.count / maxCount) * (chartHeight - padding * 2),
      date: d.date,
      count: d.count
    }));
  }, [data, chartWidth, chartHeight]);

  const pathData = useMemo(() => {
    if (points.length < 2) return "";
    return `M ${points[0].x} ${points[0].y} ` + 
      points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  }, [points]);

  const areaData = useMemo(() => {
    if (points.length < 2) return "";
    return `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;
  }, [pathData, points, chartHeight]);

  if (loading) {
     return (
       <Card className="p-6 h-[300px] flex items-center justify-center bg-zinc-50/30 border-dashed animate-pulse">
         <div className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest">Generating Velocity Graph...</div>
       </Card>
     );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Velocity History</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 shadow-[0_0_8px_rgba(0,0,0,0.2)]"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Merged PRs</span>
          </div>
        </div>
      </div>

      <Card className="p-6 overflow-hidden border-zinc-200/50 shadow-[0_2px_15px_rgb(0,0,0,0.02)] group bg-white">
        <div className="relative h-[220px] w-full">
          {(!data || data.length === 0) ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest">No historical data</p>
              <p className="text-zinc-300 text-[10px] mt-1">Check back after more activity</p>
            </div>
          ) : (
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={padding} y1={chartHeight/2} x2={chartWidth - padding} y2={chartHeight/2} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e4e4e7" strokeWidth="1" />

              <path 
                d={areaData} 
                fill="url(#velocity-gradient)" 
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
              />
              
              <path 
                d={pathData} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-zinc-900 group-hover:text-indigo-600 transition-colors duration-500"
              />

              {points.map((p, i) => (
                <circle 
                  key={i} 
                  cx={p.x} 
                  cy={p.y} 
                  r="3.5" 
                  className="fill-white stroke-zinc-900 group-hover:stroke-indigo-600 stroke-[2.5] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:r-5 cursor-crosshair" 
                />
              ))}

              <defs>
                <linearGradient id="velocity-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>
        
        <div className="flex justify-between mt-6 px-1">
           {data && data.length > 0 && (
             <>
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                 {formatShortDate(data[0].date)}
               </span>
               <div className="flex-1 mx-8 border-b border-zinc-100 border-dashed h-2"></div>
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                 {formatShortDate(data[data.length - 1].date)}
               </span>
             </>
           )}
        </div>
      </Card>
    </div>
  );
};
