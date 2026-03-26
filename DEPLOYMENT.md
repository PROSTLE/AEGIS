# AEGIS - Deployment Guide (Vercel + Cloud Services)

## Overview

AEGIS can be deployed entirely on free cloud services:
- **Frontend**: Vercel (React/Vite)
- **Backend**: Vercel (Serverless API) or Railway/Render
- **Database**: Supabase (PostgreSQL free tier)
- **Cache**: Upstash (Redis free tier)

---

## Prerequisites

- GitHub account (for version control)
- Vercel account (free) - https://vercel.com
- Supabase account (free) - https://supabase.com
- Upstash account (free) - https://upstash.com
- Gemini API key - https://ai.google.dev

---

## Step 1: Prepare Your Repository

### Push to GitHub
```powershell
cd C:\Lang\AEGIS
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
git add .
git commit -m "Initial commit: AEGIS project setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aegis.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your GitHub username

---

## Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel CLI (Fastest)

```powershell
cd C:\Lang\AEGIS\frontend
npm install -g vercel
vercel login
vercel
```

### Option B: Using Vercel Dashboard (GUI)

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Connect your GitHub account
4. Select your `aegis` repository
5. Select `frontend` as root directory
6. Add environment variable:
   - `VITE_API_BASE_URL=https://aegis-api.vercel.app`
7. Click "Deploy"

### Result
Frontend will be live at: `https://aegis.vercel.app` (or your custom domain)

---

## Step 3: Deploy Backend to Vercel

### Create Vercel Configuration

Create `C:\Lang\AEGIS\backend\vercel.json`:

```json
{
  "buildCommand": "pip install -r requirements.txt",
  "outputDirectory": ".",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/main.py"
    },
    {
      "source": "/(.*)",
      "destination": "/main.py"
    }
  ],
  "env": {
    "PYTHONUNBUFFERED": "1"
  }
}
```

### Deploy to Vercel

1. Go to https://vercel.com/new
2. Select "Add Existing Project" → Select `aegis` repo
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Output Directory**: Leave blank

4. Add **Environment Variables**:
   ```
   DATABASE_URL=postgresql://user:password@host/db
   REDIS_URL=redis://default:password@host:port
   GEMINI_API_KEY=your_key_here
   DEBUG=false
   ENVIRONMENT=production
   ```

5. Click "Deploy"

Backend will be at: `https://aegis-api.vercel.app`

---

## Step 4: Setup PostgreSQL (Supabase)

### Create Supabase Project

1. Visit https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name**: `aegis-db`
   - **Password**: Save this!
   - **Region**: Closest to you

4. Once created, go to **Settings** → **Database**
5. Copy the **Connection String**:
   ```
   postgresql://postgres:PASSWORD@HOST:5432/postgres
   ```

6. Add to Vercel Backend Environment Variables:
   ```
   DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres
   ```

---

## Step 5: Setup Redis (Upstash)

### Create Upstash Database

1. Visit https://console.upstash.com
2. Click "Create Database"
3. Fill in:
   - **Name**: `aegis-cache`
   - **Region**: Global

4. Copy **Redis URL**:
   ```
   redis://default:PASSWORD@HOST:PORT
   ```

5. Add to Vercel Backend Environment Variables:
   ```
   REDIS_URL=redis://default:PASSWORD@HOST:PORT
   ```

---

## Step 6: Update Frontend API URL

Once backend is deployed, update frontend environment:

1. Go to Vercel Dashboard → `aegis` (Frontend Project)
2. Settings → Environment Variables
3. Update `VITE_API_BASE_URL`:
   ```
   VITE_API_BASE_URL=https://aegis-api.vercel.app
   ```

4. Redeploy frontend:
   ```powershell
   cd C:\Lang\AEGIS\frontend
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

---

## Step 7: Final Configuration

### Update Backend CORS

Edit `C:\Lang\AEGIS\backend\main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aegis.vercel.app",  # Your frontend URL
        "http://localhost:5173",      # Local dev
        "http://localhost:3000"       # Local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push:
```powershell
cd C:\Lang\AEGIS\backend
git add main.py
git commit -m "Update CORS for production"
git push origin main
```

---

## Step 8: Test Deployment

### Frontend
```
https://aegis.vercel.app
```

### Backend API Docs
```
https://aegis-api.vercel.app/docs
```

### Test API Call
```powershell
curl https://aegis-api.vercel.app/health
```

---

## Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Vercel (or Railway/Render)
- [ ] PostgreSQL database created on Supabase
- [ ] Redis cache created on Upstash
- [ ] All environment variables configured
- [ ] CORS updated for production URLs
- [ ] Frontend API URL updated
- [ ] Health check endpoint working
- [ ] API documentation accessible

---

## Alternative Backend Hosting (Better for FastAPI)

### Option 1: Railway (Recommended)

1. Visit https://railway.app
2. Create account → "New Project"
3. Add PostgreSQL plugin
4. Add Redis plugin
5. Deploy from GitHub:
   - Connect repo
   - Select `backend` directory
   - Add environment variables
   - Deploy

Backend URL: `https://your-project.railway.app`

### Option 2: Render

1. Visit https://render.com
2. New → Web Service
3. Connect GitHub repo, select `backend`
4. Add environment variables
5. Deploy

Backend URL: `https://your-project.onrender.com`

---

## Production Environment Variables

### Backend (All Platforms)

```
DATABASE_URL=postgresql://user:password@host:5432/db
REDIS_URL=redis://default:password@host:port
GEMINI_API_KEY=your_gemini_api_key
DEBUG=false
ENVIRONMENT=production
CORS_ORIGINS=https://aegis.vercel.app,https://www.aegis.vercel.app
```

### Frontend (Vercel)

```
VITE_API_BASE_URL=https://aegis-api.vercel.app
VITE_APP_NAME=AEGIS
```

---

## Monitoring & Logs

### Vercel
- Dashboard: https://vercel.com/dashboard
- View logs: Click project → Deployments → View logs
- Real-time monitoring: Insights tab

### Railway/Render
- Deployment logs visible in dashboard
- Terminal output for errors
- Environment variable configuration

### Supabase
- Database usage: Settings → Database
- Monitor connections
- View query performance

### Upstash
- Dashboard: https://console.upstash.com
- Real-time statistics
- Monitor usage

---

## Custom Domain

### Add Custom Domain to Vercel

1. Buy domain from GoDaddy, Namecheap, or similar
2. Go to Vercel Dashboard → Settings → Domains
3. Add your domain
4. Update DNS records (Vercel will show you how)
5. Verify ownership

Example: `aegis-platform.com`

---

## Cost Summary (All Free Tier)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel Frontend | Unlimited | Free |
| Vercel Backend | 100GB bandwidth/month | Free |
| Supabase PostgreSQL | 500MB database | Free |
| Upstash Redis | 10,000 commands/day | Free |
| Gemini API | 1,500 req/day | Free |
| **Total** | | **$0/month** |

---

## Deployment Workflow

```
1. Make changes locally
2. Test on http://localhost:5173 and http://localhost:8000
3. Push to GitHub:
   git add .
   git commit -m "Feature: description"
   git push origin main
4. Vercel auto-deploys on push
5. Check https://aegis.vercel.app for live changes
```

---

## Troubleshooting

### Frontend won't load
- Check Vercel logs: Dashboard → Deployments
- Verify `VITE_API_BASE_URL` is correct
- Clear browser cache

### API calls fail
- Check backend logs in Vercel/Railway
- Verify database connection string
- Check CORS origin matches frontend URL
- Ensure environment variables are set

### Database connection error
- Verify Supabase URL and credentials
- Check connection limit hasn't been exceeded
- Test with: `psql "connection_string"`

### Redis connection error
- Verify Upstash credentials
- Check network access allowed
- Monitor Redis dashboard for throttling

---

## Next: Setup Custom Domain & SSL

Once everything is working:
1. Buy domain (GoDaddy, Namecheap, etc.)
2. Add to Vercel
3. Update backend CORS with custom domain
4. DNS automatically handles SSL/HTTPS

---

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs
- Upstash Docs: https://upstash.com/docs

Your AEGIS platform is now live online! 🚀
