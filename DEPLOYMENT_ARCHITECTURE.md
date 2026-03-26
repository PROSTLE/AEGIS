# AEGIS - Deployment Architecture

## Current State ✅

```
Local Development (SETUP.md)
├── React Frontend (localhost:5173)
├── FastAPI Backend (localhost:8000)
├── PostgreSQL (local or Docker)
└── Redis (local or Docker)

Structure: All 50+ files ready, all routes scaffolded
Status: Ready for implementation & deployment
```

---

## Online Deployment (VERCEL_QUICKSTART.md)

```
                    GitHub
                      ↓
         ┌────────────┴────────────┐
         ↓                         ↓
    Frontend                   Backend
    (Vercel)                 (Vercel)
    ✨ aegis.vercel.app    🚀 aegis-api.vercel.app
         ↓                         ↓
         └────────┬────────────────┘
                  ↓
         ┌────────┴────────┐
         ↓                 ↓
    Supabase          Upstash
    Database          Cache
    (PostgreSQL)      (Redis)
    📦 Free 500MB    🔴 Free 10K req/day
```

---

## Three Ways to Deploy

### 1️⃣ Vercel (Easiest - Recommended)
```
Push to GitHub → Vercel auto-deploys → Live in 2 minutes
✅ Free tier
✅ Auto-redeploy on every push
✅ Zero configuration
❌ Cold starts (Serverless)
```

### 2️⃣ Railway
```
Connect repo → Railway auto-builds → Live in 5 minutes
✅ Free tier
✅ Keep-alive container
✅ Better for Python
```

### 3️⃣ Render
```
Connect repo → Render auto-deploys → Live in 5 minutes
✅ Free tier (sleeps after 15 min inactivity)
✅ Easy to use
```

---

## Deployment Checklist

### Before Deploying
- [ ] Code pushed to GitHub
- [ ] All API routes scaffolded
- [ ] Environment files configured
- [ ] Frontend ready to test

### Deployment Day
1. **Create Vercel Project (Frontend)**
   ```
   Dashboard → New Project → Import aegis → Root: frontend
   Environment: VITE_API_BASE_URL=https://aegis-api.vercel.app
   ```

2. **Create Supabase Project (Database)**
   ```
   Dashboard → New Project → Copy Connection String
   Save DATABASE_URL for backend
   ```

3. **Create Upstash Project (Cache)**
   ```
   Dashboard → New Database → Copy Redis URL
   Save REDIS_URL for backend
   ```

4. **Create Vercel Project (Backend)**
   ```
   Dashboard → New Project → Import aegis → Root: backend
   Environment Variables:
   - DATABASE_URL (from Supabase)
   - REDIS_URL (from Upstash)
   - GEMINI_API_KEY (from Google AI)
   - DEBUG=false
   - ENVIRONMENT=production
   ```

### After Deploying
- [ ] Test frontend: https://aegis.vercel.app
- [ ] Test API: https://aegis-api.vercel.app/health
- [ ] Check API docs: https://aegis-api.vercel.app/docs
- [ ] Update frontend API URL if different

---

## File Structure for Deployment

```
C:\Lang\AEGIS\
├── frontend/              ← Deploy to Vercel (Root directory)
│   ├── src/
│   ├── package.json
│   └── .env            (VITE_API_BASE_URL=...)
│
├── backend/              ← Deploy to Vercel (Root directory)
│   ├── main.py
│   ├── requirements.txt
│   ├── vercel.json
│   └── .env            (DATABASE_URL, REDIS_URL, etc)
│
├── DEPLOYMENT.md         ← Step-by-step guide
├── VERCEL_QUICKSTART.md  ← Quick reference
└── SETUP.md              ← Local development
```

---

## Database & Cache Options

### PostgreSQL Hosting
| Provider | Free Tier | Pros | Cons |
|----------|-----------|------|------|
| **Supabase** | 500MB | Easy setup, includes auth | Limited storage |
| **Railway** | 3 months free | Generous, auto-scales | Not truly free after trial |
| **Render** | 90-day trial | Simple UI | Not free long-term |
| **Neon** | 0.5 GB | Serverless, auto-scaling | Beta |

**Recommended**: Supabase (best for getting started)

### Redis Hosting
| Provider | Free Tier | Pros | Cons |
|----------|-----------|------|------|
| **Upstash** | 10K/day | Pay-as-you-go | Low volume limit |
| **Redis Cloud** | 30MB | Generous tier | Limited |
| **Render** | Limited | Included in plan | Limited features |

**Recommended**: Upstash (most reliable free tier)

---

## Cost Analysis

### Option 1: All Free (Recommended)
```
Service          | Cost      | Limit
─────────────────┼──────────┼─────────────
Vercel Frontend  | $0        | Unlimited
Vercel Backend   | $0        | 100GB bandwidth
Supabase DB      | $0        | 500MB
Upstash Cache    | $0        | 10K commands/day
Gemini API       | $0        | 1,500 req/day
─────────────────┼──────────┼─────────────
TOTAL            | $0/month  | ✅ Suitable for MVP
```

### Option 2: Medium Growth
```
Service          | Cost      | Notes
─────────────────┼──────────┼──────────────
Vercel (Pro)     | $20/mo    | Better analytics
Supabase (Pro)   | $25/mo    | 8GB database
Upstash (Pro)    | $25/mo    | Unlimited requests
─────────────────┼──────────┼──────────────
TOTAL            | $70/month | For growth
```

---

## Deployment Timeline

| Step | Time | Service |
|------|------|---------|
| Push code to GitHub | 2 min | Git |
| Deploy Frontend | 1 min | Vercel |
| Create Supabase DB | 1 min | Supabase |
| Create Upstash Cache | 1 min | Upstash |
| Deploy Backend | 1 min | Vercel |
| Connect everything | 2 min | Config |
| **TOTAL** | **~8 min** | ✅ LIVE! |

---

## Testing Deployed App

```powershell
# Test Frontend
curl https://aegis.vercel.app

# Test Backend Health
curl https://aegis-api.vercel.app/health

# Test API with Swagger UI
open https://aegis-api.vercel.app/docs

# Test Database Connection
# Check Vercel logs for errors
```

---

## Next: Implementation Priorities

### Week 1: Data Pipeline
- [ ] Implement scrapers for data sources
- [ ] Connect to PostgreSQL
- [ ] Test data ingestion

### Week 2: API Endpoints
- [ ] Fill in TODO routes with business logic
- [ ] Test each endpoint with Swagger UI
- [ ] Document API parameters

### Week 3: Frontend Integration
- [ ] Connect pages to API endpoints
- [ ] Test data flow end-to-end
- [ ] Add loading states and error handling

### Week 4: ML Models
- [ ] Train survival predictor
- [ ] Implement logistics scoring
- [ ] Add SHAP explainability

---

## Helpful Resources

| Topic | Resource | Link |
|-------|----------|------|
| Vercel Deployment | Docs | https://vercel.com/docs |
| Supabase Setup | Docs | https://supabase.com/docs |
| Upstash Guide | Docs | https://upstash.com/docs |
| FastAPI on Serverless | Guide | https://fastapi.tiangolo.com/deployment/concepts/ |
| React + Vite Deployment | Guide | https://vitejs.dev/guide/static-deploy.html |

---

## Quick Links After Deployment

```
🌐 Frontend:     https://aegis.vercel.app
🚀 API Server:   https://aegis-api.vercel.app
📚 API Docs:     https://aegis-api.vercel.app/docs
💾 Database:     supabase.com/dashboard
🔴 Cache:        console.upstash.com
📊 Deployment:   vercel.com/dashboard
```

---

**Status**: Ready for deployment! 🎉
**Next**: Follow VERCEL_QUICKSTART.md to go live
