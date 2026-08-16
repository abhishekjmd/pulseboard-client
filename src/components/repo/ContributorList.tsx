import React from 'react';
import { Card } from '@/src/components/ui/Card';

interface Contributor {
  name: string;
  count: number;
  source?: 'pr' | 'commit';
}

interface ContributorListProps {
  contributors: Contributor[];
}

export const ContributorList: React.FC<ContributorListProps> = ({ contributors }) => {
  const maxCount = Math.max(...contributors.map(c => c.count), 1);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Contributors</h2>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{contributors.length} active</span>
      </div>
      
      <Card className="p-6 border-zinc-200/50 shadow-[0_2px_15px_rgb(0,0,0,0.02)] bg-white">
        {contributors.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-100">
              <svg className="w-6 h-6 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-[12px] font-bold text-zinc-900 uppercase tracking-widest">Quiet Period</h3>
            <p className="mt-1 text-[11px] text-zinc-400 font-medium">No contributor data recorded yet</p>
          </div>
        ) : (
          <div className="space-y-7">
            {contributors.map((c, index) => {
              const percentage = (c.count / maxCount) * 100;
                  const label = c.source === 'commit' ? 'commits' : 'PRs';
                  return (
                <div 
                  key={c.name} 
                  className="space-y-2.5 group animate-in fade-in slide-in-from-right-2"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] text-white font-black shadow-sm group-hover:bg-indigo-600 transition-colors duration-300">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-bold text-zinc-900 tracking-tight group-hover:text-indigo-900 transition-colors">
                        {c.name}
                      </span>
                    </div>
                        <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-100 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all duration-300">
                          <span className="text-[12px] font-black text-zinc-900 group-hover:text-indigo-700">{c.count}</span>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
                        </div>
                  </div>
                  <div className="h-1 w-full bg-zinc-100/50 rounded-full overflow-hidden border border-zinc-50">
                    <div 
                      className="h-full bg-zinc-900 rounded-full group-hover:bg-indigo-600 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(79,70,229,0.2)]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
      
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100/50 mt-6 group hover:bg-white hover:shadow-md transition-all duration-300">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 opacity-60">System Insight</p>
        <p className="text-[11px] text-zinc-600 font-medium leading-relaxed tracking-tight">
          {contributors.length > 0 && contributors[0].source === 'commit'
            ? 'Contribution volume is analyzed based on commits within the current window.'
            : 'Contribution volume is analyzed based on merged pull requests within the current window.'}
        </p>
      </div>
    </div>
  );
};
