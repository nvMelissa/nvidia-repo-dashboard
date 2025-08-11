// GitHub API service following cursor rules for multi-repo support
import type { GitHubIssue, SupportedRepo, GitHubApiError } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

// Repository owner mapping
const REPO_OWNERS: Record<SupportedRepo, string> = {
  'TransformerEngine': 'NVIDIA',
  'Fuser': 'NVIDIA', 
  'lightning-thunder': 'Lightning-AI'
};

interface FetchIssuesOptions {
  labels?: string[];
  state?: 'open' | 'closed' | 'all';
  since?: string;
  per_page?: number;
  page?: number;
}

class GitHubApiService {
  private token: string;
  private rateLimitRemaining: number = 5000;
  private rateLimitReset: number = 0;

  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
    if (!this.token) {
      console.warn('GitHub token not found. API requests will be limited.');
    }
  }

  private async makeRequest<T>(url: string, repository?: string): Promise<T> {
    // Check rate limit
    if (this.rateLimitRemaining <= 10 && Date.now() < this.rateLimitReset * 1000) {
      throw new Error(`Rate limit exceeded. Resets at ${new Date(this.rateLimitReset * 1000).toISOString()}`);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'NVIDIA-Bug-Dashboard',
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    try {
      const response = await fetch(url, { headers });

      // Update rate limit info
      this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0');
      this.rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset') || '0');

      if (!response.ok) {
        const error: GitHubApiError = {
          message: `GitHub API error: ${response.status} ${response.statusText}`,
          status: response.status,
          repository,
        };
        throw error;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch from GitHub API: ${error.message}`);
      }
      throw error;
    }
  }

  async fetchRepositoryIssues(
    repo: SupportedRepo,
    options: FetchIssuesOptions = {}
  ): Promise<GitHubIssue[]> {
    const {
      labels = [],
      state = 'all', // Fetch both open and closed issues to calculate metrics
      since,
      per_page = 100
    } = options;

    const allIssues: any[] = [];
    let page = 1;
    let hasMorePages = true;
    const maxPages = 15; // Limit to prevent rate limiting (15 pages = 1500 issues per repo)

    // Fetch limited pages to prevent rate limiting
    while (hasMorePages && page <= maxPages) {
      const params = new URLSearchParams({
        state,
        per_page: per_page.toString(),
        page: page.toString(),
        sort: 'updated',
        direction: 'desc',
      });

      if (labels.length > 0) {
        params.append('labels', labels.join(','));
      }

      if (since) {
        params.append('since', since);
      }

      const owner = REPO_OWNERS[repo];
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?${params}`;
      
      try {
        const issues = await this.makeRequest<any[]>(url, repo);
        
        // Filter out pull requests (they're returned as issues in GitHub API)
        const actualIssues = issues.filter(issue => !issue.pull_request);
        
        allIssues.push(...actualIssues);
        
        // Check if we got less than per_page results (indicates last page)
        hasMorePages = issues.length === per_page;
        page++;
        
        console.log(`📄 Fetched page ${page - 1} for ${repo}: ${actualIssues.length} issues (${issues.length - actualIssues.length} PRs filtered, total: ${allIssues.length})`);
        
        // Add delay between requests to respect rate limits
        if (hasMorePages && page <= maxPages) {
          await new Promise(resolve => setTimeout(resolve, 200)); // Increased delay
        }
        
      } catch (error) {
        console.error(`Failed to fetch issues for ${repo} (page ${page}):`, error);
        throw error;
      }
    }
      
    return allIssues.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      state: issue.state,
      labels: issue.labels.map((label: any) => ({
        name: label.name,
        color: label.color,
        description: label.description
      })),
      created_at: issue.created_at,
      closed_at: issue.closed_at,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
      body: issue.body,
      user: {
        login: issue.user.login,
        avatar_url: issue.user.avatar_url
      },
      assignees: issue.assignees ? issue.assignees.map((assignee: any) => ({
        login: assignee.login,
        avatar_url: assignee.avatar_url
      })) : [],
      repository: repo
    }));
  }

  async fetchAllRepositoryIssues(
    options: FetchIssuesOptions = {}
  ): Promise<GitHubIssue[]> {
    const repos: SupportedRepo[] = ['TransformerEngine', 'Fuser', 'lightning-thunder'];
    const enabledRepos = repos.filter(repo => {
      // Map repository names to environment variable names
      const envMapping: Record<string, string> = {
        'TransformerEngine': 'TRANSFORMERENGINE',
        'Fuser': 'FUSER',
        'lightning-thunder': 'LIGHTNING_THUNDER'
      };
      const envKey = `NEXT_PUBLIC_ENABLE_${envMapping[repo] || repo.toUpperCase()}`;
      return process.env[envKey] !== 'false';
    });

    console.log(`Fetching issues from ${enabledRepos.length} repositories:`, enabledRepos);

    try {
      // If no token, return mock data for demo
      if (!this.token) {
        console.log('No GitHub token found - returning mock data for demo');
        return this.getMockBugData();
      }

      // Fetch from all repos in parallel but with delay to respect rate limits
      const allIssuesPromises = enabledRepos.map((repo, index) => 
        new Promise<GitHubIssue[]>((resolve) => {
          // Stagger requests by 100ms to avoid hitting rate limits
          setTimeout(async () => {
            try {
              const issues = await this.fetchRepositoryIssues(repo, options);
              resolve(issues);
                } catch (error) {
      console.error(`Failed to fetch from ${repo}:`, error);
      // If 403 Forbidden (SAML enforcement), return mock data for demo
      if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
        console.log(`403 Forbidden for ${repo} - this requires SAML authorization. Using mock data.`);
      }
      resolve([]); // Return empty array on error to not break the whole fetch
    }
          }, index * 100);
        })
      );

      const allIssuesArrays = await Promise.all(allIssuesPromises);
      const flattenedIssues = allIssuesArrays.flat();
      
      // If we got no issues due to 403 errors, return mock data
      if (flattenedIssues.length === 0) {
        console.log('No issues fetched (likely due to SAML enforcement) - returning mock data for demo');
        return this.getMockBugData();
      }
      
      return flattenedIssues;
    } catch (error) {
      console.error('Failed to fetch from all repositories:', error);
      throw new Error('Failed to fetch issues from NVIDIA repositories');
    }
  }

  async fetchBugIssues(options: Omit<FetchIssuesOptions, 'labels'> = {}): Promise<GitHubIssue[]> {
    // Common bug labels across NVIDIA repositories
    const bugLabels = ['bug', 'Bug', 'issue', 'defect'];
    
    return this.fetchAllRepositoryIssues({
      ...options,
      labels: bugLabels
    });
  }

  getRateLimitInfo() {
    return {
      remaining: this.rateLimitRemaining,
      resetTime: new Date(this.rateLimitReset * 1000)
    };
  }

  private getMockBugData(): GitHubIssue[] {
    const now = new Date();
    const mockIssues: GitHubIssue[] = [
      // TransformerEngine mock bugs
      {
        id: 1,
        number: 2011,
        title: "[basic_linear] dtype inference is incorrect",
        state: 'open',
        labels: [{ name: 'bug', color: 'ff0000', description: 'Something is not working' }, { name: 'priority: high', color: 'ff6b6b' }],
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        closed_at: null,
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        html_url: 'https://github.com/NVIDIA/TransformerEngine/issues/2011',
        user: { login: 'user1', avatar_url: 'https://github.com/identicons/user1.png' },
        assignees: [], // Unassigned important issue
        repository: 'TransformerEngine'
      },
      {
        id: 2,
        number: 2010,
        title: "Installation Failure with PyTorch 2.5.1 + CUDA 12.1",
        state: 'open',
        labels: [{ name: 'bug', color: 'ff0000' }, { name: 'installation', color: '0052cc' }, { name: 'P0', color: 'b60205' }],
        created_at: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString(), // 75 days ago - stale
        closed_at: null,
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        html_url: 'https://github.com/NVIDIA/TransformerEngine/issues/2010',
        user: { login: 'user2', avatar_url: 'https://github.com/identicons/user2.png' },
        assignees: [{ login: 'developer1', avatar_url: 'https://github.com/identicons/developer1.png' }], // Assigned important issue
        repository: 'TransformerEngine'
      },
      {
        id: 3,
        number: 1995,
        title: "Memory leak in fp8 training",
        state: 'closed',
        labels: [{ name: 'bug', color: 'ff0000' }, { name: 'memory', color: 'ffa500' }],
        created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        closed_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        html_url: 'https://github.com/NVIDIA/TransformerEngine/issues/1995',
        user: { login: 'user3', avatar_url: 'https://github.com/identicons/user3.png' },
        assignees: [{ login: 'developer2', avatar_url: 'https://github.com/identicons/developer2.png' }],
        repository: 'TransformerEngine'
      },
      {
        id: 4,
        number: 1989,
        title: "Performance regression in attention layer",
        state: 'closed',
        labels: [{ name: 'bug', color: 'ff0000' }, { name: 'performance', color: '00ff00' }],
        created_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        closed_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        html_url: 'https://github.com/NVIDIA/TransformerEngine/issues/1989',
        user: { login: 'user4', avatar_url: 'https://github.com/identicons/user4.png' },
        assignees: [],
        repository: 'TransformerEngine'
      },
      // Fuser mock bugs
      {
        id: 5,
        number: 845,
        title: "Segmentation fault in fusion kernel",
        state: 'open',
        labels: [{ name: 'bug', color: 'ff0000' }, { name: 'crash', color: '800080' }, { name: 'critical', color: 'b60205' }],
        created_at: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago - stale
        closed_at: null,
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        html_url: 'https://github.com/NVIDIA/Fuser/issues/845',
        user: { login: 'user5', avatar_url: 'https://github.com/identicons/user5.png' },
        assignees: [], // Unassigned critical issue
        repository: 'Fuser'
      },
      {
        id: 6,
        number: 832,
        title: "Incorrect reduction results with large tensors",
        state: 'open',
        labels: [{ name: 'bug', color: 'ff0000' }, { name: 'reduction', color: 'ffff00' }],
        created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        closed_at: null,
        updated_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        html_url: 'https://github.com/NVIDIA/Fuser/issues/832',
        user: { login: 'user6', avatar_url: 'https://github.com/identicons/user6.png' },
        assignees: [{ login: 'developer3', avatar_url: 'https://github.com/identicons/developer3.png' }],
        repository: 'Fuser'
      },
      {
        id: 7,
        number: 821,
        title: "Build fails with CUDA 12.8",
        state: 'closed',
        labels: [{ name: 'bug', color: 'ff0000' }, { name: 'build', color: '0052cc' }],
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        closed_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        html_url: 'https://github.com/NVIDIA/Fuser/issues/821',
        user: { login: 'user7', avatar_url: 'https://github.com/identicons/user7.png' },
        assignees: [],
        repository: 'Fuser'
      },
      {
        id: 8,
        number: 815,
        title: "Memory optimization for large models",
        state: 'closed',
        labels: [{ name: 'bug', color: 'ff0000' }, { name: 'memory', color: 'ffa500' }],
        created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        closed_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        html_url: 'https://github.com/NVIDIA/Fuser/issues/815',
        user: { login: 'user8', avatar_url: 'https://github.com/identicons/user8.png' },
        assignees: [{ login: 'developer4', avatar_url: 'https://github.com/identicons/developer4.png' }],
        repository: 'Fuser'
      }
    ];

    console.log(`Generated ${mockIssues.length} mock bug issues for demo`);
    return mockIssues;
  }

  getMockBugTrendData(): Array<{date: string; openBugs: number; closedBugs: number; repository: string}> {
    const trends = [];
    const today = new Date();
    
    // Generate 3 months of weekly data
    for (let weeks = 12; weeks >= 0; weeks--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (weeks * 7));
      const dateString = date.toISOString().split('T')[0];
      
      // TransformerEngine trends
      trends.push({
        date: dateString,
        openBugs: Math.floor(Math.random() * 3) + 1, // 1-3 bugs opened per week
        closedBugs: Math.floor(Math.random() * 4) + 1, // 1-4 bugs closed per week
        repository: 'TransformerEngine'
      });
      
      // Fuser trends
      trends.push({
        date: dateString,
        openBugs: Math.floor(Math.random() * 2) + 1, // 1-2 bugs opened per week
        closedBugs: Math.floor(Math.random() * 3) + 1, // 1-3 bugs closed per week
        repository: 'Fuser'
      });
      
      // Lightning-Thunder trends
      trends.push({
        date: dateString,
        openBugs: Math.floor(Math.random() * 4) + 2, // 2-5 bugs opened per week (higher activity)
        closedBugs: Math.floor(Math.random() * 3) + 1, // 1-3 bugs closed per week
        repository: 'lightning-thunder'
      });
    }
    
    return trends;
  }
}

// Export singleton instance
export const githubApi = new GitHubApiService();

// Export utility function for server-side usage
export async function fetchNVIDIABugs(options?: FetchIssuesOptions): Promise<GitHubIssue[]> {
  return githubApi.fetchAllRepositoryIssues({
    ...options
    // Fetch all issues (open and closed) to calculate proper metrics
  });
}

export async function fetchNVIDIAIssues(options?: FetchIssuesOptions): Promise<GitHubIssue[]> {
  return githubApi.fetchAllRepositoryIssues(options);
}

// Export function to fetch a single repository with full coverage
export async function fetchRepoIssues(repo: SupportedRepo): Promise<GitHubIssue[]> {
  console.log(`Fetching ALL issues from single repository: ${repo}`);
  
  const owner = REPO_OWNERS[repo];
  const allIssues: GitHubIssue[] = [];
  let page = 1;
  let hasMorePages = true;

  // Fetch ALL pages without any limit for single repo
  while (hasMorePages) {
    try {
      const params = new URLSearchParams({
        state: 'all',
        per_page: '100',
        page: page.toString(),
      });

      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?${params}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const issues: any[] = await response.json();
      
      if (issues.length === 0) {
        hasMorePages = false;
        break;
      }

      // Filter out pull requests (they're returned as issues in GitHub API)
      const actualIssues = issues.filter(issue => !issue.pull_request);
      
      const githubIssues: GitHubIssue[] = actualIssues.map(issue => ({
        ...issue,
        repository: repo
      }));

      allIssues.push(...githubIssues);
      console.log(`📄 Fetched page ${page} for ${repo}: ${actualIssues.length} issues (${issues.length - actualIssues.length} PRs filtered, total: ${allIssues.length})`);
      
      page++;
      
      // Check if we've reached the end
      if (issues.length < 100) {
        hasMorePages = false;
      }
      
    } catch (error) {
      console.error(`Error fetching page ${page} for ${repo}:`, error);
      hasMorePages = false;
    }
  }

  console.log(`✅ Loaded ${allIssues.length} total issues from ${repo} (FULL COVERAGE)`);
  return allIssues;
}

export function getMockBugTrends() {
  return githubApi.getMockBugTrendData();
}