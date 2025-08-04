# NVIDIA Bug Dashboard

A comprehensive multi-repository bug tracking dashboard for NVIDIA's TransformerEngine, Fuser, and Lightning-Thunder projects.

📖 **[View Complete Metrics Guide →](DASHBOARD-METRICS-GUIDE.md)**

## Features

✅ **Multi-Repository Support**
- TransformerEngine bug tracking
- Fuser bug tracking  
- Cross-repository analytics

✅ **Comprehensive Metrics**
- **Issue Management**: Bug burn rate, resolution time, stale issues, critical alerts
- **Developer Efficiency**: Developer efficiency metrics (cycle time, throughput, review time)
- **Community Engagement**: Contributor activity, external participation, response times
- **Trend Analysis**: 3-month historical trends and projections
- **Cross-Repository**: Multi-repo comparison and analytics

✅ **Real-time Data**
- GitHub API integration
- Rate limit handling (5000/hour)
- Automatic data refresh
- Server-side rendering for performance

✅ **Interactive Visualizations**
- Repository filtering
- Comparison charts
- Progress indicators
- Responsive design

## Setup Instructions

### 1. Environment Configuration

Copy the environment template:
```bash
cp .env.local.example .env.local
```

Fill in your configuration:
```bash
# Required: Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required: GitHub Personal Access Token
GITHUB_TOKEN=your_github_personal_access_token

# Optional: Repository configuration
NEXT_PUBLIC_ENABLE_TRANSFORMERENGINE=true
NEXT_PUBLIC_ENABLE_THUNDER=true  
NEXT_PUBLIC_ENABLE_NVFUSER=true
```

### 2. GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with these permissions:
   - `repo` (for accessing repository issues)
   - `read:org` (for organization repositories)
3. Add the token to your `.env.local` file

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000/dashboard` to see your bug dashboard!

## Architecture

### Components
- **BugDashboard**: Main dashboard container with three sections
- **Issue Management**: BugChart, ImportantIssuesSummary, BugTrendChart, IssueTypeChart
- **Developer Efficiency**: Developer efficiency metrics, DeveloperActivityChart  
- **Community Engagement**: CommunityEngagementMetrics
- **Repository Selector**: Filter data by repository

### API Services
- **GitHub API Service**: Handles multi-repo data fetching
- **Metrics Calculator**: Bug analytics and trends
- **Rate Limiting**: Respects GitHub API limits

### Data Flow
1. Server-side data fetching on page load
2. Client-side refresh capability
3. Real-time metric calculations
4. Cached results for performance

## Customization

### Adding New Repositories
1. Update `NVIDIARepo` type in `src/lib/github/types.ts`
2. Add repository to environment configuration
3. Update charts to include new repository

### Modifying Metrics
1. Edit calculation functions in `src/lib/github/metrics.ts`
2. Update TypeScript interfaces as needed
3. Adjust chart components for new metrics

### Styling
- Uses Tailwind CSS for consistent design
- Responsive grid layouts
- Customizable color schemes
- Accessibility-compliant components

## Rate Limiting & Performance

- **5000 requests/hour** GitHub API limit
- **Staggered requests** to avoid rate limiting
- **Server-side caching** for better performance
- **Error handling** for API failures
- **Fallback UI** when data unavailable

## Troubleshooting

### Common Issues
1. **Rate Limit Exceeded**: Wait for reset or use authenticated token
2. **Missing Environment Variables**: Check `.env.local` configuration
3. **Authentication Issues**: Verify Supabase credentials
4. **GitHub API Errors**: Check token permissions and repository access

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
```

## Dashboard Sections

### 📝 Issue Management & Project Health
- **Issue Overview**: Total, open, closed, burn rate, resolution time
- **Important Issues**: Stale, critical, unassigned, overdue alerts  
- **Trends**: 3-month historical view of issue creation/closure
- **Distribution**: Issue types (bug, enhancement, documentation) and priorities

### ⚡ Developer Efficiency  
- **Developer Efficiency Metrics**: Cycle time, review time, PR size, throughput
- **Developer Activity**: Individual contributor performance
- **Trends**: Historical efficiency metrics over time

### 🤝 Community Engagement
- **Contributor Health**: Total, active, first-time, external contributors
- **Response Metrics**: Average response time, engagement rates
- **Growth Trends**: Community expansion over time

**📖 [Complete Metrics Documentation →](DASHBOARD-METRICS-GUIDE.md)**

## Built With

- **Next.js 15** with App Router and Turbopack
- **React 19** with Server Components  
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling
- **Chart.js** for data visualization
- **GitHub API** for real-time data
- **Supabase** for authentication (optional)