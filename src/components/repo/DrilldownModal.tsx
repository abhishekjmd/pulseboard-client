import React, { useEffect } from 'react';
import { Card } from '@/src/components/ui/Card';

interface PR {
  id: number;
  number: number;
  title: string;
  authorName: string;
  createdAt: string;
  mergedAt?: string | null;
  state: string;
}

interface DrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  prs: PR[];
  repoOwner: string;
  repoName: string;
  showCycleTime?: boolean;
}

export const DrilldownModal: React.FC<DrilldownModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  prs, 
  repoOwner, 
  repoName,
  showCycleTime
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <Card className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-zinc-900">{title}</h2>
            <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">{prs.length} items</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {prs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">No data available.</div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {prs.map(pr => {
                const createdDate = new Date(pr.createdAt);
                
                let timeText = `Opened ${createdDate.toLocaleDateString()}`;
                
                if (showCycleTime && pr.mergedAt) {
                  const mergedDate = new Date(pr.mergedAt);
                  const hours = ((mergedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60)).toFixed(1);
                  timeText = `Cycle time: ${hours}h`;
                } else if (pr.state === 'merged' && pr.mergedAt) {
                   timeText = `Merged ${new Date(pr.mergedAt).toLocaleDateString()}`;
                } else if (pr.state === 'open') {
                   const daysOpen = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                   timeText = `Open ${daysOpen} days`;
                }

                return (
                  <a
                    key={pr.id}
                    href={`https://github.com/${repoOwner}/${repoName}/pull/${pr.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-zinc-50 rounded-xl transition-colors group gap-2"
                  >
                    <div className="flex items-start gap-3 overflow-hidden">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${pr.state === 'merged' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                      <div>
                        <p className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {pr.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          #{pr.number} by <span className="font-medium text-zinc-700">{pr.authorName}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center sm:justify-end shrink-0 pl-5 sm:pl-0">
                      <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
                        {timeText}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

      </Card>
    </div>
  );
};
