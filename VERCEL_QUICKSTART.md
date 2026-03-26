# AEGIS - Vercel Deployment Quick Reference

## 5-Minute Deploy Checklist

### Prerequisites
- GitHub account → https://github.com
- Vercel account → https://vercel.com
- Supabase account → https://supabase.com
- Upstash account → https://upstash.com
- Gemini API key → https://ai.google.dev

---

## Step 1: Push to GitHub (2 min)

```powershell
cd C:\Lang\AEGIS
git init
git add .
git commit -m "Initial AEGIS deployment"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/aegis.git
git push -u origin main
```

---

## Step 2: Deploy Frontend (1 min)

1. **Vercel Dashboard** → https://vercel.com/new
2. **Import Git Repository** → Select `aegis`
3. **Root Directory**: `frontend`
4. **Add Environment Variable**:
   - `VITE_API_BASE_URL=https://aegis-api.vercel.app`
5. **Deploy**

✅ Frontend live at: `https://aegis.vercel.app`

---

## Step 3: Setup Database (1 min)

### Supabase
1. Create project at https://supabase.com
2. Copy **Connection String** from Settings → Database
3. Save this for later

### Upstash
1. Create database at https://console.upstash.com
2. Copy **Redis URL**
3. Save this for later

---

## Step 4: Deploy Backend (1 min)

1. **Vercel Dashboard** → https://vercel.com/new
2. **Add Existing Project** → Select `aegis`
3. **Root Directory**: `backend`
4. **Add Environment Variables**:
   ```
   DATABASE_URL=<from Supabase>
   REDIS_URL=<from Upstash>
   GEMINI_API_KEY=<your key>
   DEBUG=false
   ENVIRONMENT=production
   ```
5. **Deploy**

✅ Backend live at: `https://aegis-api.vercel.app`

---

## Step 5: Update Frontend (30 sec)

1. Update `C:\Lang\AEGIS\frontend\.env`:
   ```
   VITE_API_BASE_URL=https://aegis-api.vercel.app
   ```

2. Push change:
   ```powershell
   git add frontend/.env
   git commit -m "Update API URL for production"
   git push
   ```

3. Vercel auto-redeploys ✅

---

## Step 6: Test (30 sec)

- **Frontend**: https://aegis.vercel.app
- **API Docs**: https://aegis-api.vercel.app/docs
- **Health Check**: `curl https://aegis-api.vercel.app/health`

---

## Useful Links

| Service | URL | Purpose |
|---------|-----|---------|
| Vercel Dashboard | https://vercel.com/dashboard | Manage deployments |
| Frontend Deployments | https://vercel.com/dashboard/aegis | View frontend builds |
| Backend Deployments | https://vercel.com/dashboard/aegis-api | View backend builds |
| Supabase Console | https://supabase.com/dashboard | Manage database |
| Upstash Console | https://console.upstash.com | Manage Redis cache |
| GitHub Repo | Your repo URL | Source code |
| API Docs (Live) | https://aegis-api.vercel.app/docs | Swagger UI |
| Frontend (Live) | https://aegis.vercel.app | Live application |

---

## Environment Variables Reference

### Backend (`aegis-api`)
```
DATABASE_URL=postgresql://user:pass@host/db
REDIS_URL=redis://user:pass@host:port
GEMINI_API_KEY=your_key_here
DEBUG=false
ENVIRONMENT=production
CORS_ORIGINS=https://aegis.vercel.app
```

### Frontend (`aegis`)
```
VITE_API_BASE_URL=https://aegis-api.vercel.app
VITE_APP_NAME=AEGIS
```

---

## Auto-Deploy Workflow

Once deployed:
1. Make changes locally
2. `git push origin main`
3. Vercel auto-triggers deployment
4. Check progress in dashboard
5. View changes at https://aegis.vercel.app

---

## Troubleshooting

**Frontend won't load?**
- Check Vercel logs in Dashboard
- Verify `VITE_API_BASE_URL` env var
- Clear browser cache

**API returning 500?**
- Check backend logs in Vercel
- Verify DATABASE_URL and REDIS_URL
- Check GEMINI_API_KEY

**Database connection failed?**
- Test with: `psql "your_connection_string"`
- Check Supabase dashboard for active connections
- Verify IP whitelist (if applicable)

---

## Cost Status
- Frontend: **FREE** ✅
- Backend: **FREE** ✅
- Database: **FREE** (500MB) ✅
- Cache: **FREE** (10K commands/day) ✅
- **Total Monthly Cost: $0** ✅

---

## Next Steps
1. Add custom domain (GoDaddy, Namecheap, etc.)
2. Implement data pipeline (scrapers)
3. Train ML models
4. Add more features

---

For detailed guide, see **DEPLOYMENT.md**
