"""Routes for Verified Startup Activity"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/activity", tags=["activity"])

@router.get("/city/{city_name}")
async def get_startup_activity(city_name: str):
    """Get verified startup activity for a city"""
    # TODO: Implement activity counter
    return {
        "active_companies": 0,
        "closures_2_years": 0,
        "crowding_index": 0.0,
        "market_category": ""
    }

@router.get("/city/{city_name}/trend")
async def get_activity_trend(city_name: str):
    """Get startup activity trend"""
    # TODO: Implement trend analysis
    return {"trend": []}
