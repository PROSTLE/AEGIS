# AEGIS - Startup Terrain Intelligence Platform for India

## What is AEGIS?

AEGIS is an advanced, AI-powered startup terrain intelligence platform tailored for the Indian market. It empowers founders, investors, and urban planners to make data-driven decisions regarding startup location selection, operational viability, and market demand. By analyzing thousands of data points across geography, logistics, workforce, and real-time activity, AEGIS provides a dynamic launch readiness score and actionable insights for major Indian startup hubs.

## Architecture & How It Works

AEGIS follows a modern, decoupled client-server architecture:

-   **Frontend (React + Vite):** The user interface is built with React, utilizing D3.js and Recharts for highly interactive data visualizations. It handles state management via Zustand and communicates with the backend via REST APIs. The frontend is responsible for rendering the complex intelligence dashboards, maps, and predictive metrics in an intuitive, cybernetic-themed design.
-   **Backend (Python + FastAPI):** The intelligence engine of AEGIS. It processes incoming requests, computes real-time metrics, runs predictive algorithms, and integrates with the Google Gemini 1.5 Flash LLM for the AI Advisor feature. The backend performs the heavy lifting of spatial, predictive, and statistical analysis on-the-fly.

**How it works:** When a user inputs their startup idea and selects a city, the frontend queries the specific FastAPI endpoints. The backend computes the metrics (Logistics, Demand, Workforce, Competition, Survival) dynamically, processes them through the AI Advisor for a cohesive narrative, and returns the actionable data to the frontend to populate the comprehensive dashboard.

## Hardware Integration

AEGIS also features a **Hardware Simulation System** designed to demonstrate real-world physical data integration. This component visualizes real-time metric streams as if they were coming from physical IoT sensors:
- **Motion & Footfall Traffic**
- **Proximity & Distance**
- **Vibration & Industrial Activity**
- **Environmental Conditions (e.g., Moisture)**

These simulated sensor pipelines prove the platform's capability to ingest, process, and display live physical endpoint data streams. This is crucial for evaluating infrastructure, agritech, and industrial startup viability, extending AEGIS's intelligence beyond just digital statistics into physical world tracking.

## Localhost Execution

When running the platform locally for development, the components are hosted at the following addresses:

-   **Frontend UI:** `http://localhost:5173` (Vite Development Server)
-   **Backend API:** `http://localhost:8000` (FastAPI Uvicorn Server)
    -   *Interactive API Docs (Swagger UI):* `http://localhost:8000/docs`
## Project Structure

```
AEGIS/
├── frontend/                 # React + D3.js + Recharts frontend
│   ├── src/
│   │   ├── components/       # All UI components
│   │   │   ├── common/       # Common components (Layout, Navbar, Sidebar)
│   │   │   ├── heatmap/      # Heatmap visualization components
│   │   │   ├── survivalPredictor/
│   │   │   ├── logistics/
│   │   │   ├── workforce/
│   │   │   ├── location/
│   │   │   ├── activity/
│   │   │   ├── demand/
│   │   │   ├── matchmaking/
│   │   │   └── advisor/
│   │   ├── pages/            # Page components for each feature
│   │   ├── hooks/            # Custom React hooks (useApi, etc.)
│   │   ├── context/          # Global state management (Zustand)
│   │   ├── services/         # API client and endpoints
│   │   ├── utils/            # Constants, formatters, helpers
│   │   ├── styles/           # CSS files
│   │   ├── assets/           # Images, icons
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/                  # Python FastAPI backend
│   ├── main.py               # FastAPI application entry point
│   ├── app/
│   │   ├── routes/           # API endpoints for each feature
│   │   │   ├── heatmap.py
│   │   │   ├── survival.py
│   │   │   ├── logistics.py
│   │   │   ├── workforce.py
│   │   │   ├── location.py
│   │   │   ├── activity.py
│   │   │   ├── demand.py
│   │   │   ├── matchmaking.py
│   │   │   └── advisor.py
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   └── services/         # Business logic services
│   ├── data_pipeline/
│   │   ├── scrapers/         # Data collection scrapers
│   │   └── processors/       # Data processing and feature engineering
│   ├── ml_models/
│   │   ├── training/         # Model training code
│   │   └── inference/        # Model inference code
│   ├── config/
│   │   └── settings.py       # Configuration management
│   ├── requirements.txt
│   ├── .env.example
│   └── tests/                # Unit tests
└── README.md
```

## Core Features

### 1. **City Startup Heatmap**
Interactive D3.js map showing ecosystem health (0-100) across Indian cities with sector filtering and trend indicators.
- **Route**: `/heatmap`
- **API**: `GET /api/heatmap/cities`

### 2. **Startup Survival Predictor**
XGBoost-based prediction of 3-year startup survival probability with explainability.
- **Route**: `/survival`
- **API**: `POST /api/survival/predict`
- **Target AUC**: > 0.72

### 3. **Supply Chain & Logistics Stress Test**
Evaluates operational viability with delivery density, supplier proximity, port/highway access.
- **Route**: `/logistics`
- **API**: `GET /api/logistics/city/{city}`

### 4. **Workforce Intelligence Engine**
Maps startup types to workforce profiles, calculates density and salary indices.
- **Route**: `/workforce`
- **API**: `GET /api/workforce/city/{city}`

### 5. **Location & Land Intelligence**
Recommends optimal zones with cost, zoning, and proximity analysis.
- **Route**: `/location`
- **API**: `GET /api/location/city/{city}/zones`

### 6. **Verified Startup Activity Counter**
Cross-verifies startup counts and calculates crowding index.
- **Route**: `/activity`
- **API**: `GET /api/activity/city/{city}`

### 7. **Demand Forecast & Lifespan Prediction**
Uses Facebook Prophet and Kaplan-Meier survival analysis.
- **Route**: `/demand`
- **API**: `GET /api/demand/city/{city}/forecast`

### 8. **Investor-Founder Matchmaking**
Matches founders with 300-500 investors using cosine similarity.
- **Route**: `/matchmaking`
- **API**: `POST /api/matchmaking/match`

### **AI Advisor** (Integrated RAG Pipeline)
Combines all features with LLM for comprehensive Launch Readiness Score.
- **Route**: `/advisor`
- **API**: `POST /api/advisor/launch-readiness`

## Tech Stack

### Frontend
- **React 19.2** + React Router for UI and navigation
- **D3.js** for interactive heatmap visualization
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Zustand** for state management
- **Axios/Fetch** for API calls
- **Vite** as build tool

### Backend
- **Python 3.11** + FastAPI for REST API
- **PostgreSQL** for structured data storage
- **Redis** for caching (24-hr TTL)
- **SQLAlchemy** for ORM
- **Pydantic** for validation
- **XGBoost** for ML models
- **scikit-learn** for data processing
- **Facebook Prophet** for time series forecasting
- **Gemini 1.5 Flash API** for LLM integration

### Data Sources (Free & Open)
- data.gov.in, MCA21, GST portal, DPIIT Startup India
- OpenStreetMap, Numbeo API, Google Trends
- AngelList India, Crunchbase Basic, Census of India
- AISHE, NCVT MIS, Labour Bureau

## Getting Started

### Local Development Setup

See **SETUP.md** for complete step-by-step instructions with Windows PowerShell/Git Bash examples.

**In 2 terminals:**

**Terminal 1 - Frontend**:
```bash
cd C:\Lang\AEGIS\frontend
npm install
npm run dev  # Starts at http://localhost:5173
```

**Terminal 2 - Backend**:
```bash
cd C:\Lang\AEGIS\backend
python -m venv venv
venv\Scripts\activate  # or `source venv/bin/activate` on Linux/Mac
pip install -r requirements.txt
cp .env.example .env       # Configure your API keys
python main.py             # Starts at http://localhost:8000
```

### Deploy Online (Free)

See **DEPLOYMENT.md** for deploying to Vercel + Supabase + Upstash (completely free tier)

## API Documentation

All endpoints are prefixed with `/api/`. See individual route files for detailed documentation:
- `/api/heatmap/*` - Heatmap endpoints
- `/api/survival/*` - Survival predictor
- `/api/logistics/*` - Logistics analysis
- `/api/workforce/*` - Workforce intelligence
- `/api/location/*` - Location recommendations
- `/api/activity/*` - Startup activity
- `/api/demand/*` - Demand forecast
- `/api/matchmaking/*` - Investor matching
- `/api/advisor/*` - AI advisor with RAG

## Key Metrics

### Launch Readiness Score Components
- Ecosystem Score (20%)
- Startup Survival Predictor (20%)
- Logistics Score (15%)
- Workforce Score (15%)
- Demand Forecast Score (15%)
- Verified Activity/Crowding Index (10%)
- Investor Availability Score (5%)

## Environment Variables

See `.env.example` files in both frontend and backend directories.

Key required variables:
- `GEMINI_API_KEY` - Google Gemini API key (free tier available)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `VITE_API_BASE_URL` - Backend API URL (frontend)

## Deployment

Deploy AEGIS online for free using Vercel and cloud services:

### Quick Deploy to Vercel
1. **Frontend**: Deploy via Vercel (automatic on GitHub push)
2. **Backend**: Deploy via Vercel/Railway/Render
3. **Database**: Use Supabase (free PostgreSQL tier)
4. **Cache**: Use Upstash (free Redis tier)

**See DEPLOYMENT.md for complete step-by-step guide**

### Local Development
See SETUP.md for local development instructions

### Estimated Cost (Monthly)
- **Frontend (Vercel)**: Free
- **Backend (Vercel/Railway)**: Free
- **Database (Supabase)**: Free (500MB)
- **Cache (Upstash)**: Free (10K commands/day)
- **Total**: $0/month

## Next Steps

### Immediate Priorities
1. **Deploy to Vercel** - See VERCEL_QUICKSTART.md (5 minutes to online!)
2. **Connect APIs** - Implement all TODO endpoints in backend routes
3. **Frontend Integration** - Update pages to call actual API endpoints
4. **Data Pipeline** - Implement scrapers for all 10 data sources

### Feature Development
5. **ML Models** - Train survival predictor and logistics models
6. **Testing** - Add unit and integration tests
7. **UI Polish** - Refine components and add animations
8. **Analytics** - Add tracking and monitoring

### Long-term
9. **Auto-Deployment** - Setup GitHub Actions for auto-deploy on push
10. **Custom Domain** - Add branded domain name
11. **Monitoring** - Setup error tracking and performance monitoring
12. **Documentation** - API docs and user guides

## Notes

- All data sources are free to access (no licensing costs)
- Gemini API free tier: 1,500 requests/day, 1M tokens/day
- Uses only open-source and free tools
- India-first focus with real government datasets

## License

To be determined

---

For questions or contributions, please refer to the project documentation.
