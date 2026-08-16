import { Card } from '@/src/components/ui/Card';
import { formatRelativeTime } from '@/src/lib/dateUtils';

interface Activity {
  id: string;
  type: 'PR_OPENED' | 'PR_MERGED' | 'PR_STALE' | 'PR_CLOSED';
  title: string;
  user: string;
  timestamp: string;
  number?: number;
}

interface ActivitySectionProps {
  activities: Activity[];
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  switch (type) {
    case 'PR_OPENED':
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm group-hover:bg-amber-100 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      );
    case 'PR_MERGED':
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-100 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case 'PR_STALE':
      return (
        <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm group-hover:bg-rose-100 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </div>
      );
  }
};

export const ActivitySection: React.FC<ActivitySectionProps> = ({ activities }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Engineering Activity</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Recent</span>
        </div>
      </div>
      
      <Card className="overflow-hidden border-zinc-200/50 shadow-[0_2px_15px_rgb(0,0,0,0.02)] bg-white">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-100">
               <svg className="w-6 h-6 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <h3 className="text-[12px] font-bold text-zinc-900 uppercase tracking-widest">No Activity Found</h3>
             <p className="mt-1 text-[11px] text-zinc-400 font-medium">The team is currently focused elsewhere.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100/60">
            {activities.map((act, index) => (
              <div 
                key={act.id} 
                className="flex items-start gap-4 p-5 hover:bg-zinc-50/50 transition-all group animate-in fade-in slide-in-from-top-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ActivityIcon type={act.type} />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[13px] font-bold text-zinc-900 truncate leading-snug tracking-tight group-hover:text-indigo-900 transition-colors">
                      {act.title}
                    </span>
                    {act.number && (
                      <span className="text-[11px] font-bold text-zinc-400 tabular-nums">#{act.number}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-md bg-zinc-900 flex items-center justify-center text-[8px] text-white font-black uppercase shadow-sm">
                        {act.user?.charAt(0) || '?'}
                      </div>
                      <span className="text-[11px] font-bold text-zinc-600 tracking-tight">{act.user || 'Unknown'}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      act.type === 'PR_MERGED' ? 'text-emerald-600' :
                      act.type === 'PR_STALE' ? 'text-rose-600' :
                      'text-amber-600'
                    }`}>
                      {(act.type || 'EVENT').replace('PR_', '').toLowerCase()}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                    <span className="text-[10px] font-bold text-zinc-400 tabular-nums uppercase tracking-tighter">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 pt-1.5 self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">
                   <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                   </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
