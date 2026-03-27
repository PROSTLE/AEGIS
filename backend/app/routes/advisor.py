"""Routes for AI Advisor — Launch Readiness & Comprehensive Analysis"""
from fastapi import APIRouter
from app.schemas import LaunchReadinessRequest, LaunchReadinessResponse, InvestorMatch
from app.data_store import CITIES, LOGISTICS, WORKFORCE, SURVIVAL, ACTIVITY, DEMAND, INVESTORS
import random

router = APIRouter(prefix="/api/advisor", tags=["advisor"])

def _get_city_score(city: str) -> float:
    c = next((x for x in CITIES if x["name"].lower() == city.lower()), None)
    return float(c["score"]) if c else 65.0

def _compute_launch_score(city: str) -> float:
    ecosystem    = _get_city_score(city)
    survival     = float(SURVIVAL.get(city, SURVIVAL["Jaipur"])["survival_probability"])
    logistics_sc = float(LOGISTICS.get(city, LOGISTICS["Jaipur"])["score"])
    demand_cagr  = float(DEMAND.get(city, DEMAND["Jaipur"])["cagr"])
    demand_score = min(demand_cagr * 2.5, 100)
    activity     = ACTIVITY.get(city, ACTIVITY["Jaipur"])
    crowding_pen = max(0, (activity["crowding_index"] - 1.0) * 20)

    score = (
        ecosystem    * 0.20 +
        survival     * 0.20 +
        logistics_sc * 0.15 +
        demand_score * 0.15 +
        (100 - crowding_pen) * 0.10
    )
    return round(min(score, 99), 1)

@router.post("/launch-readiness")
async def get_launch_readiness(request: LaunchReadinessRequest) -> LaunchReadinessResponse:
    """
    Compute comprehensive Launch Readiness Score combining:
    Ecosystem (20%) + Survival (20%) + Logistics (15%) + Demand (15%) + Crowding (10%)
    """
    city = request.city
    score = _compute_launch_score(city)

    survival_data  = SURVIVAL.get(city, SURVIVAL["Jaipur"])
    logistics_data = LOGISTICS.get(city, LOGISTICS["Jaipur"])

    strengths = survival_data["strengths"] + [
        f"Logistics score: {logistics_data['score']}/100",
        f"Ecosystem score: {_get_city_score(city)}/100 — top tier"
    ]
    risks = survival_data["risk_factors"]

    # Alternative cities (excluding current)
    sorted_cities = sorted(CITIES, key=lambda c: c["score"], reverse=True)
    alts = [{"city": c["name"], "score": c["score"]} for c in sorted_cities if c["name"] != city][:3]

    # Investor matches
    matched_investors = []
    for inv in random.sample(INVESTORS, min(3, len(INVESTORS))):
        matched_investors.append(InvestorMatch(
            investor_id=inv["id"],
            name=inv["name"],
            compatibility_score=float(random.randint(65, 99)),
            sector_focus=", ".join(inv["focus"]),
            cheque_size={"range": inv["cheque"]}
        ))

    narrative = (
        f"{city} shows a Launch Readiness Score of {score}/100 for your {request.startup_type} startup. "
        f"The ecosystem is {'strong' if score >= 70 else 'developing'} with {survival_data['survival_probability']}% "
        f"3-year survival likelihood. Key strength: {strengths[0]}. "
        f"Primary risk: {risks[0] if risks else 'market validation needed'}."
    )

    return LaunchReadinessResponse(
        launch_readiness_score=score,
        narrative=narrative,
        strengths=strengths[:4],
        risks=risks[:3],
        alternative_cities=alts,
        investor_matches=matched_investors
    )

@router.post("/analyze")
async def analyze_startup(request: LaunchReadinessRequest):
    """Get full multi-module startup analysis"""
    city = request.city
    return {
        "city": city,
        "startup_type": request.startup_type,
        "launch_readiness_score": _compute_launch_score(city),
        "modules": {
            "ecosystem": {"score": _get_city_score(city)},
            "survival": {"probability": SURVIVAL.get(city, SURVIVAL["Jaipur"])["survival_probability"]},
            "logistics": {"score": LOGISTICS.get(city, LOGISTICS["Jaipur"])["score"]},
            "demand": {"cagr": DEMAND.get(city, DEMAND["Jaipur"])["cagr"]},
            "activity": {"crowding_index": ACTIVITY.get(city, ACTIVITY["Jaipur"])["crowding_index"]},
        }
    }
