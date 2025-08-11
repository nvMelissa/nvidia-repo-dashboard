#!/bin/bash

# Screenshot Dashboard for Confluence
echo "📸 Dashboard Screenshot Guide for Confluence"
echo "=========================================="

echo ""
echo "🌐 Dashboard URLs to screenshot:"
echo ""
echo "1. Lightning-Thunder:"
echo "   http://localhost:3000/dashboard/?repo=lightning-thunder"
echo ""
echo "2. TransformerEngine:" 
echo "   http://localhost:3000/dashboard/?repo=TransformerEngine"
echo ""
echo "3. Fuser:"
echo "   http://localhost:3000/dashboard/?repo=Fuser"
echo ""

echo "📋 Screenshot Instructions:"
echo ""
echo "Method 1 - macOS Built-in (Recommended):"
echo "  1. Open each URL above"
echo "  2. Press Cmd+Shift+4"
echo "  3. Select the dashboard area"
echo "  4. PNG file saved to Desktop"
echo ""

echo "Method 2 - Chrome DevTools (Best Quality):"
echo "  1. Open each URL above"
echo "  2. Press F12 (open DevTools)"
echo "  3. Press Cmd+Shift+M (device toolbar)"
echo "  4. Click '...' menu → 'Capture screenshot'"
echo "  5. Full page PNG downloaded"
echo ""

echo "Method 3 - Firefox Screenshots:"
echo "  1. Open each URL above"
echo "  2. Right-click → 'Take Screenshot'"
echo "  3. Select 'Save visible area' or 'Save full page'"
echo ""

# Auto-open the URLs for convenience
if command -v open >/dev/null 2>&1; then
    echo "🚀 Opening dashboard URLs..."
    sleep 2
    open "http://localhost:3000/dashboard/?repo=lightning-thunder"
    sleep 3
    open "http://localhost:3000/dashboard/?repo=TransformerEngine"
    sleep 3
    open "http://localhost:3000/dashboard/?repo=Fuser"
    echo ""
    echo "✅ All dashboards opened! Take screenshots now."
else
    echo "💡 Manually open the URLs above in your browser"
fi

echo ""
echo "📁 Suggested filenames for Confluence:"
echo "  - lightning-thunder-dashboard.png"
echo "  - transformer-engine-dashboard.png" 
echo "  - fuser-dashboard.png"
echo ""
echo "🏢 Ready for Confluence upload!"