import Link from "next/link";
import { Card } from "@/src/components/ui/Card";

export type RepoItem = {
  id: number;
  name: string;
  owner: string;
};

type RepoListProps = {
  repos: RepoItem[];
};

export function RepoList({ repos }: RepoListProps) {
  if (repos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-200 p-16 flex flex-col items-center justify-center text-center bg-zinc-50/20">
        <div className="w-14 h-14 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center shadow-sm mb-6 animate-bounce duration-[2000ms]">
          <svg className="w-7 h-7 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-[17px] font-black text-zinc-900 tracking-tight">Connect your first repository</h3>
        <p className="mt-2 text-[13px] font-medium text-zinc-500 max-w-[280px] leading-relaxed">
          Unlock health signals, cycle time tracking, and throughput metrics by connecting a GitHub repo.
        </p>
        <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full text-white text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-zinc-800 transition-colors">
           Get Started
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
           </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {repos.map((repo) => (
        <Link key={repo.id} href={`/repos/${repo.id}`} className="group h-full">
          <div className="h-full p-8 rounded-[2.5rem] bg-white border border-zinc-100 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.04)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-700 cursor-pointer relative overflow-hidden flex flex-col justify-between group">
            {/* Subtle Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-white to-violet-50/0 group-hover:from-indigo-50/30 group-hover:via-white group-hover:to-violet-50/30 transition-colors duration-700" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:border-zinc-900 group-hover:text-white transition-all duration-700 shadow-sm group-hover:shadow-xl group-hover:shadow-zinc-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-1.5 shadow-sm shadow-emerald-100/50">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">
                    {repo.owner}
                  </p>
                </div>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tighter leading-tight">
                  {repo.name}
                </h3>
              </div>
            </div>

            <div className="mt-12 relative z-10 flex items-center justify-between pt-6 border-t border-zinc-50 group-hover:border-zinc-100 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="flex -space-x-2">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-100" />
                   ))}
                 </div>
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Team active</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 shadow-lg shadow-zinc-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
