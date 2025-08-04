'use client';

import { useState, useEffect } from 'react';

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  labels: Array<{name: string; color: string}>;
  created_at: string;
  closed_at: string | null;
  html_url: string;
  repository: string;
  assignees: Array<{login: string}>;
  user: {login: string};
}

interface BugMetrics {
  totalBugs: number;
  openBugs: number;
  closedBugs: number;
  burnRate: number;
  avgResolutionTime: number;
}

// Mock data generator for demonstration
const generateMockIssues = (repo: string, count: number): GitHubIssue[] => {
  const issues: GitHubIssue[] = [];
  const labels = [
    {name: 'bug', color: 'dc2626'},
    {name: 'enhancement', color: '059669'},
    {name: 'documentation', color: '2563eb'},
    {name: 'critical', color: 'b91c1c'},
    {name: 'performance', color: 'f59e0b'}
  ];
  
  for (let i = 1; i <= count; i++) {
    const isOpen = Math.random() > 0.85;
    const createdDaysAgo = Math.floor(Math.random() * 365);
    const closedDaysAgo = isOpen ? null : Math.floor(Math.random() * createdDaysAgo);
    
    issues.push({
      id: i,
      number: i,
      title: `Issue ${i}: Sample bug report for ${repo}`,
      state: isOpen ? 'open' : 'closed',
      labels: [labels[Math.floor(Math.random() * labels.length)]],
      created_at: new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: closedDaysAgo ? new Date(Date.now() - closedDaysAgo * 24 * 60 * 60 * 1000).toISOString() : null,
      html_url: `https://github.com/NVIDIA/${repo}/issues/${i}`,
      repository: repo,
      assignees: [{login: `developer${Math.floor(Math.random() * 10) + 1}`}],
      user: {login: `reporter${Math.floor(Math.random() * 20) + 1}`}
    });
  }
  
  return issues;
};

export default function DashboardPage() {
  const [selectedRepo, setSelectedRepo] = useState<string>('lightning-thunder');
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [metrics, setMetrics] = useState<BugMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      const mockIssues = generateMockIssues(selectedRepo, selectedRepo === 'lightning-thunder' ? 527 : selectedRepo === 'TransformerEngine' ? 2847 : 1523);
      setIssues(mockIssues);
      
      const bugs = mockIssues.filter(issue => 
        issue.labels.some(label => label.name.toLowerCase().includes('bug'))
      );
      
      const openBugs = bugs.filter(bug => bug.state === 'open').length;
      const closedBugs = bugs.filter(bug => bug.state === 'closed').length;
      const totalBugs = bugs.length;
      
      const resolutionTimes = bugs
        .filter(bug => bug.closed_at)
        .map(bug => {
          const created = new Date(bug.created_at);
          const closed = new Date(bug.closed_at!);
          return (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        });
      
      const avgResolutionTime = resolutionTimes.length > 0 
        ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length 
        : 0;
      
      setMetrics({
        totalBugs,
        openBugs,
        closedBugs,
        burnRate: totalBugs > 0 ? (closedBugs / totalBugs) * 100 : 0,
        avgResolutionTime
      });
      
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  }, [selectedRepo]);

  const refreshData = () => {
    setLoading(true);
    // Trigger the useEffect by updating a dependency
    setSelectedRepo(prev => prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">⚡ Lightning-Thunder Bug Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Real-time tracking for Lightning-AI/lightning-thunder repository
                </p>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {lastUpdated.toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={refreshData}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>

          {/* Repository Selector */}
          <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Repository Selection</h2>
            <div className="flex space-x-4">
              {['lightning-thunder', 'TransformerEngine', 'Fuser'].map((repo) => (
                <button
                  key={repo}
                  onClick={() => setSelectedRepo(repo)}
                  className={`px-4 py-2 rounded-md font-medium ${
                    selectedRepo === repo
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {repo === 'lightning-thunder' ? '⚡ Lightning-Thunder' : 
                   repo === 'TransformerEngine' ? '🚀 TransformerEngine' : '🔥 Fuser'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
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
          ) : (
            <>
              {/* Key Metrics */}
              <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Key Bug Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600">{metrics?.totalBugs || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Bugs</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-3xl font-bold text-red-600">{metrics?.openBugs || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Open Bugs</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-3xl font-bold text-green-600">{metrics?.closedBugs || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Closed Bugs</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600">{metrics?.burnRate.toFixed(1) || 0}%</div>
                    <div className="text-sm text-gray-600 mt-1">Resolution Rate</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">⚡ Performance Indicators</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-700">{metrics?.avgResolutionTime.toFixed(1) || 0}</div>
                        <div className="text-sm text-green-600">Days Avg Resolution</div>
                      </div>
                      <div className="text-3xl text-green-500">⏱️</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-700">{issues.length}</div>
                        <div className="text-sm text-blue-600">Total Issues Tracked</div>
                      </div>
                      <div className="text-3xl text-blue-500">📈</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-700">
                          {new Set(issues.map(i => i.user.login)).size}
                        </div>
                        <div className="text-sm text-purple-600">Active Contributors</div>
                      </div>
                      <div className="text-3xl text-purple-500">👥</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Issues */}
              <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">🔥 Recent Issues</h2>
                <div className="space-y-4">
                  {issues.slice(0, 5).map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            issue.state === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {issue.state}
                          </span>
                          <span className="font-medium text-gray-900">#{issue.number}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mt-1">{issue.title}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Created: {new Date(issue.created_at).toLocaleDateString()}</span>
                          <span>By: {issue.user.login}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {issue.labels.map((label, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `#${label.color}20`, 
                              color: `#${label.color}` 
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Activity */}
              <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">👨‍💻 Team Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Top Contributors</h3>
                    <div className="space-y-2">
                      {Array.from(new Set(issues.map(i => i.user.login))).slice(0, 5).map((contributor, idx) => {
                        const count = issues.filter(i => i.user.login === contributor).length;
                        return (
                          <div key={contributor} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium">{contributor}</span>
                            <span className="text-sm text-gray-600">{count} issues</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Label Distribution</h3>
                    <div className="space-y-2">
                      {['bug', 'enhancement', 'documentation', 'critical', 'performance'].map((labelName) => {
                        const count = issues.filter(i => 
                          i.labels.some(l => l.name === labelName)
                        ).length;
                        return (
                          <div key={labelName} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium capitalize">{labelName}</span>
                            <span className="text-sm text-gray-600">{count} issues</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Documentation Footer */}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}