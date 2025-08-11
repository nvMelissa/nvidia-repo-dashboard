# 🚀 NVIDIA Repository Dashboard - Setup for Cursor Users

## 📊 **What You'll Get**

A comprehensive dashboard for tracking NVIDIA GitHub repositories with:

✅ **Individual Repository Dashboards** (NvFuser, TransformerEngine, Lightning-Thunder)  
✅ **Interactive Trends Dashboard** with Chart.js visualizations  
✅ **Developer Assignment Tracking** (assigned + opened issues)  
✅ **Real GitHub API Integration** with 1,200+ issues  
✅ **90-day Stale Issue Detection**  
✅ **Beautiful Charts** with teal/brown color schemes  

## ⚡ **Quick Setup (5 minutes)**

### 1. **Clone the Repository**
```bash
git clone https://github.com/nvMelissa/nvidia-repo-dashboard.git
cd nvidia-repo-dashboard
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Set Up Environment**
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your GitHub token
# GITHUB_TOKEN=your_github_personal_access_token_here
```

**Get GitHub Token:**
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate token with `repo` permissions  
3. Copy token to `.env.local`

### 4. **Start the Dashboard**
```bash
npm run dev
```

## 🎯 **Access Your Dashboards**

### **Individual Repository Dashboards:**
- **NvFuser**: `http://localhost:3000/dashboard/?repo=Fuser`
- **Lightning-Thunder**: `http://localhost:3000/dashboard/?repo=lightning-thunder`  
- **TransformerEngine**: `http://localhost:3000/dashboard/?repo=TransformerEngine`

### **Trends Dashboard:**
- **Multi-Repo Trends**: `http://localhost:3000/trends/`

### **Quick Shortcuts:**
```bash
npm run dashboard:nvfuser     # Opens NvFuser dashboard
npm run dashboard:thunder     # Opens Lightning-Thunder dashboard  
npm run dashboard:te          # Opens TransformerEngine dashboard
```

## 📊 **Dashboard Features**

### **Program Metrics**
- Real-time issue counts from GitHub API
- Open vs Closed issue ratios
- Repository health indicators

### **Developer Efficiency**  
- Bug resolution rates and trends
- 🟦 **Teal bars**: Issues assigned to developers
- 🟨 **Brown bars**: Issues opened by developers
- Performance metrics across repositories

### **Community Engagement**
- External contributor tracking
- Issue creation patterns
- Community involvement metrics

### **Needs Attention**
- 🟡 **Stale Issues**: No activity for 90+ days
- Critical issues without assignees
- High-priority items requiring attention

## 🛠 **Technical Stack**

- **Next.js 15.4.5** with Turbopack for ultra-fast development
- **React 19.1.0** with modern hooks and components
- **TypeScript 5** for type safety
- **Chart.js** with time-series and stacked bar charts
- **Tailwind CSS 4** for beautiful styling
- **GitHub API** with rate limiting and caching

## 🎨 **Customization**

### **Add New Repositories**
Edit `src/lib/github/api.ts` and add your repository to the list:
```typescript
const repositories = ['TransformerEngine', 'Fuser', 'lightning-thunder', 'YourRepo'];
```

### **Modify Stale Issue Threshold**
Edit `src/components/ImportantIssuesSummary.tsx`:
```typescript
// Change from 90 days to your preferred threshold
return daysDiff > 90 && issue.state === 'open';
```

### **Update Color Schemes**
Edit `src/app/trends/page.tsx` for chart colors:
```typescript
// Teal for assigned issues
const assignedColor = '#14B8A6';
// Brown/Amber for opened issues  
const openedColor = '#F59E0B';
```

## 🚨 **Troubleshooting**

### **Port Already in Use**
If port 3000 is busy, Next.js automatically uses the next available port (3001, 3002, etc.)

### **GitHub API Rate Limits**
- Free GitHub accounts: 60 requests/hour
- With token: 5,000 requests/hour  
- Dashboard implements caching to minimize API calls

### **Charts Not Loading**
```bash
# Clear Next.js cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### **Environment Issues**
```bash
# Check your environment setup
npm run health
```

## 📚 **Documentation**

- **Detailed Metrics Guide**: See `DASHBOARD-METRICS-GUIDE.md`
- **Performance Tips**: Dashboard includes memory optimization
- **API Integration**: Comprehensive GitHub API with error handling

## 🤝 **Contributing**

This dashboard is actively maintained and includes:
- Comprehensive backup system
- Real GitHub data integration
- Performance optimizations  
- Responsive design
- TypeScript type safety

## 🎯 **What Makes This Special**

✅ **Real Data**: No mock data - everything comes from live GitHub API  
✅ **Developer Focus**: Shows both assigned and opened issues per developer  
✅ **Multi-Repository**: Tracks multiple NVIDIA repos simultaneously  
✅ **Interactive Charts**: Beautiful Chart.js visualizations with hover details  
✅ **Performance Optimized**: Built for speed with caching and rate limiting  
✅ **Cursor Ready**: Designed specifically for Cursor IDE users  

---

## 🚀 **Ready to Start?**

1. Clone the repository
2. Add your GitHub token  
3. Run `npm run dev`
4. Open your first dashboard!

**Questions?** Check the documentation or create an issue in the repository.

🎉 **Enjoy your NVIDIA repository insights!**