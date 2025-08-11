// Chart export utilities for Confluence integration
export function exportChartAsImage(chartId: string, filename: string = 'chart') {
  const canvas = document.querySelector(`#${chartId} canvas`) as HTMLCanvasElement;
  if (!canvas) {
    console.error(`Chart canvas not found for ID: ${chartId}`);
    return;
  }

  // Create download link
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAllChartsAsImages() {
  const charts = [
    { id: 'bug-overview-chart', name: 'bug-overview' },
    { id: 'bug-trends-chart', name: 'bug-trends' },
    { id: 'dora-metrics-chart', name: 'developer-efficiency' },
    { id: 'community-engagement-chart', name: 'community-engagement' },
    { id: 'issue-type-chart', name: 'issue-types' },
    { id: 'developer-activity-chart', name: 'developer-activity' }
  ];

  charts.forEach((chart, index) => {
    setTimeout(() => {
      exportChartAsImage(chart.id, chart.name);
    }, index * 500); // Stagger downloads
  });
}

export function exportDashboardAsHTML(): string {
  const dashboard = document.querySelector('[data-dashboard="main"]');
  if (!dashboard) {
    console.error('Dashboard element not found');
    return '';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <title>NVIDIA Repository Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .chart-container { margin: 20px 0; padding: 20px; border: 1px solid #ccc; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
  </style>
</head>
<body>
  ${dashboard.innerHTML}
</body>
</html>
  `;
}