'use client';

// Issue progression chart with dual Y-axes following cursor rules
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { GitHubIssue, SupportedRepo } from '@/lib/github/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BurndownDataPoint {
  date: string;
  openIssues: number; // Actual number of issues open on this date
  closedPercentage: number; // Percentage of total bugs that are closed
  dateObj: Date; // For easier sorting and processing
}

interface IssueProgressionChartProps {
  issues: GitHubIssue[];
  className?: string;
  selectedRepository?: SupportedRepo | 'all';
}

function createBurndownData(issues: GitHubIssue[]): BurndownDataPoint[] {
  const burndownData: BurndownDataPoint[] = [];
  
  // Start from 3 months ago
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  
  // Create weekly intervals over the last 3 months
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const checkDate = new Date(currentDate);
    
    // Count how many issues existed by this date (created on or before)
    const totalIssuesByDate = issues.filter(issue => {
      const createdDate = new Date(issue.created_at);
      return createdDate <= checkDate;
    });
    
    // Count how many of those were closed by this date
    const closedIssuesByDate = totalIssuesByDate.filter(issue => {
      const closedDate = issue.closed_at ? new Date(issue.closed_at) : null;
      return closedDate && closedDate <= checkDate;
    });
    
    // Count how many issues were open on this specific date
    const openIssuesCount = totalIssuesByDate.length - closedIssuesByDate.length;
    
    // Calculate percentage of total issues that are closed
    const closedPercentage = totalIssuesByDate.length > 0 
      ? (closedIssuesByDate.length / totalIssuesByDate.length) * 100 
      : 0;
    
    burndownData.push({
      date: checkDate.toISOString().slice(0, 10), // YYYY-MM-DD format
      openIssues: openIssuesCount,
      closedPercentage: closedPercentage,
      dateObj: new Date(checkDate)
    });
    
    // Move to next week (7 days)
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  // No additional calculation needed - closedPercentage is already calculated
  
  return burndownData;
}

export function IssueProgressionChart({ issues, className = '', selectedRepository = 'all' }: IssueProgressionChartProps) {
  const burndownData = React.useMemo(() => {
    return createBurndownData(issues);
  }, [issues]);

  const chartData = {
    labels: burndownData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Open Issues',
        data: burndownData.map(item => item.openIssues),
        borderColor: 'rgb(239, 68, 68)', // red-500 - represents issues that need to be "burned down"
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.2,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        borderWidth: 3,
        fill: true, // Fill area under the curve to emphasize the "burning down" effect
        yAxisID: 'y',
      },
      {
        label: '% of Issues Closed',
        data: burndownData.map(item => item.closedPercentage),
        borderColor: 'rgb(34, 197, 94)', // green-500 - represents positive progress
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.2,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        borderWidth: 2,
        fill: false, // Line only for the percentage
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            weight: 'bold' as const
          },
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            if (context.dataset.yAxisID === 'y1') {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
            } else {
              return `${context.dataset.label}: ${context.parsed.y} issues`;
            }
          },
          title: function(tooltipItems: any[]) {
            const date = new Date(burndownData[tooltipItems[0].dataIndex].date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            });
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (Last 3 Months)',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8, // Show ~8 data points for better readability
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Number of Open Issues',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          precision: 0,
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '% of Issues Closed',
          font: {
            size: 12,
            weight: 'bold' as const
          },
          color: 'rgb(34, 197, 94)' // Match the line color
        },
        grid: {
          drawOnChartArea: false, // Don't draw grid lines over the main chart
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(1) + '%';
          },
          color: 'rgb(34, 197, 94)' // Match the line color
        }
      },
    },
  };

  // Calculate burndown metrics
  const latestData = burndownData[burndownData.length - 1];
  const earliestData = burndownData[0];
  
  const trend = latestData && earliestData ? 
    latestData.openIssues - earliestData.openIssues : 0;
  
  const trendPercentage = earliestData && earliestData.openIssues > 0 ? 
    ((trend / earliestData.openIssues) * 100) : 0;
  
  return (
    <div className={className}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Issue Burndown Chart</h2>
        <p className="text-sm text-gray-600 mt-1">Shows the number of open issues over the last 3 months</p>
      </div>
      
      <div className="h-96"> {/* Fixed height for the chart */}
        <Line data={chartData} options={options as any} />
      </div>
      
      {latestData && earliestData && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-900">Current Open Issues:</p>
            <p className="text-red-500 text-lg font-bold">{latestData.openIssues}</p>
            <p className="text-xs text-gray-500">As of {new Date(latestData.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">3-Month Change:</p>
            <p className={`text-lg font-bold ${trend < 0 ? 'text-green-500' : trend > 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {trend > 0 ? '+' : ''}{trend}
            </p>
            <p className="text-xs text-gray-500">
              {trend < 0 ? '↓ Burned down' : trend > 0 ? '↑ Increased' : '→ No change'}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900">% of Issues Closed:</p>
            <p className={`text-lg font-bold text-green-500`}>
              {latestData.closedPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">Total completion rate</p>
          </div>
        </div>
      )}
    </div>
  );
}