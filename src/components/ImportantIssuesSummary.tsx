'use client';

// Important issues summary component following cursor rules
import React from 'react';
import type { GitHubIssue, SupportedRepo } from '@/lib/github/types';

interface ImportantIssuesSummaryProps {
  issues: GitHubIssue[];
  selectedRepository?: SupportedRepo | 'all';
  className?: string;
}

interface ImportantIssuesMetrics {
  staleIssues: number;
  criticalIssues: number;
  unassignedCriticalIssues: number;
  overdueIssues: number;
}

// Define what constitutes an "important" issue based on labels
const IMPORTANT_LABELS = [
  'priority: high',
  'priority:high', 
  'high priority',
  'high-priority',
  'P0',
  'P1',
  'critical',
  'urgent',
  'blocker',
  'severity: high',
  'severity:high',
  'high severity'
];

function isImportantIssue(issue: GitHubIssue): boolean {
  return issue.labels.some(label => 
    IMPORTANT_LABELS.some(importantLabel => 
      label.name.toLowerCase().includes(importantLabel.toLowerCase())
    )
  );
}

function isStaleIssue(issue: GitHubIssue): boolean {
  const now = new Date();
  // Use updated_at if available, otherwise fall back to created_at
  const lastActivityDate = new Date(issue.updated_at || issue.created_at);
  const daysDiff = (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff > 30 && issue.state === 'open';
}

function isOverdueIssue(issue: GitHubIssue): boolean {
  if (issue.state !== 'open') return false;
  
  // Check for overdue-related labels
  const overdueLabels = ['overdue', 'past due', 'deadline passed', 'missed deadline'];
  const hasOverdueLabel = issue.labels.some(label => 
    overdueLabels.some(overdueLabel => 
      label.name.toLowerCase().includes(overdueLabel.toLowerCase())
    )
  );
  
  return hasOverdueLabel;
}

function isUnassignedIssue(issue: GitHubIssue): boolean {
  // Check if assignees field exists and has no assignees
  if (issue.assignees) {
    return issue.assignees.length === 0;
  }
  
  // Fallback: Check for common assignee indicators in labels
  const hasAssigneeLabel = issue.labels.some(label => 
    label.name.toLowerCase().includes('assigned') ||
    label.name.toLowerCase().includes('assignee') ||
    label.name.toLowerCase().includes('owner')
  );
  
  // If no assignees field and no assignee labels, consider it unassigned
  return !hasAssigneeLabel;
}

function calculateImportantIssuesMetrics(issues: GitHubIssue[]): ImportantIssuesMetrics {
  const openIssues = issues.filter(issue => issue.state === 'open');
  
  const staleIssues = openIssues.filter(isStaleIssue).length;
  const criticalIssues = openIssues.filter(isImportantIssue).length;
  const unassignedCriticalIssues = openIssues.filter(issue => 
    isImportantIssue(issue) && isUnassignedIssue(issue)
  ).length;
  const overdueIssues = openIssues.filter(isOverdueIssue).length;

  return {
    staleIssues,
    criticalIssues,
    unassignedCriticalIssues,
    overdueIssues
  };
}

export function ImportantIssuesSummary({ 
  issues, 
  selectedRepository = 'all', 
  className = '' 
}: ImportantIssuesSummaryProps) {
  const metrics = React.useMemo(() => {
    return calculateImportantIssuesMetrics(issues);
  }, [issues]);

  return (
    <div className={className}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Needs Attention</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stale Issues */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-900">{metrics.staleIssues}</div>
              <div className="text-sm font-medium text-yellow-700">Stale Issues</div>
              <div className="text-xs text-yellow-600 mt-1">&gt;30d no activity</div>
            </div>
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-900">{metrics.criticalIssues}</div>
              <div className="text-sm font-medium text-red-700">Critical Issues</div>
              <div className="text-xs text-red-600 mt-1">High priority, P0/P1, Critical</div>
            </div>
          </div>
        </div>

        {/* Unassigned Critical Issues */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-purple-900">{metrics.unassignedCriticalIssues}</div>
              <div className="text-sm font-medium text-purple-700">Unassigned Critical</div>
              <div className="text-xs text-purple-600 mt-1">Critical issues needing owners</div>
            </div>
          </div>
        </div>

        {/* Overdue Issues */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-orange-900">{metrics.overdueIssues}</div>
              <div className="text-sm font-medium text-orange-700">Overdue Issues</div>
              <div className="text-xs text-orange-600 mt-1">Past milestone or deadline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Priority Detection:</span> Issues labeled with high priority, P0/P1, critical, urgent, or blocker
        </div>
      </div>
    </div>
  );
}