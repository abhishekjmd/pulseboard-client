import React, { useMemo } from 'react';
import { Card } from '@/src/components/ui/Card';

interface PR {
  id: number;
  authorName: string;
  createdAt: string;
}

interface BlockedContributorsProps {
  actionablePrs: PR[];
}

export const BlockedContributors: React.FC<BlockedContributorsProps> = ({ actionablePrs }) => {
  const blockedAuthors = useMemo(() => {
    const now = new Date();
    const blocked: Record<string, number> = {};

    actionablePrs.forEach(pr => {
      const daysOpen = Math.floor((now.getTime() - new Date(pr.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysOpen > 3) {
        if (!blocked[pr.authorName]) blocked[pr.authorName] = 0;
        blocked[pr.authorName]++;
      }
    });

    return Object.entries(blocked)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [actionablePrs]);

  if (blockedAuthors.length === 0) return null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 delay-200">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Potentially Blocked</h2>
      <Card className="border border-amber-100 shadow-sm overflow-hidden bg-white">
        <div className="bg-amber-50 border-b border-amber-100 px-5 py-3">
          <p className="text-xs font-bold text-amber-900">Contributors waiting on review</p>
        </div>
        <div className="divide-y divide-zinc-50">
          {blockedAuthors.map(author => (
            <div key={author.name} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                  {author.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-zinc-900">{author.name}</span>
              </div>
              <span className="text-xs text-zinc-500">
                <span className="font-bold text-amber-600">{author.count}</span> PR{author.count > 1 ? 's' : ''} pending
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
