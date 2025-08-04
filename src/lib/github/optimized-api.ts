// Optimized GitHub API service with caching and smart loading
import { dataCache, CACHE_KEYS } from '@/lib/cache';
import type { GitHubIssue, NVIDIARepo } from './types';

interface OptimizedLoadOptions {
  priority?: 'critical' | 'background';
  maxPages?: number;
  cacheFirst?: boolean;
}

class OptimizedGitHubService {
  private readonly GITHUB_API_BASE = 'https://api.github.com';
  private readonly GITHUB_OWNER = 'NVIDIA';
  
  /**
   * Smart loading strategy: Load critical data first, background load the rest
   */
  async loadDashboardData(repos: NVIDIARepo[]): Promise<{
    critical: GitHubIssue[];
    loading: Promise<GitHubIssue[]>;
  }> {
    // Load critical data immediately (recent issues for overview)
    const criticalPromises = repos.map(repo => 
      this.loadRepoData(repo, { priority: 'critical', maxPages: 2, cacheFirst: true })
    );
    
    const critical = (await Promise.all(criticalPromises)).flat();
    
    // Background load complete data
    const backgroundPromises = repos.map(repo =>
      this.loadRepoData(repo, { priority: 'background', cacheFirst: true })
    );
    
    const loading = Promise.all(backgroundPromises).then(results => results.flat());
    
    return { critical, loading };
  }

  /**
   * Load repository data with caching and smart pagination
   */
  async loadRepoData(
    repo: NVIDIARepo, 
    options: OptimizedLoadOptions = {}
  ): Promise<GitHubIssue[]> {
    const { priority = 'critical', maxPages = Infinity, cacheFirst = true } = options;
    const cacheKey = CACHE_KEYS.ISSUES(repo);
    
    // Check cache first if requested
    if (cacheFirst) {
      const cached = dataCache.get<GitHubIssue[]>(cacheKey);
      if (cached && !dataCache.isStale(cacheKey, 2 * 60 * 1000)) { // 2 min stale time
        console.log(`📦 Using cached data for ${repo} (${cached.length} issues)`);
        return cached;
      }
    }

    try {
      // Smart pagination based on priority
      const pagesToLoad = priority === 'critical' ? Math.min(maxPages, 3) : maxPages;
      const issues = await this.fetchWithSmartPagination(repo, pagesToLoad);
      
      // Cache the results
      const cacheTime = priority === 'critical' ? 2 * 60 * 1000 : 10 * 60 * 1000; // 2min vs 10min
      dataCache.set(cacheKey, issues, cacheTime);
      
      console.log(`✅ Loaded ${issues.length} issues for ${repo} (${priority} priority)`);
      return issues;
      
    } catch (error) {
      console.error(`❌ Failed to load ${repo}:`, error);
      
      // Fallback to stale cache if available
      const staleCache = dataCache.get<GitHubIssue[]>(cacheKey);
      if (staleCache) {
        console.log(`🔄 Using stale cache for ${repo}`);
        return staleCache;
      }
      
      return [];
    }
  }

  /**
   * Efficient pagination that stops early when possible
   */
  private async fetchWithSmartPagination(
    repo: NVIDIARepo, 
    maxPages: number
  ): Promise<GitHubIssue[]> {
    const allIssues: GitHubIssue[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore && page <= maxPages) {
      const params = new URLSearchParams({
        state: 'all',
        per_page: '100',
        page: page.toString(),
        sort: 'updated',
        direction: 'desc',
      });

      const url = `${this.GITHUB_API_BASE}/repos/${this.GITHUB_OWNER}/${repo}/issues?${params}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NVIDIA-Issues-Dashboard/1.0',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.warn(`⚠️ GitHub API rate limit or SAML enforcement for ${repo}`);
          break;
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const issues = await response.json();
      const actualIssues = issues.filter((issue: any) => !issue.pull_request);
      
      allIssues.push(...actualIssues.map((issue: any) => ({
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
      })));

      // Stop if we got fewer issues than requested (last page)
      if (actualIssues.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
      
      // Add small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return allIssues;
  }

  /**
   * Get cached metrics or calculate from cached data
   */
  getCachedMetrics(repo: NVIDIARepo | 'all') {
    const cacheKey = repo === 'all' ? CACHE_KEYS.COMBINED_METRICS : CACHE_KEYS.METRICS(repo);
    return dataCache.get(cacheKey);
  }

  /**
   * Preload data in background for better UX
   */
  async preloadInBackground(repos: NVIDIARepo[]) {
    // Don't await - let this run in background
    repos.forEach(repo => {
      this.loadRepoData(repo, { priority: 'background', cacheFirst: false });
    });
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    dataCache.clear();
    console.log('🧹 Cleared all cached data');
  }
}

export const optimizedGitHub = new OptimizedGitHubService();