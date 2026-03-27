"""Routes for Investor-Founder Matchmaking"""
from fastapi import APIRouter, Query
from typing import Optional
import random
from app.data_store import INVESTORS

router = APIRouter(prefix="/api/matchmaking", tags=["matchmaking"])

def _score_investor(inv: dict, city: str, sector: str, stage: str) -> int:
    score = 0
    score += 30 if any(sector.lower() in f.lower() for f in inv["focus"]) else 5
    score += 20 if any(c.lower() == city.lower() for c in inv["cities"]) else 5
    score += 25 if stage.lower() in inv["stage"].lower() else 10
    score += random.randint(5, 18)  # noise for ranking diversity
    return min(score, 99)

@router.get("/match")
async def match_investors(
    city: str = Query(...),
    sector: str = Query(...),
    funding_stage: str = Query("Pre-seed")
):
    """Match founders with suitable investors using compatibility scoring"""
    scored = []
    for inv in INVESTORS:
        s = _score_investor(inv, city, sector, funding_stage)
        scored.append({
            "id": inv["id"],
            "name": inv["name"],
            "focus": inv["focus"],
            "cities": inv["cities"],
            "stage": inv["stage"],
            "cheque": inv["cheque"],
            "tier": inv["tier"],
            "overexposed": inv.get("overexposed", False),
            "compatibility_score": s
        })
    scored.sort(key=lambda x: x["compatibility_score"], reverse=True)
    return {
        "city": city,
        "sector": sector,
        "stage": funding_stage,
        "matched": scored[:8],
        "total_searched": len(INVESTORS)
    }

@router.get("/investor/{investor_id}")
async def get_investor_details(investor_id: int):
    """Get investor profile details"""
    inv = next((i for i in INVESTORS if i["id"] == investor_id), None)
    if not inv:
        return {"error": f"Investor ID {investor_id} not found"}
    return inv

@router.get("/city/{city_name}/investors")
async def get_investors_by_city(city_name: str):
    """Get investors active in a city"""
    city_investors = [i for i in INVESTORS if city_name in i["cities"]]
    return {"city": city_name, "investors": city_investors, "count": len(city_investors)}

@router.get("/investors")
async def list_all_investors():
    """List all investors in the database"""
    return {"investors": INVESTORS, "total": len(INVESTORS)}
