"""Routes for Workforce Intelligence"""
from fastapi import APIRouter, Query
from typing import Optional
from app.data_store import WORKFORCE
from app.schemas import WorkforceResponse

router = APIRouter(prefix="/api/workforce", tags=["workforce"])

@router.get("/city/{city_name}")
async def get_workforce_intelligence(city_name: str, sector: Optional[str] = Query(None)) -> WorkforceResponse:
    """Get workforce intelligence for a city"""
    city_data = WORKFORCE.get(city_name, WORKFORCE.get("Jaipur"))
    sectors_available = list(city_data.keys())
    sec = sector if sector and sector in city_data else sectors_available[0]
    data = city_data[sec]
    return WorkforceResponse(
        workforce_score=float(data["score"]),
        required_roles=[r["title"] for r in data["roles"]],
        density_per_10k=float(data["roles"][0]["density"]) if data["roles"] else 0.0,
        average_wages={r["title"]: r["wage"] for r in data["roles"]},
        hiring_channels=list(set(r["hiring"] for r in data["roles"]))
    )

@router.get("/city/{city_name}/by-sector")
async def get_workforce_by_sector(city_name: str, sector: str = Query(...)):
    """Get detailed workforce data for a city and sector"""
    city_data = WORKFORCE.get(city_name, WORKFORCE.get("Jaipur"))
    if sector not in city_data:
        return {"error": f"No data for sector '{sector}' in {city_name}", "available_sectors": list(city_data.keys())}
    data = city_data[sector]
    return {
        "city": city_name,
        "sector": sector,
        "score": data["score"],
        "total_workers": data["total"],
        "avg_wage": data["avg_wage"],
        "roles": data["roles"],
        "insight": data["insight"],
        "data_source": data["data_source"]
    }

@router.get("/city/{city_name}/sectors")
async def get_available_sectors(city_name: str):
    """Get available sectors for a city"""
    city_data = WORKFORCE.get(city_name)
    if not city_data:
        return {"error": f"No workforce data for {city_name}"}
    return {"city": city_name, "sectors": list(city_data.keys())}
