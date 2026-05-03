import React, { useMemo } from 'react';
import { Card } from '@/src/components/ui/Card';

interface Insight {
  text: string;
  recommendation?: string;
  type: 'success' | 'warning' | 'info' | 'neutral';
  icon: string;
}

interface InsightLayerProps {
  metrics: {
    avgCycleTimeHours: number;
    prThroughput: number;
    stalePrsCount: number;
    velocityIndex: number;
  };
  trends: {
    cycleTimeTrend: number;
    throughputTrend: number;
    staleTrend: number;
    velocityTrend: number;
  };
  contributorCount: number;
}

export const InsightLayer: React.FC<InsightLayerProps> = ({ metrics, trends, contributorCount }) => {
  const insights = useMemo(() => {
    const list: Insight[] = [];

    // Rule 1: Cycle Time Improvements
    if (trends.cycleTimeTrend < -15) {
      list.push({
        text: `Cycle time improved by ${Math.abs(trends.cycleTimeTrend)}% — team is shipping faster.`,
        recommendation: `Maintain small PR sizes to keep momentum.`,
        type: 'success',
        icon: '⚡'
      });
    } else if (trends.cycleTimeTrend > 25 || metrics.avgCycleTimeHours > 48) {
      list.push({
        text: `Cycle time increased by ${trends.cycleTimeTrend}% — potential review process slowdown.`,
        recommendation: `Consider assigning reviewers earlier or reducing PR size.`,
        type: 'warning',
        icon: '⏳'
      });
    }

    // Rule 2: Stale PRs
    if (metrics.stalePrsCount > 5) {
      list.push({
        text: `${metrics.stalePrsCount} stale PRs detected — review bottleneck identified.`,
        recommendation: `Schedule a triage session to close or prioritize these PRs.`,
        type: 'warning',
        icon: '🛑'
      });
    } else if (metrics.stalePrsCount === 0 && metrics.prThroughput > 0) {
      list.push({
        text: `Zero stale PRs — the engineering queue is moving perfectly.`,
        type: 'success',
        icon: '✅'
      });
    }

    // Rule 3: Throughput & Momentum
    if (trends.throughputTrend > 20) {
      list.push({
        text: `Throughput is up by ${trends.throughputTrend}% — team momentum is building.`,
        type: 'info',
        icon: '🚀'
      });
    }

    // Rule 4: Distribution
    if (contributorCount >= 5 && metrics.velocityIndex > 3) {
      list.push({
        text: `Contributor activity is healthy and well-distributed across the team.`,
        type: 'success',
        icon: '🤝'
      });
    }

    // Fallback if no specific insights
    if (list.length === 0) {
      list.push({
        text: "Repository health is stable with consistent activity levels.",
        type: 'neutral',
        icon: '📊'
      });
    }

    // Return top 2 insights
    return list.slice(0, 2);
  }, [metrics, trends, contributorCount]);

  const typeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    neutral: 'bg-zinc-50 text-zinc-700 border-zinc-100',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight, idx) => (
        <Card 
          key={idx} 
          className={`p-5 flex items-start gap-4 border shadow-sm transition-all hover:shadow-md ${typeStyles[insight.type]}`}
        >
          <div className="text-2xl shrink-0 mt-1">{insight.icon}</div>
          <div className="space-y-1.5">
            <p className="text-[13px] font-bold tracking-tight leading-tight">
              {insight.text}
            </p>
            {insight.recommendation && (
              <p className="text-[11px] font-medium opacity-80 leading-snug">
                <span className="uppercase tracking-widest font-bold text-[9px] mr-1.5 opacity-70">Action</span>
                {insight.recommendation}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
