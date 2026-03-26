# AEGIS - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL 15+ (for database)
- Redis 7+ (for caching)

---

## Frontend Setup (React + Vite)

### Location: `C:\Lang\AEGIS\frontend`

### Using PowerShell
```powershell
cd C:\Lang\AEGIS\frontend
npm install
npm run dev
```

### Using Git Bash
```bash
cd /c/Lang/AEGIS/frontend
npm install
npm run dev
```

Frontend will start at: **http://localhost:5173**

### Environment Variables
Create `C:\Lang\AEGIS\frontend\.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

---

## Backend Setup (Python FastAPI)

### Location: `C:\Lang\AEGIS\backend`

### Using PowerShell
```powershell
cd C:\Lang\AEGIS\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Using Git Bash
```bash
cd /c/Lang/AEGIS/backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python main.py
```

Backend will start at: **http://localhost:8000**

### Environment Variables
Create `C:\Lang\AEGIS\backend\.env`:
```
DATABASE_URL=postgresql://user:password@localhost/aegis_db
REDIS_URL=redis://localhost:6379/0
GEMINI_API_KEY=your_api_key_here
DEBUG=True
ENVIRONMENT=development
```

---

## Using Docker (Full Stack)

### Location: `C:\Lang\AEGIS`

### Prerequisites
- Docker and Docker Compose installed

### Start all services
```powershell
cd C:\Lang\AEGIS
docker-compose up --build
```

Services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

---

## Development Workflow

### Terminal 1 - Frontend
```powershell
cd C:\Lang\AEGIS\frontend
npm run dev
```

### Terminal 2 - Backend
```powershell
cd C:\Lang\AEGIS\backend
venv\Scripts\activate
python main.py
```

---

## Troubleshooting

### PowerShell Issues
If you get errors about `&&`, use separate commands:
```powershell
# Correct way in PowerShell - use semicolon (;) instead of &&
cd C:\Lang\AEGIS\frontend; npm install; npm run dev

# Or use three separate commands
cd C:\Lang\AEGIS\frontend
npm install
npm run dev
```

### npm Dependency Issues
If npm install fails with dependency errors:
```powershell
cd C:\Lang\AEGIS\frontend
rm package-lock.json
npm install
```

### Python Issues
```powershell
# Make sure you're in the right location and have Python installed
cd C:\Lang\AEGIS\backend
python --version
pip --version

# If venv doesn't work, try clearing and recreating
rmdir venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Database Connection
```powershell
# Test PostgreSQL connection (if you have psql installed)
psql -U user -d aegis_db -c "SELECT 1"

# Test Redis connection (if you have redis-cli installed)
redis-cli ping
```

---

## Available Scripts

### Frontend (`C:\Lang\AEGIS\frontend`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend (`C:\Lang\AEGIS\backend`)
- `python main.py` - Start FastAPI server
- `python -m pytest` - Run tests
- (Add more as needed)

---

## API Documentation

Once backend is running, visit:
- **http://localhost:8000/docs** - Interactive Swagger UI
- **http://localhost:8000/redoc** - ReDoc documentation

---

## Next: Connect Frontend to Backend

1. Ensure backend is running on `http://localhost:8000`
2. Frontend will call `/api/*` endpoints automatically
3. Check `C:\Lang\AEGIS\frontend\src\services\api.js` for endpoint configuration

Visit **http://localhost:5173** to see the AEGIS dashboard!

