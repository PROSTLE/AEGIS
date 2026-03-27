"""Routes for City Startup Heatmap"""
from fastapi import APIRouter, Query
from typing import Optional
from app.data_store import CITIES

router = APIRouter(prefix="/api/heatmap", tags=["heatmap"])

@router.get("/cities")
async def get_cities(sector: Optional[str] = Query(None)):
    """Get all cities with ecosystem scores, optionally filtered by sector"""
    result = []
    for city in CITIES:
        score = city["score"]
        if sector and sector.lower() in city["sector_scores"]:
            score = city["sector_scores"][sector.lower()]
        result.append({
            "name": city["name"],
            "state": city["state"],
            "lat": city["lat"],
            "lng": city["lng"],
            "score": score,
            "startups": city["startups"],
            "trend": city["trend"],
            "sector_scores": city["sector_scores"]
        })
    result.sort(key=lambda x: x["score"], reverse=True)
    return {"cities": result, "total": len(result)}

@router.get("/cities/{city_name}")
async def get_city_details(city_name: str, sector: Optional[str] = Query(None)):
    """Get detailed heatmap data for a specific city"""
    city = next((c for c in CITIES if c["name"].lower() == city_name.lower()), None)
    if not city:
        return {"error": f"City '{city_name}' not found", "cities": [c["name"] for c in CITIES]}
    score = city["score"]
    if sector and sector.lower() in city["sector_scores"]:
        score = city["sector_scores"][sector.lower()]
    return {
        "name": city["name"],
        "state": city["state"],
        "lat": city["lat"],
        "lng": city["lng"],
        "score": score,
        "overall_score": city["score"],
        "startups": city["startups"],
        "trend": city["trend"],
        "sector_scores": city["sector_scores"]
    }

@router.get("/clusters")
async def get_startup_clusters():
    """Get startup clusters ranked by ecosystem score"""
    tier1 = [c for c in CITIES if c["score"] >= 80]
    tier2 = [c for c in CITIES if 65 <= c["score"] < 80]
    emerging = [c for c in CITIES if c["score"] < 65]
    return {
        "clusters": {
            "tier1_hubs": [c["name"] for c in tier1],
            "tier2_growing": [c["name"] for c in tier2],
            "emerging": [c["name"] for c in emerging]
        }
    }
