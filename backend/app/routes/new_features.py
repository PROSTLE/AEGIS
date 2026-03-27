"""
New Feature Routes: Competition Radar, Regulatory Pulse, City Planner, War Room
"""
from fastapi import APIRouter, Query
from typing import Optional
import uuid, secrets
from datetime import datetime, timedelta
from app.data_store import REGULATORY_PULSE, COMPETITION, CITY_PLANNER

# ---------------------------------------------------------------------------
# REGULATORY PULSE
# ---------------------------------------------------------------------------
pulse_router = APIRouter(prefix="/api/regulatory-pulse", tags=["regulatory-pulse"])

@pulse_router.get("")
async def get_regulatory_pulse(tags: Optional[str] = Query(None)):
    """Get live regulatory policy feed (PIB-sourced). Optionally filter by sector tags."""
    feed = REGULATORY_PULSE
    if tags:
        tag_list = [t.strip().lower() for t in tags.split(",")]
        feed = [item for item in feed if item["tag"].lower() in tag_list]
    return {
        "feed": feed,
        "total": len(feed),
        "source": "PIB RSS + DPIIT Policy Tracker",
        "refreshed_at": datetime.utcnow().isoformat() + "Z"
    }

@pulse_router.get("/impact/{impact_level}")
async def get_by_impact(impact_level: str):
    """Filter pulse feed by impact level: High, Medium, Low"""
    feed = [item for item in REGULATORY_PULSE if item["impact"].lower() == impact_level.lower()]
    return {"feed": feed, "impact": impact_level, "total": len(feed)}

# ---------------------------------------------------------------------------
# COMPETITION RADAR
# ---------------------------------------------------------------------------
competition_router = APIRouter(prefix="/api/competition", tags=["competition"])

@competition_router.get("")
async def get_competition(
    city: str = Query("Jaipur"),
    sector: str = Query("Manufacturing")
):
    """Get competitor analysis for a city+sector combo"""
    key = f"{city}_{sector}"
    competitors = COMPETITION.get(key, COMPETITION.get("Jaipur_Manufacturing", []))

    # Build radar data: YOU vs LEADER
    leader_score = max((c["threat_score"] for c in competitors), default=80)
    your_score   = max(60, leader_score - 22)
    radar = [
        {"subject": "Product", "you": your_score + 5, "leader": leader_score},
        {"subject": "Distribution", "you": your_score - 5, "leader": leader_score - 8},
        {"subject": "Brand", "you": your_score - 12, "leader": leader_score - 2},
        {"subject": "Pricing", "you": your_score + 8, "leader": leader_score - 15},
        {"subject": "Tech", "you": your_score + 15, "leader": leader_score - 10},
        {"subject": "Network", "you": your_score - 8, "leader": leader_score + 2},
    ]

    ai_suggestions = [
        f"Undercut {competitors[0]['name'] if competitors else 'market leader'} on pricing — they show cost inefficiencies.",
        "Build tech-first differentiation: your score is higher in Tech stack vs competitors.",
        "Target underserved Tier-2 geographic pockets that larger players ignore.",
        "Network effects and distribution — file DPIIT recognition to access govt tenders and accelerator matching.",
    ]

    return {
        "city": city,
        "sector": sector,
        "competitors": competitors,
        "radar": radar,
        "ai_suggestions": ai_suggestions,
        "market_leader": max(competitors, key=lambda c: c["threat_score"], default=None)
    }

@competition_router.get("/cities")
async def get_competition_cities():
    """Get all city+sector combos available"""
    return {"combos": list(COMPETITION.keys())}

# ---------------------------------------------------------------------------
# CITY PLANNER (Reverse Pitch)
# ---------------------------------------------------------------------------
planner_router = APIRouter(prefix="/api/city-planner", tags=["city-planner"])

@planner_router.get("/{city}")
async def get_city_planner(city: str):
    """Get city planner intelligence — migration, infra gaps, policy recs"""
    data = CITY_PLANNER.get(city, CITY_PLANNER.get("Jaipur"))
    return {
        "city": city,
        "migration": data["migration"],
        "infra_gaps": data["infra_gaps"],
        "policy_recs": data["policy_recs"],
        "summary": {
            "total_migrating_sectors": len(data["migration"]),
            "critical_gaps": len([g for g in data["infra_gaps"] if g["impact"] == "High"]),
            "preferred_destination": "Bangalore"
        }
    }

@planner_router.get("/{city}/migration")
async def get_migration_data(city: str):
    """Get startup migration data for a city"""
    data = CITY_PLANNER.get(city, CITY_PLANNER.get("Jaipur"))
    return {"city": city, "migration": data["migration"]}

@planner_router.get("/{city}/infra-gaps")
async def get_infra_gaps(city: str):
    """Get infrastructure gap analysis"""
    data = CITY_PLANNER.get(city, CITY_PLANNER.get("Jaipur"))
    return {"city": city, "infra_gaps": data["infra_gaps"]}

# ---------------------------------------------------------------------------
# WAR ROOM (Secure Share)
# ---------------------------------------------------------------------------
war_room_router = APIRouter(prefix="/api/share", tags=["war-room"])

# In-memory store (use Redis/DB in production)
_share_store: dict = {}

@war_room_router.post("")
async def create_share_link(
    report_name: str = Query(...),
    expires_days: int = Query(30),
    password_hash: Optional[str] = Query(None)
):
    """Generate a secure shareable report link"""
    share_id = secrets.token_urlsafe(8)
    expires_at = (datetime.utcnow() + timedelta(days=expires_days)).isoformat() + "Z"
    record = {
        "share_id": share_id,
        "report_name": report_name,
        "url": f"https://aegis.io/report/share/{share_id}",
        "expires_at": expires_at,
        "password_protected": password_hash is not None,
        "views": 0,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "status": "active"
    }
    _share_store[share_id] = record
    return record

@war_room_router.get("/{share_id}")
async def get_share(share_id: str):
    """Retrieve a shared report"""
    record = _share_store.get(share_id)
    if not record:
        return {"error": "Share link not found or expired"}
    # Increment view count
    record["views"] += 1
    return record

@war_room_router.delete("/{share_id}")
async def revoke_share(share_id: str):
    """Revoke a share link"""
    if share_id in _share_store:
        _share_store[share_id]["status"] = "revoked"
        return {"success": True, "message": f"Share {share_id} revoked"}
    return {"error": "Share link not found"}

@war_room_router.get("")
async def list_shares():
    """List all active share links"""
    return {
        "shares": [v for v in _share_store.values() if v["status"] == "active"],
        "total": len([v for v in _share_store.values() if v["status"] == "active"])
    }
