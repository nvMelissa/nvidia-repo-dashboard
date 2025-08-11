#!/bin/bash

# Quick Confluence Export - Just the essentials
echo "🏢 Quick Confluence Export for NVIDIA Dashboard"
echo "=============================================="

# Create directory
mkdir -p confluence-ready

echo "🌐 Opening dashboard in browser..."
echo "📋 Instructions:"
echo ""
echo "1. ✅ AUTOMATIC: Click the green 'Export for Confluence' button in the dashboard"
echo "   - This will download PNG files of all charts"
echo ""
echo "2. 📸 MANUAL: Take screenshots with Cmd+Shift+4 on macOS:"
echo "   - Lightning-Thunder: http://localhost:3000/dashboard/?repo=lightning-thunder"
echo "   - TransformerEngine: http://localhost:3000/dashboard/?repo=TransformerEngine" 
echo "   - Fuser: http://localhost:3000/dashboard/?repo=Fuser"
echo ""
echo "3. 📋 Copy this summary for Confluence:"
echo ""

cat > confluence-ready/dashboard-summary.txt << 'EOF'
# NVIDIA Repository Dashboard Summary

## 📊 Key Metrics
- **2,249** Total Issues Tracked across 3 repositories
- **96%** Bug Resolution Rate 
- **91** Currently Active Issues
- **12** Average Days to Close Issues

## 🚀 Repositories Monitored
- **Lightning-Thunder**: Deep learning framework
- **TransformerEngine**: Optimized transformer implementations  
- **Fuser**: GPU kernel fusion technology

## 🔍 Dashboard Features
- Real-time GitHub issue tracking
- Developer efficiency metrics
- Community engagement analysis
- Multi-repository comparison

## 🔗 Access
Live Dashboard: http://localhost:3000/dashboard/
EOF

echo "📋 Dashboard Summary (copy to Confluence):"
echo "=========================================="
cat confluence-ready/dashboard-summary.txt
echo ""
echo "✅ Summary saved to: confluence-ready/dashboard-summary.txt"
echo ""

# Open the dashboard automatically
if command -v open >/dev/null 2>&1; then
    echo "🌐 Opening Lightning-Thunder dashboard..."
    open "http://localhost:3000/dashboard/?repo=lightning-thunder"
else
    echo "🌐 Open this URL: http://localhost:3000/dashboard/?repo=lightning-thunder"
fi

echo ""
echo "💡 Pro Tips for Confluence:"
echo "- Use the green 'Export for Confluence' button for best quality charts"
echo "- Upload the downloaded PNG files directly to Confluence pages"
echo "- Copy the summary text above for professional documentation"