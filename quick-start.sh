#!/bin/bash

# NVIDIA Bug Dashboard - One Command Setup & Run
echo "🚀 Starting NVIDIA Bug Dashboard Setup..."

# Check if GitHub token is set
if grep -q "your_github_token_here" .env.local 2>/dev/null; then
    echo "⚠️  QUICK SETUP NEEDED:"
    echo "1. Get GitHub token: https://github.com/settings/tokens"
    echo "2. Replace 'your_github_token_here' in .env.local with your token"
    echo "3. Run this script again"
    echo ""
    echo "📝 Opening .env.local for you to edit..."
    if command -v code &> /dev/null; then
        code .env.local
    elif command -v nano &> /dev/null; then
        nano .env.local
    else
        echo "Edit .env.local manually and replace 'your_github_token_here'"
    fi
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the dashboard
echo "🎯 Starting dashboard with real NVIDIA data..."
echo "📊 Dashboard will be available at: http://localhost:3000/dashboard"
echo "⏱️  Initial load may take 10-15 seconds to fetch GitHub data..."
echo ""

# Open browser automatically (optional)
sleep 3 && (command -v open &> /dev/null && open http://localhost:3000/dashboard || command -v xdg-open &> /dev/null && xdg-open http://localhost:3000/dashboard) &

# Run the dashboard
npm run dev