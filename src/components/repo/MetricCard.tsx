import React, { ReactNode } from 'react';
import { Card } from '@/src/components/ui/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon?: ReactNode;
  description?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendLabel = 'vs last window',
  icon,
  description,
  onClick
}) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  // For Cycle Time and Stale PRs, a negative trend (decrease) is actually GOOD.
  const isGood = (title.toLowerCase().includes('cycle') || title.toLowerCase().includes('stale')) 
    ? isNegative 
    : isPositive;
    
  const isBad = (title.toLowerCase().includes('cycle') || title.toLowerCase().includes('stale'))
    ? isPositive
    : isNegative;

  return (
    <Card 
      onClick={onClick}
      className={`p-6 flex flex-col justify-between group transition-all duration-300 bg-white animate-in fade-in slide-in-from-bottom-2 ${
        onClick ? 'cursor-pointer hover:border-indigo-300 hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)]' : 'hover:border-zinc-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em] group-hover:text-zinc-500 transition-colors">{title}</h3>
          {description && <p className="text-[10px] text-zinc-400 font-medium tracking-tight">{description}</p>}
        </div>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-all duration-300">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-3xl font-black text-zinc-900 tracking-tighter group-hover:scale-[1.02] transition-transform duration-300 origin-left">
          {value}
        </span>
        {unit && <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{unit}</span>}
      </div>

      <div className="mt-5 flex items-center gap-2">
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isGood ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 
            isBad ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 
            'bg-zinc-50 text-zinc-500 border border-zinc-200/50'
          }`}>
            <span className="text-[8px]">{isPositive ? '▲' : isNegative ? '▼' : '●'}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{trendLabel}</span>
      </div>
    </Card>
  );
};
