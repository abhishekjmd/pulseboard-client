"use client";



export type WorkspaceItem = {
  id: number;
  name: string;
  createdAt: string;
};

type WorkspaceListProps = {
  workspaces: WorkspaceItem[];
  selectedWorkspaceId?: number | null;
  onSelectWorkspace?: (id: number) => void;
};

export function WorkspaceList({
  workspaces,
  selectedWorkspaceId,
  onSelectWorkspace,
}: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-8 flex flex-col items-center justify-center text-center bg-zinc-50/30">
        <div className="w-8 h-8 bg-white border border-zinc-200 rounded-lg flex items-center justify-center shadow-sm mb-3">
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">Empty Nest</h3>
        <p className="mt-1 text-[11px] font-medium text-zinc-500 leading-relaxed px-4">
          Group your projects by creating your first workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {workspaces.map((workspace) => {
        const isSelected = selectedWorkspaceId === workspace.id;

        return (
          <button
            key={workspace.id}
            type="button"
            onClick={() => onSelectWorkspace?.(workspace.id)}
            className={`w-full text-left rounded-2xl transition-all duration-500 group relative overflow-hidden ${
              isSelected 
                ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200" 
                : "hover:bg-zinc-50 text-zinc-600"
            }`}
          >
            <div className="flex items-center gap-4 p-4 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500 ${
                isSelected 
                  ? 'bg-white/10 border border-white/20' 
                  : 'bg-zinc-100 border border-zinc-200 group-hover:bg-white group-hover:border-zinc-300'
              }`}>
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-[13px] font-bold tracking-tight truncate transition-colors ${
                  isSelected ? 'text-white' : 'text-zinc-900'
                }`}>
                  {workspace.name}
                </h3>
                <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 transition-colors ${
                  isSelected ? 'text-zinc-400' : 'text-zinc-400'
                }`}>
                   Workspace ID: #{workspace.id}
                </p>
              </div>

              {isSelected && (
                <div className="animate-in fade-in zoom-in-50 duration-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                </div>
              )}
            </div>
            
            {isSelected && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
            )}
          </button>
        );
      })}
    </div>
  );
}
