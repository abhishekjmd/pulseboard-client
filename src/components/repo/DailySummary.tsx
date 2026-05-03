import React, { useMemo } from 'react';
import { Card } from '@/src/components/ui/Card';

interface PR {
  createdAt: string;
  mergedAt?: string | null;
  state: string;
}

interface DailySummaryProps {
  actionablePrs: PR[];
  mergedPrs: PR[];
}

export const DailySummary: React.FC<DailySummaryProps> = ({ actionablePrs, mergedPrs }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let openedToday = 0;
    let openedYesterday = 0;
    
    // Count opened (we only have open PRs in actionablePrs, but we can also check mergedPrs to see if they were opened today/yesterday and merged quickly)
    // Actually, getting an exact count of ALL PRs opened today requires backend logic. But we can approximate with what we have.
    const allPrs = [...actionablePrs, ...mergedPrs];
    // Deduplicate by object identity or a simple set if we had IDs, but we just want to count safely.
    // It's better to just count from the combined lists (assuming no overlap, which is true because one is open, one is merged)
    
    allPrs.forEach(pr => {
      const createdStr = new Date(pr.createdAt).toISOString().split('T')[0];
      if (createdStr === todayStr) openedToday++;
      if (createdStr === yesterdayStr) openedYesterday++;
    });

    let mergedToday = 0;
    let mergedYesterday = 0;

    mergedPrs.forEach(pr => {
      if (pr.mergedAt) {
        const mergeStr = new Date(pr.mergedAt).toISOString().split('T')[0];
        if (mergeStr === todayStr) mergedToday++;
        if (mergeStr === yesterdayStr) mergedYesterday++;
      }
    });

    const needsAttention = actionablePrs.filter(pr => {
      const daysOpen = Math.floor((now.getTime() - new Date(pr.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return daysOpen > 3;
    }).length;

    return {
      openedToday,
      openedTrend: openedToday - openedYesterday,
      mergedToday,
      mergedTrend: mergedToday - mergedYesterday,
      needsAttention
    };
  }, [actionablePrs, mergedPrs]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 delay-100">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Today's Summary</h2>
      <Card className="p-5 border-none shadow-sm bg-gradient-to-br from-white to-zinc-50 border border-zinc-100">
        <div className="flex flex-col gap-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Opened today</p>
                <p className="text-xl font-black text-zinc-900 leading-none mt-1">{stats.openedToday}</p>
              </div>
            </div>
            {stats.openedTrend !== 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stats.openedTrend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                {stats.openedTrend > 0 ? '+' : ''}{stats.openedTrend} vs yesterday
              </span>
            )}
          </div>

          <div className="h-px bg-zinc-100 w-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Merged today</p>
                <p className="text-xl font-black text-zinc-900 leading-none mt-1">{stats.mergedToday}</p>
              </div>
            </div>
            {stats.mergedTrend !== 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stats.mergedTrend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                {stats.mergedTrend > 0 ? '+' : ''}{stats.mergedTrend} vs yesterday
              </span>
            )}
          </div>

          <div className="h-px bg-zinc-100 w-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Needs attention</p>
                <p className="text-xl font-black text-zinc-900 leading-none mt-1">{stats.needsAttention}</p>
              </div>
            </div>
            {stats.needsAttention > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                Action required
              </span>
            )}
          </div>

        </div>
      </Card>
    </div>
  );
};
