# 🚀 NVIDIA Bug Dashboard Optimization Guide

## **Quick Start - Optimized Dashboard**

### **1. One-Time Setup**
```bash
# Run the optimization script
./optimize-dashboard.sh

# This will:
# ✅ Configure memory settings (4GB heap)
# ✅ Create optimized shortcuts  
# ✅ Set up environment variables
# ✅ Clear caches and optimize dependencies
```

### **2. Optimized Commands (Use These!)**
```bash
# Individual Repository Dashboards (Recommended)
nvfuser_dash_optimized      # NvFuser (4,897 issues) - ~28-35 seconds
thunder_dash_optimized      # Lightning-Thunder (2,394 issues) - ~16-20 seconds  
te_dash_optimized          # TransformerEngine (2,003 issues) - ~12-16 seconds

# NPM Scripts (Alternative)
npm run dashboard:nvfuser   # NvFuser dashboard
npm run dashboard:thunder   # Lightning-Thunder dashboard
npm run dashboard:te        # TransformerEngine dashboard

# System Monitoring
./monitor-dashboard.sh      # Real-time performance monitoring
npm run health             # Quick system health check
```

## **Performance Optimizations**

### **Memory Management** 
- **4GB Heap Size**: `NODE_OPTIONS="--max-old-space-size=4096"`
- **512MB Semi-Space**: For garbage collection optimization
- **Automatic GC**: Forces garbage collection when needed

### **GitHub API Optimization**
- **Rate Limiting**: Intelligent request throttling (100ms delays)
- **Circuit Breaker**: Prevents cascading failures
- **Retry Logic**: Exponential backoff for failed requests
- **Caching**: 5-minute TTL for API responses

### **Loading Strategy**
- **Single Repository**: Full coverage (all issues)
- **Combined Dashboard**: Limited to 10 pages for speed
- **Progressive Loading**: Fastest repos load first

## **File Structure**

### **New Optimization Files**
```
├── performance.config.js          # Performance settings
├── optimize-dashboard.sh          # One-time optimization setup
├── monitor-dashboard.sh           # Real-time monitoring
├── src/lib/performance-optimizer.ts  # API rate limiting & memory
├── src/lib/stability-manager.ts   # Error handling & resilience
└── OPTIMIZATION-GUIDE.md          # This guide
```

### **Enhanced Environment (`.env.local`)**
```bash
# Core Configuration
GITHUB_TOKEN=your_token_here

# Performance Tuning
GITHUB_API_CACHE_TTL=300000        # 5 minutes
GITHUB_MAX_PAGES_COMBINED=10       # Combined dashboard limit
GITHUB_MAX_PAGES_SINGLE=50         # Single repo limit
GITHUB_REQUEST_DELAY=100           # 100ms between requests

# Memory Management  
NODE_OPTIONS="--max-old-space-size=4096"
```

## **Monitoring & Troubleshooting**

### **Real-Time Monitoring**
```bash
./monitor-dashboard.sh

# Shows:
# 📊 GitHub API rate limit status
# 🖥️  System resource usage  
# ⚡ Next.js process memory
# 🌐 Dashboard endpoint health
# 📝 Recent logs
```

### **Quick Health Check**
```bash
npm run health

# Output:
# 🏥 System Health:
# Node version: v18.17.0
# Memory: 156MB
# Platform: darwin
```

### **Performance Monitoring**
The dashboard now includes automatic performance logging:
- ⏱️  API call durations
- 📊 Memory usage tracking  
- 🔄 Request queue status
- ⚠️  Warnings for slow operations

## **Expected Performance**

### **Load Times (Optimized)**
| Repository | Issues | Expected Time | Memory Peak |
|------------|--------|---------------|-------------|
| TransformerEngine | 2,003 | 12-16 seconds | ~1.5GB |
| Lightning-Thunder | 2,394 | 16-20 seconds | ~2GB |
| NvFuser | 4,897 | 28-35 seconds | ~3GB |

### **System Requirements**
- **RAM**: 8GB minimum, 16GB recommended
- **Node.js**: v18+ with heap limit increase
- **Network**: Stable internet for GitHub API
- **GitHub Token**: With appropriate rate limits

## **Troubleshooting**

### **Slow Loading**
```bash
# Check system resources
./monitor-dashboard.sh quick

# Check GitHub rate limit
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit

# Force garbage collection
node -e "global.gc && global.gc(); console.log('GC forced')"
```

### **Memory Issues**
```bash
# Monitor memory usage
./monitor-dashboard.sh

# If memory usage > 4GB:
pkill -f "next dev"     # Restart Next.js
nvfuser_dash_optimized  # Use optimized command
```

### **API Rate Limiting**
```bash
# Check current rate limit
./monitor-dashboard.sh test

# If rate limited:
# - Wait for reset time
# - Use smaller page limits
# - Implement caching
```

## **Advanced Configuration**

### **Custom Performance Settings**
Edit `performance.config.js`:
```javascript
module.exports = {
  github: {
    maxPagesForCombinedDashboard: 5,    // Reduce for speed
    maxPagesForSingleRepo: 100,         // Increase for coverage
    requestDelayMs: 50,                 // Faster requests (risky)
  }
};
```

### **Memory Tuning**
For systems with more RAM:
```bash
# 8GB heap
export NODE_OPTIONS="--max-old-space-size=8192"

# 16GB heap (high-memory systems)
export NODE_OPTIONS="--max-old-space-size=16384"
```

### **Production Deployment**
```bash
# Build with optimizations
npm run build:optimized

# Run in production mode
npm run start:optimized
```

## **Monitoring Dashboard**

### **Live Metrics**
The monitoring dashboard shows:
- 🔄 **Active Requests**: Current GitHub API calls
- ⏱️  **Response Times**: Average API latency
- 📊 **Memory Usage**: Heap utilization
- 🚨 **Error Rates**: Failed requests and retries

### **Alerts**
Automatic warnings for:
- Memory usage > 80% of limit
- API rate limit < 100 requests
- Response times > 10 seconds
- Error rates > 5%

## **Tips for Maximum Performance**

1. **Use Single Repository Commands**: Faster than combined dashboard
2. **Monitor Rate Limits**: Check before heavy usage periods  
3. **Restart Periodically**: Clears memory leaks
4. **Use Optimized Scripts**: Always use `*_optimized` versions
5. **Close Unused Tabs**: Reduces browser memory usage

## **Getting Help**

If you encounter issues:
1. Run `./monitor-dashboard.sh` to diagnose
2. Check GitHub rate limits
3. Verify memory settings
4. Review recent logs
5. Restart with optimized commands

---

**🎯 Goal**: Sub-30 second load times with full data coverage and stable performance!