"""
AEGIS Extended City Data — Mumbai, Delhi, Hyderabad, Pune
Appended to data_store after initial load.
Import this module AFTER data_store to extend all dicts in-place.
"""
from app.data_store import CITIES, LOGISTICS, SURVIVAL, ACTIVITY, DEMAND, LOCATION, INVESTORS
from app.indian_cities_data import EXTENDED_CITIES, EXTENDED_LOGISTICS, EXTENDED_LOCATION, EXTENDED_ACTIVITY, EXTENDED_DEMAND, EXTENDED_SURVIVAL

# ── LOGISTICS ────────────────────────────────────────────────────────────────
LOGISTICS["Mumbai"] = {
    "score": 88, "recommendation": "Unmatched sea freight access via JNPT (Nhava Sheva). Last-mile is highly crowded but effective. Warehousing costs are very high — consider Bhiwandi.",
    "metrics": [
        {"name": "Last-Mile Density", "value": 95, "unit": "Extensive 2W/3W EV network"},
        {"name": "Supplier Proximity", "value": 85, "unit": "Strong industrial corridors"},
        {"name": "Highway Access", "value": 86, "unit": "NH-48 · Mumbai-Pune Exp"},
        {"name": "Port Distance", "value": 95, "unit": "40km to JNPT Port (Nhava Sheva)"},
        {"name": "Cold Chain", "value": 90, "unit": "Excellent specialized cold chain"},
        {"name": "Cost vs Bangalore", "value": 40, "unit": "10% more expensive"},
    ]
}
LOGISTICS["Delhi"] = {
    "score": 82, "recommendation": "NCR logistics hub. IGI cargo airport, NH-48 corridor. Prime enterprise sales HQ location.",
    "metrics": [
        {"name": "Last-Mile Density", "value": 90, "unit": "Delhivery HQ city"},
        {"name": "Supplier Proximity", "value": 80, "unit": "Okhla + Noida MSME belt"},
        {"name": "Highway Access", "value": 92, "unit": "NH-48 · NH-44 · Yamuna Exp"},
        {"name": "Port Distance", "value": 40, "unit": "1400km to JNPT — inland hub"},
        {"name": "Cold Chain", "value": 75, "unit": "Good availability"},
        {"name": "Cost vs Bangalore", "value": 55, "unit": "20% more expensive"},
    ]
}
LOGISTICS["Hyderabad"] = {
    "score": 80, "recommendation": "Strong IT corridor (HITEC City). Pharma logistics via Genome Valley. Rajiv Gandhi airport cargo hub.",
    "metrics": [
        {"name": "Last-Mile Density", "value": 85, "unit": "Strong e-comm presence"},
        {"name": "Supplier Proximity", "value": 72, "unit": "Pharma clusters at Genome Valley"},
        {"name": "Highway Access", "value": 85, "unit": "NH-44 · ORR"},
        {"name": "Port Distance", "value": 55, "unit": "620km to Chennai Port"},
        {"name": "Cold Chain", "value": 78, "unit": "Good pharma cold chain"},
        {"name": "Cost vs Bangalore", "value": 70, "unit": "15% cheaper than Bangalore"},
    ]
}
LOGISTICS["Pune"] = {
    "score": 79, "recommendation": "Strong IT and auto manufacturing hub. Mumbai port 150km. Fast-growing SaaS ecosystem.",
    "metrics": [
        {"name": "Last-Mile Density", "value": 82, "unit": "Good coverage"},
        {"name": "Supplier Proximity", "value": 85, "unit": "Auto + IT clusters"},
        {"name": "Highway Access", "value": 88, "unit": "NH-48 Mumbai-Pune Expressway"},
        {"name": "Port Distance", "value": 72, "unit": "150km to JNPT Mumbai"},
        {"name": "Cold Chain", "value": 70, "unit": "Adequate"},
        {"name": "Cost vs Bangalore", "value": 65, "unit": "10% cheaper than Bangalore"},
    ]
}

# ── SURVIVAL ──────────────────────────────────────────────────────────────────
SURVIVAL["Mumbai"] = {
    "sector": "Fintech", "survival_probability": 82,
    "risk_factors": ["Very high office & talent costs", "RBI regulatory complexity for NBFCs", "Dense fintech competition from BKC cluster"],
    "strengths": ["India's financial capital — best investor density", "RBI Innovation Hub sandbox access", "SEBI, BSE, NSE proximity for capital markets", "GIFT City regulatory corridor nearby"],
    "similar_failed": ["LoanKart India (2022) — RBI NBFC norms", "PayCraft India (2021) — unit economics"],
    "radar": [
        {"subject": "Market Timing", "score": 90}, {"subject": "Team Background", "score": 85},
        {"subject": "Location", "score": 95}, {"subject": "Funding Stage", "score": 80},
        {"subject": "Sector Health", "score": 92}, {"subject": "Competitor Density", "score": 48},
    ]
}
SURVIVAL["Delhi"] = {
    "sector": "Enterprise SaaS / D2C", "survival_probability": 79,
    "risk_factors": ["High real estate in Gurugram", "Talent attrition to Bangalore/Mumbai", "Government procurement cycles slow"],
    "strengths": ["Largest enterprise customer base in India", "Strong D2C consumer market (NCR)", "DPIIT HQ advantage for policy access"],
    "similar_failed": ["RetailEdge Delhi (2022) — cash flow", "EnterpriseHub India (2021) — sales cycle"],
    "radar": [
        {"subject": "Market Timing", "score": 82}, {"subject": "Team Background", "score": 80},
        {"subject": "Location", "score": 85}, {"subject": "Funding Stage", "score": 75},
        {"subject": "Sector Health", "score": 88}, {"subject": "Competitor Density", "score": 60},
    ]
}
SURVIVAL["Hyderabad"] = {
    "sector": "SaaS / Pharma Tech", "survival_probability": 78,
    "risk_factors": ["Smaller investor community vs Bangalore", "Talent retention challenge to Bangalore", "Limited Series B+ capital locally"],
    "strengths": ["Lower burn rate than Bangalore by 30%", "Strong pharma & biotech ecosystem at Genome Valley", "T-Hub government incubator support", "HITEC City world-class IT infrastructure"],
    "similar_failed": ["MedSync Hyderabad (2022) — distribution", "PharmaBridge (2021) — integration issues"],
    "radar": [
        {"subject": "Market Timing", "score": 84}, {"subject": "Team Background", "score": 82},
        {"subject": "Location", "score": 80}, {"subject": "Funding Stage", "score": 72},
        {"subject": "Sector Health", "score": 88}, {"subject": "Competitor Density", "score": 70},
    ]
}
SURVIVAL["Pune"] = {
    "sector": "SaaS / Auto Tech", "survival_probability": 76,
    "risk_factors": ["Smaller talent pool than Bangalore", "Limited Series A+ investors locally", "Hinjewadi infrastructure congestion"],
    "strengths": ["Costs 30% lower than Mumbai/Bangalore", "Strong auto and IT workforce", "Close proximity to Mumbai investors (3hr)"],
    "similar_failed": ["AutoTech Pune (2022) — OEM dependency", "SaaSBridge (2021) — scaling issues"],
    "radar": [
        {"subject": "Market Timing", "score": 80}, {"subject": "Team Background", "score": 78},
        {"subject": "Location", "score": 82}, {"subject": "Funding Stage", "score": 72},
        {"subject": "Sector Health", "score": 84}, {"subject": "Competitor Density", "score": 65},
    ]
}

# ── ACTIVITY ──────────────────────────────────────────────────────────────────
ACTIVITY["Mumbai"] = {
    "sector": "Fintech", "active": 2840, "closures": 310, "new_2024": 480,
    "crowding_index": 1.18, "category": "Competitive", "dpiit": 2600, "mca21": 2840, "gst": 2500,
    "closure_rate": 10.2,
    "top_companies": [
        {"name": "Razorpay (Mumbai ops)", "status": "Active", "year": 2014},
        {"name": "Zerodha", "status": "Active", "year": 2010},
        {"name": "PayZen India", "status": "Struck Off", "year": 2022},
    ],
    "insight": "Crowding index 1.18 — competitive but not saturated. Fintech remains India's #1 funded sector by deal count."
}
ACTIVITY["Delhi"] = {
    "sector": "Enterprise SaaS / D2C", "active": 3200, "closures": 380, "new_2024": 520,
    "crowding_index": 1.22, "category": "Competitive", "dpiit": 3000, "mca21": 3200, "gst": 2800,
    "closure_rate": 11.0,
    "top_companies": [
        {"name": "PolicyBazaar", "status": "Active", "year": 2008},
        {"name": "Zomato", "status": "Active", "year": 2008},
        {"name": "EdTech Delhi", "status": "Struck Off", "year": 2022},
    ],
    "insight": "Large market, competitive field. Strong D2C and enterprise opportunity — especially via ONDC and GeM portal."
}
ACTIVITY["Hyderabad"] = {
    "sector": "SaaS / Pharma Tech", "active": 1820, "closures": 190, "new_2024": 290,
    "crowding_index": 0.82, "category": "Growing", "dpiit": 1700, "mca21": 1820, "gst": 1600,
    "closure_rate": 9.4,
    "top_companies": [
        {"name": "Dr. Reddy's Digital", "status": "Active", "year": 2019},
        {"name": "T-Hub Portfolio Co.", "status": "Active", "year": 2021},
        {"name": "MedSync India", "status": "Struck Off", "year": 2022},
    ],
    "insight": "Crowding index 0.82 — moderate saturation. Pharma tech and SaaS for regulated industries is underserved."
}
ACTIVITY["Pune"] = {
    "sector": "SaaS / Auto Tech", "active": 1640, "closures": 165, "new_2024": 260,
    "crowding_index": 0.88, "category": "Growing", "dpiit": 1500, "mca21": 1640, "gst": 1420,
    "closure_rate": 9.1,
    "top_companies": [
        {"name": "Persistent Systems", "status": "Active", "year": 1990},
        {"name": "Cummins India Digital", "status": "Active", "year": 2020},
        {"name": "AutoSaaS Pune", "status": "Struck Off", "year": 2022},
    ],
    "insight": "Moderate crowding — good opportunity in auto tech, IoT, and B2B SaaS targeting manufacturing."
}

# ── DEMAND ────────────────────────────────────────────────────────────────────
DEMAND["Mumbai"] = {
    "sector": "Fintech / BFSI Tech", "cagr": 32, "horizon": 5,
    "seasonal": "Q4 tax season peaks, Q1 budget cycle",
    "policy": "RBI Innovation Hub sandbox, SEBI fintech regulatory framework, UPI 2.0",
    "survival_curve": {"y1": 90, "y2": 80, "y3": 70, "y5": 55},
    "forecast": [
        {"year": "2023", "gst": 12400, "trend": 12400},
        {"year": "2024", "gst": 14800, "trend": 15000},
        {"year": "2025", "gst": 18200, "trend": 19000},
        {"year": "2026", "gst": None, "trend": 24000},
        {"year": "2027", "gst": None, "trend": 30500},
        {"year": "2028", "gst": None, "trend": 39000},
    ]
}
DEMAND["Delhi"] = {
    "sector": "Enterprise SaaS / GovTech", "cagr": 24, "horizon": 5,
    "seasonal": "Q4 government budget spend; Q1 enterprise renewals",
    "policy": "GEM portal expansion, Digital India 2.0, DPIIT procurement reform",
    "survival_curve": {"y1": 88, "y2": 76, "y3": 66, "y5": 52},
    "forecast": [
        {"year": "2023", "gst": 9800, "trend": 9800},
        {"year": "2024", "gst": 11400, "trend": 11800},
        {"year": "2025", "gst": 13800, "trend": 14500},
        {"year": "2026", "gst": None, "trend": 18200},
        {"year": "2027", "gst": None, "trend": 22800},
        {"year": "2028", "gst": None, "trend": 28500},
    ]
}
DEMAND["Hyderabad"] = {
    "sector": "SaaS / Pharma Tech", "cagr": 26, "horizon": 5,
    "seasonal": "Q2 pharma procurement cycles",
    "policy": "Telangana IT policy 2024, Genome Valley pharma incentives, T-Hub 2.0 grants",
    "survival_curve": {"y1": 89, "y2": 78, "y3": 68, "y5": 54},
    "forecast": [
        {"year": "2023", "gst": 6200, "trend": 6200},
        {"year": "2024", "gst": 7400, "trend": 7700},
        {"year": "2025", "gst": 9100, "trend": 9600},
        {"year": "2026", "gst": None, "trend": 12200},
        {"year": "2027", "gst": None, "trend": 15500},
        {"year": "2028", "gst": None, "trend": 19800},
    ]
}
DEMAND["Pune"] = {
    "sector": "SaaS / Auto Tech", "cagr": 22, "horizon": 5,
    "seasonal": "Q3 auto industry order cycles",
    "policy": "Maharashtra IT policy, Pune IT park subsidies, PLI for auto components",
    "survival_curve": {"y1": 87, "y2": 76, "y3": 65, "y5": 51},
    "forecast": [
        {"year": "2023", "gst": 5400, "trend": 5400},
        {"year": "2024", "gst": 6400, "trend": 6600},
        {"year": "2025", "gst": 7800, "trend": 8200},
        {"year": "2026", "gst": None, "trend": 10200},
        {"year": "2027", "gst": None, "trend": 12800},
        {"year": "2028", "gst": None, "trend": 16000},
    ]
}

# ── LOCATION ──────────────────────────────────────────────────────────────────
LOCATION["Mumbai"] = {
    "sector": "Fintech / Logistics",
    "zones": [
        {
            "name": "Bhiwandi Logistics Park", "score": 88, "rent": 35,
            "zoning": "Warehousing/Logistics", "highway": "NH-3 / Mumbai-Nashik (1km)",
            "supplier_proximity": "High — Major hub for e-com & supply chain",
            "talent_access": "Moderate — High worker turnover, migrant heavy",
            "pros": ["Largest warehousing hub in India", "Direct access to JNPT port", "No octroi barriers"],
            "cons": ["Traffic bottlenecks", "Unplanned urban sprawl"],
            "recommended": True
        },
        {
            "name": "Bandra Kurla Complex (BKC)", "score": 92, "rent": 250,
            "zoning": "Commercial SEZ", "highway": "Western Express Hwy (2km)",
            "supplier_proximity": "N/A — Financial hub",
            "talent_access": "Elite — Top finance & tech talent",
            "pros": ["Status & networking", "Proximity to VCs and Banks", "Premium infrastructure"],
            "cons": ["Exorbitant rents", "High cost of living for employees"],
            "recommended": True
        },
        {
            "name": "Lower Parel / Worli", "score": 82, "rent": 130,
            "zoning": "Commercial", "highway": "Eastern Freeway",
            "supplier_proximity": "High — media, finance, consumer clusters",
            "talent_access": "High",
            "pros": ["30% cheaper than BKC", "Good metro access", "D2C brand ecosystem"],
            "cons": ["Congested micro-markets", "Older buildings in parts"],
            "recommended": False
        }
    ]
}
LOCATION["Delhi"] = {
    "sector": "Enterprise SaaS / D2C",
    "zones": [
        {
            "name": "Gurugram Cyber City", "score": 88, "rent": 95,
            "zoning": "IT / Commercial", "highway": "NH-48 (Delhi-Jaipur corridor)",
            "supplier_proximity": "High — enterprise customers cluster",
            "talent_access": "High — MDI, IIT Delhi, Delhi University",
            "pros": ["Best enterprise sales address in north India", "MNC HQ cluster", "Metro connectivity"],
            "cons": ["Traffic — 2hr commute from Delhi", "High office costs"],
            "recommended": True
        },
        {
            "name": "Noida Sector 62/63", "score": 78, "rent": 60,
            "zoning": "IT Park", "highway": "NH-24 / Yamuna Expressway",
            "supplier_proximity": "Moderate",
            "talent_access": "High — many engineering colleges nearby",
            "pros": ["40% cheaper than Gurugram", "IT park infrastructure", "Good talent pipeline"],
            "cons": ["Perceived as non-premium", "Less investor foot traffic"],
            "recommended": False
        }
    ]
}
LOCATION["Hyderabad"] = {
    "sector": "SaaS / Pharma Tech",
    "zones": [
        {
            "name": "HITEC City / Madhapur", "score": 90, "rent": 65,
            "zoning": "IT Hub", "highway": "ORR + NH-44",
            "supplier_proximity": "High — Google, Microsoft, Amazon HQs nearby",
            "talent_access": "Very High — IIIT Hyderabad, BITS Pilani campus",
            "pros": ["India's 2nd largest IT corridor", "T-Hub incubator access", "30% cheaper than Bangalore"],
            "cons": ["Traffic congestion peak hours", "Limited pharma-specific zones"],
            "recommended": True
        }
    ]
}
LOCATION["Pune"] = {
    "sector": "SaaS / Auto Tech",
    "zones": [
        {
            "name": "Hinjewadi IT Park", "score": 84, "rent": 58,
            "zoning": "IT Hub", "highway": "Mumbai-Pune Expressway (15km)",
            "supplier_proximity": "High — auto OEMs (Tata, Bajaj, Mercedes) nearby",
            "talent_access": "Very High — Pune University, COEP, Symbiosis",
            "pros": ["Strong auto-tech ecosystem", "30% cheaper than Bangalore", "Close to Mumbai investors"],
            "cons": ["Traffic congestion in Hinjewadi area", "Power outages in Pimpri belt"],
            "recommended": True
        }
    ]
}

# ── INVESTORS (Fintech/Mumbai additions) ──────────────────────────────────────
INVESTORS.extend([
    {"id": 9, "name": "Flourish Ventures", "focus": ["Fintech", "Financial Inclusion"], "cities": ["Mumbai", "Bangalore"], "stage": "Seed - Series A", "cheque": "₹2-12 Cr", "tier": "Thematic VC"},
    {"id": 10, "name": "QED Investors India", "focus": ["Fintech", "BFSI Tech"], "cities": ["Mumbai"], "stage": "Series A - B", "cheque": "₹10-40 Cr", "tier": "Global VC"},
    {"id": 11, "name": "Mumbai Angels", "focus": ["Fintech", "D2C", "Consumer"], "cities": ["Mumbai", "Pune"], "stage": "Pre-seed - Seed", "cheque": "₹25L-3 Cr", "tier": "Angel Network"},
    {"id": 12, "name": "3one4 Capital", "focus": ["SaaS", "Fintech", "Deep Tech"], "cities": ["Bangalore", "Delhi"], "stage": "Seed - Series A", "cheque": "₹2-10 Cr", "tier": "Tier 1 VC"},
])

# ── BLEND GENERATED EXTENDED CITIES ───────────────────────────────────────────
# Only add cities/data that don't already exist so we don't clobber the hand-curated data above.

_existing_city_names = {c["name"] for c in CITIES}
for c in EXTENDED_CITIES:
    if c["name"] not in _existing_city_names:
        CITIES.append(c)

for k, v in EXTENDED_LOGISTICS.items():
    if k not in LOGISTICS:
        LOGISTICS[k] = v

for k, v in EXTENDED_LOCATION.items():
    if k not in LOCATION:
        LOCATION[k] = v

for k, v in EXTENDED_ACTIVITY.items():
    if k not in ACTIVITY:
        ACTIVITY[k] = v

for k, v in EXTENDED_DEMAND.items():
    if k not in DEMAND:
        DEMAND[k] = v

for k, v in EXTENDED_SURVIVAL.items():
    if k not in SURVIVAL:
        SURVIVAL[k] = v
