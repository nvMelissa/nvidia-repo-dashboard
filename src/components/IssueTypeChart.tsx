'use client';

// Issue type chart component showing pie chart of issue labels
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

interface IssueTypeData {
  type: string;
  count: number;
  color: string;
}

interface IssueTypeChartProps {
  issues: GitHubIssue[];
  selectedRepository?: SupportedRepo | 'all';
  className?: string;
}

// Define the issue types and their colors
const ISSUE_TYPES = {
  bug: { name: 'Bug', color: '#ef4444' },           // red-500
  enhancement: { name: 'Enhancement', color: '#10b981' }, // emerald-500
  documentation: { name: 'Documentation', color: '#3b82f6' }, // blue-500
  epic: { name: 'Epic', color: '#8b5cf6' },          // violet-500
  initiative: { name: 'Initiative', color: '#f59e0b' }, // amber-500
  task: { name: 'Task', color: '#06b6d4' },          // cyan-500
  other: { name: 'Other', color: '#6b7280' },        // gray-500
};

// Define priority levels and their colors
const PRIORITY_LEVELS = {
  p0: { name: 'P0 (Critical)', color: '#dc2626' },   // red-600
  p1: { name: 'P1 (High)', color: '#f59e0b' },       // amber-500
  p2: { name: 'P2 (Medium)', color: '#10b981' },     // emerald-500
  unassigned: { name: 'No Priority', color: '#6b7280' }, // gray-500
};

function categorizeIssues(issues: GitHubIssue[]): IssueTypeData[] {
  const typeCounts: { [key: string]: number } = {};
  
  // Initialize all types with 0
  Object.keys(ISSUE_TYPES).forEach(type => {
    typeCounts[type] = 0;
  });

  issues.forEach(issue => {
    let categorized = false;
    
    // Check each label to categorize the issue
    issue.labels.forEach(label => {
      const labelName = label.name.toLowerCase();
      
      // Check for each known issue type
      if (labelName.includes('bug') || labelName.includes('defect')) {
        typeCounts.bug++;
        categorized = true;
      } else if (labelName.includes('enhancement') || labelName.includes('feature') || labelName.includes('improvement')) {
        typeCounts.enhancement++;
        categorized = true;
      } else if (labelName.includes('documentation') || labelName.includes('docs')) {
        typeCounts.documentation++;
        categorized = true;
      } else if (labelName.includes('epic')) {
        typeCounts.epic++;
        categorized = true;
      } else if (labelName.includes('initiative')) {
        typeCounts.initiative++;
        categorized = true;
      } else if (labelName.includes('task') || labelName.includes('chore')) {
        typeCounts.task++;
        categorized = true;
      }
    });
    
    // If no specific type found, categorize as 'other'
    if (!categorized) {
      typeCounts.other++;
    }
  });

  // Convert to array and filter out types with 0 count
  return Object.entries(typeCounts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type: ISSUE_TYPES[type as keyof typeof ISSUE_TYPES].name,
      count,
      color: ISSUE_TYPES[type as keyof typeof ISSUE_TYPES].color,
    }));
}

function categorizePriorities(issues: GitHubIssue[]): IssueTypeData[] {
  const priorityCounts: { [key: string]: number } = {};
  
  // Initialize all priorities with 0
  Object.keys(PRIORITY_LEVELS).forEach(priority => {
    priorityCounts[priority] = 0;
  });

  issues.forEach(issue => {
    let priorityAssigned = false;
    
    // Check each label for priority indicators
    issue.labels.forEach(label => {
      const labelName = label.name.toLowerCase();
      
      if (labelName.includes('p0') || labelName.includes('priority=p0') || labelName.includes('priority 0') || labelName.includes('critical')) {
        priorityCounts.p0++;
        priorityAssigned = true;
      } else if (labelName.includes('p1') || labelName.includes('priority=p1') || labelName.includes('priority 1') || labelName.includes('high')) {
        priorityCounts.p1++;
        priorityAssigned = true;
      } else if (labelName.includes('p2') || labelName.includes('priority=p2') || labelName.includes('priority 2') || labelName.includes('medium')) {
        priorityCounts.p2++;
        priorityAssigned = true;
      }
    });
    
    // If no priority found, categorize as 'unassigned'
    if (!priorityAssigned) {
      priorityCounts.unassigned++;
    }
  });

  // Convert to array and filter out priorities with 0 count
  return Object.entries(priorityCounts)
    .filter(([_, count]) => count > 0)
    .map(([priority, count]) => ({
      type: PRIORITY_LEVELS[priority as keyof typeof PRIORITY_LEVELS].name,
      count,
      color: PRIORITY_LEVELS[priority as keyof typeof PRIORITY_LEVELS].color,
    }));
}

function categorizeWorkflowStatus(issues: GitHubIssue[]): IssueTypeData[] {
  const statusCounts = {
    todo: 0,
    inprogress: 0,
    done: 0
  };

  const STATUS_LEVELS = {
    todo: { name: 'To Do', color: '#6b7280' },      // gray-500
    inprogress: { name: 'In Progress', color: '#f59e0b' }, // amber-500
    done: { name: 'Done', color: '#10b981' },       // emerald-500
  };

  issues.forEach(issue => {
    if (issue.state === 'closed') {
      statusCounts.done++;
    } else {
      // Check labels for "in progress" indicators
      const hasInProgressLabel = issue.labels.some(label => {
        const labelName = label.name.toLowerCase();
        return labelName.includes('in progress') || 
               labelName.includes('in-progress') || 
               labelName.includes('work in progress') ||
               labelName.includes('wip') ||
               labelName.includes('doing') ||
               labelName.includes('active') ||
               labelName.includes('working');
      });

      if (hasInProgressLabel) {
        statusCounts.inprogress++;
      } else {
        statusCounts.todo++;
      }
    }
  });

  // Convert to array and filter out statuses with 0 count
  return Object.entries(statusCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      type: STATUS_LEVELS[status as keyof typeof STATUS_LEVELS].name,
      count,
      color: STATUS_LEVELS[status as keyof typeof STATUS_LEVELS].color,
    }));
}

export function IssueTypeChart({ issues, selectedRepository = 'all', className = '' }: IssueTypeChartProps) {
  const openIssues = React.useMemo(() => {
    return issues.filter(issue => issue.state === 'open');
  }, [issues]);
  
  const typeData = React.useMemo(() => {
    return categorizeIssues(openIssues);
  }, [openIssues]);

  const priorityData = React.useMemo(() => {
    return categorizePriorities(openIssues);
  }, [openIssues]);

  const workflowData = React.useMemo(() => {
    return categorizeWorkflowStatus(issues); // Use all issues (including closed) for workflow status
  }, [issues]);

  const typeChartData = {
    labels: typeData.map(item => item.type),
    datasets: [
      {
        data: typeData.map(item => item.count),
        backgroundColor: typeData.map(item => item.color),
        borderColor: typeData.map(item => item.color),
        borderWidth: 2,
        hoverBackgroundColor: typeData.map(item => item.color + '80'), // Add transparency on hover
        hoverBorderWidth: 3,
      },
    ],
  };

  const priorityChartData = {
    labels: priorityData.map(item => item.type),
    datasets: [
      {
        data: priorityData.map(item => item.count),
        backgroundColor: priorityData.map(item => item.color),
        borderColor: priorityData.map(item => item.color),
        borderWidth: 2,
        hoverBackgroundColor: priorityData.map(item => item.color + '80'), // Add transparency on hover
        hoverBorderWidth: 3,
      },
    ],
  };

  const workflowChartData = {
    labels: workflowData.map(item => item.type),
    datasets: [
      {
        data: workflowData.map(item => item.count),
        backgroundColor: workflowData.map(item => item.color),
        borderColor: workflowData.map(item => item.color),
        borderWidth: 2,
        hoverBackgroundColor: workflowData.map(item => item.color + '80'), // Add transparency on hover
        hoverBorderWidth: 3,
      },
    ],
  };

  const typeOptions = {
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
        text: 'Issue Types',
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

  const priorityOptions = {
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
        text: 'Priority Distribution',
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

  const workflowOptions = {
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
        text: 'Workflow Status',
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

  if (typeData.length === 0 && priorityData.length === 0 && workflowData.length === 0) {
    return (
      <div className={className}>
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Open Issues Distribution</h3>
          <p>No issue data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Open Issues Distribution</h3>
      </div>
      
      {/* Three charts in a responsive grid - all same size */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Issue Types Chart */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-[320px] h-[320px] flex-shrink-0">
            {typeData.length > 0 ? (
              <Pie data={typeChartData} options={typeOptions as any} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No type data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Priority Distribution Chart */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-[320px] h-[320px] flex-shrink-0">
            {priorityData.length > 0 ? (
              <Pie data={priorityChartData} options={priorityOptions as any} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No priority data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Workflow Status Chart */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-[320px] h-[320px] flex-shrink-0">
            {workflowData.length > 0 ? (
              <Pie data={workflowChartData} options={workflowOptions as any} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No workflow data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}