// Performance Optimizer for GitHub API calls
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private requestQueue: Map<string, Promise<any>> = new Map();
  private requestTimestamps: number[] = [];
  private readonly RATE_LIMIT_PER_HOUR = 5000;
  private readonly CONCURRENT_LIMIT = 3;
  
  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  async optimizedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Check if request is already in progress
    if (this.requestQueue.has(url)) {
      return this.requestQueue.get(url)!;
    }

    // Rate limiting check
    await this.checkRateLimit();

    // Create request promise
    const requestPromise = this.makeRequest(url, options);
    this.requestQueue.set(url, requestPromise);

    try {
      const response = await requestPromise;
      return response;
    } finally {
      this.requestQueue.delete(url);
    }
  }

  private async makeRequest(url: string, options: RequestInit): Promise<Response> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NVIDIA-Bug-Dashboard/1.0',
          ...options.headers,
        },
      });

      // Log performance metrics
      const duration = Date.now() - startTime;
      console.log(`📊 API Call: ${url.split('?')[0]} - ${duration}ms`);

      // Check rate limit headers
      this.logRateLimitStatus(response);

      return response;
    } catch (error) {
      console.error(`❌ API Error: ${url}`, error);
      throw error;
    }
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Remove old timestamps
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => timestamp > oneHourAgo
    );

    // Check if we're approaching rate limit
    if (this.requestTimestamps.length >= this.RATE_LIMIT_PER_HOUR - 100) {
      const oldestRequest = Math.min(...this.requestTimestamps);
      const waitTime = oldestRequest + (60 * 60 * 1000) - now;
      
      if (waitTime > 0) {
        console.warn(`⏳ Rate limit approaching, waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    // Add delay between requests to be nice to GitHub
    if (this.requestTimestamps.length > 0) {
      const lastRequest = Math.max(...this.requestTimestamps);
      const timeSinceLastRequest = now - lastRequest;
      const minDelay = 100; // 100ms between requests
      
      if (timeSinceLastRequest < minDelay) {
        await new Promise(resolve => 
          setTimeout(resolve, minDelay - timeSinceLastRequest)
        );
      }
    }

    this.requestTimestamps.push(now);
  }

  private logRateLimitStatus(response: Response): void {
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    
    if (remaining && reset) {
      const resetTime = new Date(parseInt(reset) * 1000);
      console.log(`📈 Rate Limit: ${remaining} requests remaining, resets at ${resetTime.toLocaleTimeString()}`);
      
      if (parseInt(remaining) < 100) {
        console.warn(`⚠️  Rate limit running low: ${remaining} requests remaining`);
      }
    }
  }

  // Get performance metrics
  getMetrics() {
    return {
      activeRequests: this.requestQueue.size,
      requestsInLastHour: this.requestTimestamps.length,
      remainingRequests: this.RATE_LIMIT_PER_HOUR - this.requestTimestamps.length
    };
  }
}

// Enhanced memory management
export class MemoryManager {
  static monitorMemory(): void {
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        const usage = process.memoryUsage();
        const formatMB = (bytes: number) => Math.round(bytes / 1024 / 1024);
        
        console.log(`🧠 Memory Usage:`, {
          rss: `${formatMB(usage.rss)}MB`,
          heapUsed: `${formatMB(usage.heapUsed)}MB`,
          heapTotal: `${formatMB(usage.heapTotal)}MB`,
          external: `${formatMB(usage.external)}MB`
        });

        // Warn if memory usage is high
        if (usage.heapUsed > 1024 * 1024 * 1024) { // 1GB
          console.warn('⚠️  High memory usage detected');
        }
      }, 30000); // Check every 30 seconds
    }
  }

  static forceGC(): void {
    if (global.gc) {
      global.gc();
      console.log('🗑️  Garbage collection forced');
    }
  }
}

// Progress tracking for long operations
export class ProgressTracker {
  private progress = new Map<string, { current: number; total: number; startTime: number }>();

  startOperation(id: string, total: number): void {
    this.progress.set(id, {
      current: 0,
      total,
      startTime: Date.now()
    });
  }

  updateProgress(id: string, current: number): void {
    const operation = this.progress.get(id);
    if (operation) {
      operation.current = current;
      const elapsed = Date.now() - operation.startTime;
      const rate = current / (elapsed / 1000);
      const remaining = operation.total - current;
      const eta = remaining / rate;

      console.log(`📊 ${id}: ${current}/${operation.total} (${Math.round(current/operation.total*100)}%) - ETA: ${Math.round(eta)}s`);
    }
  }

  completeOperation(id: string): void {
    const operation = this.progress.get(id);
    if (operation) {
      const totalTime = Date.now() - operation.startTime;
      console.log(`✅ ${id} completed in ${Math.round(totalTime/1000)}s`);
      this.progress.delete(id);
    }
  }
}