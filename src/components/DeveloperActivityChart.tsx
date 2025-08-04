'use client';

// Developer activity and metrics component
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { GitHubIssue, SupportedRepo } from '@/lib/github/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DeveloperData {
  developer: string;
  count: number;
  color: string;
}

interface LabelData {
  type: string;
  count: number;
  color: string;
}

interface DeveloperActivityChartProps {
  issues: GitHubIssue[];
  selectedRepository?: SupportedRepo | 'all';
  className?: string;
}

// Define colors for the developer pie chart
const DEVELOPER_COLORS = [
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
];

function getTopDevelopersWhoClosed(issues: GitHubIssue[]): DeveloperData[] {
  // Filter to only include issues closed in the last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const closedIssues = issues.filter(issue => {
    if (issue.state !== 'closed' || !issue.closed_at || !issue.assignees || issue.assignees.length === 0) {
      return false;
    }
    const closedDate = new Date(issue.closed_at);
    return closedDate >= threeMonthsAgo;
  });
  
  const developerCounts: { [key: string]: number } = {};

  closedIssues.forEach(issue => {
    issue.assignees?.forEach(assignee => {
      developerCounts[assignee.login] = (developerCounts[assignee.login] || 0) + 1;
    });
  });

  // Get top 5 developers
  return Object.entries(developerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([developer, count], index) => ({
      developer,
      count,
      color: DEVELOPER_COLORS[index] || '#6b7280', // gray-500 fallback
    }));
}

function getTopLabels(issues: GitHubIssue[], maxLabels: number = 8): LabelData[] {
  const labelCounts: { [key: string]: number } = {};

  // Generate colors for labels
  const LABEL_COLORS = [
    '#ef4444', // red-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
  ];

  const openIssues = issues.filter(issue => issue.state === 'open');

  openIssues.forEach(issue => {
    issue.labels.forEach(label => {
      labelCounts[label.name] = (labelCounts[label.name] || 0) + 1;
    });
  });

  return Object.entries(labelCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxLabels)
    .map(([label, count], index) => ({
      type: label,
      count,
      color: LABEL_COLORS[index % LABEL_COLORS.length],
    }));
}

export function DeveloperActivityChart({ issues, selectedRepository = 'all', className = '' }: DeveloperActivityChartProps) {
  const developerData = React.useMemo(() => {
    return getTopDevelopersWhoClosed(issues);
  }, [issues]);

  const labelsData = React.useMemo(() => {
    return getTopLabels(issues, 8);
  }, [issues]);

  const chartData = {
    labels: developerData.map(item => item.developer),
    datasets: [
      {
        data: developerData.map(item => item.count),
        backgroundColor: developerData.map(item => item.color),
        borderColor: developerData.map(item => item.color),
        borderWidth: 2,
        hoverBackgroundColor: developerData.map(item => item.color + '80'), // Add transparency on hover
        hoverBorderWidth: 3,
      },
    ],
  };

  const labelsChartData = {
    labels: labelsData.map(item => item.type),
    datasets: [
      {
        data: labelsData.map(item => item.count),
        backgroundColor: labelsData.map(item => item.color),
        borderColor: labelsData.map(item => item.color),
        borderWidth: 2,
        hoverBackgroundColor: labelsData.map(item => item.color + '80'), // Add transparency on hover
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 11,
            weight: 'bold' as const
          },
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const count = data.datasets[0].data[i];
                const percentage = ((count / data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
                return {
                  text: `${label} (${count}) - ${percentage}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: 'Top 5 Developers (Closed Issues - Last 3 Months)',
        font: {
          size: 14,
          weight: 'bold' as const
        },
        color: '#374151', // gray-700
        padding: {
          bottom: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} issues closed in last 3 months (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  const labelsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 11,
            weight: 'bold' as const
          },
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const count = data.datasets[0].data[i];
                const percentage = ((count / data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
                return {
                  text: `${label} (${count}) - ${percentage}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: 'Labels Distribution',
        font: {
          size: 14,
          weight: 'bold' as const
        },
        color: '#374151', // gray-700
        padding: {
          bottom: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} issues (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  if (developerData.length === 0 && labelsData.length === 0) {
    return (
      <div className={className}>
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Developer Activity & Metrics</h3>
          <p>No activity data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Developer Activity & Metrics</h3>
      </div>
      
      {/* Two charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Developer Pie Chart */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-[320px] h-[320px] flex-shrink-0">
            {developerData.length > 0 ? (
              <Pie data={chartData} options={chartOptions as any} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No developer data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Labels Distribution Chart */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-[320px] h-[320px] flex-shrink-0">
            {labelsData.length > 0 ? (
              <Pie data={labelsChartData} options={labelsOptions as any} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No labels data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}