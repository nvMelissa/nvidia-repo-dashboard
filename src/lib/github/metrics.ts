// Bug metrics calculation utilities following cursor rules
import type { GitHubIssue, BugMetrics, CombinedBugMetrics, SupportedRepo, BugTrend } from './types';

export function isBugIssue(issue: GitHubIssue): boolean {
  const bugKeywords = ['bug', 'defect', 'issue', 'error', 'fix', 'broken'];
  
  // Check labels
  const haseBugLabel = issue.labels.some(label => 
    bugKeywords.some(keyword => 
      label.name.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  
  // Check title for bug indicators
  const titleHasBug = bugKeywords.some(keyword =>
    issue.title.toLowerCase().includes(keyword.toLowerCase())
  );
  
  return haseBugLabel || titleHasBug;
}

export function calculateResolutionTime(issue: GitHubIssue): number {
  if (!issue.closed_at || issue.state !== 'closed') {
    return 0;
  }
  
  const created = new Date(issue.created_at);
  const closed = new Date(issue.closed_at);
  const diffTime = Math.abs(closed.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
}

export function calculateAverageResolutionTime(issues: GitHubIssue[]): number {
  const closedBugs = issues.filter(issue => issue.state === 'closed');
  
  if (closedBugs.length === 0) return 0;
  
  const totalResolutionTime = closedBugs.reduce((sum, issue) => {
    return sum + calculateResolutionTime(issue);
  }, 0);
  
  return Math.round(totalResolutionTime / closedBugs.length);
}

export function countRecentActivity(issues: GitHubIssue[], days: number = 30): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return issues.filter(issue => {
    const createdDate = new Date(issue.created_at);
    return createdDate >= cutoffDate;
  }).length;
}

export function calculateBugMetrics(
  issues: GitHubIssue[], 
  repository: string = 'All'
): BugMetrics {
  // Use all issues (not just bug-labeled ones)
  const bugs = issues;
  
  const openBugs = bugs.filter(bug => bug.state === 'open').length;
  const closedBugs = bugs.filter(bug => bug.state === 'closed').length;
  const totalBugs = bugs.length;
  
  return {
    repository,
    totalBugs,
    openBugs,
    closedBugs,
    burnRate: totalBugs > 0 ? Math.round((closedBugs / totalBugs) * 100 * 10) / 10 : 0,
    avgResolutionTime: calculateAverageResolutionTime(bugs),
    recentActivity: countRecentActivity(bugs, 30),
  };
}

export function calculateCombinedBugMetrics(allIssues: GitHubIssue[]): CombinedBugMetrics {
  const repos: SupportedRepo[] = ['TransformerEngine', 'Fuser', 'lightning-thunder'];
  
  // Calculate metrics for each repository
  const byRepository = repos.reduce((acc, repo) => {
    const repoIssues = allIssues.filter(issue => issue.repository === repo);
    acc[repo] = calculateBugMetrics(repoIssues, repo);
    return acc;
  }, {} as Record<SupportedRepo, BugMetrics>);
  
  // Calculate overall metrics
  const overall = calculateBugMetrics(allIssues, 'All Repositories');
  
  return { overall, byRepository };
}

export function generateBugTrends(
  issues: GitHubIssue[], 
  days: number = 90
): BugTrend[] {
  const trends: BugTrend[] = [];
  const today = new Date();
  
  // Group issues by repository
  const repos: SupportedRepo[] = ['TransformerEngine', 'Fuser', 'lightning-thunder'];
  
  // Calculate weekly periods for the last 3 months (12 weeks)
  const weeks = 12;
  
  for (let i = weeks - 1; i >= 0; i--) {
    // Calculate the start of the week (Monday)
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() === 0 ? 6 : weekStart.getDay() - 1)); // Get Monday
    weekStart.setDate(weekStart.getDate() - (i * 7)); // Go back i weeks
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Sunday of the same week
    
    const dateString = weekStart.toISOString().split('T')[0];
    
    repos.forEach(repo => {
      const repoIssues = issues.filter(issue => issue.repository === repo);
      
      // Count issues CREATED during this week
      const createdThisWeek = repoIssues.filter(issue => {
        const created = new Date(issue.created_at);
        return created >= weekStart && created <= weekEnd;
      }).length;
      
      // Count issues CLOSED during this week
      const closedThisWeek = repoIssues.filter(issue => {
        if (!issue.closed_at) return false;
        const closed = new Date(issue.closed_at);
        return closed >= weekStart && closed <= weekEnd;
      }).length;
      
      // Calculate total open issues at the END of this week
      const totalOpenAtWeekEnd = repoIssues.filter(issue => {
        const created = new Date(issue.created_at);
        const closed = issue.closed_at ? new Date(issue.closed_at) : null;
        
        // Issue was created before or during this week AND
        // Either never closed OR closed after this week
        return created <= weekEnd && (!closed || closed > weekEnd);
      }).length;
      
      trends.push({
        date: dateString,
        openBugs: createdThisWeek, // Reusing openBugs field for "created this week"
        closedBugs: closedThisWeek,
        totalOpen: totalOpenAtWeekEnd, // New field for total open issues
        repository: repo,
      });
    });
  }
  
  return trends;
}

export function getRepositoryStats(allIssues: GitHubIssue[]): Record<SupportedRepo, any> {
const repos: SupportedRepo[] = ['TransformerEngine', 'Fuser', 'lightning-thunder'];
  
  return repos.reduce((acc, repo) => {
    const repoIssues = allIssues.filter(issue => issue.repository === repo);
    const bugs = repoIssues; // Use all issues
    
    acc[repo] = {
      name: repo,
      enabled: true,
      lastFetched: new Date().toISOString(),
      issueCount: repoIssues.length,
      bugCount: bugs.length,
    };
    
    return acc;
  }, {} as Record<SupportedRepo, any>);
}

// Utility function to format metrics for display
export function formatBugMetrics(metrics: BugMetrics) {
  return {
    ...metrics,
    burnRateFormatted: `${metrics.burnRate}%`,
    avgResolutionTimeFormatted: `${metrics.avgResolutionTime} days`,
    recentActivityFormatted: `${metrics.recentActivity} bugs (30 days)`,
  };
}