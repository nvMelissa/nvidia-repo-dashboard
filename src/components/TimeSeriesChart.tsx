'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface TimeSeriesData {
  date: string;
  openIssues: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title: string;
  repoKey: string;
  className?: string;
}

export function TimeSeriesChart({ data, title, repoKey, className = '' }: TimeSeriesChartProps) {
  // Repository-specific colors
  const repoColors = {
    'Fuser': {
      line: '#FF6B6B',
      background: 'rgba(255, 107, 107, 0.1)',
    },
    'lightning-thunder': {
      line: '#4ECDC4', 
      background: 'rgba(78, 205, 196, 0.1)',
    },
    'TransformerEngine': {
      line: '#45B7D1',
      background: 'rgba(69, 183, 209, 0.1)',
    },
  };

  const colors = repoColors[repoKey as keyof typeof repoColors] || {
    line: '#6B73FF',
    background: 'rgba(107, 115, 255, 0.1)',
  };

  const chartData = {
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

  const options = {
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
      title: {
        display: false, // We'll use our own title
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: colors.line,
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
    } as any,
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
    elements: {
      point: {
        hoverBackgroundColor: colors.line,
      },
    },
  };

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return null;
    
    const firstWeek = data.slice(0, 7);
    const lastWeek = data.slice(-7);
    
    const firstAvg = firstWeek.reduce((sum, point) => sum + point.openIssues, 0) / firstWeek.length;
    const lastAvg = lastWeek.reduce((sum, point) => sum + point.openIssues, 0) / lastWeek.length;
    
    const change = lastAvg - firstAvg;
    const percentChange = firstAvg > 0 ? (change / firstAvg) * 100 : 0;
    
    return {
      change: Math.round(change),
      percentChange: Math.round(percentChange * 10) / 10,
      direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable',
    };
  };

  const trend = calculateTrend();

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">Chart will appear when data is loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trend Summary */}
      {trend && (
        <div className="absolute top-0 right-0 z-10 bg-white rounded-lg shadow-sm border p-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">90-day trend:</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend.direction === 'increase' 
                ? 'bg-red-100 text-red-800'
                : trend.direction === 'decrease'
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {trend.direction === 'increase' && '↗'}
              {trend.direction === 'decrease' && '↘'} 
              {trend.direction === 'stable' && '→'}
              {Math.abs(trend.change)} issues ({Math.abs(trend.percentChange)}%)
            </span>
          </div>
        </div>
      )}
      
      {/* Chart */}
      <Line data={chartData} options={options} />
    </div>
  );
}