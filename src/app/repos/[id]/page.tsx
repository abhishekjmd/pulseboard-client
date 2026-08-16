"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MetricCard } from "@/src/components/repo/MetricCard";
import { ActivitySection } from "@/src/components/repo/ActivitySection";
import { ContributorList } from "@/src/components/repo/ContributorList";
import { ActivityChart } from "@/src/components/repo/ActivityChart";
import { HealthScore } from "@/src/components/repo/HealthScore";
import { ContributionHeatmap } from "@/src/components/repo/ContributionHeatmap";
import { ActionCenter } from "@/src/components/repo/ActionCenter";
import { DailySummary } from "@/src/components/repo/DailySummary";
import { DrilldownModal } from "@/src/components/repo/DrilldownModal";
import { PRDistributionChart } from "@/src/components/repo/PRDistributionChart";
import { CycleTimeChart } from "@/src/components/repo/CycleTimeChart";
import { TimeRangeSelector } from "@/src/components/repo/TimeRangeSelector";
import { useDashboard } from "@/src/lib/DashboardContext";
import { apiRequest } from "@/src/lib/api";
import { MetricSkeleton, Skeleton } from "@/src/components/ui/Skeleton";
import { Button } from "@/src/components/ui/Button";

interface Repo {
  id: number;
  name: string;
  owner: string;
  lastPrSyncAt: string | null;
  syncStatus?: "ready" | "processing";
}

interface ActivityPoint {
  date: string;
  count: number;
}

interface HealthData {
  metrics: {
    avgCycleTimeHours: number;
    prThroughput: number;
    stalePrsCount: number;
    openPrsCount: number;
    closedPrsCount: number;
    velocityIndex: number;
  };
  trends: {
    cycleTimeTrend: number;
    throughputTrend: number;
    staleTrend: number;
    velocityTrend: number;
  };
  activities: {
    id: string;
    type: "PR_OPENED" | "PR_MERGED" | "PR_STALE" | "PR_CLOSED";
    title: string;
    user: string;
    timestamp: string;
    number?: number;
  }[];
  topContributors: {
    name: string;
    count: number;
  }[];
  engineering?: {
    totalCommits: number;
    uniqueAuthors: number;
    topCommitters: { name: string; count: number }[];
    activityHistory: ActivityPoint[];
  } | null;
  activityHistory: ActivityPoint[];
  actionablePrs: any[];
  mergedPrsList: any[];
}

export default function RepoDashboardPage() {
  const { id } = useParams();
  const { window, setWindow } = useDashboard();
  const [data, setData] = useState<HealthData | null>(null);
  const [repo, setRepo] = useState<Repo | null>(null);
  const [contributions, setContributions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [contribLoading, setContribLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [drilldown, setDrilldown] = useState<{
    isOpen: boolean;
    title: string;
    prs: any[];
    showCycleTime?: boolean;
  }>({ isOpen: false, title: "", prs: [] });

  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchHealth = useCallback(async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    setContribLoading(true);

    try {
      const repoRes = await apiRequest<{ success: boolean; data: Repo }>(`/api/repos/${id}`);
      setRepo(repoRes.data);

      if (repoRes.data.syncStatus === "processing") {
        setError(null);

        if (!pollInterval.current) {
          pollInterval.current = setInterval(async () => {
            try {
              const statusRes = await apiRequest<{ success: boolean; data: { syncStatus: string } }>(`/api/repos/${id}/sync-status`);
              if (statusRes.data.syncStatus === "ready") {
                if (pollInterval.current) {
                  clearInterval(pollInterval.current);
                  pollInterval.current = null;
                }
                const [healthRes, contribRes] = await Promise.all([
                  apiRequest<{ success: boolean; data: HealthData }>(`/api/metrics/repos/${id}/health?window=${window}`),
                  apiRequest<{ success: boolean; contributions: Record<string, number> }>(`/api/repos/${id}/contributions`)
                ]);
                setData(healthRes.data);
                setContributions(contribRes.contributions);
                setError(null);
              }
            } catch (pollErr) {
              console.warn("Sync-status poll error", pollErr);
            }
          }, 3000);
        }
        return;
      }

      const [healthRes, contribRes] = await Promise.all([
        apiRequest<{ success: boolean; data: HealthData }>(`/api/metrics/repos/${id}/health?window=${window}`),
        apiRequest<{ success: boolean; contributions: Record<string, number> }>(`/api/repos/${id}/contributions`)
      ]);

      setData(healthRes.data);
      setContributions(contribRes.contributions);
      setError(null);
    } catch (err: unknown) {
      if (!isPolling) {
        const message = err instanceof Error ? err.message : "Failed to load repository health";
        setError(message);
      }
    } finally {
      if (!isPolling) setLoading(false);
      setContribLoading(false);
    }
  }, [id, window]);

  useEffect(() => {
    if (id) {
      fetchHealth();
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [id, window, fetchHealth]);

  const triggerIngestion = async () => {
    setIsTriggering(true);
    try {
      await apiRequest(`/api/repos/${id}/sync-prs`, { method: "POST" });
      await fetchHealth();
    } catch (err: unknown) {
      console.error("Ingestion failed:", err);
      globalThis.window.location.reload();
    } finally {
      setIsTriggering(false);
    }
  };

  function relativeTime(ts: string | null) {
    if (!ts) return "Never synced";
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
    const days = Math.round(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-sm font-semibold text-zinc-900">Failed to load data</h2>
          <p className="mt-1 text-sm text-zinc-500">{error}</p>
        </div>
        <Button onClick={() => fetchHealth()} variant="secondary">Try Again</Button>
      </div>
    );
  }

  const isProcessing = repo?.syncStatus === "processing";
  const hasPRData = Boolean(data && ((data.metrics.prThroughput && data.metrics.prThroughput > 0) || (data.mergedPrsList && data.mergedPrsList.length > 0) || (data.activities && data.activities.length > 0)));
  const hasEngineering = Boolean(data && data.engineering && data.engineering.totalCommits > 0);

  return (
    <div className="space-y-10">
      
      {/* 1. Repository Header */}
      <div className="border-b border-zinc-200/80 pb-6 space-y-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <span>←</span>
          <span>Overview</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {(!loading && data && !isProcessing) ? (
              <HealthScore metrics={data.metrics} />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 animate-pulse flex items-center justify-center shrink-0">
                <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                {loading ? <Skeleton className="h-8 w-48" /> : repo?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
                <span className="font-mono">{repo?.owner}/{repo?.name}</span>
                <span>·</span>
                <span className="bg-zinc-100 border border-zinc-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 uppercase">
                  Repository
                </span>
                <span>·</span>
                <span>Last synced {relativeTime(repo?.lastPrSyncAt || null)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <TimeRangeSelector value={window} onChange={(val) => setWindow(val as any)} />
            <Button variant="secondary" onClick={triggerIngestion} disabled={isTriggering || loading || isProcessing} className="h-9 px-4 text-xs">
              {isTriggering || isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
                  <span>{isProcessing ? "Processing..." : "Syncing..."}</span>
                </div>
              ) : "Force Sync"}
            </Button>
          </div>
        </div>
      </div>

      {/* Action Center Layer */}
      {(!loading && data && !isProcessing && repo && data.actionablePrs && data.actionablePrs.length > 0) && (
        <ActionCenter prs={data.actionablePrs} repoOwner={repo.owner} repoName={repo.name} />
      )}

      {/* 2. Executive Overview */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Executive Overview</h2>
        {(loading || isProcessing) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Contributors"
              value={hasEngineering ? String(data.engineering!.uniqueAuthors) : (hasPRData ? String(Math.max(1, Math.round(data.metrics.velocityIndex))) : "0")}
              unit="contributors"
              description={hasEngineering ? "Commit authors in window" : (hasPRData ? "Active team members" : "No activity recorded")}
            />

            <MetricCard
              title="Total Commits"
              value={hasEngineering ? String(data.engineering!.totalCommits) : "0"}
              unit="commits"
              description={hasEngineering ? "Ingested commit volume" : "No commits found"}
            />

            <MetricCard
              title="PR Throughput"
              value={hasPRData ? String(data.metrics.prThroughput) : "0"}
              unit="merged"
              trend={hasPRData ? data.trends.throughputTrend : 0}
              description={hasPRData ? "Merged PRs in window" : "No PR history"}
              onClick={() => { if (hasPRData) setDrilldown({ isOpen: true, title: "Recently Merged", prs: data.mergedPrsList || [] }); }}
            />

            <MetricCard
              title="Avg Cycle Time"
              value={hasPRData && data.metrics.avgCycleTimeHours > 0 ? data.metrics.avgCycleTimeHours.toFixed(1) : "—"}
              unit={hasPRData && data.metrics.avgCycleTimeHours > 0 ? "hours" : ""}
              trend={hasPRData ? data.trends.cycleTimeTrend : 0}
              description={hasPRData && data.metrics.avgCycleTimeHours > 0 ? "PR creation to merge" : "No PR cycle data"}
            />
          </div>
        ) : null}
      </div>

      {/* 3. PR Health */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">PR Health</h2>
        {loading || isProcessing ? (
          <div className="h-40 bg-zinc-50 rounded-2xl animate-pulse" />
        ) : data ? (
          !hasPRData ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-2">
              <h3 className="text-base font-bold text-zinc-900 uppercase tracking-wide">NO PR DATA AVAILABLE</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                This repository has no pull request history in the selected window. Engineering activity is shown below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PRDistributionChart
                openCount={data.metrics.openPrsCount}
                mergedCount={data.metrics.prThroughput}
                closedCount={data.metrics.closedPrsCount}
              />
              <CycleTimeChart mergedPrs={data.mergedPrsList || []} />
            </div>
          )
        ) : null}
      </div>

      {/* 4. Engineering Activity */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Engineering Activity</h2>
        {loading || isProcessing ? (
          <div className="h-40 bg-zinc-50 rounded-2xl animate-pulse" />
        ) : data ? (
          !hasEngineering ? (
            <div className="rounded-2xl border border-zinc-200 p-8 bg-white text-center space-y-2">
              <h3 className="text-base font-bold text-zinc-900">No commit activity recorded</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                No commits were found in the selected window. Try triggering a sync if commits were recently pushed.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-zinc-200 p-6 bg-white space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Commit Summary</h3>
                    <div className="text-3xl font-extrabold text-zinc-900">{data.engineering!.totalCommits}</div>
                    <div className="text-xs text-zinc-500 mt-1">{data.engineering!.uniqueAuthors} active contributors</div>
                  </div>

                  {data.engineering!.topCommitters && data.engineering!.topCommitters.length > 0 && (
                    <div className="pt-3 border-t border-zinc-100">
                      <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Top Committers</h4>
                      <ul className="space-y-2">
                        {data.engineering!.topCommitters.map((c) => (
                          <li key={c.name} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-zinc-900">{c.name}</span>
                            <span className="font-bold text-zinc-700 bg-zinc-100 rounded px-2 py-0.5">{c.count}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 rounded-2xl border border-zinc-200 p-6 bg-white">
                  <ActivityChart data={(data.engineering && data.engineering.activityHistory) ? data.engineering.activityHistory.map((p: any) => ({ date: p.date, count: p.count })) : data.activityHistory || []} />
                </div>
              </div>

              <ContributionHeatmap contributions={contributions} loading={contribLoading || isProcessing} />
            </div>
          )
        ) : null}
      </div>

      {/* 5 & 6. Contributors & Recent Activity */}
      {(!loading && data && !isProcessing) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          <div className="lg:col-span-2 space-y-6">
            <ActivitySection activities={data.activities} />
          </div>

          <div className="space-y-6">
            <ContributorList contributors={data.topContributors} />
            <DailySummary actionablePrs={data.actionablePrs || []} mergedPrs={data.mergedPrsList || []} />
            
            {/* Health Score Explanation Context Card */}
            <div className="rounded-2xl border border-zinc-200 p-5 bg-white space-y-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Health Score Calculation</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                The Health Score is a deterministic 0–100 rating based on PR cycle time speed (&lt;24h target), stale PR ratios (&lt;10% target), and merged PR volume.
              </p>
            </div>
          </div>
        </div>
      )}

      <DrilldownModal 
        isOpen={drilldown.isOpen} 
        onClose={() => setDrilldown({ ...drilldown, isOpen: false })}
        title={drilldown.title}
        prs={drilldown.prs}
        repoOwner={repo?.owner || ""}
        repoName={repo?.name || ""}
        showCycleTime={drilldown.showCycleTime}
      />
    </div>
  );
}
