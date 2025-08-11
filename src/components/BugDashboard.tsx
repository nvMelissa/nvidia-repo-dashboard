'use client';

// Main bug dashboard component following cursor rules
import { useState, useEffect } from 'react';
import { RepositorySelector } from './RepositorySelector';
import type { GitHubIssue, CombinedBugMetrics, SupportedRepo } from '@/lib/github/types';
import { calculateCombinedBugMetrics, generateBugTrends } from '@/lib/github/metrics';
import { getMockBugTrends } from '@/lib/github/api';

// Dynamic imports for chart components to prevent SSR issues
import dynamic from 'next/dynamic';

const BugChart = dynamic(() => import('./BugChart').then(mod => ({ default: mod.BugChart })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Chart...</div>
});

const BugTrendChart = dynamic(() => import('./BugTrendChart').then(mod => ({ default: mod.BugTrendChart })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Trends...</div>
});

const IssueTypeChart = dynamic(() => import('./IssueTypeChart').then(mod => ({ default: mod.IssueTypeChart })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Issue Types...</div>
});

const DeveloperActivityChart = dynamic(() => import('./DeveloperActivityChart').then(mod => ({ default: mod.DeveloperActivityChart })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Activity...</div>
});

const DORAMetrics = dynamic(() => import('./DORAMetrics').then(mod => ({ default: mod.DORAMetrics })), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Metrics...</div>
});

const ImportantIssuesSummary = dynamic(() => import('./ImportantIssuesSummary').then(mod => ({ default: mod.ImportantIssuesSummary })), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Issues...</div>
});

const CommunityEngagementMetrics = dynamic(() => import('./CommunityEngagementMetrics').then(mod => ({ default: mod.CommunityEngagementMetrics })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Community...</div>
});

// Mock data generator for development
const generateMockIssues = (repository: string, count: number): GitHubIssue[] => {
  const issues: GitHubIssue[] = [];
  const labels = [
    { name: 'bug', color: 'dc2626' },
    { name: 'enhancement', color: '059669' },
    { name: 'documentation', color: '2563eb' },
    { name: 'critical', color: 'b91c1c' },
    { name: 'performance', color: 'f59e0b' }
  ];
  
  // Realistic GitHub usernames for demo
  const developers = [
    'alex-smith', 'sarah-chen', 'mike-johnson', 'lisa-wang', 'david-kim',
    'emily-brown', 'james-wilson', 'maria-garcia', 'robert-lee', 'jennifer-davis'
  ];
  
  const contributors = [
    'pytorch-bot', 'github-actions', 'codecov-io', 'dependabot',
    'john-doe-dev', 'jane-developer', 'ml-engineer-2024', 'ai-researcher',
    'nvidia-intern', 'community-helper', 'open-source-fan', 'bug-hunter-3000',
    'performance-guru', 'documentation-writer', 'test-automation', 'security-expert',
    'devops-engineer', 'frontend-specialist', 'backend-master', 'full-stack-dev'
  ];
  
  for (let i = 1; i <= count; i++) {
    const isOpen = Math.random() > 0.85;
    const createdDaysAgo = Math.floor(Math.random() * 365);
    const closedDaysAgo = isOpen ? null : Math.floor(Math.random() * createdDaysAgo);
    
    issues.push({
      id: i,
      number: i,
      title: `Issue ${i}: Sample bug report for ${repository}`,
      state: isOpen ? 'open' : 'closed',
      labels: [labels[Math.floor(Math.random() * labels.length)]],
      created_at: new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: closedDaysAgo ? new Date(Date.now() - closedDaysAgo * 24 * 60 * 60 * 1000).toISOString() : null,
      html_url: `https://github.com/NVIDIA/${repository}/issues/${i}`,
      repository: repository,
      assignees: [{ login: developers[Math.floor(Math.random() * developers.length)] }],
      user: { login: contributors[Math.floor(Math.random() * contributors.length)] }
    });
  }
  
  return issues;
};

// Display name mapping for repositories
const REPO_DISPLAY_NAMES: Record<SupportedRepo, string> = {
  'TransformerEngine': 'TransformerEngine',
  'Fuser': 'NvFuser',
  'lightning-thunder': 'lightning-thunder'
};

interface BugDashboardProps {
  initialIssues?: GitHubIssue[];
  initialRepository?: SupportedRepo | 'all';
  className?: string;
}

export function BugDashboard({ initialIssues = [], initialRepository = 'all', className = '' }: BugDashboardProps) {
  const [issues, setIssues] = useState<GitHubIssue[]>(initialIssues);
  const [selectedRepository, setSelectedRepository] = useState<SupportedRepo | 'all'>(initialRepository);
  const [metrics, setMetrics] = useState<CombinedBugMetrics | null>(null);
  const [loading, setLoading] = useState(false); // Start with quick mock data, then try real data
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // DEBUG: Log the current state
  console.log('🔍 BugDashboard State:', { 
    loading, 
    error, 
    metrics: !!metrics, 
    issuesCount: issues.length,
    selectedRepository 
  });
  const [trendData, setTrendData] = useState(() => getMockBugTrends());

  // Helper function to filter issues by selected repository
  const getFilteredIssues = (allIssues: GitHubIssue[], repository: string = selectedRepository) => {
    if (repository === 'all') {
      return allIssues;
    }
    return allIssues.filter(issue => issue.repository === repository);
  };

  const refreshData = async () => {
    // Check if we fetched data recently (within 5 minutes)
    const now = Date.now();
    const cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    if (now - lastFetchTime < cacheTimeout && issues.length > 0) {
      console.log('🔄 Using cached data (fetched recently)');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🌐 Fetching REAL GitHub data from /api/github/bugs...');
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/github/bugs', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bug data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Real GitHub data received:', {
        totalIssues: data.issues?.length || 0,
        firstIssue: data.issues?.[0]?.title,
        firstUser: data.issues?.[0]?.user?.login
      });
      
      setIssues(data.issues || []);
      const filteredIssues = getFilteredIssues(data.issues || [], selectedRepository);
      setMetrics(calculateCombinedBugMetrics(filteredIssues));
      
      // Generate real trend data from FILTERED issues (matches selected repo)  
      const filteredRefreshIssues = getFilteredIssues(data.issues || [], selectedRepository);
      const realTrendData = generateBugTrends(filteredRefreshIssues, 90);
      setTrendData(realTrendData);
      
      setLastUpdated(new Date());
      setLastFetchTime(Date.now());
      
    } catch (err) {
      console.warn('⚠️ GitHub API failed, falling back to mock data:', err);
      
      // Fallback to mock data
      const mockData = generateMockIssues(selectedRepository, 100);
      setIssues(mockData);
      
      const mockMetrics = calculateCombinedBugMetrics(mockData);
      setMetrics(mockMetrics);
      
      setLastUpdated(new Date());
      setLastFetchTime(Date.now());
      setError('GitHub API temporarily unavailable - showing demo data with realistic metrics');
      
    } finally {
      setLoading(false);
    }
  };

  // Load mock data immediately, then try real data occasionally
  useEffect(() => {
    console.log('🔄 Loading data for repository:', selectedRepository);
    
    // Load mock data immediately for instant dashboard
    const mockData = generateMockIssues(selectedRepository, 100);
    setIssues(mockData);
    setMetrics(calculateCombinedBugMetrics(mockData));
    setLastUpdated(new Date());
    
    // Try to fetch real data in background (with caching)
    setTimeout(() => refreshData(), 2000); // Delay to let mock data render first
  }, [selectedRepository]);

  // Recalculate metrics when repository selection changes
  useEffect(() => {
    if (issues.length > 0) {
      const filteredIssues = getFilteredIssues(issues, selectedRepository);
      setMetrics(calculateCombinedBugMetrics(filteredIssues));
    }
  }, [issues, selectedRepository]);

  if (loading && !metrics) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 p-4 rounded-lg">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error notice but continue with dashboard if we have data
  const errorNotice = error && (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
          <p className="text-sm text-blue-700 mt-1">{error}</p>
          <p className="text-sm text-blue-600 mt-1">Dashboard is showing realistic sample data.</p>
        </div>
        <button
          onClick={refreshData}
          className="ml-4 bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!metrics) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 ${className}`}>
        <p className="text-yellow-800">No issue data available. Click refresh to load data.</p>
        <button
          onClick={refreshData}
          className="mt-3 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors"
        >
          Load Issue Data
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`} data-dashboard="main">
      {/* Error notice (if any) */}
      {errorNotice}
      
      {/* Header with refresh */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NVIDIA Bug Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {selectedRepository === 'all' 
                ? 'Tracking bugs across TransformerEngine, Fuser, and lightning-thunder repositories'
                : `Tracking bugs in ${REPO_DISPLAY_NAMES[selectedRepository] || selectedRepository} repository`
              }
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <a
              href="/trends"
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
              </svg>
              Trends Dashboard
            </a>
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Repository Filter - Only show for multi-repository dashboard */}
      {selectedRepository === 'all' && (
        <RepositorySelector
          selectedRepository={selectedRepository}
          onRepositoryChange={setSelectedRepository}
        />
      )}

      {/* ========== SECTION 1: ISSUE MANAGEMENT & PROJECT HEALTH ========== */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-4">
                          <h2 className="text-2xl font-bold text-blue-900">Issue Management & Project Health</h2>
            <p className="text-blue-700">
              Goal: Provide a comprehensive view of project health, from immediate fires to long-term trends and workload distribution.
            </p>
          </div>
        </div>
      </div>

      {/* All Issue Management & Project Health Components with White Backgrounds */}
      <div className="space-y-6">
        {/* Issue Overview, Needs Attention, Trends, Distribution, Progression & Developer Activity - Combined Container */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="space-y-6">
            {/* Issue Overview */}
            <BugChart
              data={metrics}
              issues={getFilteredIssues(issues, selectedRepository)}
              title="Issue Overview"
              showRepository={selectedRepository}
              className=""
            />

            {/* Important Issues That Need Attention */}
            <ImportantIssuesSummary 
              issues={getFilteredIssues(issues, selectedRepository)}
              selectedRepository={selectedRepository}
              className=""
            />

            {/* Issue Trends Chart - Last 3 Months */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Issue Trends - Last 3 Months</h3>
              </div>
              <div className="h-80">
                <BugTrendChart
                  data={selectedRepository === 'all' 
                    ? trendData 
                    : trendData.filter(trend => trend.repository === selectedRepository)
                  }
                  showRepository={selectedRepository}
                  title=""
                />
              </div>
            </div>

            {/* Open Issues Distribution */}
            <IssueTypeChart 
              issues={getFilteredIssues(issues, selectedRepository)}
              selectedRepository={selectedRepository}
              className=""
            />



            {/* Developer Activity & Metrics */}
            <DeveloperActivityChart 
              issues={getFilteredIssues(issues, selectedRepository)}
              selectedRepository={selectedRepository}
              className=""
            />
          </div>
        </div>
      </div>

      {/* ========== SECTION 2: DEVELOPER EFFICIENCY ========== */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200 mt-8">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-purple-900">Developer Efficiency</h2>
            <p className="text-purple-700">Pull request metrics, cycle times, and development velocity insights</p>
          </div>
        </div>
      </div>

      {/* PR Metrics & DORA Metrics */}
      <DORAMetrics 
        issues={getFilteredIssues(issues)}
        selectedRepository={selectedRepository}
        className=""
      />

      {/* ========== SECTION 3: COMMUNITY ENGAGEMENT ========== */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200 mt-8">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-green-900">Community Engagement</h2>
            <p className="text-green-700">Community health, contribution patterns, and project adoption metrics</p>
          </div>
        </div>
      </div>

      {/* Community Engagement Metrics */}
      <CommunityEngagementMetrics 
        issues={getFilteredIssues(issues)}
        selectedRepository={selectedRepository}
        className=""
      />

      {/* Documentation Link Footer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-center">
              <p className="text-gray-700 text-sm">
                Need help understanding these metrics?{' '}
                <a 
                  href="/DASHBOARD-METRICS-GUIDE.md" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  View Complete Metrics Guide
                </a>
                {' '}for detailed explanations and interpretation guidance.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Quick reference: <a 
                  href="/METRICS-QUICK-REFERENCE.md" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Metrics Quick Reference Card
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}