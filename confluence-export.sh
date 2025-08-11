#!/bin/bash

# NVIDIA Dashboard - Confluence Export Utility
# Multiple options for sharing dashboard content in Confluence

echo "🏢 NVIDIA Dashboard - Confluence Export Options"
echo "=============================================="

# Option 1: Take full page screenshots
take_screenshots() {
    echo "📸 Option 1: Taking dashboard screenshots..."
    
    # Create exports directory
    mkdir -p exports/screenshots
    
    echo "🌐 Starting dashboard on localhost:3000..."
    npm run dev &
    DEV_PID=$!
    
    # Wait for server to start
    sleep 10
    
    # Take screenshots of different repository views
    repositories=("lightning-thunder" "TransformerEngine" "Fuser")
    
    for repo in "${repositories[@]}"; do
        echo "📷 Capturing $repo dashboard..."
        # Use screencapture on macOS to take full page screenshot
        open "http://localhost:3000/dashboard/?repo=$repo"
        sleep 5
        screencapture -w "exports/screenshots/${repo}-dashboard-$(date +%Y%m%d).png"
    done
    
    # Stop the dev server
    kill $DEV_PID
    
    echo "✅ Screenshots saved to exports/screenshots/"
    echo "   - Upload these PNG files directly to Confluence"
}

# Option 2: Create print-friendly HTML
create_print_html() {
    echo "🖨️ Option 2: Creating print-friendly HTML..."
    
    mkdir -p exports/html
    
    cat > exports/html/nvidia-dashboard-export.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>NVIDIA Repository Dashboard - Confluence Export</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: white;
            color: #333;
        }
        .dashboard-header {
            background: #1e40af;
            color: white;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 8px;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            background: #f9f9f9;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .metric-card {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #ddd;
            text-align: center;
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #1e40af;
        }
        .metric-label {
            color: #666;
            margin-top: 5px;
        }
        .chart-placeholder {
            background: #f0f0f0;
            height: 300px;
            border: 2px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
            border-radius: 8px;
        }
        @media print {
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="dashboard-header">
        <h1>🚀 NVIDIA Repository Dashboard</h1>
        <p>Real-time insights into Lightning-Thunder, TransformerEngine, and Fuser development</p>
        <p><em>Generated on: $(date)</em></p>
    </div>

    <div class="section">
        <h2>📊 Executive Summary</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">2,249</div>
                <div class="metric-label">Total Issues Tracked</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">91</div>
                <div class="metric-label">Active Issues</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">96%</div>
                <div class="metric-label">Resolution Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">12</div>
                <div class="metric-label">Avg Days to Close</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>🔧 Developer Efficiency Metrics</h2>
        <div class="chart-placeholder">
            [Insert Bug Trends Chart Here]<br>
            <small>Use "Export for Confluence" button to get PNG files</small>
        </div>
        <p><strong>Key Insights:</strong></p>
        <ul>
            <li>High developer velocity with 96% bug resolution rate</li>
            <li>Average resolution time: 12 days</li>
            <li>Strong community engagement across all repositories</li>
        </ul>
    </div>

    <div class="section">
        <h2>👥 Community Engagement</h2>
        <div class="chart-placeholder">
            [Insert Community Engagement Chart Here]<br>
            <small>Use "Export for Confluence" button to get PNG files</small>
        </div>
    </div>

    <div class="section">
        <h2>🔍 Repository Breakdown</h2>
        <h3>Lightning-Thunder</h3>
        <p>Deep learning framework with active community</p>
        
        <h3>TransformerEngine</h3>
        <p>Optimized transformer implementations</p>
        
        <h3>Fuser</h3>
        <p>GPU kernel fusion technology</p>
    </div>
</body>
</html>
EOF

    echo "✅ Print-friendly HTML created at exports/html/nvidia-dashboard-export.html"
    echo "   - Open this in browser and print/save as PDF for Confluence"
}

# Option 3: Create Confluence macro code
create_confluence_macro() {
    echo "📝 Option 3: Creating Confluence macro code..."
    
    mkdir -p exports/confluence
    
    cat > exports/confluence/iframe-embed.txt << 'EOF'
# Option A: Embed as iframe (if dashboard is publicly accessible)

{iframe:src=https://nvmelissa.github.io/nvidia-repo-dashboard/dashboard/|width=100%|height=800px|frameborder=0}

# Option B: HTML macro with static content

{html}
<div style="font-family: Arial, sans-serif; background: white; padding: 20px;">
  <h2 style="color: #1e40af;">🚀 NVIDIA Repository Dashboard</h2>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0;">
    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center;">
      <div style="font-size: 2em; font-weight: bold; color: #1e40af;">2,249</div>
      <div style="color: #666;">Total Issues</div>
    </div>
    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center;">
      <div style="font-size: 2em; font-weight: bold; color: #059669;">96%</div>
      <div style="color: #666;">Resolution Rate</div>
    </div>
    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center;">
      <div style="font-size: 2em; font-weight: bold; color: #dc2626;">91</div>
      <div style="color: #666;">Active Issues</div>
    </div>
    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center;">
      <div style="font-size: 2em; font-weight: bold; color: #7c3aed;">12</div>
      <div style="color: #666;">Days to Close</div>
    </div>
  </div>
  <p><strong>Dashboard Link:</strong> <a href="http://localhost:3000/dashboard/">View Live Dashboard</a></p>
</div>
{html}

EOF

    echo "✅ Confluence macro code saved to exports/confluence/iframe-embed.txt"
    echo "   - Copy and paste this into Confluence pages"
}

# Option 4: Create PowerPoint slides
create_powerpoint_content() {
    echo "📊 Option 4: Creating PowerPoint content template..."
    
    mkdir -p exports/powerpoint
    
    cat > exports/powerpoint/slide-content.md << 'EOF'
# NVIDIA Repository Dashboard - PowerPoint Slides

## Slide 1: Title Slide
**Title:** NVIDIA Repository Dashboard
**Subtitle:** Real-time Development Insights
**Date:** $(date +"%B %Y")

## Slide 2: Executive Summary
- **2,249** Total Issues Tracked
- **96%** Bug Resolution Rate  
- **91** Active Issues
- **12** Average Days to Close

## Slide 3: Key Repositories
### Lightning-Thunder
- Deep learning framework
- Active community engagement

### TransformerEngine  
- Optimized transformer implementations
- High performance focus

### Fuser
- GPU kernel fusion technology
- Advanced optimization

## Slide 4: Developer Efficiency
- Fast resolution times
- High community engagement
- Strong developer velocity
- [Insert chart images here using "Export for Confluence" button]

## Slide 5: Community Insights
- External contributor engagement
- Issue reporting patterns
- Developer activity trends
- [Insert community engagement chart]
EOF

    echo "✅ PowerPoint content template saved to exports/powerpoint/slide-content.md"
}

# Main menu
show_menu() {
    echo ""
    echo "Choose export option:"
    echo "1) 📸 Take full page screenshots (easiest for Confluence)"
    echo "2) 🖨️ Create print-friendly HTML"
    echo "3) 📝 Generate Confluence macro code"
    echo "4) 📊 Create PowerPoint content template"
    echo "5) 🚀 Export all options"
    echo "0) Exit"
    echo ""
    read -p "Enter your choice [0-5]: " choice
}

# Execute based on choice
case "${1:-menu}" in
    "screenshots"|"1")
        take_screenshots
        ;;
    "html"|"2")
        create_print_html
        ;;
    "confluence"|"3")
        create_confluence_macro
        ;;
    "powerpoint"|"4")
        create_powerpoint_content
        ;;
    "all"|"5")
        take_screenshots
        create_print_html
        create_confluence_macro
        create_powerpoint_content
        echo "🎉 All export options completed!"
        ;;
    "menu"|"")
        show_menu
        ./confluence-export.sh $choice
        ;;
    "0")
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Use: screenshots, html, confluence, powerpoint, all, or menu"
        exit 1
        ;;
esac

echo ""
echo "📁 All exports saved to ./exports/ directory"
echo "🔗 Dashboard URL: http://localhost:3000/dashboard/"
echo ""
echo "📋 Quick Confluence Steps:"
echo "1. Click 'Export for Confluence' button in dashboard"
echo "2. Upload the downloaded PNG files to Confluence"
echo "3. Use the HTML template from exports/html/ for text content"
echo ""