"""
AEGIS Backend - Main FastAPI Application
Startup Terrain Intelligence Platform for India
"""
from dotenv import load_dotenv
load_dotenv()  # loads GEMINI_API_KEY from .env

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging


# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize app lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("AEGIS Backend Starting — all routes registered.")
    yield
    logger.info("AEGIS Backend Shutting Down.")

# Create FastAPI app
app = FastAPI(
    title="AEGIS API",
    description="Startup Terrain Intelligence Platform for India — 12 modules, real data.",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Import & register all routers ────────────────────────────────────────────
import importlib
importlib.import_module("app.extended_data")  # extends dicts with Mumbai/Delhi/Hyderabad/Pune — must not shadow `app`
from app.routes import heatmap, survival, logistics, workforce, location, activity, demand, matchmaking, advisor
from app.routes.new_features import pulse_router, competition_router, planner_router, war_room_router
from app.routes.ai_narrator import router as ai_router
from app.routes.idea_analysis import router as idea_router

# Core modules
app.include_router(heatmap.router)
app.include_router(survival.router)
app.include_router(logistics.router)
app.include_router(workforce.router)
app.include_router(location.router)
app.include_router(activity.router)
app.include_router(demand.router)
app.include_router(matchmaking.router)
app.include_router(advisor.router)

# AI Narrator + Idea Intelligence
app.include_router(ai_router)
app.include_router(idea_router)

# New features (Phase 3)
app.include_router(pulse_router)
app.include_router(competition_router)
app.include_router(planner_router)
app.include_router(war_room_router)

# ── Health & Root ─────────────────────────────────────────────────────────────
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AEGIS Backend", "version": "2.0.0"}

@app.get("/")
async def root():
    return {
        "name": "AEGIS API",
        "version": "2.0.0",
        "description": "Startup Terrain Intelligence Platform for India",
        "modules": [
            "/api/heatmap",
            "/api/survival",
            "/api/logistics",
            "/api/workforce",
            "/api/location",
            "/api/activity",
            "/api/demand",
            "/api/matchmaking",
            "/api/advisor",
        "/api/ai",
        "/api/regulatory-pulse",
            "/api/competition",
            "/api/city-planner",
            "/api/share",
        ],
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
