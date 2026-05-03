import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';

export interface ActionablePR {
  id: number;
  number: number;
  title: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  state: string;
}

interface ActionCenterProps {
  prs: ActionablePR[];
  repoOwner: string;
  repoName: string;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ prs, repoOwner, repoName }) => {
  const [expanded, setExpanded] = useState(false);
  const now = new Date();

  // Process PRs
  const processedPrs = prs.map(pr => {
    const createdDate = new Date(pr.createdAt);
    const daysOpen = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'stale' | 'needs_review' | 'normal' = 'normal';
    if (daysOpen > 7) {
      status = 'stale';
    } else if (daysOpen > 3) {
      status = 'needs_review';
    }

    return { ...pr, daysOpen, status };
  }).filter(pr => pr.status !== 'normal');

  if (processedPrs.length === 0) return null;

  // Sort: Stale first, then needs_review, then by daysOpen descending
  processedPrs.sort((a, b) => {
    if (a.status === 'stale' && b.status !== 'stale') return -1;
    if (a.status !== 'stale' && b.status === 'stale') return 1;
    return b.daysOpen - a.daysOpen;
  });

  const displayPrs = expanded ? processedPrs : processedPrs.slice(0, 5);

  return (
    <Card className="border border-rose-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="bg-rose-50 border-b border-rose-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-rose-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          <h2 className="text-sm font-bold text-rose-900 tracking-tight">Action Center</h2>
        </div>
        <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
          {processedPrs.length} PR{processedPrs.length !== 1 ? 's' : ''} need{processedPrs.length === 1 ? 's' : ''} attention
        </span>
      </div>

      <div className="divide-y divide-zinc-100 bg-white">
        {displayPrs.map(pr => (
          <a
            key={pr.id}
            href={`https://github.com/${repoOwner}/${repoName}/pull/${pr.number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50 transition-colors group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-2 h-2 rounded-full shrink-0 bg-rose-400"></div>
              <p className="text-sm font-medium text-zinc-900 truncate">
                {pr.title} <span className="text-zinc-400 font-mono text-xs ml-1">#{pr.number}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 pl-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 hidden sm:inline-block">by <span className="font-medium text-zinc-700">{pr.authorName}</span></span>
                <span className="text-zinc-300 hidden sm:inline-block">•</span>
                <span className="text-xs text-zinc-500 hidden sm:inline-block">open {pr.daysOpen} days</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                pr.status === 'stale' 
                  ? 'bg-amber-100 text-amber-800 border border-amber-200/50' 
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-100/50'
              }`}>
                {pr.status === 'stale' ? 'Stale' : 'Needs Review'}
              </span>
            </div>
          </a>
        ))}
      </div>

      {processedPrs.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 transition-colors border-t border-zinc-100"
        >
          {expanded ? "Show less" : `View all ${processedPrs.length}`}
        </button>
      )}
    </Card>
  );
};
