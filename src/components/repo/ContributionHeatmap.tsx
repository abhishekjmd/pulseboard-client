import React, { useMemo, useState } from 'react';
import { Card } from '@/src/components/ui/Card';

interface DayData {
  date: string;
  count: number;
}

interface ContributionHeatmapProps {
  contributions: Record<string, number>;
  loading?: boolean;
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ contributions, loading }) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const grid = useMemo(() => {
    const today = new Date();
    const days: DayData[] = [];
    
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    
    // Adjust to previous Sunday (0) to align the grid
    const dayOfWeek = startDate.getDay();
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(startDate.getDate() - dayOfWeek);

    const currentDate = new Date(adjustedStart);
    
    // Generate ~53 weeks of data
    while (currentDate <= today || days.length % 7 !== 0) {
      const dateStr = currentDate.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        count: contributions[dateStr] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Safety break
      if (days.length > 400) break;
    }
    
    const weeks: DayData[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [contributions]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-zinc-800'; // Gray in dark theme
    if (count < 3) return 'bg-emerald-900'; // Dark green
    if (count < 6) return 'bg-emerald-700'; 
    if (count < 10) return 'bg-emerald-500';
    return 'bg-emerald-400'; // Bright green
  };

  if (loading) {
    return (
      <Card className="p-8 bg-zinc-950 border-zinc-900 h-[200px] flex items-center justify-center animate-pulse">
        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Loading Pulse Grid...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Contribution Pulse</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-bold uppercase">Less</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-zinc-800"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-900"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-700"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></div>
          </div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase">More</span>
        </div>
      </div>

      <Card className="p-6 bg-zinc-950 border-zinc-900 shadow-2xl relative overflow-visible group">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1.5 shrink-0">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3 h-3 rounded-[2px] ${getColor(day.count)} transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer shadow-sm`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Custom Tooltip */}
        {hoveredDay && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg shadow-2xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
            <p className="text-[10px] font-bold text-zinc-100 whitespace-nowrap">
              {dayDataFormatter(hoveredDay.date)}
            </p>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">
              {hoveredDay.count} commits
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

const dayDataFormatter = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
