// Stability Manager for Error Handling and Resilience
export class StabilityManager {
  private static retryAttempts = new Map<string, number>();
  private static circuitBreaker = new Map<string, { failures: number; lastFailure: number; isOpen: boolean }>();
  
  // Retry with exponential backoff
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    operationId: string
  ): Promise<T> {
    const currentAttempts = this.retryAttempts.get(operationId) || 0;
    
    try {
      const result = await operation();
      this.retryAttempts.delete(operationId); // Reset on success
      this.resetCircuitBreaker(operationId);
      return result;
    } catch (error) {
      console.error(`❌ Operation failed (attempt ${currentAttempts + 1}/${maxRetries + 1}):`, operationId, error);
      
      if (currentAttempts < maxRetries && !this.isCircuitBreakerOpen(operationId)) {
        this.retryAttempts.set(operationId, currentAttempts + 1);
        
        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delayMs = Math.pow(2, currentAttempts) * 1000;
        console.log(`⏳ Retrying ${operationId} in ${delayMs}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return this.retryWithBackoff(operation, maxRetries, operationId);
      } else {
        this.recordFailure(operationId);
        throw error;
      }
    }
  }

  // Circuit breaker pattern
  private static recordFailure(operationId: string): void {
    const breaker = this.circuitBreaker.get(operationId) || { failures: 0, lastFailure: 0, isOpen: false };
    breaker.failures++;
    breaker.lastFailure = Date.now();
    
    // Open circuit after 5 failures
    if (breaker.failures >= 5) {
      breaker.isOpen = true;
      console.warn(`🔌 Circuit breaker opened for ${operationId} after ${breaker.failures} failures`);
    }
    
    this.circuitBreaker.set(operationId, breaker);
  }

  private static isCircuitBreakerOpen(operationId: string): boolean {
    const breaker = this.circuitBreaker.get(operationId);
    if (!breaker || !breaker.isOpen) return false;
    
    // Auto-reset after 5 minutes
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    if (breaker.lastFailure < fiveMinutesAgo) {
      this.resetCircuitBreaker(operationId);
      return false;
    }
    
    return true;
  }

  private static resetCircuitBreaker(operationId: string): void {
    this.circuitBreaker.delete(operationId);
  }

  // Graceful degradation
  static async withFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    operationId: string
  ): Promise<T> {
    try {
      return await primaryOperation();
    } catch (error) {
      console.warn(`⚠️  Primary operation failed for ${operationId}, using fallback`);
      return await fallbackOperation();
    }
  }

  // Health check for dependencies
  static async healthCheck(): Promise<{ github: boolean; memory: boolean; overall: boolean }> {
    const health = {
      github: false,
      memory: false,
      overall: false
    };

    try {
      // Test GitHub API
      const response = await fetch('https://api.github.com/rate_limit', {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'NVIDIA-Bug-Dashboard/1.0'
        }
      });
      health.github = response.ok;
    } catch (error) {
      console.error('GitHub health check failed:', error);
    }

    try {
      // Check memory usage
      const usage = process.memoryUsage();
      const heapUsedGB = usage.heapUsed / 1024 / 1024 / 1024;
      health.memory = heapUsedGB < 2; // Less than 2GB is healthy
    } catch (error) {
      console.error('Memory health check failed:', error);
    }

    health.overall = health.github && health.memory;
    
    console.log('🏥 Health Check:', health);
    return health;
  }
}

// Error boundary for React components
export class ErrorLogger {
  static logError(error: Error, errorInfo?: any, component?: string): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      component,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      errorInfo
    };

    console.error('🚨 Application Error:', errorData);

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error, { extra: errorData });
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static measurements = new Map<string, number>();

  static startMeasurement(id: string): void {
    this.measurements.set(id, Date.now());
  }

  static endMeasurement(id: string): number {
    const startTime = this.measurements.get(id);
    if (!startTime) {
      console.warn(`⚠️  No start time found for measurement: ${id}`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.measurements.delete(id);
    
    console.log(`⏱️  ${id}: ${duration}ms`);
    
    // Warn on slow operations
    if (duration > 10000) { // 10 seconds
      console.warn(`🐌 Slow operation detected: ${id} took ${duration}ms`);
    }

    return duration;
  }

  static async measureAsync<T>(id: string, operation: () => Promise<T>): Promise<T> {
    this.startMeasurement(id);
    try {
      const result = await operation();
      this.endMeasurement(id);
      return result;
    } catch (error) {
      this.endMeasurement(id);
      throw error;
    }
  }
}