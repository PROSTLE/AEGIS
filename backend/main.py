"""
AEGIS Backend - Main FastAPI Application
Startup Terrain Intelligence Platform for India
"""
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
    logger.info("AEGIS Backend Starting...")
    yield
    logger.info("AEGIS Backend Shutting Down...")

# Create FastAPI app
app = FastAPI(
    title="AEGIS API",
    description="Startup Terrain Intelligence Platform for India",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AEGIS Backend"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "AEGIS API",
        "version": "1.0.0",
        "description": "Startup Terrain Intelligence Platform for India"
    }

# TODO: Import and include routers
# from app.routes import heatmap, survival_predictor, logistics, workforce, location, activity, demand, matchmaking, advisor

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
