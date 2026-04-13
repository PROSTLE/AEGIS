"""Routes for Logistics and Supply Chain Analysis"""
from fastapi import APIRouter
from app.data_store import LOGISTICS
from app.schemas import LogisticsScoreResponse
import time
from typing import Optional
from pydantic import BaseModel

class HardwareData(BaseModel):
    motion: str
    distance: float
    vibration: str
    soil: int
    timestamp: float = 0.0

# Global state to hold the latest telemetry from the Arduino
CURRENT_HARDWARE_STATE: Optional[HardwareData] = None

router = APIRouter(prefix="/api/logistics", tags=["logistics"])

# Weights used to compute the overall logistics score from individual metrics.
# Port distance and highway access reflect infrastructure that most impacts
# real-world logistics cost and speed.
_METRIC_WEIGHTS = {
    "last_mile_density": 0.20,
    "supplier_proximity": 0.20,
    "highway_access": 0.20,
    "port_distance": 0.20,
    "cold_chain": 0.10,
    "cost_vs_bangalore": 0.10,
}

def _weighted_score(metrics_map: dict) -> int:
    """Compute overall logistics score as weighted average of individual metrics."""
    total = sum(
        metrics_map.get(key, 50) * weight
        for key, weight in _METRIC_WEIGHTS.items()
    )
    return round(total)

def _generate_logistics_for_city(city_name: str) -> dict:
    """Generate realistic logistics data for cities not in the curated dataset."""
    seed = sum(ord(c) for c in city_name)

    # Vary each metric using different prime multipliers of the seed so that
    # cities with similar character sums still get differentiated profiles.
    last_mile  = min(85, 45 + (seed * 3)  % 40)
    supplier   = min(85, 40 + (seed * 7)  % 45)
    highway    = min(88, 50 + (seed * 11) % 38)
    port_dist  = min(80, 20 + (seed * 13) % 55)
    cold_chain = min(80, 30 + (seed * 17) % 45)
    cost       = min(88, 45 + (seed * 19) % 43)

    metrics_map = {
        "last_mile_density": last_mile,
        "supplier_proximity": supplier,
        "highway_access": highway,
        "port_distance": port_dist,
        "cold_chain": cold_chain,
        "cost_vs_bangalore": cost,
    }
    base = _weighted_score(metrics_map)

    port_km  = 300 + (seed * 5) % 900
    cost_pct = 5 + (seed * 2) % 25
    cost_dir = "cheaper" if cost_pct > 10 else "more expensive"

    return {
        "score": base,
        "recommendation": (
            f"{city_name} logistics profile: "
            f"{'Strong' if base >= 70 else 'Moderate' if base >= 55 else 'Developing'} "
            f"infrastructure with {'good' if highway > 65 else 'limited'} road connectivity "
            f"and {'a nearby' if port_dist > 60 else 'a distant'} port. "
            f"Consider local warehouse partnerships."
        ),
        "metrics": [
            {"name": "Last-Mile Density",  "value": last_mile,  "unit": f"{'Good' if last_mile > 65 else 'Limited'} delivery network"},
            {"name": "Supplier Proximity", "value": supplier,   "unit": f"{'Strong' if supplier > 65 else 'Moderate'} industrial zones"},
            {"name": "Highway Access",     "value": highway,    "unit": f"NH connectivity {'excellent' if highway > 70 else 'average'}"},
            {"name": "Port Distance",      "value": port_dist,  "unit": f"{port_km}km to nearest major port"},
            {"name": "Cold Chain",         "value": cold_chain, "unit": f"{'Available' if cold_chain > 55 else 'Limited'} cold storage"},
            {"name": "Cost vs Bangalore",  "value": cost,       "unit": f"{cost_pct}% {cost_dir}"},
        ]
    }

def _get_data(city_name: str):
    if city_name in LOGISTICS:
        return LOGISTICS[city_name]
    return _generate_logistics_for_city(city_name)

@router.get("/city/{city_name}")
async def get_logistics_score(city_name: str) -> LogisticsScoreResponse:
    """Get logistics and supply chain score for a city"""
    data = _get_data(city_name)
    metrics = {m["name"].lower().replace(" ", "_").replace("-", "_"): m["value"] for m in data["metrics"]}
    # port_highway_access combines both port proximity and highway connectivity
    highway_val = float(metrics.get("highway_access", 0))
    port_val    = float(metrics.get("port_distance", 0))
    port_highway_access = round((highway_val + port_val) / 2, 1)
    return LogisticsScoreResponse(
        overall_score=float(data["score"]),
        delivery_density=float(metrics.get("last_mile_density", 0)),
        supplier_proximity=float(metrics.get("supplier_proximity", 0)),
        port_highway_access=port_highway_access,
        cold_chain_availability=float(metrics.get("cold_chain", 0))
    )

@router.get("/city/{city_name}/breakdown")
async def get_logistics_breakdown(city_name: str):
    """Get detailed logistics breakdown with all metrics"""
    data = _get_data(city_name)
    return {
        "city": city_name,
        "overall_score": data["score"],
        "recommendation": data["recommendation"],
        "metrics": data["metrics"]
    }

@router.get("/cities")
async def get_all_logistics():
    """Get logistics scores for all available cities"""
    return {
        "cities": [
            {"city": city, "score": data["score"], "recommendation": data["recommendation"]}
            for city, data in LOGISTICS.items()
        ]
    }

@router.post("/hardware")
async def post_hardware_data(data: HardwareData):
    """Receive real-time telemetry from physical Arduino sensors via the bridge"""
    global CURRENT_HARDWARE_STATE
    data.timestamp = time.time()
    CURRENT_HARDWARE_STATE = data
    return {"status": "success", "data": CURRENT_HARDWARE_STATE.dict()}

@router.get("/hardware")
async def get_hardware_data():
    """Get the latest real-time telemetry from the Arduino"""
    if CURRENT_HARDWARE_STATE is None:
        return {"active": False, "data": None}
    
    # If the data is older than 10 seconds, consider the hardware disconnected
    if time.time() - CURRENT_HARDWARE_STATE.timestamp > 10:
        return {"active": False, "data": CURRENT_HARDWARE_STATE.dict(), "stale": True}
        
    return {"active": True, "data": CURRENT_HARDWARE_STATE.dict(), "stale": False}
