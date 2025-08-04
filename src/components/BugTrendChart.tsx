'use client';

// Bug trend chart component following cursor rules for data visualization
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
import type { SupportedRepo } from '@/lib/github/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BugTrendData {
  date: string;
  openBugs: number; // Issues created this week
  closedBugs: number; // Issues closed this week  
  totalOpen?: number; // Total open issues at end of week
  repository: string;
}

interface BugTrendChartProps {
  data: BugTrendData[];
  className?: string;
  showRepository?: SupportedRepo | 'all';
  title?: string;
}

export function BugTrendChart({ 
  data, 
  className = '', 
  showRepository = 'all',
  title = "Bug Trends - Last 3 Months"
}: BugTrendChartProps) {
  
  // Filter data by repository
  const filteredData = showRepository === 'all' 
    ? data 
    : data.filter(item => item.repository === showRepository);

  // Group data by date and sum across repositories if showing 'all'
  const groupedData = filteredData.reduce((acc, item) => {
    const existingEntry = acc.find(entry => entry.date === item.date);
    if (existingEntry) {
      existingEntry.openBugs += item.openBugs;
      existingEntry.closedBugs += item.closedBugs;
      existingEntry.totalOpen = (existingEntry.totalOpen || 0) + (item.totalOpen || 0);
    } else {
      acc.push({
        date: item.date,
        openBugs: item.openBugs,
        closedBugs: item.closedBugs,
        totalOpen: item.totalOpen || 0,
        repository: item.repository
      });
    }
    return acc;
  }, [] as BugTrendData[]);

  // Sort by date and format labels
  const sortedData = groupedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = {
    labels: sortedData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Created Issues per Week',
        data: sortedData.map(item => item.openBugs),
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y',
      },
      {
        label: 'Closed Issues per Week',
        data: sortedData.map(item => item.closedBugs),
        borderColor: 'rgb(34, 197, 94)', // green-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y',
      },
      {
        label: 'Total Open Issues',
        data: sortedData.map(item => item.totalOpen || 0),
        borderColor: 'rgb(239, 68, 68)', // red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y1', // Use secondary y-axis for total open issues
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label;
            const value = context.parsed.y;
            if (label.includes('per Week')) {
              return `${label}: ${value} issues`;
            } else {
              return `${label}: ${value} total`;
            }
          },
          title: function(tooltipItems: any[]) {
            const date = new Date(sortedData[tooltipItems[0].dataIndex].date);
            return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          }
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Weeks (Last 3 Months)',
          font: {
            size: 11,
            weight: '600'
          }
        },
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          font: {
            size: 10,
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Issues per Week',
          font: {
            size: 11,
            weight: '600'
          },
          color: 'rgb(34, 197, 94)' // Green color for weekly metrics
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          font: {
            size: 10,
          },
          precision: 0,
          color: 'rgb(34, 197, 94)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Open Issues',
          font: {
            size: 11,
            weight: '600'
          },
          color: 'rgb(239, 68, 68)' // Red color for total open
        },
        grid: {
          drawOnChartArea: false, // Don't draw grid lines for right axis
        },
        ticks: {
          font: {
            size: 10,
          },
          precision: 0,
          color: 'rgb(239, 68, 68)'
        }
      },
    },
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <div className="h-full">
        <Line data={chartData} options={options as any} />
      </div>
    </div>
  );
}

// Repository selector for trend chart
interface BugTrendWithSelectorProps {
  data: BugTrendData[];
  className?: string;
}

export function BugTrendWithSelector({ data, className = '' }: BugTrendWithSelectorProps) {
  const [selectedRepo, setSelectedRepo] = React.useState<SupportedRepo | 'all'>('all');

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bug Trends - Last 3 Months</h3>
        <select 
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value as SupportedRepo | 'all')}
        >
          <option value="all">All Repositories</option>
          <option value="TransformerEngine">TransformerEngine</option>
          <option value="Fuser">Fuser</option>
        </select>
      </div>
      
      <div className="h-80">
        <BugTrendChart 
          data={data} 
          showRepository={selectedRepo}
          title=""
        />
      </div>
    </div>
  );
}