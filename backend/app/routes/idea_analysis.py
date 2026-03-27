"""
AEGIS Idea Intelligence Engine — /api/ai/idea-analysis
Analyzes startup ideas for:
  1. Innovation score (how novel is this in the market)
  2. Problem-solution fit (does it fix a real world problem?)
  3. City-domain alignment (is this the right city for this idea?)
  4. Sector timing (is the tailwind on your side?)
  5. Survival forecast (ML + city domain signals)
All powered by Gemini LLM + city data layer.
"""
import os, asyncio, httpx, re
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from app.data_store import (
    CITIES, SURVIVAL, ACTIVITY, DEMAND, LOGISTICS,
    LOCATION, INVESTORS, REGULATORY_PULSE
)

router = APIRouter(prefix="/api/ai", tags=["ai-idea"])

BASE = "https://generativelanguage.googleapis.com/v1beta/models"
MODELS = ["gemini-2.0-flash-lite", "gemini-2.5-flash"]

# ─────────────────────────────────────────────────────────────────────────────
# SECTOR → CITY domain wisdom: what is each city KNOWN for per sector?
# ─────────────────────────────────────────────────────────────────────────────
CITY_SECTOR_DOMAIN = {
    "Mumbai": {
        "Fintech": {
            "domain_fit": 97, "moat": "RBI HQ, SEBI, NSE, BSE — India's regulatory capital",
            "why": "Every fintech that wants to deal with regulators must be in Mumbai. NBFC licenses, RBI Innovation Hub, GIFT City access.",
            "real_problem": "60% of Indian SMEs lack formal credit. UPI-linked lending, BNPL, and embedded finance are underpenetrated.",
            "policy": ["RBI Innovation Sandbox", "SEBI RegTech Framework", "GIFT City IFSC"],
        },
        "D2C": {
            "domain_fit": 89, "moat": "Media, brand agencies, luxury consumer base in Bandra/Juhu",
            "why": "Top D2C brands (Mamaearth, Sugar, Bombay Shaving Co.) were Mumbai-centric for go-to-market.",
            "real_problem": "Urban millennial consumers in Mumbai spend ₹3x more than national average on premium D2C products.",
            "policy": ["ONDC expansion to 100+ cities", "GeM vendor onboarding"],
        },
        "SaaS": {
            "domain_fit": 75, "moat": "Large enterprise HQ density in BKC",
            "why": "Mumbai has the largest density of FMCGs, banks, and media companies — all prime SaaS buyers.",
            "real_problem": "Legacy BFSI and media companies are 5-10 years behind on SaaS adoption.",
            "policy": ["Digital India initiative", "RBI cloud guidelines for financial SaaS"],
        },
    },
    "Bangalore": {
        "SaaS": {
            "domain_fit": 98, "moat": "Global SaaS capital of India — 185,000+ tech workers",
            "why": "Freshworks, Chargebee, Zoho, Razorpay all scaled from Bangalore. Deepest B2B SaaS talent.",
            "real_problem": "Global SMBs need affordable, India-built SaaS alternatives to Salesforce and SAP.",
            "policy": ["NASSCOM IT-BPM India Stack", "India AI Mission ₹10,372 Cr"],
        },
        "Deep Tech": {
            "domain_fit": 94, "moat": "IISc, IIIT-B, IIT Bangalore campus — deepest research talent",
            "why": "ISRO, DRDO, HAL proximity creates unique robotics and aerospace pipeline.",
            "real_problem": "Indian R&D spend is 0.7% of GDP vs 3%+ in Israel/South Korea — huge enterprise gap.",
            "policy": ["India AI Mission", "DRDO Startup Connect", "DST Startup Grant"],
        },
        "Fintech": {
            "domain_fit": 85, "moat": "Razorpay, PhonePe, CRED all Bangalore-based",
            "why": "Strong payments/fintech engineering talent. But regulatory approvals need Mumbai proximity.",
            "real_problem": "70 Mn gig workers lack access to micro-insurance and earned wage access products.",
            "policy": ["RBI Account Aggregator framework", "UPI 2.0 mandates"],
        },
    },
    "Hyderabad": {
        "SaaS": {
            "domain_fit": 88, "moat": "HITEC City — India's 2nd largest IT corridor, 30% cheaper than Bangalore",
            "why": "WNS, Tech Mahindra, Infosys all run large product teams here. Pharma + IT crossover is unique.",
            "real_problem": "Pharma companies globally spend $2.6T on inefficient supply chains — SaaS for regulated industries.",
            "policy": ["Telangana IT Policy 2024", "T-Hub 2.0 — ₹300 Cr fund", "Genome Valley pharma grants"],
        },
        "HealthTech": {
            "domain_fit": 92, "moat": "Genome Valley — Asia's largest pharma cluster, Apollo HQ, AIIMS campus",
            "why": "Apollo Hospitals, Dr. Reddy's, Natco Pharma HQ here. Clinical research and hospital-tech convergence.",
            "real_problem": "India has 0.8 doctors per 1000 people vs WHO standard of 1. Digital health is critical.",
            "policy": ["Ayushman Bharat Digital Mission", "ICMR research grants", "Telangana health incubator"],
        },
    },
    "Delhi": {
        "SaaS": {
            "domain_fit": 82, "moat": "Largest enterprise buyer base in India — govt, FMCG, retail",
            "why": "DPIIT HQ gives first-mover policy access. GeM portal makes B2G SaaS lucrative.",
            "real_problem": "₹3 lakh Cr government procurement is 60% paper-based. GovTech SaaS is massively underpenetrated.",
            "policy": ["Digital India 2.0", "GeM portal expansion", "DPIIT Startup India Portal"],
        },
        "Fintech": {
            "domain_fit": 82, "moat": "PolicyBazaar, Zomato, OYO — consumer fintech HQ belt",
            "why": "Large affluent NCR consumer base + MSME lending corridor in east Delhi/Noida.",
            "real_problem": "Delhi NCR SMEs pay 18-24% interest from informal lenders vs 12% from formal channels.",
            "policy": ["NSIC (SME finance scheme)", "MUDRA Yojana scale-up"],
        },
        "D2C": {
            "domain_fit": 90, "moat": "Largest middle-class consumer market in India",
            "why": "Titan, Manyavar, Max Fashion regional HQs here. Fashion D2C thrives with Noida manufacturing.",
            "real_problem": "India's fashion market is ₹6.5L Cr — only 12% online. Tier-1 consumer appetite is unmet.",
            "policy": ["ONDC expansion", "India Post logistics for last-mile"],
        },
    },
    "Pune": {
        "SaaS": {
            "domain_fit": 87, "moat": "Auto + IT convergence — Tata, Bajaj, Mercedes all here",
            "why": "Auto manufacturing digital transformation is $200B global opportunity. Pune sits at the center.",
            "real_problem": "India's 20Mn+ 2-wheeler and 4-wheeler OEM suppliers lack Industry 4.0 adoption.",
            "policy": ["PLI for auto components", "Maharashtra IT park subsidies"],
        },
        "Manufacturing": {
            "domain_fit": 85, "moat": "Pimpri-Chinchwad MIDC — India's largest auto MSME cluster",
            "why": "Proximity to Mumbai port (150km) + auto supply chain make Pune unbeatable for industrial IoT.",
            "real_problem": "Unplanned downtime costs Indian auto MSMEs ₹2.4L/hour. Predictive maintenance SaaS is missing.",
            "policy": ["PLI auto components scheme", "Maharashtra stamp duty waiver for startups"],
        },
    },
    "Ahmedabad": {
        "Manufacturing": {
            "domain_fit": 93, "moat": "India's #1 manufacturing hub — Mundra port 120km, MSME cluster density",
            "why": "GSPC gas supply, Mundra logistics corridor, and GIDC industrial estates make it cost-optimal.",
            "real_problem": "India's textile and chemical SMEs waste ₹1.2L Cr/year on inefficient inventory management.",
            "policy": ["PM-MITRA textile parks", "PLI scheme advanced manufacturing", "GIFT City access"],
        },
    },
    "Jaipur": {
        "Manufacturing": {
            "domain_fit": 80, "moat": "Gems, handicraft, textiles — Rajasthan's $4B export base",
            "why": "ITI diploma workforce at 35% lower wages. RIICO industrial estates with power subsidies.",
            "real_problem": "Jaipur's artisan sector (1.2M workers) lacks quality control and export market access.",
            "policy": ["PM-MITRA textile parks", "PLI Scheme 2.0 (Jaipur priority city)", "RIICO incentives"],
        },
    },
}

SECTOR_REAL_PROBLEMS = {
    "Fintech": [
        "190M Indians unbanked; 300M underbanked",
        "SME credit gap is ₹25 lakh crore (SIDBI 2023)",
        "60% of UPI merchants have no working capital access",
        "NPA rates soar because credit scoring ignores cash flow data",
    ],
    "SaaS": [
        "Indian SMBs spend 10x less on software than US counterparts",
        "Legacy ERP systems cost ₹50L+ to maintain — SMBs can't afford it",
        "90% of Indian businesses still use Excel for accounting",
        "CRM penetration in India is <5% vs 40% in US",
    ],
    "Manufacturing": [
        "Up to 30% raw material wastage in SME production lines",
        "PM-MITRA needs ₹4,445 Cr in textile park tech stack — none delivered",
        "India loses ₹8.4L Cr/year from poor cold chain infrastructure",
        "MSME quality rejections up 22% since global ESG mandates",
    ],
    "HealthTech": [
        "Only 700 ICU beds per million people in India vs 3,400 in US",
        "75% of doctors in top 8 cities — rural healthcare desert",
        "India's diagnostic market is ₹65,000 Cr — 70% unorganized",
        "Ayushman Bharat covers 500M+ who still lack last-mile access to care",
    ],
    "D2C": [
        "India's ecommerce penetration is 7% vs 20% in China",
        "Quick commerce (10-min delivery) is a ₹45,000 Cr opportunity barely tapped",
        "Urban India's $60B FMCG market is 80% dominated by legacy brands",
        "Direct consumer retention via app is below 15% for most D2C brands",
    ],
    "Agritech": [
        "Post-harvest losses in India: ₹92,000 Cr per year (Ministry of Food)",
        "Kisan Credit Card utilisation below 30% — farmers lack formal credit",
        "Only 2% of Indian farms use precision agriculture tools",
        "APMC middlemen take 30-40% margin; farmer gets fraction of shelf price",
    ],
    "EdTech": [
        "150M Indians lack foundational literacy; government school quality crisis",
        "Gross Enrolment Ratio in higher education only 28% (lowest among BRIC)",
        "80% of engineering graduates are 'unemployable' per NASSCOM",
        "Skill India trained 1.4 Cr; only 15% placed — platform failing",
    ],
    "Logistics": [
        "India logistics cost is 13-14% of GDP vs 8% global benchmark",
        "Cold chain: India has 5,400 cold stores vs 100,000+ needed",
        "400M+ ecommerce shipments monthly — 8% return logistics unsolved",
        "ONDC logistics integration is fragmented — no unified routing layer",
    ],
    "CleanTech": [
        "India's EV charging infra: 6,000 stations vs 1.5L needed by 2030",
        "30% of India's land is facing desertification due to water mismanagement",
        "Industrial water recycling in MSMEs under 5%",
        "FAME-III demand surge: 5M EVs — supply chain for battery recycling missing",
    ],
}


def _get_city_domain(city: str, sector: str) -> dict:
    """Look up rich city-sector domain knowledge."""
    city_data = CITY_SECTOR_DOMAIN.get(city, {})
    sector_match = city_data.get(sector)
    if not sector_match:
        # Try closest sector
        for s in city_data:
            if sector.lower() in s.lower() or s.lower() in sector.lower():
                sector_match = city_data[s]
                break
    return sector_match or {
        "domain_fit": 65, "moat": f"{city}'s growing startup ecosystem",
        "why": f"{city} has general startup infrastructure suitable for {sector}.",
        "real_problem": SECTOR_REAL_PROBLEMS.get(sector, ["Market validation required"])[0],
        "policy": ["Startup India DPIIT recognition", "Seed Fund Scheme (SFS)"],
    }


class IdeaAnalysisRequest(BaseModel):
    city: str
    sector: str
    startup_idea: str
    funding_stage: Optional[str] = "Seed"
    team_size: Optional[int] = 4


class IdeaAnalysisResponse(BaseModel):
    innovation_score: int
    problem_fit_score: int
    city_domain_score: int
    sector_timing_score: int
    overall_viability: int
    real_problems_addressed: List[str]
    city_moat: str
    city_domain_insight: str
    policy_tailwinds: List[str]
    innovation_verdict: str
    risk_summary: str
    ai_narrative: str
    ai_source: str


def _build_idea_prompt(req: IdeaAnalysisRequest, domain: dict, survival_data: dict, demand_data: dict) -> str:
    real_probs = SECTOR_REAL_PROBLEMS.get(req.sector, ["Market validation required"])
    active_cos = ACTIVITY.get(req.city, {}).get("active", 500)
    crowding = ACTIVITY.get(req.city, {}).get("crowding_index", 0.9)
    cagr = demand_data.get("cagr", 22)
    policy = demand_data.get("policy", "DPIIT Startup India")

    return f"""You are AEGIS, India's sovereign startup terrain intelligence engine. A founder just described their startup idea. 
Analyze it in the context of {req.city}'s startup domain and {req.sector} sector.

FOUNDER'S IDEA:
"{req.startup_idea}"

CITY: {req.city}
SECTOR: {req.sector}
STAGE: {req.funding_stage}
TEAM SIZE: {req.team_size}

AEGIS CITY-DOMAIN INTELLIGENCE FOR {req.city.upper()} × {req.sector.upper()}:
- Domain Fit Score: {domain['domain_fit']}/100
- City Moat: {domain['moat']}
- Why this city: {domain['why']}
- Key Real-World Problem: {domain['real_problem']}
- Active companies in {req.city}: {active_cos}
- Market crowding index: {crowding} ({'saturated' if crowding > 1.1 else 'moderate' if crowding > 0.7 else 'opportunity'})
- 5-Year demand CAGR: {cagr}%
- Policy tailwinds: {policy}
- 3-yr survival rate in this city: {survival_data.get('survival_probability', 72)}%

REAL PROBLEMS IN {req.sector.upper()} THIS IDEA COULD FIX:
{chr(10).join(f"- {p}" for p in real_probs[:3])}

YOUR TASK — write exactly 4 paragraphs. NO bullet points. NO markdown headers. Just paragraphs.

Para 1 — INNOVATION ANALYSIS: How novel is this idea? Does it clone an existing solution or does it attack an underserved angle? 
Be specific about what makes it innovative or generic. Cite the crowding index and any competitors.

Para 2 — REAL-WORLD PROBLEM FIT: Which specific real-world problems in {req.city} / India does this idea fix? 
Quote real numbers (from AEGIS data above). Is the problem large enough to build a ₹100 Cr+ business on?

Para 3 — CITY-DOMAIN ALIGNMENT: Why is {req.city} the right (or wrong) city for this exact idea?  
What unique city-specific moat, policy, or infrastructure advantage can this startup leverage?

Para 4 — TACTICAL PLAYBOOK: What should they do in the first 90 days? What investor profile to target?  
What is the single biggest risk and how to mitigate it?

Tone: Senior VC partner. Direct. Data-driven. No fluff. Maximum 2-3 sentences per paragraph."""


def _score_idea(req: IdeaAnalysisRequest, domain: dict) -> dict:
    """Rule-based scoring for innovation, problem-fit, city-domain, sector timing."""
    idea_lower = req.startup_idea.lower()
    sector = req.sector
    city = req.city
    
    # Innovation score: penalize for generic keywords, reward for specific angles
    generic_terms = ["platform", "marketplace", "app", "solution", "service"]
    novel_terms = ["ai", "ml", "blockchain", "iot", "embedded", "api-first", "b2b2c", "vertical saas", "co-pilot", "agent"]
    generic_count = sum(1 for t in generic_terms if t in idea_lower)
    novel_count = sum(1 for t in novel_terms if t in idea_lower)
    innovation_score = max(35, min(95, 60 + (novel_count * 10) - (generic_count * 5)))
    
    # Problem-fit: how many real sector problems does idea address?
    real_probs = SECTOR_REAL_PROBLEMS.get(sector, [])
    prob_keywords = {
        "Fintech": ["credit", "loan", "payment", "lending", "nbfc", "sme", "kisan", "msme", "insurance", "invest"],
        "SaaS": ["automat", "erp", "crm", "workflow", "dashboard", "compliance", "b2b"],
        "Manufacturing": ["supply chain", "inventory", "quality", "production", "iot", "predictive"],
        "HealthTech": ["patient", "doctor", "diagnostic", "rural", "telemedicine", "hospital"],
        "D2C": ["brand", "consumer", "direct", "d2c", "ecommerce", "quick commerce"],
        "Agritech": ["farm", "kisan", "mandi", "crop", "harvest", "agri"],
        "Logistics": ["last mile", "cold chain", "delivery", "route", "fleet", "warehouse"],
    }
    prob_hits = sum(1 for kw in prob_keywords.get(sector, []) if kw in idea_lower)
    problem_fit = max(40, min(92, 55 + (prob_hits * 8)))
    
    # City-domain score from data
    city_domain = domain.get("domain_fit", 65)
    
    # Sector timing = demand CAGR proxy
    demand_cagr = DEMAND.get(city, DEMAND.get("Jaipur", {})).get("cagr", 20)
    sector_timing = max(50, min(98, 50 + demand_cagr))
    
    # Overall viability
    survival_prob = SURVIVAL.get(city, SURVIVAL.get("Jaipur", {})).get("survival_probability", 65)
    overall = round(
        innovation_score * 0.25 +
        problem_fit * 0.30 +
        city_domain * 0.25 +
        min(survival_prob, 95) * 0.20
    )
    
    # Innovation verdict
    if innovation_score >= 80:
        verdict = "Highly Innovative — clear first-mover potential in this segment"
    elif innovation_score >= 65:
        verdict = "Differentiated — strong angle but execution is the moat"
    elif innovation_score >= 50:
        verdict = "Incremental — market exists but differentiation unclear"
    else:
        verdict = "Generic — risk of me-too positioning without a unique wedge"
    
    return {
        "innovation_score": innovation_score,
        "problem_fit_score": problem_fit,
        "city_domain_score": city_domain,
        "sector_timing_score": sector_timing,
        "overall_viability": overall,
        "innovation_verdict": verdict,
    }


@router.post("/idea-analysis", response_model=IdeaAnalysisResponse)
async def analyze_idea(req: IdeaAnalysisRequest):
    """Full idea intelligence: innovation + problem-fit + city-domain + LLM narrative."""
    domain = _get_city_domain(req.city, req.sector)
    survival_data = SURVIVAL.get(req.city, SURVIVAL.get("Jaipur", {}))
    demand_data = DEMAND.get(req.city, DEMAND.get("Jaipur", {}))
    scores = _score_idea(req, domain)
    real_probs = SECTOR_REAL_PROBLEMS.get(req.sector, ["Market gap validation required"])[:3]

    # Build risk summary
    crowding_idx = ACTIVITY.get(req.city, {}).get("crowding_index", 0.9)
    if crowding_idx > 1.2:
        risk = f"High crowding index ({crowding_idx}) in {req.city} — differentiation or sub-niche focus is critical."
    elif scores["innovation_score"] < 55:
        risk = "Low innovation signal — idea may be too generic. Find unique distribution or tech wedge."
    else:
        risk = survival_data.get("risk_factors", ["Market timing risk"])[0]

    # Try Gemini for narrative
    key = os.getenv("GEMINI_API_KEY", "")
    narrative = ""
    ai_source = "rule-based"

    if key and key != "your_gemini_api_key_here":
        prompt = _build_idea_prompt(req, domain, survival_data, demand_data)
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 800, "topP": 0.9},
        }
        for model in MODELS:
            url = f"{BASE}/{model}:generateContent?key={key}"
            for attempt in range(2):
                try:
                    async with httpx.AsyncClient(timeout=30.0) as client:
                        resp = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
                    if resp.status_code == 429:
                        if attempt == 0:
                            await asyncio.sleep(4)
                            continue
                        break
                    if resp.status_code != 200:
                        break
                    data = resp.json()
                    narrative = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    ai_source = model
                    break
                except Exception as e:
                    if attempt == 0:
                        await asyncio.sleep(2)
                        continue
                    break
            if narrative:
                break

    if not narrative:
        # Rule-based fallback
        narrative = (
            f"Your idea targets the {req.sector} space in {req.city} — a sector with a {demand_data.get('cagr', 22)}% 5-year CAGR. "
            f"Innovation score of {scores['innovation_score']}/100 suggests {'strong first-mover potential' if scores['innovation_score'] >= 70 else 'the need for a sharper differentiated angle'}. "
            f"The city-domain fit registers {scores['city_domain_score']}/100: {domain['why']}\n\n"
            f"The core real-world problem this addresses: {domain['real_problem']} "
            f"This is a verified gap in the {req.city} market backed by DPIIT and sector data. "
            f"The policy environment ({demand_data.get('policy', 'Startup India')}) creates near-term tailwinds.\n\n"
            f"In the first 90 days: secure DPIIT recognition, engage T-Hub / Nasscom iLEAP / relevant incubator, "
            f"and target {', '.join([inv['name'] for inv in INVESTORS[:2]])} for your seed round. "
            f"Primary risk: {risk}"
        )

    return IdeaAnalysisResponse(
        innovation_score=scores["innovation_score"],
        problem_fit_score=scores["problem_fit_score"],
        city_domain_score=scores["city_domain_score"],
        sector_timing_score=scores["sector_timing_score"],
        overall_viability=scores["overall_viability"],
        real_problems_addressed=real_probs,
        city_moat=domain["moat"],
        city_domain_insight=domain["why"],
        policy_tailwinds=domain.get("policy", ["Startup India DPIIT"]),
        innovation_verdict=scores["innovation_verdict"],
        risk_summary=risk,
        ai_narrative=narrative,
        ai_source=ai_source,
    )
