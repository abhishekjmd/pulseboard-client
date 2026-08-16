"use client";

import { useCallback, useEffect, useState } from "react";
import { AddRepo } from "@/src/components/repo/AddRepo";
import { RepoItem, RepoList } from "@/src/components/repo/RepoList";
import { CreateWorkspace } from "@/src/components/workspace/CreateWorkspace";
import { WorkspaceItem, WorkspaceList } from "@/src/components/workspace/WorkspaceList";
import { apiRequest } from "@/src/lib/api";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { ListSkeleton, CardSkeleton, Skeleton } from "@/src/components/ui/Skeleton";

type WorkspacesResponse = {
  success: boolean;
  data: WorkspaceItem[];
};

type ReposResponse = {
  success: boolean;
  repos: RepoItem[];
};

type GitHubConnectionResponse = {
  success: boolean;
  connected: boolean;
  githubUser?: {
    id: string;
    login: string;
  };
};

export default function DashboardRoutePage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
  const [isWorkspacesLoading, setIsWorkspacesLoading] = useState(true);
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [isReposLoading, setIsReposLoading] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [githubConnection, setGithubConnection] = useState<GitHubConnectionResponse | null>(null);
  const [isConnectingGitHub, setIsConnectingGitHub] = useState(false);

  const fetchWorkspaces = useCallback(async () => {
    const response = await apiRequest<WorkspacesResponse>("/api/workspaces");
    return response.data;
  }, []);

  const loadWorkspaces = useCallback(async () => {
    setIsWorkspacesLoading(true);
    try {
      const data = await fetchWorkspaces();
      setWorkspaces(data);
      if (data.length > 0 && !selectedWorkspaceId) {
        setSelectedWorkspaceId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load workspaces");
    } finally {
      setIsWorkspacesLoading(false);
    }
  }, [fetchWorkspaces, selectedWorkspaceId]);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);
  useEffect(() => {
    async function loadGitHubConnection() {
      try {
        const connection = await apiRequest<GitHubConnectionResponse>("/api/github/connection");
        setGithubConnection(connection);
      } catch {
        setGithubConnection({ success: false, connected: false });
      }
    }

    loadGitHubConnection();
  }, []);

  const handleConnectGitHub = async () => {
    setIsConnectingGitHub(true);
    try {
      const response = await apiRequest<{ success: boolean; url: string }>("/api/github/oauth/start");
      globalThis.window.location.href = response.url;
    } catch (err) {
      console.error("Failed to start GitHub OAuth", err);
      setIsConnectingGitHub(false);
    }
  };

  useEffect(() => {
    if (!selectedWorkspaceId) return;
    
    async function loadRepos() {
      setIsReposLoading(true);
      try {
        const res = await apiRequest<ReposResponse>(`/api/workspaces/${selectedWorkspaceId}/repos`);
        setRepos(res.repos);
      } catch {
        console.error("Failed to load repositories");
      } finally {
        setIsReposLoading(false);
      }
    }
    loadRepos();
  }, [selectedWorkspaceId]);

  const handleCreateWorkspace = async (name: string) => {
    await apiRequest("/api/workspaces", { method: "POST", body: { name } });
    setShowCreateWorkspace(false);
    loadWorkspaces();
  };

  const handleAddRepo = async (githubId: string) => {
    if (!selectedWorkspaceId) return;
    await apiRequest("/api/repos/from-github", {
      method: "POST",
      body: { workspaceId: selectedWorkspaceId, githubId },
    });
    setShowAddRepo(false);
    const res = await apiRequest<ReposResponse>(`/api/workspaces/${selectedWorkspaceId}/repos`);
    setRepos(res.repos);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Dynamic Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-zinc-200/80">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Overview
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-lg leading-relaxed">
            Your engineering workspace. Select a workspace, manage connected repositories, and view engineering metrics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-2 shadow-xl shadow-zinc-100">
            <div className={`w-2 h-2 rounded-full ${githubConnection?.connected ? "bg-emerald-500" : "bg-zinc-300"}`} />
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              {githubConnection?.connected && githubConnection.githubUser
                ? `GitHub: ${githubConnection.githubUser.login}`
                : "GitHub disconnected"}
            </span>
          </div>
          <button
            onClick={handleConnectGitHub}
            disabled={isConnectingGitHub}
            className="h-12 px-6 rounded-2xl bg-white text-zinc-700 border border-zinc-100 text-[13px] font-bold shadow-xl shadow-zinc-100 hover:shadow-2xl transition-all duration-500 flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>{isConnectingGitHub ? "Connecting..." : "Connect GitHub"}</span>
          </button>
          <button 
            onClick={() => setShowCreateWorkspace(!showCreateWorkspace)} 
            className={`h-12 px-6 rounded-2xl text-[13px] font-bold transition-all duration-500 flex items-center gap-2 shadow-xl hover:shadow-2xl active:scale-95 ${
              showCreateWorkspace ? 'bg-zinc-100 text-zinc-900 shadow-zinc-100' : 'bg-white text-zinc-700 border border-zinc-100 shadow-zinc-100'
            }`}
          >
            <svg className={`w-4 h-4 transition-transform duration-500 ${showCreateWorkspace ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{showCreateWorkspace ? "Cancel" : "New Workspace"}</span>
          </button>
          <button 
            onClick={() => setShowAddRepo(!showAddRepo)} 
            disabled={!selectedWorkspaceId} 
            className="h-12 px-8 rounded-2xl bg-zinc-900 text-white text-[13px] font-bold shadow-xl shadow-zinc-200 hover:shadow-2xl hover:bg-zinc-800 transition-all duration-500 flex items-center gap-2 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Connect Repository
          </button>
        </div>
      </header>

      {/* Inline Forms Section */}
      {(showCreateWorkspace || showAddRepo) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-6 duration-700">
          {showCreateWorkspace && (
            <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">Create Workspace</h3>
                  <p className="text-sm font-medium text-zinc-500 mt-1">Isolate projects or teams into logical units.</p>
                </div>
                <CreateWorkspace onCreate={handleCreateWorkspace} />
              </div>
            </div>
          )}
          {showAddRepo && (
            <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">Connect Repository</h3>
                  <p className="text-sm font-medium text-zinc-500 mt-1">Start tracking performance for a GitHub repo.</p>
                </div>
                <AddRepo workspaceId={selectedWorkspaceId} githubConnected={githubConnection?.connected ?? false} onAdd={handleAddRepo} onClose={() => setShowAddRepo(false)} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar Selector */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Your Workspaces</h3>
            <div className="h-px flex-1 bg-zinc-100 mx-4" />
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded-lg">
              {workspaces.length}
            </span>
          </div>
          <div className="p-2 bg-white rounded-3xl border border-zinc-100 shadow-sm">
            {isWorkspacesLoading ? (
              <div className="space-y-3 p-2">
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
            ) : (
              <WorkspaceList
                workspaces={workspaces}
                selectedWorkspaceId={selectedWorkspaceId}
                onSelectWorkspace={setSelectedWorkspaceId}
              />
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center text-white text-xl font-black shadow-2xl shadow-zinc-200">
                 {workspaces.find(w => w.id === selectedWorkspaceId)?.name.charAt(0).toUpperCase() || "W"}
               </div>
               <div className="space-y-0.5">
                 <h3 className="text-2xl font-black text-zinc-900 tracking-tighter">
                    {workspaces.find(w => w.id === selectedWorkspaceId)?.name || 'Select Workspace'}
                 </h3>
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Repositories</p>
                 </div>
               </div>
            </div>
            {selectedWorkspaceId && !isReposLoading && (
              <div className="px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                <span className="text-xs font-bold text-zinc-500">{repos.length} Repositories Connected</span>
              </div>
            )}
          </div>

          <div className="min-h-[500px]">
            {isReposLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                <div className="h-64 rounded-[2.5rem] bg-zinc-50 animate-pulse" />
                <div className="h-64 rounded-[2.5rem] bg-zinc-50 animate-pulse" />
                <div className="h-64 rounded-[2.5rem] bg-zinc-50 animate-pulse" />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
                <RepoList repos={repos} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
