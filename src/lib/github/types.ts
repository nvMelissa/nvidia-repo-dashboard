// GitHub API types and interfaces following cursor rules
export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  labels: Array<{
    name: string;
    color: string;
    description?: string;
  }>;
  created_at: string;
  closed_at: string | null;
  updated_at: string;
  html_url: string;
  body?: string;
  user: {
    login: string;
    avatar_url: string;
  };
  assignees?: Array<{
    login: string;
    avatar_url: string;
  }>;
  repository: string; // Added for multi-repo tracking
}

export type NVIDIARepo = 'TransformerEngine' | 'Fuser';
export type LightningRepo = 'lightning-thunder';
export type SupportedRepo = NVIDIARepo | LightningRepo;

export interface BugMetrics {
  repository: string;
  totalBugs: number;
  openBugs: number;
  closedBugs: number;
  burnRate: number; // Percentage of closed bugs
  avgResolutionTime: number; // In days
  recentActivity: number; // Bugs created in last 30 days
}

export interface CombinedBugMetrics {
  overall: BugMetrics;
  byRepository: Record<SupportedRepo, BugMetrics>;
}

export interface GitHubApiError {
  message: string;
  status: number;
  repository?: string;
}

export interface BugTrend {
  date: string;
  openBugs: number; // Issues created this week
  closedBugs: number; // Issues closed this week
  totalOpen?: number; // Total open issues at end of week
  repository: string;
}

export interface RepositoryStats {
  name: SupportedRepo;
  enabled: boolean;
  lastFetched?: string;
  issueCount: number;
  bugCount: number;
}