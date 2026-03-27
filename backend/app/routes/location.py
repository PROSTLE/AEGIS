"""Routes for Location & Land Intelligence"""
from fastapi import APIRouter
from app.data_store import LOCATION

router = APIRouter(prefix="/api/location", tags=["location"])

def _generate_location_for_city(city_name: str) -> dict:
    """Generate realistic location data for cities not in the curated dataset."""
    seed = sum(ord(c) for c in city_name)
    sl = len(city_name)
    
    zone_types = ["Industrial Zone", "IT Park", "SEZ", "MIDC Area", "Tech Corridor"]
    zone_suffixes = ["Phase I", "Phase II", "East", "West", "Central"]
    
    zones = []
    for i in range(3):
        idx = (seed + i * 7) % len(zone_types)
        sidx = (seed + i * 3) % len(zone_suffixes)
        score = max(40, min(95, 55 + (seed * (i+1) * 3) % 35))
        zones.append({
            "name": f"{city_name} {zone_types[idx]} {zone_suffixes[sidx]}",
            "score": score,
            "price_sqft": 8 + (seed + i * 5) % 40,
            "zoning": "Industrial" if i == 0 else "Commercial" if i == 1 else "Mixed Use",
            "recommended": i == 0,
            "highlights": [
                f"{'Good' if score > 65 else 'Limited'} road connectivity",
                f"{'Near' if (seed+i)%2==0 else 'Far from'} supplier clusters",
                f"{'Affordable' if (seed+i*3)%40 < 20 else 'Premium'} rental rates"
            ]
        })
    
    return {
        "sector": "Cross-Sector",
        "zones": zones
    }

def _get_location(city_name: str) -> dict:
    if city_name in LOCATION:
        return LOCATION[city_name]
    return _generate_location_for_city(city_name)

@router.get("/city/{city_name}")
async def get_location_data(city_name: str):
    """Get zone recommendations for a city"""
    data = _get_location(city_name)
    return {
        "city": city_name,
        "sector": data["sector"],
        "zones": data["zones"],
        "recommended_zone": next((z for z in data["zones"] if z["recommended"]), data["zones"][0])
    }

@router.get("/city/{city_name}/zones")
async def get_zones(city_name: str):
    """Get all industrial zones for a city"""
    data = _get_location(city_name)
    return {"city": city_name, "zones": data["zones"]}

@router.get("/cities")
async def get_cities_with_zones():
    """Get all cities with location intelligence"""
    return {
        "cities": [
            {"city": city, "sector": data["sector"], "zone_count": len(data["zones"]),
             "top_zone": next((z["name"] for z in data["zones"] if z["recommended"]), data["zones"][0]["name"])}
            for city, data in LOCATION.items()
        ]
    }
