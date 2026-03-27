"""
AEGIS Backend - Central Data Store
All city/sector intelligence data used across all modules.
This layer simulates a real database/API response while the live integrations are built.
"""

# ---------------------------------------------------------------------------
# CITIES MASTER DATA
# ---------------------------------------------------------------------------
CITIES = [
    {"name": "Bangalore", "state": "Karnataka", "lat": 12.97, "lng": 77.59,
     "score": 92, "startups": 8400, "trend": "up",
     "sector_scores": {"fintech": 88, "saas": 95, "agritech": 72, "d2c": 85, "manufacturing": 65}},
    {"name": "Mumbai", "state": "Maharashtra", "lat": 19.07, "lng": 72.87,
     "score": 88, "startups": 9200, "trend": "up",
     "sector_scores": {"fintech": 95, "saas": 82, "agritech": 55, "d2c": 91, "manufacturing": 60}},
    {"name": "Delhi", "state": "Delhi", "lat": 28.61, "lng": 77.20,
     "score": 85, "startups": 7800, "trend": "stable",
     "sector_scores": {"fintech": 82, "saas": 80, "agritech": 68, "d2c": 88, "manufacturing": 70}},
    {"name": "Pune", "state": "Maharashtra", "lat": 18.52, "lng": 73.85,
     "score": 83, "startups": 4200, "trend": "up",
     "sector_scores": {"fintech": 75, "saas": 90, "agritech": 60, "d2c": 78, "manufacturing": 82}},
    {"name": "Hyderabad", "state": "Telangana", "lat": 17.38, "lng": 78.48,
     "score": 81, "startups": 3800, "trend": "up",
     "sector_scores": {"fintech": 78, "saas": 86, "agritech": 72, "d2c": 74, "manufacturing": 76}},
    {"name": "Ahmedabad", "state": "Gujarat", "lat": 23.02, "lng": 72.57,
     "score": 79, "startups": 2900, "trend": "up",
     "sector_scores": {"fintech": 70, "saas": 65, "agritech": 78, "d2c": 80, "manufacturing": 90}},
    {"name": "Chennai", "state": "Tamil Nadu", "lat": 13.08, "lng": 80.27,
     "score": 77, "startups": 2600, "trend": "stable",
     "sector_scores": {"fintech": 75, "saas": 80, "agritech": 65, "d2c": 72, "manufacturing": 85}},
    {"name": "Jaipur", "state": "Rajasthan", "lat": 26.91, "lng": 75.78,
     "score": 74, "startups": 1200, "trend": "up",
     "sector_scores": {"fintech": 62, "saas": 58, "agritech": 70, "d2c": 76, "manufacturing": 82}},
    {"name": "Kochi", "state": "Kerala", "lat": 9.93, "lng": 76.26,
     "score": 71, "startups": 980, "trend": "up",
     "sector_scores": {"fintech": 78, "saas": 68, "agritech": 65, "d2c": 70, "manufacturing": 60}},
    {"name": "Indore", "state": "Madhya Pradesh", "lat": 22.71, "lng": 75.85,
     "score": 69, "startups": 850, "trend": "up",
     "sector_scores": {"fintech": 60, "saas": 62, "agritech": 72, "d2c": 70, "manufacturing": 75}},
    {"name": "Coimbatore", "state": "Tamil Nadu", "lat": 11.00, "lng": 76.96,
     "score": 72, "startups": 760, "trend": "up",
     "sector_scores": {"fintech": 60, "saas": 64, "agritech": 75, "d2c": 68, "manufacturing": 88}},
    {"name": "Surat", "state": "Gujarat", "lat": 21.17, "lng": 72.83,
     "score": 70, "startups": 720, "trend": "up",
     "sector_scores": {"fintech": 62, "saas": 58, "agritech": 65, "d2c": 78, "manufacturing": 88}},
]

# ---------------------------------------------------------------------------
# LOGISTICS DATA
# ---------------------------------------------------------------------------
LOGISTICS = {
    "Jaipur": {
        "score": 71, "recommendation": "Strong for road-based logistics via NH-48. Limited cold chain — use third-party cold storage. Inland Container Depot (ICD) available.",
        "metrics": [
            {"name": "Last-Mile Density", "value": 74, "unit": "Delhivery + Shadowfax"},
            {"name": "Supplier Proximity", "value": 82, "unit": "MSME Clusters Nearby"},
            {"name": "Highway Access", "value": 88, "unit": "NH-48 · NH-58"},
            {"name": "Port Distance", "value": 42, "unit": "700km to Mundra / Kandla"},
            {"name": "Cold Chain", "value": 38, "unit": "Limited availability"},
            {"name": "Cost vs Bangalore", "value": 78, "unit": "22% cheaper logistics"},
        ]
    },
    "Ahmedabad": {
        "score": 88, "recommendation": "Excellent logistics hub. Mundra Port corridor is highly efficient. MSME cluster density is highest after Surat.",
        "metrics": [
            {"name": "Last-Mile Density", "value": 88, "unit": "Strong courier network"},
            {"name": "Supplier Proximity", "value": 92, "unit": "MSME clusters excellent"},
            {"name": "Highway Access", "value": 90, "unit": "NH-48 · NH-27 · NH-8"},
            {"name": "Port Distance", "value": 85, "unit": "340km to Mundra Port"},
            {"name": "Cold Chain", "value": 72, "unit": "Adequate infrastructure"},
            {"name": "Cost vs Bangalore", "value": 85, "unit": "15% cheaper logistics"},
        ]
    },
    "Bangalore": {
        "score": 76, "recommendation": "Good last-mile density but high cost. Manufacturing logistics expensive — consider Tumkur for satellite operations. Nearest major sea port is Chennai.",
        "metrics": [
            {"name": "Last-Mile Density", "value": 92, "unit": "All major courier players"},
            {"name": "Supplier Proximity", "value": 65, "unit": "Moderate MSME presence"},
            {"name": "Highway Access", "value": 80, "unit": "NH-44 · NH-275"},
            {"name": "Port Distance", "value": 60, "unit": "340km to Chennai Port"},
            {"name": "Cold Chain", "value": 70, "unit": "Good availability"},
            {"name": "Cost vs Bangalore", "value": 50, "unit": "Baseline reference"},
        ]
    },
    "Mumbai": {
        "score": 88, "recommendation": "Unmatched sea freight access via JNPT (Nhava Sheva). Last-mile is highly crowded but effective. Warehousing costs are very high — consider Bhiwandi.",
        "metrics": [
            {"name": "Last-Mile Density", "value": 95, "unit": "Extensive 2W/3W EV network"},
            {"name": "Supplier Proximity", "value": 85, "unit": "Strong industrial corridors"},
            {"name": "Highway Access", "value": 86, "unit": "NH-48 · Mumbai-Pune Exp"},
            {"name": "Port Distance", "value": 95, "unit": "40km to JNPT Port (Nhava Sheva)"},
            {"name": "Cold Chain", "value": 90, "unit": "Excellent specialized cold chain"},
            {"name": "Cost vs Bangalore", "value": 40, "unit": "10% more expensive"},
        ]
    },
    "Delhi": {
        "score": 85, "recommendation": "Massive consumer market reach. Heavy reliance on ICDs (Tughlakabad, Garhi Harsaru) for DFM. Strong air freight via DEL.",
        "metrics": [
            {"name": "Last-Mile Density", "value": 94, "unit": "Highest volume hub"},
            {"name": "Supplier Proximity", "value": 88, "unit": "NCR MSME clusters"},
            {"name": "Highway Access", "value": 92, "unit": "NH-44 · NH-48 · Eastern Peripheral"},
            {"name": "Port Distance", "value": 55, "unit": "Dry Ports (ICD) / 1000km to Sea"},
            {"name": "Cold Chain", "value": 85, "unit": "Good availability (Sonipat/Panipat)"},
            {"name": "Cost vs Bangalore", "value": 65, "unit": "5% cheaper logistics"},
        ]
    },
    "Pune": {
        "score": 82, "recommendation": "Top-tier auto/manufacturing logistics. Direct expressway access to JNPT makes it a premier export hub with lower costs than Mumbai.",
        "metrics": [
            {"name": "Last-Mile Density", "value": 84, "unit": "Good urban coverage"},
            {"name": "Supplier Proximity", "value": 90, "unit": "World-class auto/heavy industry"},
            {"name": "Highway Access", "value": 88, "unit": "NH-48 · Mumbai-Pune Exp"},
            {"name": "Port Distance", "value": 82, "unit": "130km to JNPT Port"},
            {"name": "Cold Chain", "value": 68, "unit": "Moderate specialized storage"},
            {"name": "Cost vs Bangalore", "value": 72, "unit": "12% cheaper logistics"},
        ]
    },
    "Hyderabad": {
        "score": 80, "recommendation": "Centralized location makes it ideal for pan-India distribution. Pharma/Life Sciences cold chain is world-class. Coast access requires overland.",
        "metrics": [
            {"name": "Last-Mile Density", "value": 86, "unit": "Strong and growing quickly"},
            {"name": "Supplier Proximity", "value": 78, "unit": "Pharma and Electronics clusters"},
            {"name": "Highway Access", "value": 85, "unit": "NH-44 · NH-65"},
            {"name": "Port Distance", "value": 58, "unit": "380km to Krishnapatnam Port"},
            {"name": "Cold Chain", "value": 92, "unit": "Best-in-class Pharma cold chain"},
            {"name": "Cost vs Bangalore", "value": 70, "unit": "15% cheaper logistics"},
        ]
    }
}

# ---------------------------------------------------------------------------
# WORKFORCE DATA
# ---------------------------------------------------------------------------
WORKFORCE = {
    "Jaipur": {
        "Manufacturing": {
            "score": 77, "total": 12400, "avg_wage": 13800,
            "data_source": "Census 2011 · AISHE 2022 · NCVT MIS portal",
            "insight": "Strong ITI diploma workforce. Avg wages 35% lower than Pune/Bangalore.",
            "roles": [
                {"title": "Packaging Engineers", "density": 8.4, "wage": 18500, "hiring": "Campus + Job Fairs"},
                {"title": "Machine Operators", "density": 24.2, "wage": 11200, "hiring": "ITI Colleges, NCVT Portal"},
                {"title": "Quality Inspectors", "density": 12.8, "wage": 13500, "hiring": "LinkedIn, Word-of-Mouth"},
                {"title": "Logistics Supervisors", "density": 6.2, "wage": 16000, "hiring": "Job Portals"},
            ]
        },
        "SaaS": {
            "score": 55, "total": 2800, "avg_wage": 42000,
            "data_source": "AISHE 2022 · LinkedIn Insights",
            "insight": "Limited SaaS talent pool. Consider remote-first or Hyderabad hybrid.",
            "roles": [
                {"title": "Software Engineers", "density": 3.2, "wage": 45000, "hiring": "LinkedIn, Naukri"},
                {"title": "Data Scientists", "density": 1.1, "wage": 58000, "hiring": "Campus Placements"},
                {"title": "Product Managers", "density": 0.8, "wage": 62000, "hiring": "LinkedIn"},
            ]
        },
    },
    "Bangalore": {
        "SaaS": {
            "score": 95, "total": 185000, "avg_wage": 72000,
            "data_source": "AISHE 2022 · NASSCOM reports",
            "insight": "World-class tech talent. Plan for ₹70k-₹1.5L/month per engineer.",
            "roles": [
                {"title": "Software Engineers", "density": 42.5, "wage": 78000, "hiring": "LinkedIn, Referrals"},
                {"title": "Data Scientists", "density": 18.2, "wage": 95000, "hiring": "Campus, LinkedIn"},
                {"title": "Product Managers", "density": 12.4, "wage": 110000, "hiring": "Executive Search"},
            ]
        },
        "Manufacturing": {
            "score": 62, "total": 22000, "avg_wage": 24000,
            "data_source": "Census 2011 · NCVT MIS",
            "insight": "Manufacturing talent scarce and costly. Consider Tumkur or Mysore.",
            "roles": [
                {"title": "Machine Operators", "density": 8.2, "wage": 19000, "hiring": "Local Job Consultants"},
                {"title": "ITI Diploma Holders", "density": 5.4, "wage": 15000, "hiring": "ITI Colleges"},
            ]
        },
    },
}

# ---------------------------------------------------------------------------
# SURVIVAL / ACTIVITY DATA
# ---------------------------------------------------------------------------
SURVIVAL = {
    "Jaipur": {
        "sector": "Manufacturing", "survival_probability": 71,
        "risk_factors": ["Limited cold-chain infrastructure", "Competition from Gujarat clusters", "Working capital seasonality"],
        "strengths": ["Strong ITI graduate base", "Low rent vs Tier-1 cities", "State industrial incentives"],
        "similar_failed": ["CleanPack Jaipur (2021) — GSTIN inactive", "GreenWrap Industries (2020) — MCA Struck Off"],
        "radar": [
            {"subject": "Market Timing", "score": 78},
            {"subject": "Team Background", "score": 72},
            {"subject": "Location", "score": 80},
            {"subject": "Funding Stage", "score": 60},
            {"subject": "Sector Health", "score": 75},
            {"subject": "Competitor Density", "score": 82},
        ]
    },
    "Bangalore": {
        "sector": "SaaS", "survival_probability": 84,
        "risk_factors": ["High-cost talent market", "Intense funding competition", "Office space premium"],
        "strengths": ["Deep SaaS talent pool", "Active investor ecosystem", "Global market access"],
        "similar_failed": ["SaaSly (2022) — dilution issues", "CloudOps India (2021) — product-market fit"],
        "radar": [
            {"subject": "Market Timing", "score": 88},
            {"subject": "Team Background", "score": 90},
            {"subject": "Location", "score": 92},
            {"subject": "Funding Stage", "score": 82},
            {"subject": "Sector Health", "score": 95},
            {"subject": "Competitor Density", "score": 55},
        ]
    },
}

# ---------------------------------------------------------------------------
# ACTIVITY DATA
# ---------------------------------------------------------------------------
ACTIVITY = {
    "Jaipur": {
        "sector": "Manufacturing", "active": 47, "closures": 8, "new_2024": 14,
        "crowding_index": 0.38, "category": "Gold Rush", "dpiit": 42, "mca21": 47, "gst": 39,
        "closure_rate": 14.5,
        "top_companies": [
            {"name": "Jaipur Packaging Industries", "status": "Active", "year": 2019},
            {"name": "RajPack Solutions Pvt Ltd", "status": "Active", "year": 2021},
            {"name": "GreenWrap Industries", "status": "Struck Off", "year": 2020},
        ],
        "insight": "Low crowding index (0.38) — healthy, underserved market. Only 8 closures in 2 years vs national avg of 22%."
    },
    "Bangalore": {
        "sector": "SaaS", "active": 3840, "closures": 420, "new_2024": 680,
        "crowding_index": 1.42, "category": "Saturated", "dpiit": 3600, "mca21": 3840, "gst": 3200,
        "closure_rate": 9.8,
        "top_companies": [
            {"name": "Freshworks Inc", "status": "Active", "year": 2010},
            {"name": "Chargebee Technologies", "status": "Active", "year": 2011},
            {"name": "CloudSales India", "status": "Struck Off", "year": 2022},
        ],
        "insight": "High crowding index (1.42) — market saturated. Differentiation is critical. Consider Hyderabad or Pune."
    },
}

# ---------------------------------------------------------------------------
# DEMAND / FORECAST DATA
# ---------------------------------------------------------------------------
DEMAND = {
    "Jaipur": {
        "sector": "Manufacturing / Packaging", "cagr": 28, "horizon": 5,
        "seasonal": "Q4 peaks — festive season packaging demand",
        "policy": "PM-MITRA textile parks, PLI scheme for packaging",
        "survival_curve": {"y1": 88, "y2": 76, "y3": 64, "y5": 49},
        "forecast": [
            {"year": "2023", "gst": 1420, "trend": 1420},
            {"year": "2024", "gst": 1680, "trend": 1720},
            {"year": "2025", "gst": 2050, "trend": 2100},
            {"year": "2026", "gst": None, "trend": 2580},
            {"year": "2027", "gst": None, "trend": 3200},
            {"year": "2028", "gst": None, "trend": 3950},
        ]
    },
    "Bangalore": {
        "sector": "SaaS / Tech", "cagr": 18, "horizon": 5,
        "seasonal": "Q1 & Q3 enterprise sales cycles",
        "policy": "NASSCOM IT-BPM growth, India AI Mission",
        "survival_curve": {"y1": 92, "y2": 84, "y3": 75, "y5": 62},
        "forecast": [
            {"year": "2023", "gst": 8200, "trend": 8200},
            {"year": "2024", "gst": 9400, "trend": 9600},
            {"year": "2025", "gst": 11200, "trend": 11500},
            {"year": "2026", "gst": None, "trend": 13800},
            {"year": "2027", "gst": None, "trend": 16400},
            {"year": "2028", "gst": None, "trend": 19500},
        ]
    },
}

# ---------------------------------------------------------------------------
# LOCATION DATA
# ---------------------------------------------------------------------------
LOCATION = {
    "Jaipur": {
        "sector": "Manufacturing",
        "zones": [
            {
                "name": "Sitapura Industrial Area", "score": 84, "rent": 22,
                "zoning": "Industrial", "highway": "NH-48 (2km)",
                "supplier_proximity": "High — MSME cluster nearby",
                "talent_access": "Moderate — ITI colleges within 8km",
                "pros": ["Direct NH-48 access", "RIICO industrial plots available", "Power substation on-site"],
                "cons": ["Water supply intermittent", "Limited food options for workers"],
                "recommended": True
            },
            {
                "name": "Boranada Industrial Zone", "score": 76, "rent": 18,
                "zoning": "Industrial", "highway": "NH-11 (5km)",
                "supplier_proximity": "Moderate — textile suppliers nearby",
                "talent_access": "High — proximity to ITI colleges",
                "pros": ["Lower land cost", "Good labour pool", "Near textile base"],
                "cons": ["Flood risk in monsoon", "Older infrastructure"],
                "recommended": False
            },
        ]
    },
    "Ahmedabad": {
        "sector": "Manufacturing",
        "zones": [
            {
                "name": "Vatva GIDC", "score": 91, "rent": 29,
                "zoning": "Industrial", "highway": "NH-48 (3km)",
                "supplier_proximity": "Very High — chemical & textile clusters",
                "talent_access": "High",
                "pros": ["Established industrial estate", "Near Mundra port corridor", "Strong MSME network"],
                "cons": ["High pollution zone", "Rising property costs"],
                "recommended": True
            },
        ]
    },
    "Mumbai": {
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
            }
        ]
    },
    "Bangalore": {
        "sector": "SaaS / Tech",
        "zones": [
            {
                "name": "Electronic City", "score": 90, "rent": 65,
                "zoning": "IT SEZ / Commercial", "highway": "Hosur Road / Elevated Expy",
                "supplier_proximity": "High — Electronics & IT hardware",
                "talent_access": "Elite",
                "pros": ["Established SEZ benefits", "Large tech talent pool", "Good connectivity to Hosur"],
                "cons": ["Peak hour traffic", "Groundwater shortage"],
                "recommended": True
            },
            {
                "name": "Peenya Industrial Area", "score": 75, "rent": 35,
                "zoning": "Industrial", "highway": "NH-4 (Tumkur Road)",
                "supplier_proximity": "Very High — Asia's largest SME hub",
                "talent_access": "Moderate — Engineering/ITI focus",
                "pros": ["Massive supplier base", "Metro connectivity"],
                "cons": ["Severely congested", "Aging infrastructure"],
                "recommended": False
            }
        ]
    },
    "Delhi": {
        "sector": "D2C / SaaS",
        "zones": [
            {
                "name": "Cyber Hub / DLF Gurugram", "score": 93, "rent": 110,
                "zoning": "Commercial", "highway": "NH-48",
                "supplier_proximity": "Moderate — Tech & Services",
                "talent_access": "Elite",
                "pros": ["Premium ecosystem", "Metro/Rapid metro access", "Corporate networking"],
                "cons": ["High rent and CAM charges", "Pollution in winter"],
                "recommended": True
            },
            {
                "name": "Okhla Industrial Area", "score": 82, "rent": 45,
                "zoning": "Industrial / Commercial", "highway": "Mathura Road",
                "supplier_proximity": "High — Garments, electronics, packaging",
                "talent_access": "High — South Delhi proximity",
                "pros": ["Central location in NCR", "Good mix of factory/office"],
                "cons": ["Parking constraints", "Narrow lanes in older phases"],
                "recommended": True
            }
        ]
    },
    "Pune": {
        "sector": "SaaS / Auto",
        "zones": [
            {
                "name": "Hinjewadi IT Park", "score": 88, "rent": 55,
                "zoning": "IT SEZ", "highway": "Mumbai-Pune Expressway (2km)",
                "supplier_proximity": "Moderate",
                "talent_access": "Elite — Major IT hub",
                "pros": ["Dedicated IT infrastructure", "Proximity to Mumbai"],
                "cons": ["Legendary traffic jams", "Metro still under construction"],
                "recommended": True
            },
            {
                "name": "Chakan MIDC", "score": 94, "rent": 30,
                "zoning": "Industrial", "highway": "NH-60",
                "supplier_proximity": "Elite — Auto & Engineering hub",
                "talent_access": "High",
                "pros": ["World-class auto ecosystem", "Excellent MIDC infra", "Export friendly"],
                "cons": ["Distance from city center", "Public transport limited"],
                "recommended": True
            }
        ]
    },
    "Hyderabad": {
        "sector": "Pharma / SaaS",
        "zones": [
            {
                "name": "HITEC City / Madhapur", "score": 92, "rent": 68,
                "zoning": "Commercial / IT SEZ", "highway": "Outer Ring Road (ORR) near",
                "supplier_proximity": "Moderate",
                "talent_access": "Elite",
                "pros": ["World rate infra", "Excellent public transport/Metro", "Lower cost than Bangalore"],
                "cons": ["Rents rising rapidly", "Traffic during peak hours"],
                "recommended": True
            },
            {
                "name": "Genome Valley (Shamirpet)", "score": 95, "rent": 40,
                "zoning": "Specialized Industrial (Pharma/Biotech)", "highway": "State Highway 1",
                "supplier_proximity": "Elite — Pharma & Life Sciences",
                "talent_access": "High — Specialized science talent",
                "pros": ["Specialized labs & clean rooms", "Top global pharma presence"],
                "cons": ["Far from core city", "Niche strictly for life sciences"],
                "recommended": True
            }
        ]
    }
}

# ---------------------------------------------------------------------------
# INVESTORS DATA
# ---------------------------------------------------------------------------
INVESTORS = [
    {"id": 1, "name": "Blume Ventures", "focus": ["Manufacturing", "D2C", "SaaS"], "cities": ["Mumbai", "Bangalore"], "stage": "Seed - Series A", "cheque": "₹1-5 Cr", "tier": "Tier 1 VC"},
    {"id": 2, "name": "Stellaris Venture Partners", "focus": ["Deep Tech", "SaaS", "Manufacturing"], "cities": ["Bangalore", "Pune"], "stage": "Seed - Series B", "cheque": "₹2-15 Cr", "tier": "Tier 1 VC"},
    {"id": 3, "name": "Rajasthan Angels Network", "focus": ["Manufacturing", "Agritech", "D2C"], "cities": ["Jaipur", "Jodhpur"], "stage": "Pre-seed - Seed", "cheque": "₹25L-2 Cr", "tier": "Angel Network"},
    {"id": 4, "name": "India Quotient", "focus": ["D2C", "Consumer", "Fintech"], "cities": ["Mumbai", "Bangalore"], "stage": "Seed", "cheque": "₹1-3 Cr", "tier": "Tier 1 VC"},
    {"id": 5, "name": "Accel India", "focus": ["SaaS", "Fintech", "EdTech"], "cities": ["Bangalore", "Delhi"], "stage": "Series A - B", "cheque": "₹10-50 Cr", "tier": "Top VC", "overexposed": True},
    {"id": 6, "name": "Sequoia Surge", "focus": ["SaaS", "Consumer", "Fintech"], "cities": ["Bangalore", "Mumbai"], "stage": "Pre-seed - Seed", "cheque": "₹1-10 Cr", "tier": "Accelerator"},
    {"id": 7, "name": "Avaana Capital", "focus": ["Climate Tech", "Agritech", "Manufacturing"], "cities": ["Bangalore", "Ahmedabad"], "stage": "Seed - Series A", "cheque": "₹2-10 Cr", "tier": "Thematic VC"},
    {"id": 8, "name": "Titan Capital", "focus": ["D2C", "Consumer", "SaaS"], "cities": ["Mumbai", "Bangalore", "Delhi"], "stage": "Pre-seed - Seed", "cheque": "₹50L-5 Cr", "tier": "Angel / Family Office"},
]

# ---------------------------------------------------------------------------
# REGULATORY PULSE DATA  (PIB feed simulation)
# ---------------------------------------------------------------------------
REGULATORY_PULSE = [
    {"tag": "EV", "impact": "High", "title": "FAME-III Subsidy — ₹10,900 Cr allocated for EV manufacturers", "summary": "Direct impact on EV startup sector. Manufacturing incentives renewed for 3 years.", "published": "48h ago", "source": "pib.gov.in"},
    {"tag": "SaaS", "impact": "Medium", "title": "DPIIT Startup India tax holiday extended for SaaS-first companies", "summary": "3-year income tax exemption extended to include cloud-native SaaS startups.", "published": "1 day ago", "source": "startupindia.gov.in"},
    {"tag": "Manufacturing", "impact": "High", "title": "PLI Scheme 2.0 — ₹35,000 Cr for advanced manufacturing clusters in Tier-2 cities", "summary": "14 sectors covered. Jaipur and Indore identified as priority cities.", "published": "5 days ago", "source": "pib.gov.in"},
    {"tag": "AgriTech", "impact": "Low", "title": "Agricultural export policy updated — minor tariff adjustment for processed food startups", "summary": "New tariff bands announced. Marginal impact on food processing startups.", "published": "1 week ago", "source": "apeda.gov.in"},
    {"tag": "Fintech", "impact": "High", "title": "RBI releases sandbox framework for AI-powered lending startups", "summary": "New regulatory sandbox allows fintech startups to test AI credit models with real data.", "published": "2 days ago", "source": "rbi.org.in"},
    {"tag": "D2C", "impact": "Medium", "title": "ONDC expands to 100+ cities — major opportunity for D2C brands", "summary": "Open Network for Digital Commerce now live in 107 cities with logistics integration.", "published": "3 days ago", "source": "ondc.org"},
]

# ---------------------------------------------------------------------------
# COMPETITION DATA
# ---------------------------------------------------------------------------
COMPETITION = {
    "Jaipur_Manufacturing": [
        {"name": "RajPack Solutions", "city": "Jaipur", "threat_score": 62, "funding": "Bootstrapped", "founded": 2021, "strength": "Local distribution", "weakness": "No automation", "mca_status": "Active"},
        {"name": "PackIndia Ltd", "city": "Ahmedabad", "threat_score": 81, "funding": "₹12 Cr Series A", "founded": 2019, "strength": "Scale + brand", "weakness": "High burn", "mca_status": "Active"},
        {"name": "GreenBox Mfg", "city": "Surat", "threat_score": 55, "funding": "₹2 Cr Seed", "founded": 2022, "strength": "Eco-focus", "weakness": "Narrow market", "mca_status": "Active"},
        {"name": "SwiftPack Co", "city": "Delhi", "threat_score": 74, "funding": "₹6 Cr Seed", "founded": 2020, "strength": "Tech-enabled", "weakness": "North India only", "mca_status": "Active"},
    ],
    "Bangalore_SaaS": [
        {"name": "Freshworks", "city": "Chennai", "threat_score": 95, "funding": "NASDAQ Listed", "founded": 2010, "strength": "Global scale", "weakness": "Enterprise focus", "mca_status": "Active"},
        {"name": "Chargebee", "city": "Bangalore", "threat_score": 88, "funding": "$250M Series H", "founded": 2011, "strength": "Billing vertical", "weakness": "SMB only", "mca_status": "Active"},
        {"name": "Zoho Corp", "city": "Chennai", "threat_score": 90, "funding": "Bootstrapped", "founded": 1996, "strength": "Full suite", "weakness": "Legacy UX", "mca_status": "Active"},
    ],
}

# ---------------------------------------------------------------------------
# CITY PLANNER DATA
# ---------------------------------------------------------------------------
CITY_PLANNER = {
    "Jaipur": {
        "migration": [
            {"sector": "SaaS", "leaving_pct": 68, "reason": "Talent scarcity and weak investor ecosystem"},
            {"sector": "Fintech", "leaving_pct": 54, "reason": "Regulatory access slower than Mumbai"},
            {"sector": "D2C", "leaving_pct": 31, "reason": "Premium fulfilment logistics gap"},
            {"sector": "Manufacturing", "leaving_pct": 12, "reason": "Strong local incentive schemes"},
        ],
        "infra_gaps": [
            {"metric": "Cold Chain Density", "gap_score": 62, "impact": "High", "sectors_lost": "AgriTech, Food & Bev"},
            {"metric": "MSME Co-working Zones", "gap_score": 45, "impact": "Medium", "sectors_lost": "D2C, Creative"},
            {"metric": "IT Park Availability", "gap_score": 38, "impact": "High", "sectors_lost": "SaaS, Deeptech"},
            {"metric": "Fiber Broadband Coverage", "gap_score": 22, "impact": "Low", "sectors_lost": "EdTech, Fintech"},
        ],
        "policy_recs": [
            "Prioritize cold-chain infrastructure in Phase II industrial zones to stop AgriTech migration.",
            "Introduce co-working MSME zone policy: 5-year tax holidays to attract SaaS and D2C founders.",
            "Partner with NHAI for last-mile logistics upgrade — boosts investor confidence by ~23%.",
            "Launch 'Startup City' fast-track GSTIN + DPIIT recognition portal — reduce time-to-operational from 45 to 9 days.",
        ]
    },
    "Bangalore": {
        "migration": [
            {"sector": "Manufacturing", "leaving_pct": 82, "reason": "High real estate and power costs"},
            {"sector": "AgriTech", "leaving_pct": 71, "reason": "Distance from farmlands; poor last-mile"},
            {"sector": "D2C", "leaving_pct": 45, "reason": "Warehousing costs 3x vs Tier-2 cities"},
        ],
        "infra_gaps": [
            {"metric": "Affordable Housing Belt", "gap_score": 78, "impact": "High", "sectors_lost": "All (talent flight)"},
            {"metric": "Tier-2 Overflow Infrastructure", "gap_score": 55, "impact": "High", "sectors_lost": "Manufacturing"},
            {"metric": "Water Supply for Industrial Units", "gap_score": 40, "impact": "Medium", "sectors_lost": "Manufacturing, Biotech"},
        ],
        "policy_recs": [
            "Create affordable housing corridors in Whitefield and Electronic City to reduce talent flight.",
            "Develop satellite industrial zones in Tumkur and Mysore with fast-track permits.",
            "Subsidize water supply for biotech and pharmaceutical manufacturing units.",
            "Partner with Tier-2 cities in Karnataka for startup de-concentration incentive scheme.",
        ]
    },
}
