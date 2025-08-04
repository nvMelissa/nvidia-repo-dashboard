// Performance Configuration for NVIDIA Bug Dashboard
module.exports = {
  // GitHub API Optimization
  github: {
    maxPagesForCombinedDashboard: 10,      // Limit for all-repos view
    maxPagesForSingleRepo: 50,             // Limit for individual repos  
    requestDelayMs: 100,                   // Delay between requests
    concurrentRequests: 3,                 // Max parallel requests
    rateLimitBuffer: 100,                  // Keep this many requests in reserve
    cacheTTL: 5 * 60 * 1000,              // 5 minutes cache
  },
  
  // Memory Management
  node: {
    maxOldSpaceSize: 4096,                 // 4GB heap size
    maxSemiSpaceSize: 512,                 // 512MB for young generation
  },
  
  // Repository Settings
  repositories: {
    // Priority order for loading (fastest first)
    loadOrder: ['TransformerEngine', 'lightning-thunder', 'Fuser'],
    
    // Expected issue counts (for progress indicators)
    expectedCounts: {
      'TransformerEngine': 2003,
      'lightning-thunder': 2394, 
      'Fuser': 4897
    }
  },
  
  // Development Settings
  development: {
    enableVerboseLogging: true,
    showPerformanceMetrics: true,
    enableHotReload: true
  }
};