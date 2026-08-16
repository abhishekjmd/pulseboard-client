import Link from "next/link";

export type RepoItem = {
  id: number;
  name: string;
  owner: string;
  updatedAt?: string | null;
  lastPrSyncAt?: string | null;
  commitCount?: number;
  contributorCount?: number;
  prCount?: number;
  stalePrCount?: number;
};

function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "Not synced yet";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

type RepoListProps = {
  repos: RepoItem[];
};

export function RepoList({ repos }: RepoListProps) {
  if (repos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-12 flex flex-col items-center justify-center text-center bg-zinc-50/50">
        <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm mb-4">
          <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-zinc-900">No repositories connected</h3>
        <p className="mt-1 text-xs text-zinc-500 max-w-sm">
          Connect a GitHub repository to start tracking pull request health, cycle time, and engineering activity.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {repos.map((repo) => {
        const commits = repo.commitCount ?? 0;
        const contributors = repo.contributorCount ?? 0;
        const prs = repo.prCount ?? 0;
        const stale = repo.stalePrCount ?? 0;
        const timeAgo = formatRelativeTime(repo.updatedAt || repo.lastPrSyncAt);

        return (
          <Link key={repo.id} href={`/repos/${repo.id}`} className="group block">
            <div className="h-full p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {repo.name}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      {repo.owner} / {repo.name}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-zinc-500 bg-zinc-100 border border-zinc-200/60 rounded px-2 py-0.5 uppercase tracking-wider">
                    Repository
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-zinc-100 my-3 text-xs">
                  <div>
                    <span className="font-bold text-zinc-900 text-sm">{commits}</span>{" "}
                    <span className="text-zinc-500">commits</span>
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 text-sm">{contributors}</span>{" "}
                    <span className="text-zinc-500">contributors</span>
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 text-sm">{prs}</span>{" "}
                    <span className="text-zinc-500">PRs</span>
                  </div>
                  <div>
                    <span className={`font-bold text-sm ${stale > 0 ? "text-amber-600" : "text-zinc-900"}`}>{stale}</span>{" "}
                    <span className="text-zinc-500">stale</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-zinc-500">
                <span>Updated {timeAgo}</span>
                <span className="text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all">→</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
