# 🚀 NVIDIA Dashboard Deployment Guide

*Enterprise deployment options for NVIDIA teams*

---

## 🎯 **Recommended: Google Cloud Platform (Optimal for NVIDIA)**

### **Why GCP?**
- ✅ You already have Google toolsuite access
- ✅ Excellent Next.js support with Cloud Run
- ✅ Professional domain options
- ✅ Easy CI/CD integration
- ✅ Enterprise-grade security and access controls

### **Quick GCP Deployment (15 minutes)**

#### **1. Prepare Your Project**
```bash
# Install Google Cloud SDK (if not already installed)
curl https://sdk.cloud.google.com | bash
gcloud auth login

# Initialize your project
gcloud config set project your-nvidia-project-id
```

#### **2. Create Cloud Run Service**
```bash
# Build and deploy in one command
gcloud run deploy nvidia-bug-dashboard \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10
```

#### **3. Set Environment Variables**
```bash
gcloud run services update nvidia-bug-dashboard \
  --set-env-vars="GITHUB_TOKEN=your_token_here" \
  --set-env-vars="NODE_OPTIONS=--max-old-space-size=2048"
```

#### **4. Custom Domain (Optional)**
```bash
# Map to nvidia.com subdomain
gcloud run domain-mappings create \
  --service nvidia-bug-dashboard \
  --domain dashboard.nvidia.com
```

**Result**: `https://nvidia-bug-dashboard-xxx.run.app` (or custom domain)

---

## 🔷 **Alternative: Vercel (Easiest)**

### **Perfect for Next.js + GitHub Integration**

#### **One-Click Deployment**
1. Push your code to GitHub
2. Connect GitHub to Vercel
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy automatically

#### **Vercel Setup**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel

# Set production environment variables
vercel env add GITHUB_TOKEN
```

**Result**: `https://nvidia-dashboard.vercel.app` (free custom domain)

---

## 🏢 **Enterprise Option: NVIDIA Internal Hosting**

### **If NVIDIA Has Internal Web Hosting**

#### **Docker Deployment**
```dockerfile
# Dockerfile (create this)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and deploy
docker build -t nvidia-dashboard .
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=your_token \
  nvidia-dashboard
```

---

## 📊 **Integration Options**

### **1. Confluence Integration**

#### **Option A: Embed as iFrame**
```html
<iframe 
  src="https://your-dashboard-url.com" 
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>
```

#### **Option B: Link from Confluence Pages**
Create a Confluence page with:
- Dashboard overview and metrics explanation
- Direct links to live dashboard
- Screenshots for quick reference
- Team access instructions

### **2. Power BI Integration**

#### **Option A: Web Content Tile**
1. In Power BI, add "Web content" tile
2. Enter your dashboard URL
3. Embed in NVIDIA Power BI workspace

#### **Option B: Custom Visual**
1. Export dashboard data as API endpoints
2. Create Power BI custom visual
3. Integrate with existing NVIDIA Power BI reports

### **3. Google Sites Integration**
```html
<!-- Embed in Google Sites -->
<div>
  <h2>NVIDIA Bug Dashboard</h2>
  <iframe src="https://your-dashboard.run.app" 
          width="100%" height="600px">
  </iframe>
  <p><a href="https://your-dashboard.run.app" target="_blank">
    Open Full Dashboard →
  </a></p>
</div>
```

---

## 🔐 **Security & Access Control**

### **Public Access (Recommended)**
```javascript
// No authentication needed for GitHub issue data
// Safe for public consumption
```

### **NVIDIA-Only Access**
```javascript
// Add Google OAuth for nvidia.com emails only
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          hd: "nvidia.com" // Restrict to nvidia.com domain
        }
      }
    })
  ]
}
```

---

## 📋 **Step-by-Step Deployment Plan**

### **Recommended Path for NVIDIA:**

#### **Phase 1: Quick Start (Today)**
1. **Deploy to Vercel** (5 minutes)
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables
   - Get public URL

#### **Phase 2: Professional Setup (This Week)**
1. **Deploy to GCP Cloud Run**
   - Professional nvidia.com subdomain
   - Better performance and control
   - Enterprise security features

#### **Phase 3: Integration (Next Week)**
1. **Create Confluence Page**
   - Dashboard overview
   - Metrics guide links
   - Team access instructions
2. **Add to Power BI Workspace**
   - Web content tiles
   - Link from existing reports

#### **Phase 4: Enhancement (Later)**
1. **Custom Analytics**
   - Google Analytics integration
   - Usage tracking
   - Performance monitoring

---

## 🛠️ **Pre-Deployment Checklist**

### **Environment Setup**
- [ ] GitHub token configured
- [ ] .env.local properly set up
- [ ] Build process working locally
- [ ] Performance optimizations applied

### **Security Review**
- [ ] No secrets in client-side code
- [ ] GitHub token has minimal required permissions
- [ ] Environment variables properly configured
- [ ] Access controls considered

### **Documentation**
- [ ] Metrics guide accessible
- [ ] Quick reference available
- [ ] Team access instructions written
- [ ] Maintenance procedures documented

---

## 🎯 **Recommended Timeline**

| Day | Action | Platform | Result |
|-----|--------|----------|---------|
| Day 1 | Deploy to Vercel | Vercel | Public URL available |
| Day 2 | Create Confluence page | Confluence | Team documentation |
| Day 3 | Set up GCP deployment | GCP | Professional domain |
| Day 4 | Power BI integration | Power BI | Executive visibility |
| Day 5 | Team training & rollout | All | Full adoption |

---

## 📞 **Support & Maintenance**

### **Monitoring**
- Set up uptime monitoring (UptimeRobot, StatusCake)
- Configure alerts for service issues
- Monitor GitHub API rate limits

### **Updates**
- Automatic deployments from GitHub
- Staging environment for testing
- Rollback procedures

### **Support**
- Documentation links in dashboard
- Internal Slack channel for questions
- Regular team check-ins

---

## 🚀 **Quick Start Command**

```bash
# Deploy to Vercel right now (5 minutes)
npx vercel --prod

# Or deploy to GCP (10 minutes)
gcloud run deploy nvidia-dashboard --source .
```

**Get your dashboard live today and enhance it over time!** 🎯