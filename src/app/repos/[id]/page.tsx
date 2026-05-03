"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { MetricCard } from '@/src/components/repo/MetricCard';
import { ActivitySection } from '@/src/components/repo/ActivitySection';
import { ContributorList } from '@/src/components/repo/ContributorList';
import { InsightLayer } from '@/src/components/repo/InsightLayer';
import { ActivityChart } from '@/src/components/repo/ActivityChart';
import { HealthScore } from '@/src/components/repo/HealthScore';
import { ContributionHeatmap } from '@/src/components/repo/ContributionHeatmap';
import { ActionCenter } from '@/src/components/repo/ActionCenter';
import { DailySummary } from '@/src/components/repo/DailySummary';
import { BlockedContributors } from '@/src/components/repo/BlockedContributors';
import { DrilldownModal } from '@/src/components/repo/DrilldownModal';
import { PRDistributionChart } from '@/src/components/repo/PRDistributionChart';
import { CycleTimeChart } from '@/src/components/repo/CycleTimeChart';
import { ContributorChart } from '@/src/components/repo/ContributorChart';
import { useDashboard } from '@/src/lib/DashboardContext';
import { apiRequest } from '@/src/lib/api';
import { MetricSkeleton, ListSkeleton, CardSkeleton, Skeleton } from '@/src/components/ui/Skeleton';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

interface Repo {
  id: number;
  name: string;
  owner: string;
  lastPrSyncAt: string | null;
  syncStatus?: 'ready' | 'processing';
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
    type: 'PR_OPENED' | 'PR_MERGED' | 'PR_STALE' | 'PR_CLOSED';
    title: string;
    user: string;
    timestamp: string;
    number?: number;
  }[];
  topContributors: {
    name: string;
    count: number;
  }[];
  activityHistory: ActivityPoint[];
  actionablePrs: any[];
  mergedPrsList: any[];
}

export default function RepoDashboardPage() {
  const { id } = useParams();
  const { window } = useDashboard();
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
  }>({ isOpen: false, title: '', prs: [] });
  
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchHealth = useCallback(async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    setContribLoading(true);
    
    try {
      const [healthRes, repoRes, contribRes] = await Promise.all([
        apiRequest<{ success: boolean; data: HealthData }>(`/api/metrics/repos/${id}/health?window=${window}`),
        apiRequest<{ success: boolean; data: Repo }>(`/api/repos/${id}`),
        apiRequest<{ success: boolean; contributions: Record<string, number> }>(`/api/repos/${id}/contributions`)
      ]);
      
      setData(healthRes.data);
      setRepo(repoRes.data);
      setContributions(contribRes.contributions);
      setError(null);

      // Stop polling if status is ready
      if (repoRes.data.syncStatus === 'ready' && pollInterval.current) {
        clearInterval(pollInterval.current);
        pollInterval.current = null;
      }
      
      // Start polling if status is processing and we aren't already
      if (repoRes.data.syncStatus === 'processing' && !pollInterval.current) {
        pollInterval.current = setInterval(() => fetchHealth(true), 5000);
      }

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

  const isProcessing = repo?.syncStatus === 'processing';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
           {/* Health Score Component */}
           {(!loading && data && !isProcessing) ? (
             <div className="animate-in zoom-in-95 duration-500">
               <HealthScore metrics={data.metrics} />
             </div>
           ) : (
             <div className="w-20 h-20 rounded-full bg-zinc-100 animate-pulse border-4 border-zinc-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-400 rounded-full animate-spin"></div>
             </div>
           )}

           <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{repo?.owner || "Repository"}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isProcessing ? 'text-amber-500 animate-pulse' : 'text-emerald-600'}`}>
                  {isProcessing ? "Analyzing repository... fetching PR data" : "Live Data"}
                </span>
              </div>
              <h1 className="text-3xl font-black text-zinc-900 tracking-tighter leading-none">
                {loading ? <Skeleton className="h-8 w-48" /> : repo?.name}
              </h1>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={triggerIngestion} disabled={isTriggering || loading || isProcessing} className="h-10 px-5">
              {isTriggering || isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin"></div>
                  <span>{isProcessing ? "Processing..." : "Syncing..."}</span>
                </div>
              ) : "Force Sync"}
            </Button>
        </div>
      </div>
      
      {/* Action Center Layer */}
      {(!loading && data && !isProcessing && repo && data.actionablePrs) && (
        <ActionCenter prs={data.actionablePrs} repoOwner={repo.owner} repoName={repo.name} />
      )}
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {(loading || isProcessing) ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : data ? (
          <>
            <MetricCard 
              title="Avg Cycle Time" 
              value={data.metrics.avgCycleTimeHours.toFixed(1)} 
              unit="hours"
              trend={data.trends.cycleTimeTrend}
              description="Merge speed"
              onClick={() => {
                const slowest = [...(data.mergedPrsList || [])].sort((a, b) => {
                  const cycleA = new Date(a.mergedAt).getTime() - new Date(a.createdAt).getTime();
                  const cycleB = new Date(b.mergedAt).getTime() - new Date(b.createdAt).getTime();
                  return cycleB - cycleA;
                });
                setDrilldown({ isOpen: true, title: 'Slowest PRs', prs: slowest, showCycleTime: true });
              }}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard 
              title="PR Throughput" 
              value={data.metrics.prThroughput} 
              unit="merged"
              trend={data.trends.throughputTrend}
              description="Output volume"
              onClick={() => {
                setDrilldown({ isOpen: true, title: 'Recently Merged', prs: data.mergedPrsList || [] });
              }}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <MetricCard 
              title="Open PRs" 
              value={data.metrics.openPrsCount} 
              unit="active"
              trend={data.trends.staleTrend}
              description={`${data.metrics.stalePrsCount} are stale (>7d)`}
              onClick={() => {
                const stales = (data.actionablePrs || []).filter((pr: any) => {
                  const daysOpen = Math.floor((new Date().getTime() - new Date(pr.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return daysOpen > 7;
                });
                setDrilldown({ isOpen: true, title: 'Stale PRs', prs: stales.length > 0 ? stales : (data.actionablePrs || []) });
              }}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
            <MetricCard 
              title="Velocity Index" 
              value={data.metrics.velocityIndex.toFixed(1)} 
              unit="devs"
              trend={data.trends.velocityTrend}
              description="Active team"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </>
        ) : null}
      </div>

      {/* Engineering Insights — Charts */}
      {(!loading && data && !isProcessing) ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
          <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Engineering Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PRDistributionChart
              openCount={data.metrics.openPrsCount}
              mergedCount={data.metrics.prThroughput}
              closedCount={data.metrics.closedPrsCount}
            />
            <CycleTimeChart mergedPrs={data.mergedPrsList || []} />
            <ContributorChart contributors={data.topContributors} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-4 w-40 bg-zinc-100 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-52 bg-zinc-50 rounded-2xl animate-pulse" />
            <div className="h-52 bg-zinc-50 rounded-2xl animate-pulse" />
            <div className="h-52 bg-zinc-50 rounded-2xl animate-pulse" />
          </div>
        </div>
      )}

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 gap-10">
        <div className="animate-in fade-in slide-in-from-top-2 duration-500 delay-100">
          <ContributionHeatmap contributions={contributions} loading={contribLoading || isProcessing} />
        </div>

        {(!loading && data && !isProcessing) ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-500 delay-200">
            <ActivityChart data={data.activityHistory || []} />
          </div>
        ) : (
          <div className="h-[300px] w-full bg-zinc-50 rounded-2xl animate-pulse flex items-center justify-center">
             <div className="text-zinc-300 text-xs font-bold uppercase tracking-widest">Generating Activity Trend...</div>
          </div>
        )}

        {(!loading && data && !isProcessing) ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-500 delay-300">
            <InsightLayer 
              metrics={data.metrics} 
              trends={data.trends} 
              contributorCount={data.topContributors.length} 
              />
          </div>
        ) : (
          <div className="h-[120px] w-full bg-zinc-50 rounded-2xl animate-pulse"></div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 pt-4">
        {/* Main Activity Column */}
        <div className="lg:col-span-2 space-y-6">
          {(loading || isProcessing) ? (
             <div className="space-y-4">
               <Skeleton className="h-4 w-32" />
               <Card className="overflow-hidden">
                 <ListSkeleton rows={5} />
               </Card>
             </div>
          ) : data ? (
            <ActivitySection activities={data.activities} />
          ) : null}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-10">
           {(!loading && data && !isProcessing) ? (
             <DailySummary actionablePrs={data.actionablePrs || []} mergedPrs={data.mergedPrsList || []} />
           ) : (
             <div className="space-y-4">
               <Skeleton className="h-4 w-32" />
               <CardSkeleton />
             </div>
           )}

           {(!loading && data && !isProcessing && data.actionablePrs) ? (
             <BlockedContributors actionablePrs={data.actionablePrs} />
           ) : null}

           {(loading || isProcessing) ? (
             <div className="space-y-4">
               <Skeleton className="h-4 w-32" />
               <CardSkeleton />
             </div>
           ) : data ? (
             <ContributorList contributors={data.topContributors} />
           ) : null}

          {/* Context Card */}
           <div className="space-y-4">
             <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Performance Benchmarks</h2>
             <Card className="p-6 bg-gradient-to-br from-indigo-900 to-zinc-900 border-none shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
               <p className="relative z-10 text-[14px] text-zinc-100 leading-relaxed font-bold italic tracking-tight">
                "Teams with cycle times under 24h ship 40% fewer bugs. Performance starts with small, focused PRs."
               </p>
               <div className="mt-6 flex items-center justify-between relative z-10">
                 <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Industry Standard</span>
                 <div className="h-1 w-12 bg-indigo-500/30 rounded-full"></div>
               </div>
             </Card>
           </div>
        </div>
      </div>
      
      <DrilldownModal 
        isOpen={drilldown.isOpen} 
        onClose={() => setDrilldown({ ...drilldown, isOpen: false })}
        title={drilldown.title}
        prs={drilldown.prs}
        repoOwner={repo?.owner || ''}
        repoName={repo?.name || ''}
        showCycleTime={drilldown.showCycleTime}
      />
    </div>
  );
}
