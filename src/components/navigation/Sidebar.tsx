"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiRequest } from "@/src/lib/api";
import { useDashboard } from "@/src/lib/DashboardContext";
import { Skeleton } from "@/src/components/ui/Skeleton";

interface SidebarRepo {
  id: number;
  name: string;
}

interface SidebarWorkspace {
  id: number;
  name: string;
  repositories?: SidebarRepo[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setIsSidebarOpen } = useDashboard();
  const [workspaces, setWorkspaces] = useState<SidebarWorkspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiRequest<{ success: boolean; data: SidebarWorkspace[] }>("/api/workspaces");
        const workspacesWithRepos = await Promise.all(
          res.data.map(async (ws) => {
            try {
              const repoRes = await apiRequest<{ success: boolean; repos: SidebarRepo[] }>(`/api/workspaces/${ws.id}/repos`);
              return { ...ws, repositories: repoRes.repos };
            } catch {
              return ws;
            }
          })
        );
        setWorkspaces(workspacesWithRepos);
      } catch (err) {
        console.error("Sidebar load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-[2px] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-zinc-900 md:w-64 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex h-[60px] items-center px-6 shrink-0 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-zinc-900 font-bold text-xs transition-transform group-hover:scale-105">
              P
            </div>
            <span className="text-[13px] font-bold text-white tracking-wide">
              Pulseboard
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-8 custom-scrollbar">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center rounded-md px-3 py-2 text-[13px] font-medium transition-all ${
                isActive("/dashboard")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              <svg className="w-4 h-4 mr-2.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Overview
            </Link>
          </nav>

          <div className="space-y-4">
            <div className="px-3 flex items-center justify-between">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Workspaces
              </h3>
            </div>
            {loading ? (
              <div className="px-3 space-y-4">
                <Skeleton className="h-3 w-20 bg-zinc-800" />
                <div className="ml-2 space-y-2">
                  <Skeleton className="h-2.5 w-24 bg-zinc-800" />
                  <Skeleton className="h-2.5 w-20 bg-zinc-800" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {workspaces.map((ws) => (
                  <div key={ws.id} className="space-y-1">
                    <div className="px-3 py-1 flex items-center gap-2 text-zinc-300">
                       <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="text-[12px] font-semibold tracking-tight">{ws.name}</span>
                    </div>
                    <div className="space-y-0.5">
                      {ws.repositories?.map((repo) => (
                        <Link
                          key={repo.id}
                          href={`/repos/${repo.id}`}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center rounded-md px-3 pl-8 py-1.5 text-[12px] transition-all ${
                            isActive(`/repos/${repo.id}`)
                              ? "bg-zinc-800 text-white font-medium"
                              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                          }`}
                        >
                          <svg className={`w-3.5 h-3.5 mr-2 ${isActive(`/repos/${repo.id}`) ? "text-zinc-300" : "text-zinc-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          {repo.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
