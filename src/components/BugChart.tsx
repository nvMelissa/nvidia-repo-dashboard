'use client';

// Bug chart components following cursor rules for multi-repo visualization
import React from 'react';
import type { CombinedBugMetrics, BugMetrics, SupportedRepo, GitHubIssue } from '@/lib/github/types';

interface BugChartProps {
  data: CombinedBugMetrics;
  issues: GitHubIssue[];
  className?: string;
  title: string;
  showRepository?: SupportedRepo | 'all';
}

function calculateCloseTimeMetrics(issues: GitHubIssue[]): {
  avgDaysToClose: number;
  issuesClosedLast3Months: number;
} {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const recentlyClosedIssues = issues.filter(issue => {
    if (issue.state !== 'closed' || !issue.closed_at) return false;
    const closedDate = new Date(issue.closed_at);
    return closedDate >= threeMonthsAgo;
  });

  if (recentlyClosedIssues.length === 0) {
    return { avgDaysToClose: 0, issuesClosedLast3Months: 0 };
  }

  const totalDays = recentlyClosedIssues.reduce((sum, issue) => {
    const created = new Date(issue.created_at);
    const closed = new Date(issue.closed_at!);
    const days = Math.ceil((closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  return {
    avgDaysToClose: Math.round(totalDays / recentlyClosedIssues.length),
    issuesClosedLast3Months: recentlyClosedIssues.length,
  };
}

function calculateWeeklyMetrics(issues: GitHubIssue[]): {
  newIssuesThisWeek: number;
  closedIssuesThisWeek: number;
} {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const newIssuesThisWeek = issues.filter(issue => {
    const createdDate = new Date(issue.created_at);
    return createdDate >= oneWeekAgo;
  }).length;

  const closedIssuesThisWeek = issues.filter(issue => {
    if (issue.state !== 'closed' || !issue.closed_at) return false;
    const closedDate = new Date(issue.closed_at);
    return closedDate >= oneWeekAgo;
  }).length;

  return {
    newIssuesThisWeek,
    closedIssuesThisWeek,
  };
}

function calculateAgeMetrics(issues: GitHubIssue[]): {
  avgAgeOfOpenIssues: number;
} {
  const openIssues = issues.filter(issue => issue.state === 'open');
  
  if (openIssues.length === 0) {
    return { avgAgeOfOpenIssues: 0 };
  }

  const now = new Date();
  const totalDays = openIssues.reduce((sum, issue) => {
    const createdDate = new Date(issue.created_at);
    const ageInDays = Math.ceil((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + ageInDays;
  }, 0);

  return {
    avgAgeOfOpenIssues: Math.round(totalDays / openIssues.length),
  };
}

export function BugChart({ data, issues, className = '', title, showRepository = 'all' }: BugChartProps) {
  const chartData = showRepository === 'all' 
    ? data.overall 
    : data.byRepository[showRepository];
    
  const timeMetrics = React.useMemo(() => {
    return calculateCloseTimeMetrics(issues);
  }, [issues]);

  const weeklyMetrics = React.useMemo(() => {
    return calculateWeeklyMetrics(issues);
  }, [issues]);

  const ageMetrics = React.useMemo(() => {
    return calculateAgeMetrics(issues);
  }, [issues]);

  const getStatusColor = (type: 'open' | 'closed' | 'total') => {
    switch (type) {
      case 'open': return 'bg-red-500';
      case 'closed': return 'bg-green-500';
      case 'total': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTextColor = (type: 'open' | 'closed' | 'total') => {
    switch (type) {
      case 'open': return 'text-red-700';
      case 'closed': return 'text-green-700';
      case 'total': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      {/* Issue Statistics Cards - Split into 2 rows */}
      {/* Issue Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Open Issues */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${getStatusColor('open')} mr-2`}></div>
            <span className="text-sm font-medium text-gray-600">Total Open Issues</span>
          </div>
          <p className={`text-2xl font-bold ${getTextColor('open')} mt-1`}>
            {chartData.openBugs}
          </p>
        </div>
        
        {/* New Issues (This Week) */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm font-medium text-gray-600">New Issues (This Week)</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {weeklyMetrics.newIssuesThisWeek}
          </p>
        </div>
        
        {/* Closed Issues (This Week) */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${getStatusColor('closed')} mr-2`}></div>
            <span className="text-sm font-medium text-gray-600">Closed Issues (This Week)</span>
          </div>
          <p className={`text-2xl font-bold ${getTextColor('closed')} mt-1`}>
            {weeklyMetrics.closedIssuesThisWeek}
          </p>
        </div>
        
        {/* Avg Age of Open Issues */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-sm font-medium text-gray-600">Avg Age of Open Issues</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {ageMetrics.avgAgeOfOpenIssues} days
          </p>
        </div>
      </div>
    </div>
  );
}

interface RepoComparisonChartProps {
  data: CombinedBugMetrics;
  metric: keyof BugMetrics;
  className?: string;
}

export function RepoComparisonChart({ data, metric, className = '' }: RepoComparisonChartProps) {
  const repos: SupportedRepo[] = ['TransformerEngine', 'Fuser', 'lightning-thunder'];
  
  const getMetricLabel = (metric: keyof BugMetrics): string => {
    switch (metric) {
      case 'totalBugs': return 'Total Bugs';
      case 'openBugs': return 'Open Bugs';
      case 'closedBugs': return 'Closed Bugs';
      case 'burnRate': return 'Burn Rate (%)';
      case 'avgResolutionTime': return 'Avg Resolution Time (days)';
      case 'recentActivity': return 'Recent Activity (30 days)';
      default: return metric;
    }
  };

  const getMetricValue = (repoData: BugMetrics, metric: keyof BugMetrics): number => {
    return repoData[metric] as number;
  };

  const maxValue = Math.max(...repos.map(repo => getMetricValue(data.byRepository[repo], metric)));

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Repository Comparison - {getMetricLabel(metric)}
      </h3>
      
      <div className="space-y-4">
        {repos.map((repo) => {
          const value = getMetricValue(data.byRepository[repo], metric);
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          return (
            <div key={repo} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{repo}</span>
                <span className="text-sm text-gray-600">
                  {metric === 'burnRate' ? `${value}%` : value}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Overall Comparison */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Overall (All Repos)</span>
          <span className="text-sm font-semibold text-blue-600">
            {metric === 'burnRate' 
              ? `${getMetricValue(data.overall, metric)}%` 
              : getMetricValue(data.overall, metric)
            }
          </span>
        </div>
      </div>
    </div>
  );
}