"""
AEGIS AI Narrator — Gemini Flash Lite
Primary: gemini-2.0-flash-lite  |  Fallback: gemini-2.5-flash  |  Last resort: rule-based
"""
import os
import asyncio
import httpx
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/ai", tags=["ai"])

BASE = "https://generativelanguage.googleapis.com/v1beta/models"
MODELS = [
    "gemini-2.0-flash-lite",   # fastest / cheapest
    "gemini-2.5-flash",        # fallback if lite rate-limited
]


class NarrativeRequest(BaseModel):
    city: str
    sector: str
    startup_idea: str
    funding_stage: Optional[str] = "Seed"
    team_size: Optional[int] = 4
    launch_readiness_score: Optional[float] = 72.0
    survival_probability: Optional[float] = 70.0
    logistics_score: Optional[float] = 70.0
    cagr: Optional[float] = 25.0
    active_companies: Optional[int] = 100
    crowding_index: Optional[float] = 0.8
    top_zone: Optional[str] = ""
    zone_rent: Optional[float] = 80.0


def _build_prompt(req: NarrativeRequest) -> str:
    crowding_label = (
        "low saturation — early-mover advantage" if req.crowding_index < 0.7
        else "moderate competition" if req.crowding_index < 1.0
        else "saturated — strong differentiation essential"
    )
    return f"""You are AEGIS, India's sovereign startup terrain intelligence engine.
A founder described their idea. Write a precise, data-driven terrain report in exactly 3 paragraphs.

FOUNDER INPUT:
- Idea: {req.startup_idea}
- City: {req.city}
- Sector: {req.sector}
- Stage: {req.funding_stage}
- Team Size: {req.team_size}

LIVE AEGIS DATA FOR {req.city.upper()} · {req.sector.upper()}:
- Launch Readiness Score: {req.launch_readiness_score}/100
- 3-Year Survival Probability: {req.survival_probability}%
- Logistics Score: {req.logistics_score}/100
- 5-Year Demand CAGR: {req.cagr}%
- Active Companies in Sector: {req.active_companies}
- Market Crowding Index: {req.crowding_index} ({crowding_label})
- Recommended Zone: {req.top_zone or req.city + ' central zone'} at Rs.{req.zone_rent}/sqft/month

STRICT INSTRUCTIONS:
1. Exactly 3 paragraphs, no bullet points, no headers.
2. Para 1: Market opportunity & timing in {req.city} for {req.sector} — cite the real numbers above.
3. Para 2: Operational realities — costs, zone, logistics, workforce, city-specific policy (RBI/DPIIT/PLI/T-Hub etc).
4. Para 3: Tactical playbook — first 90-day priorities, investor type to target, top risk to mitigate.
5. Tone: senior VC analyst. Direct. No fluff. Confidence-inducing.
6. Each paragraph: 2-3 sentences max.
"""


@router.post("/narrative")
async def generate_narrative(req: NarrativeRequest):
    """Generate AI terrain narrative using Gemini Flash Lite → Flash fallback."""
    key = os.getenv("GEMINI_API_KEY", "")
    if not key or key == "your_gemini_api_key_here":
        return {"narrative": _rule_based(req), "source": "rule-based"}

    payload = {
        "contents": [{"parts": [{"text": _build_prompt(req)}]}],
        "generationConfig": {
            "temperature": 0.65,
            "maxOutputTokens": 600,
            "topP": 0.9,
        },
    }

    for model in MODELS:
        url = f"{BASE}/{model}:generateContent?key={key}"
        for attempt in range(2):
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        url, json=payload,
                        headers={"Content-Type": "application/json"}
                    )
                if resp.status_code == 429:
                    # rate-limited — wait and retry once, then try next model
                    if attempt == 0:
                        await asyncio.sleep(4)
                        continue
                    break  # try next model
                if resp.status_code != 200:
                    break  # try next model
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {"narrative": text.strip(), "source": model}
            except Exception as e:
                if attempt == 0:
                    await asyncio.sleep(2)
                    continue
                print(f"[AEGIS AI] {model} error: {e}")
                break

    # All Gemini models failed → rule-based
    return {"narrative": _rule_based(req), "source": "rule-based"}


def _rule_based(req: NarrativeRequest) -> str:
    crowding_label = (
        "low saturation — early-mover advantage" if req.crowding_index < 0.7
        else "moderate competition — differentiate early" if req.crowding_index < 1.0
        else "high saturation — differentiation is non-negotiable"
    )
    tier = "strong" if req.launch_readiness_score >= 70 else "developing"
    survival_tier = "above average" if req.survival_probability >= 75 else "moderate"

    return (
        f"{req.city} presents a {tier} launch environment for a {req.sector} startup "
        f"with a Launch Readiness Score of {req.launch_readiness_score}/100. "
        f"With {req.active_companies} active companies and a crowding index of {req.crowding_index}, "
        f"the market signals {crowding_label}. "
        f"The 5-year demand CAGR of {req.cagr}% is backed by strong policy tailwinds in this sector.\n\n"
        f"Operationally, {req.top_zone or req.city + ' commercial zone'} offers space at "
        f"Rs.{req.zone_rent}/sqft/month — "
        f"{'competitive' if req.zone_rent < 100 else 'premium but strategically justified'}. "
        f"The logistics score of {req.logistics_score}/100 indicates "
        f"{'efficient supply chain connectivity' if req.logistics_score >= 75 else 'adequate but improvable logistics'}. "
        f"At the {req.funding_stage} stage with a team of {req.team_size}, "
        f"cost efficiency is achievable relative to {req.city}'s talent pool.\n\n"
        f"The 3-year survival probability of {req.survival_probability}% is {survival_tier} "
        f"for Indian {req.sector} startups. "
        f"Prioritise DPIIT recognition in the first 30 days to unlock tax benefits and investor credibility. "
        f"Target thematic VCs and sector-specific angel networks active in {req.city} for your first cheque."
    )
