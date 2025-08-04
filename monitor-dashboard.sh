#!/bin/bash

# NVIDIA Bug Dashboard Performance Monitor
echo "📊 NVIDIA Dashboard Performance Monitor"
echo "======================================="

# Function to get memory usage
get_memory_usage() {
    local pid=$1
    if [ ! -z "$pid" ] && kill -0 $pid 2>/dev/null; then
        local memory=$(ps -o rss= -p $pid | tail -1)
        if [ ! -z "$memory" ]; then
            echo "$((memory / 1024))"
        else
            echo "0"
        fi
    else
        echo "0"
    fi
}

# Function to check GitHub API rate limit
check_github_rate_limit() {
    if [ ! -z "$GITHUB_TOKEN" ]; then
        curl -s -H "Authorization: token $GITHUB_TOKEN" \
             -H "User-Agent: NVIDIA-Dashboard-Monitor" \
             https://api.github.com/rate_limit | \
        node -e "
            const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
            console.log('GitHub API Rate Limit:');
            console.log('  Remaining:', data.rate.remaining);
            console.log('  Limit:', data.rate.limit);
            console.log('  Reset:', new Date(data.rate.reset * 1000).toLocaleTimeString());
            const percentage = (data.rate.remaining / data.rate.limit * 100).toFixed(1);
            console.log('  Usage:', percentage + '%');
        " 2>/dev/null || echo "❌ Could not check GitHub rate limit"
    else
        echo "⚠️  GITHUB_TOKEN not set - cannot check rate limit"
    fi
}

# Function to monitor system resources
monitor_system() {
    echo ""
    echo "🖥️  System Resources:"
    echo "  CPU Usage: $(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')"
    echo "  Memory Pressure: $(memory_pressure | head -1)"
    
    # Check disk space
    local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    echo "  Disk Usage: ${disk_usage}%"
    
    if [ $disk_usage -gt 80 ]; then
        echo "  ⚠️  High disk usage detected!"
    fi
}

# Function to check Next.js process
monitor_nextjs() {
    local next_pid=$(pgrep -f "next dev")
    if [ ! -z "$next_pid" ]; then
        local memory_mb=$(get_memory_usage $next_pid)
        local uptime=$(ps -o etime= -p $next_pid | tr -d ' ')
        
        echo ""
        echo "⚡ Next.js Process (PID: $next_pid):"
        echo "  Memory Usage: ${memory_mb}MB"
        echo "  Uptime: $uptime"
        
        if [ $memory_mb -gt 2048 ]; then
            echo "  ⚠️  High memory usage detected!"
        fi
        
        if [ $memory_mb -gt 4096 ]; then
            echo "  🚨 Critical memory usage! Consider restarting."
        fi
    else
        echo ""
        echo "❌ Next.js process not found"
    fi
}

# Function to test dashboard endpoints
test_dashboard_endpoints() {
    echo ""
    echo "🌐 Testing Dashboard Endpoints:"
    
    local base_url="http://localhost:3000"
    local endpoints=(
        "/dashboard"
        "/dashboard?repo=Fuser"
        "/dashboard?repo=lightning-thunder"
        "/dashboard?repo=TransformerEngine"
        "/api/dashboard"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local start_time=$(date +%s%3N)
        local status=$(curl -s -o /dev/null -w "%{http_code}" "${base_url}${endpoint}" --max-time 10)
        local end_time=$(date +%s%3N)
        local response_time=$((end_time - start_time))
        
        if [ "$status" = "200" ]; then
            echo "  ✅ $endpoint - ${response_time}ms"
        else
            echo "  ❌ $endpoint - HTTP $status"
        fi
    done
}

# Function to show real-time logs
show_logs() {
    echo ""
    echo "📝 Recent Logs (last 20 lines):"
    echo "--------------------------------"
    
    # Try to find Next.js logs
    if [ -f ".next/trace" ]; then
        tail -20 .next/trace
    elif command -v lsof >/dev/null 2>&1; then
        # Try to find the process and its output
        local next_pid=$(pgrep -f "next dev")
        if [ ! -z "$next_pid" ]; then
            echo "Process $next_pid is running..."
        fi
    else
        echo "No recent logs found"
    fi
}

# Main monitoring loop
main() {
    # Load environment if available
    if [ -f .env.local ]; then
        source .env.local
    fi
    
    while true; do
        clear
        echo "📊 NVIDIA Dashboard Monitor - $(date)"
        echo "=========================================="
        
        check_github_rate_limit
        monitor_system
        monitor_nextjs
        test_dashboard_endpoints
        
        echo ""
        echo "🔄 Refreshing in 30 seconds... (Ctrl+C to exit)"
        echo "💡 Commands: 'q' to quit, 'r' to refresh now, 't' to test endpoints only"
        
        # Wait for input or timeout
        read -t 30 -n 1 input
        case $input in
            q|Q) 
                echo ""
                echo "👋 Monitoring stopped"
                exit 0
                ;;
            r|R)
                continue
                ;;
            t|T)
                clear
                test_dashboard_endpoints
                read -p "Press Enter to continue..."
                ;;
        esac
    done
}

# Handle command line arguments
case "$1" in
    "quick")
        check_github_rate_limit
        monitor_system
        monitor_nextjs
        ;;
    "test")
        test_dashboard_endpoints
        ;;
    "logs")
        show_logs
        ;;
    *)
        main
        ;;
esac