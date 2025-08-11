'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Dynamically import Chart.js components to avoid SSR issues
const Line = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Line })), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Bar })), { ssr: false });

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  repository: string;
  created_at: string;
  closed_at: string | null;
  updated_at?: string;
}

interface TimeSeriesData {
  date: string;
  openIssues: number;
}

interface DeveloperAssignment {
  developer: string;
  assignedIssues: number;
  openedIssues: number;
  totalIssues: number;
  assignedIssuesList: any[];
  openedIssuesList: any[];
}

const REPO_DISPLAY_NAMES = {
  'Fuser': 'NvFuser',
  'lightning-thunder': 'Thunder-Lightning', 
  'TransformerEngine': 'Transformer Engine'
};

const REPO_COLORS = {
  'Fuser': {
    line: '#EF4444',
    background: 'rgba(239, 68, 68, 0.1)',
  },
  'lightning-thunder': {
    line: '#06B6D4', 
    background: 'rgba(6, 182, 212, 0.1)',
  },
  'TransformerEngine': {
    line: '#3B82F6',
    background: 'rgba(59, 130, 246, 0.1)',
  },
};

export default function TrendsPage() {
  const [trendsData, setTrendsData] = useState<{[repo: string]: TimeSeriesData[]}>({});
  const [developerData, setDeveloperData] = useState<{[repo: string]: DeveloperAssignment[]}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Generate time series data from real GitHub issues
  const generateTimeSeriesData = (issues: GitHubIssue[], repo: string): TimeSeriesData[] => {
    const timePoints: { [date: string]: number } = {};
    
    // Generate daily data points for the last 90 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);
    
    // Initialize all dates with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      timePoints[dateStr] = 0;
    }
    
    // Count open issues for each date
    Object.keys(timePoints).forEach(dateStr => {
      const currentDate = new Date(dateStr + 'T00:00:00Z');
      
      const openIssuesCount = issues.filter(issue => {
        if (issue.repository !== repo) return false;
        
        const createdDate = new Date(issue.created_at);
        const closedDate = issue.closed_at ? new Date(issue.closed_at) : null;
        
        // Issue was created before or on current date
        const wasCreated = createdDate <= currentDate;
        
        // Issue was not closed or closed after current date  
        const wasOpen = !closedDate || closedDate > currentDate;
        
        return wasCreated && wasOpen;
      }).length;
      
      timePoints[dateStr] = openIssuesCount;
    });
    
    return Object.entries(timePoints)
      .map(([date, openIssues]) => ({ date, openIssues }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // Generate developer assignment data from real GitHub issues
  const generateDeveloperAssignmentData = (issues: GitHubIssue[], repo: string): DeveloperAssignment[] => {
    const developerMap: { [dev: string]: { assigned: any[], opened: any[] } } = {};
    
    // Filter open issues for this repository
    const openIssues = issues.filter(issue => 
      issue.repository === repo && 
      issue.state === 'open'
    );
    
    // Group by assignees and creators
    openIssues.forEach(issue => {
      const assignees = (issue as any).assignees || [];
      const creator = (issue as any).user?.login || 'Unknown';
      
      // Track opened issues
      if (!developerMap[creator]) {
        developerMap[creator] = { assigned: [], opened: [] };
      }
      developerMap[creator].opened.push(issue);
      
      // Track assigned issues
      if (assignees.length === 0) {
        // Unassigned issues
        if (!developerMap['Unassigned']) {
          developerMap['Unassigned'] = { assigned: [], opened: [] };
        }
        developerMap['Unassigned'].assigned.push(issue);
      } else {
        assignees.forEach((assignee: any) => {
          const devName = assignee?.login || 'Unknown';
          if (!developerMap[devName]) {
            developerMap[devName] = { assigned: [], opened: [] };
          }
          developerMap[devName].assigned.push(issue);
        });
      }
    });
    
    // Convert to array and sort by total involvement
    return Object.entries(developerMap)
      .map(([developer, data]) => {
        const assignedCount = data.assigned.length;
        const openedCount = data.opened.length;
        const totalCount = assignedCount + openedCount;
        
        return {
          developer,
          assignedIssues: assignedCount,
          openedIssues: openedCount,
          totalIssues: totalCount,
          assignedIssuesList: data.assigned,
          openedIssuesList: data.opened
        };
      })
      .filter(dev => dev.totalIssues > 0) // Only show developers with issues
      .sort((a, b) => b.totalIssues - a.totalIssues)
      .slice(0, 15); // Top 15 developers by total involvement
  };

  // Generate mock developer data as fallback
  const generateMockDeveloperData = (repo: string): DeveloperAssignment[] => {
    const mockDevelopers = [
      'dev-user-1', 'dev-user-2', 'dev-user-3', 'dev-user-4', 'dev-user-5',
      'Unassigned'
    ];
    
    return mockDevelopers.map(dev => {
      const assigned = Math.floor(Math.random() * 10) + 1;
      const opened = Math.floor(Math.random() * 8) + 1;
      return {
        developer: dev,
        assignedIssues: assigned,
        openedIssues: opened,
        totalIssues: assigned + opened,
        assignedIssuesList: [],
        openedIssuesList: []
      };
    }).sort((a, b) => b.totalIssues - a.totalIssues);
  };

  // Generate mock data as fallback
  const generateMockTimeSeriesData = (repo: string): TimeSeriesData[] => {
    const data: TimeSeriesData[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);
    
    const baseIssues = {
      'Fuser': 45,
      'lightning-thunder': 78,
      'TransformerEngine': 62
    };
    
    let currentIssues = baseIssues[repo as keyof typeof baseIssues] || 50;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      // Add realistic variation
      const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
      currentIssues = Math.max(20, Math.min(120, currentIssues + change));
      
      data.push({
        date: dateStr,
        openIssues: currentIssues
      });
    }
    
    return data;
  };

  const fetchTrendsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🌐 Fetching GitHub data for trends dashboard...');
      
      const response = await fetch('/api/github/bugs');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      const issues: GitHubIssue[] = data.issues || [];
      
      console.log(`✅ Fetched ${issues.length} issues for trends analysis`);
      
      // Generate time series data for each repo
      const repoNames = ['Fuser', 'lightning-thunder', 'TransformerEngine'];
      const trends: {[repo: string]: TimeSeriesData[]} = {};
      const developers: {[repo: string]: DeveloperAssignment[]} = {};
      
      repoNames.forEach(repo => {
        trends[repo] = generateTimeSeriesData(issues, repo);
        developers[repo] = generateDeveloperAssignmentData(issues, repo);
      });
      
      setTrendsData(trends);
      setDeveloperData(developers);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.warn('⚠️ GitHub API failed, using mock data:', err);
      
      // Generate mock data
      const mockTrends: {[repo: string]: TimeSeriesData[]} = {};
      const mockDevelopers: {[repo: string]: DeveloperAssignment[]} = {};
      const repoNames = ['Fuser', 'lightning-thunder', 'TransformerEngine'];
      
      repoNames.forEach(repo => {
        mockTrends[repo] = generateMockTimeSeriesData(repo);
        mockDevelopers[repo] = generateMockDeveloperData(repo);
      });
      
      setTrendsData(mockTrends);
      setDeveloperData(mockDevelopers);
      setLastUpdated(new Date());
      setError('Using demo data (GitHub API temporarily unavailable)');
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendsData();
  }, []);

  const createChartData = (data: TimeSeriesData[], repo: string) => {
    const colors = REPO_COLORS[repo as keyof typeof REPO_COLORS];
    
    return {
      labels: data.map(point => point.date),
      datasets: [
        {
          label: 'Open Issues',
          data: data.map(point => point.openIssues),
          borderColor: colors.line,
          backgroundColor: colors.background,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: colors.line,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
      ],
    };
  };

  const createDeveloperChartData = (data: DeveloperAssignment[], repo: string) => {
    // Create distinct colors for assigned vs opened with matching backgrounds and borders
    const assignedColor = '#0F766E'; // Teal-700 for assigned
    const openedColor = '#A16207';   // Amber-700/Brown for opened
    
    const assignedBackgroundColor = '#14B8A6'; // Teal-500 for assigned background
    const openedBackgroundColor = '#F59E0B';   // Amber-500/Brown for opened background
    
    return {
      labels: data.map(dev => dev.developer),
      datasets: [
        {
          label: 'Assigned to Developer',
          data: data.map(dev => dev.assignedIssues),
          backgroundColor: assignedBackgroundColor,
          borderColor: assignedColor,
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
          stack: 'stack1',
        },
        {
          label: 'Opened by Developer',
          data: data.map(dev => dev.openedIssues),
          backgroundColor: openedBackgroundColor,
          borderColor: openedColor,
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
          stack: 'stack1',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: 'bold' as const,
          },
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            const date = new Date(context[0].label);
            return date.toLocaleDateString('en-US', { 
              weekday: 'short',
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          },
          label: function(context: any) {
            return `Open Issues: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM dd',
          },
        },
        title: {
          display: true,
          text: 'Date',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          color: '#6B7280',
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Open Issues',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          color: '#6B7280',
          precision: 0,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: 'bold' as const,
          },
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            return `Developer: ${context[0].label}`;
          },
          label: function(context: any) {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;
            return `${datasetLabel}: ${value} issues`;
          },
          footer: function(context: any) {
            const total = context.reduce((sum: number, item: any) => sum + item.parsed.y, 0);
            return `Total: ${total} issues`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Developer',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          color: '#6B7280',
          maxRotation: 45,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Open Issues',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          color: '#6B7280',
          precision: 0,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md border mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Repository Trends Dashboard</h1>
                <p className="text-gray-600 mt-2">
                  Open issues over time for NVIDIA repositories (Last 90 Days)
                </p>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {lastUpdated.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={fetchTrendsData}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
                <a
                  href="/dashboard"
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Main Dashboard
                </a>
              </div>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
                  <p className="text-sm text-blue-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Repository Trends Sections */}
          <div className="space-y-8">
            {Object.entries(REPO_DISPLAY_NAMES).map(([repoKey, displayName]) => {
              const data = trendsData[repoKey] || [];
              const devData = developerData[repoKey] || [];
              const currentIssues = data.length > 0 ? data[data.length - 1]?.openIssues || 0 : 0;
              const totalAssigned = devData.reduce((sum, dev) => sum + dev.assignedIssues, 0);
              const totalOpened = devData.reduce((sum, dev) => sum + dev.openedIssues, 0);
              const totalInvolvement = devData.reduce((sum, dev) => sum + dev.totalIssues, 0);
              
              return (
                <div key={repoKey} className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {displayName}
                    </h2>
                    <p className="text-gray-600">
                      Open issues trend over the last 90 days
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Current: {currentIssues} open issues • Data points: {data.length}
                    </p>
                  </div>
                  
                  {/* Issues Over Time Chart */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Issues Over Time</h3>
                    <div className="h-80">
                      {data.length > 0 ? (
                        <Line 
                          data={createChartData(data, repoKey)} 
                          options={chartOptions as any}
                        />
                      ) : (
                        <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-medium text-gray-700 mb-2">
                              Loading {displayName} data...
                            </div>
                            <div className="text-sm text-gray-500">
                              Chart will appear once data is loaded
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Developer Assignment Chart */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">👥 Developer Issue Involvement</h3>
                      <p className="text-sm text-gray-600">
                        Open issues assigned to + opened by each developer (stacked bars)
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-2">
                        <span>🟦 Teal - Assigned: {totalAssigned} issues</span>
                        <span>🟨 Brown/Amber - Opened: {totalOpened} issues</span>
                        <span>📊 Total: {totalInvolvement} issues</span>
                        <span>👥 Developers: {devData.length}</span>
                      </div>
                    </div>
                    <div className="h-80">
                      {devData.length > 0 ? (
                        <Bar 
                          data={createDeveloperChartData(devData, repoKey)} 
                          options={barChartOptions as any}
                        />
                      ) : (
                        <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-medium text-gray-700 mb-2">
                              Loading developer assignment data...
                            </div>
                            <div className="text-sm text-gray-500">
                              Chart will appear once data is loaded
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                📈 Interactive Line Charts with Real GitHub Data
              </h3>
              <p className="text-gray-600 mb-4">
                Each chart shows the number of open issues over the last 90 days with daily granularity. 
                Hover over data points for detailed information including exact dates and issue counts.
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>• Real-time GitHub API data</span>
                <span>• 90-day historical view</span>
                <span>• Interactive tooltips</span>
                <span>• Daily granularity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}