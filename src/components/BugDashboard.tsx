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
  const [loading, setLoading] = useState(!initialIssues.length);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [trendData, setTrendData] = useState(() => getMockBugTrends());

  // Helper function to filter issues by selected repository
  const getFilteredIssues = (allIssues: GitHubIssue[]) => {
    if (selectedRepository === 'all') {
      return allIssues;
    }
    return allIssues.filter(issue => issue.repository === selectedRepository);
  };

  useEffect(() => {
    if (initialIssues.length > 0) {
      const filteredIssues = getFilteredIssues(initialIssues);
      setMetrics(calculateCombinedBugMetrics(filteredIssues));
      
      // Generate real trend data from FILTERED issues (matches selected repo)
      const realTrendData = generateBugTrends(filteredIssues, 90);
      setTrendData(realTrendData);
      
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, [initialIssues, selectedRepository]);

  // Recalculate metrics when repository selection changes
  useEffect(() => {
    if (issues.length > 0) {
      const filteredIssues = getFilteredIssues(issues);
      setMetrics(calculateCombinedBugMetrics(filteredIssues));
    }
  }, [issues, selectedRepository]);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/github/bugs');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bug data: ${response.status}`);
      }
      
      const data = await response.json();
      setIssues(data.issues || []);
      const filteredIssues = getFilteredIssues(data.issues || []);
      setMetrics(calculateCombinedBugMetrics(filteredIssues));
      
      // Generate real trend data from FILTERED issues (matches selected repo)  
      const filteredRefreshIssues = getFilteredIssues(data.issues || []);
      const realTrendData = generateBugTrends(filteredRefreshIssues, 90);
      setTrendData(realTrendData);
      
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bug data');
      console.error('Failed to refresh bug data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}>
            <div style={{
              height: '16px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              width: '25%',
              marginBottom: '16px'
            }}></div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{
                  backgroundColor: '#f3f4f6',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    height: '12px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    width: '75%',
                    marginBottom: '8px'
                  }}></div>
                  <div style={{
                    height: '24px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    width: '50%'
                  }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ flexShrink: 0 }}>
            <svg style={{ height: '20px', width: '20px', color: '#f87171' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div style={{ marginLeft: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#991b1b' }}>Error loading bug data</h3>
            <p style={{ fontSize: '14px', color: '#b91c1c', marginTop: '4px' }}>{error}</p>
          </div>
        </div>
        <button
          onClick={refreshData}
          style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#fecaca'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#fee2e2'}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '8px',
        padding: '24px'
      }}>
        <p style={{ color: '#92400e' }}>No issue data available. Click refresh to load data.</p>
        <button
          onClick={refreshData}
          style={{
            marginTop: '12px',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#fde68a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#fef3c7'}
        >
          Load Issue Data
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header with refresh */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              ⚡ Lightning-Thunder Bug Dashboard
            </h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              {selectedRepository === 'all' 
                ? 'Tracking bugs across TransformerEngine, Fuser, and lightning-thunder repositories'
                : `Tracking bugs in ${selectedRepository === 'lightning-thunder' ? 'Lightning-AI/lightning-thunder' : REPO_DISPLAY_NAMES[selectedRepository] || selectedRepository} repository`
              }
            </p>
            {lastUpdated && (
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#93c5fd' : '#2563eb',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
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
              issues={getFilteredIssues(issues)}
              title="Issue Overview"
              showRepository={selectedRepository}
              className=""
            />

            {/* Important Issues That Need Attention */}
            <ImportantIssuesSummary 
              issues={getFilteredIssues(issues)}
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
              issues={getFilteredIssues(issues)}
              selectedRepository={selectedRepository}
              className=""
            />



            {/* Developer Activity & Metrics */}
            <DeveloperActivityChart 
              issues={getFilteredIssues(issues)}
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