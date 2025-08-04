'use client';

// Bug total count chart component following cursor rules
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { CombinedBugMetrics, SupportedRepo } from '@/lib/github/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface BugTotalChartProps {
  data: CombinedBugMetrics | null;
  className?: string;
  chartType?: 'bar' | 'doughnut';
  showRepository?: SupportedRepo | 'all';
}

export function BugTotalChart({ 
  data, 
  className = '', 
  chartType = 'bar',
  showRepository = 'all'
}: BugTotalChartProps) {
  
  if (!data) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-md border ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const metrics = showRepository === 'all' ? data.overall : data.byRepository[showRepository];
  
  if (chartType === 'doughnut') {
    const doughnutData = {
      labels: ['Open Bugs', 'Closed Bugs'],
      datasets: [
        {
          data: [metrics.openBugs, metrics.closedBugs],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)', // red-500
            'rgba(34, 197, 94, 0.8)', // green-500
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(34, 197, 94)',
          ],
          borderWidth: 2,
          hoverBackgroundColor: [
            'rgba(239, 68, 68, 0.9)',
            'rgba(34, 197, 94, 0.9)',
          ],
        },
      ],
    };

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
            }
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
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        },
      },
    };

    return (
      <div className={`bg-white p-6 rounded-lg shadow-md border ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Bug Status Distribution
          </h3>
          <div className="text-sm text-gray-500">
            {showRepository === 'all' ? 'All Repositories' : showRepository}
          </div>
        </div>
        
        <div className="h-64">
          <Doughnut data={doughnutData} options={doughnutOptions as any} />
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-center">
          <div>
            <div className="text-sm text-gray-600">Total Bugs</div>
            <div className="text-xl font-bold text-gray-900">{metrics.totalBugs}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
            <div className="text-xl font-bold text-blue-600">{metrics.burnRate.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Avg Resolution</div>
            <div className="text-xl font-bold text-purple-600">{metrics.avgResolutionTime}d</div>
          </div>
        </div>
      </div>
    );
  }

  // Bar chart version
  const barData = {
    labels: ['Open Bugs', 'Closed Bugs'],
    datasets: [
      {
        label: 'Bug Count',
        data: [metrics.openBugs, metrics.closedBugs],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // red-500 for open
          'rgba(34, 197, 94, 0.8)', // green-500 for closed
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
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
            const total = metrics.totalBugs;
            const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : '0';
            return `${context.parsed.y} bugs (${percentage}%)`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Number of Bugs',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
    },
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Total Bug Counts
        </h3>
        <div className="text-sm text-gray-500">
          {showRepository === 'all' ? 'All Repositories' : showRepository}
        </div>
      </div>
      
      <div className="h-64">
        <Bar data={barData} options={barOptions as any} />
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-center">
        <div>
          <div className="text-sm text-gray-600">Total Bugs</div>
          <div className="text-xl font-bold text-gray-900">{metrics.totalBugs}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Resolution Rate</div>
          <div className="text-xl font-bold text-blue-600">{metrics.burnRate.toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Avg Resolution</div>
          <div className="text-xl font-bold text-purple-600">{metrics.avgResolutionTime}d</div>
        </div>
      </div>
    </div>
  );
}

// Repository selector version with both chart types
interface BugTotalWithSelectorProps {
  data: CombinedBugMetrics | null;
  className?: string;
}

export function BugTotalWithSelector({ data, className = '' }: BugTotalWithSelectorProps) {
  const [selectedRepo, setSelectedRepo] = React.useState<SupportedRepo | 'all'>('all');
  const [chartType, setChartType] = React.useState<'bar' | 'doughnut'>('bar');

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Total Bug Counts</h3>
        <div className="flex gap-3">
          {/* Chart Type Selector */}
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'bar' | 'doughnut')}
          >
            <option value="bar">Bar Chart</option>
            <option value="doughnut">Doughnut Chart</option>
          </select>
          
          {/* Repository Selector */}
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
      </div>
      
      <BugTotalChart 
        data={data} 
        showRepository={selectedRepo}
        chartType={chartType}
        className=""
      />
    </div>
  );
}