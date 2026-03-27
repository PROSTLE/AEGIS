"""Routes for Logistics and Supply Chain Analysis"""
from fastapi import APIRouter, HTTPException
from app.schemas import LogisticsScoreResponse
from typing import Dict, Any

router = APIRouter(prefix="/api/logistics", tags=["logistics"])

# Logistics data for major Indian cities
# Scores based on: last-mile density, supplier proximity, highway access,
# port distance, cold chain availability, and cost index
CITY_LOGISTICS: Dict[str, Dict[str, Any]] = {
    "bangalore": {
        "overall_score": 83,
        "delivery_density": 92,
        "supplier_proximity": 80,
        "port_highway_access": 78,
        "cold_chain_availability": 75,
        "metrics": [
            {"name": "Last-Mile Density", "value": 92, "unit": "Delhivery + Shadowfax + Dunzo"},
            {"name": "Supplier Proximity", "value": 80, "unit": "Electronics & apparel MSMEs"},
            {"name": "Highway Access", "value": 85, "unit": "NH-44 · NH-48 · NH-75"},
            {"name": "Port Distance", "value": 52, "unit": "340km to Chennai Port"},
            {"name": "Cold Chain", "value": 75, "unit": "Strong pharma cold chain"},
            {"name": "Cost vs Bangalore", "value": 100, "unit": "Benchmark city"},
        ],
        "recommendation": "India's premier logistics hub for tech and D2C. Excellent last-mile network. Nearest port Chennai is 340km — plan air freight for time-sensitive exports. Cold chain well-developed for pharma/biotech.",
    },
    "mumbai": {
        "overall_score": 95,
        "delivery_density": 95,
        "supplier_proximity": 90,
        "port_highway_access": 98,
        "cold_chain_availability": 88,
        "metrics": [
            {"name": "Last-Mile Density", "value": 95, "unit": "Highest courier network density"},
            {"name": "Supplier Proximity", "value": 90, "unit": "APMC + Dharavi clusters"},
            {"name": "Highway Access", "value": 92, "unit": "NH-48 · NH-66 · NH-160"},
            {"name": "Port Distance", "value": 98, "unit": "JNPT Port in city (~25km)"},
            {"name": "Cold Chain", "value": 88, "unit": "Best cold chain in India"},
            {"name": "Cost vs Bangalore", "value": 60, "unit": "40% more expensive logistics"},
        ],
        "recommendation": "India's #1 logistics hub. JNPT handles 55% of India's container traffic. Excellent for exports. High costs due to real estate — consider Bhiwandi/Pune for warehousing.",
    },
    "delhi": {
        "overall_score": 82,
        "delivery_density": 90,
        "supplier_proximity": 85,
        "port_highway_access": 80,
        "cold_chain_availability": 78,
        "metrics": [
            {"name": "Last-Mile Density", "value": 90, "unit": "Amazon, Flipkart hubs nearby"},
            {"name": "Supplier Proximity", "value": 85, "unit": "Karol Bagh + Okhla industrial"},
            {"name": "Highway Access", "value": 88, "unit": "NH-44 · NH-48 · NH-9"},
            {"name": "Port Distance", "value": 40, "unit": "1400km to nearest coast"},
            {"name": "Cold Chain", "value": 78, "unit": "APMC cold storage network"},
            {"name": "Cost vs Bangalore", "value": 85, "unit": "15% cheaper logistics"},
        ],
        "recommendation": "Best for North India distribution. Landlocked — high freight cost for coastal exports. Strong for D2C and pan-India distribution via NH-44 corridor. ICD Tughlakabad handles inland container movement.",
    },
    "pune": {
        "overall_score": 85,
        "delivery_density": 85,
        "supplier_proximity": 88,
        "port_highway_access": 88,
        "cold_chain_availability": 72,
        "metrics": [
            {"name": "Last-Mile Density", "value": 85, "unit": "Strong Flipkart/Amazon presence"},
            {"name": "Supplier Proximity", "value": 88, "unit": "Auto + electronics MSMEs"},
            {"name": "Highway Access", "value": 92, "unit": "NH-48 · NH-65 · NH-60"},
            {"name": "Port Distance", "value": 78, "unit": "170km to JNPT Mumbai"},
            {"name": "Cold Chain", "value": 72, "unit": "Growing pharma network"},
            {"name": "Cost vs Bangalore", "value": 90, "unit": "10% cheaper logistics"},
        ],
        "recommendation": "Ideal mix of Mumbai port access and lower costs. NH-48 connects to JNPT in ~3 hours. Strong automotive supply chain. Growing pharma exports. Chakan MIDC is a top industrial zone.",
    },
    "hyderabad": {
        "overall_score": 78,
        "delivery_density": 82,
        "supplier_proximity": 75,
        "port_highway_access": 72,
        "cold_chain_availability": 70,
        "metrics": [
            {"name": "Last-Mile Density", "value": 82, "unit": "Ecom Express + DTDC strong"},
            {"name": "Supplier Proximity", "value": 75, "unit": "Pharma + IT supply chain"},
            {"name": "Highway Access", "value": 80, "unit": "NH-44 · NH-65 · NH-163"},
            {"name": "Port Distance", "value": 55, "unit": "600km to Kakinada / Vizag"},
            {"name": "Cold Chain", "value": 70, "unit": "Pharma cold chain growing"},
            {"name": "Cost vs Bangalore", "value": 88, "unit": "12% cheaper logistics"},
        ],
        "recommendation": "Strong for pharma and biotech supply chains. Inland location increases export costs — Visakhapatnam port 600km. Excellent road connectivity via NH-44. HMDA logistics parks developing rapidly.",
    },
    "ahmedabad": {
        "overall_score": 88,
        "delivery_density": 88,
        "supplier_proximity": 92,
        "port_highway_access": 90,
        "cold_chain_availability": 72,
        "metrics": [
            {"name": "Last-Mile Density", "value": 88, "unit": "Strong courier network"},
            {"name": "Supplier Proximity", "value": 92, "unit": "MSME clusters excellent"},
            {"name": "Highway Access", "value": 90, "unit": "NH-48 · NH-27 · NH-8"},
            {"name": "Port Distance", "value": 85, "unit": "120km to Mundra Port"},
            {"name": "Cold Chain", "value": 72, "unit": "Adequate infrastructure"},
            {"name": "Cost vs Bangalore", "value": 85, "unit": "30% cheaper logistics"},
        ],
        "recommendation": "Excellent logistics hub for manufacturing. Proximate to Mundra Port for exports. MSME cluster density is highest after Surat. Gujarat's road infrastructure is among the best in India.",
    },
    "chennai": {
        "overall_score": 87,
        "delivery_density": 85,
        "supplier_proximity": 82,
        "port_highway_access": 95,
        "cold_chain_availability": 78,
        "metrics": [
            {"name": "Last-Mile Density", "value": 85, "unit": "Good courier penetration"},
            {"name": "Supplier Proximity", "value": 82, "unit": "Auto + electronics clusters"},
            {"name": "Highway Access", "value": 90, "unit": "NH-44 · NH-48 · NH-532"},
            {"name": "Port Distance", "value": 98, "unit": "Chennai Port in city"},
            {"name": "Cold Chain", "value": 78, "unit": "Fish export cold chain strong"},
            {"name": "Cost vs Bangalore", "value": 88, "unit": "12% cheaper logistics"},
        ],
        "recommendation": "Major port city with excellent export connectivity. Chennai Port and Ennore Port handle automobiles and containers. Strong for manufacturing exports. Auto corridor via NH-48 is world-class.",
    },
    "kolkata": {
        "overall_score": 75,
        "delivery_density": 80,
        "supplier_proximity": 72,
        "port_highway_access": 82,
        "cold_chain_availability": 65,
        "metrics": [
            {"name": "Last-Mile Density", "value": 80, "unit": "Strong eastern India hub"},
            {"name": "Supplier Proximity", "value": 72, "unit": "Textile + jute MSMEs"},
            {"name": "Highway Access", "value": 78, "unit": "NH-12 · NH-16 · NH-112"},
            {"name": "Port Distance", "value": 88, "unit": "Kolkata & Haldia Port in city"},
            {"name": "Cold Chain", "value": 65, "unit": "Limited but improving"},
            {"name": "Cost vs Bangalore", "value": 82, "unit": "18% cheaper logistics"},
        ],
        "recommendation": "Gateway to Northeast India and Bangladesh. Kolkata Port connects to Southeast Asia. Aging infrastructure but improving under Smart City Mission. Strong for textile and jute exports.",
    },
    "jaipur": {
        "overall_score": 71,
        "delivery_density": 74,
        "supplier_proximity": 82,
        "port_highway_access": 72,
        "cold_chain_availability": 38,
        "metrics": [
            {"name": "Last-Mile Density", "value": 74, "unit": "Delhivery + Shadowfax"},
            {"name": "Supplier Proximity", "value": 82, "unit": "MSME Clusters Nearby"},
            {"name": "Highway Access", "value": 88, "unit": "NH-48 · NH-58"},
            {"name": "Port Distance", "value": 42, "unit": "285km to Mundra Port"},
            {"name": "Cold Chain", "value": 38, "unit": "Limited availability"},
            {"name": "Cost vs Bangalore", "value": 78, "unit": "22% cheaper logistics"},
        ],
        "recommendation": "Strong for road-based logistics to North & West India via NH-48. Limited cold chain capability — plan for third-party cold storage. Mundra port access is 4-5 hours, suitable for exports.",
    },
    "coimbatore": {
        "overall_score": 74,
        "delivery_density": 72,
        "supplier_proximity": 85,
        "port_highway_access": 70,
        "cold_chain_availability": 68,
        "metrics": [
            {"name": "Last-Mile Density", "value": 72, "unit": "Delhivery + Xpressbees"},
            {"name": "Supplier Proximity", "value": 85, "unit": "Textile + pump MSMEs dense"},
            {"name": "Highway Access", "value": 78, "unit": "NH-47 · NH-544 · NH-83"},
            {"name": "Port Distance", "value": 58, "unit": "200km to Kochi / Tuticorin"},
            {"name": "Cold Chain", "value": 68, "unit": "Agri cold chain adequate"},
            {"name": "Cost vs Bangalore", "value": 82, "unit": "18% cheaper logistics"},
        ],
        "recommendation": "Manufacturing powerhouse with excellent MSME supplier proximity. Nearest ports are Kochi (200km) and Tuticorin (180km). NH-544 connects efficiently. Strong for textile and pumps export.",
    },
    "kochi": {
        "overall_score": 80,
        "delivery_density": 75,
        "supplier_proximity": 70,
        "port_highway_access": 92,
        "cold_chain_availability": 82,
        "metrics": [
            {"name": "Last-Mile Density", "value": 75, "unit": "Decent regional coverage"},
            {"name": "Supplier Proximity", "value": 70, "unit": "Spice & seafood clusters"},
            {"name": "Highway Access", "value": 85, "unit": "NH-66 · NH-544 · NH-85"},
            {"name": "Port Distance", "value": 98, "unit": "Kochi Port in city"},
            {"name": "Cold Chain", "value": 82, "unit": "Seafood export cold chain"},
            {"name": "Cost vs Bangalore", "value": 80, "unit": "20% cheaper logistics"},
        ],
        "recommendation": "Strategic port city for seafood and spice exports. Vallarpadam terminal handles containers. Strong cold chain for perishables. NH-66 coastal highway ideal for South India distribution.",
    },
    "chandigarh": {
        "overall_score": 68,
        "delivery_density": 70,
        "supplier_proximity": 65,
        "port_highway_access": 75,
        "cold_chain_availability": 58,
        "metrics": [
            {"name": "Last-Mile Density", "value": 70, "unit": "Moderate regional coverage"},
            {"name": "Supplier Proximity", "value": 65, "unit": "Limited MSME clusters"},
            {"name": "Highway Access", "value": 82, "unit": "NH-44 · NH-5 · NH-7"},
            {"name": "Port Distance", "value": 35, "unit": "1200km+ to any coast"},
            {"name": "Cold Chain", "value": 58, "unit": "Agri produce cold chain"},
            {"name": "Cost vs Bangalore", "value": 80, "unit": "20% cheaper logistics"},
        ],
        "recommendation": "Good for Punjab/Haryana/HP distribution. Deep inland — high sea freight costs. Proximity to Delhi (250km) partially offsets port distance. Agri produce supply chain is a strength.",
    },
    "indore": {
        "overall_score": 70,
        "delivery_density": 72,
        "supplier_proximity": 70,
        "port_highway_access": 68,
        "cold_chain_availability": 62,
        "metrics": [
            {"name": "Last-Mile Density", "value": 72, "unit": "Growing courier network"},
            {"name": "Supplier Proximity", "value": 70, "unit": "Pharma + textile MSMEs"},
            {"name": "Highway Access", "value": 75, "unit": "NH-52 · NH-347 · NH-52A"},
            {"name": "Port Distance", "value": 45, "unit": "800km to Mumbai / Mundra"},
            {"name": "Cold Chain", "value": 62, "unit": "Soybean agri cold chain"},
            {"name": "Cost vs Bangalore", "value": 85, "unit": "15% cheaper logistics"},
        ],
        "recommendation": "Central India distribution hub. Good for pan-India reach but high port freight costs. MP government's logistics parks are improving infrastructure. Pharma cluster growing rapidly.",
    },
    "nagpur": {
        "overall_score": 72,
        "delivery_density": 70,
        "supplier_proximity": 65,
        "port_highway_access": 82,
        "cold_chain_availability": 60,
        "metrics": [
            {"name": "Last-Mile Density", "value": 70, "unit": "Ecom Express strong here"},
            {"name": "Supplier Proximity", "value": 65, "unit": "Orange belt agri cluster"},
            {"name": "Highway Access", "value": 90, "unit": "NH-44 · NH-7 · Zero Mile"},
            {"name": "Port Distance", "value": 48, "unit": "700km to Mumbai / Vizag"},
            {"name": "Cold Chain", "value": 60, "unit": "Orange export cold chain"},
            {"name": "Cost vs Bangalore", "value": 82, "unit": "18% cheaper logistics"},
        ],
        "recommendation": "Zero Mile City — geographic centre of India makes it ideal for pan-India distribution. NH-44 crosses here. High trucking costs to ports offset by central location savings. Multimodal logistics hub potential.",
    },
    "vadodara": {
        "overall_score": 78,
        "delivery_density": 76,
        "supplier_proximity": 80,
        "port_highway_access": 85,
        "cold_chain_availability": 65,
        "metrics": [
            {"name": "Last-Mile Density", "value": 76, "unit": "Good Gujarat coverage"},
            {"name": "Supplier Proximity", "value": 80, "unit": "Chemical + engineering MSMEs"},
            {"name": "Highway Access", "value": 88, "unit": "NH-48 · Delhi-Mumbai corridor"},
            {"name": "Port Distance", "value": 80, "unit": "200km to Mundra / Hazira"},
            {"name": "Cold Chain", "value": 65, "unit": "Adequate for pharma"},
            {"name": "Cost vs Bangalore", "value": 88, "unit": "12% cheaper logistics"},
        ],
        "recommendation": "Strong chemicals and engineering supply chain. NH-48 Delhi-Mumbai Industrial Corridor passes through. Mundra Port 200km via expressway. Hazira port even closer at ~90km. Competitive logistics costs.",
    },
}


def _get_city_data(city_name: str) -> Dict[str, Any]:
    key = city_name.lower().strip()
    if key not in CITY_LOGISTICS:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found. Available cities: {', '.join(CITY_LOGISTICS.keys())}")
    return CITY_LOGISTICS[key]


@router.get("/cities")
async def list_cities():
    """List all cities with their overall logistics score"""
    return {
        "cities": [
            {"city": k.title(), "overall_score": v["overall_score"]}
            for k, v in CITY_LOGISTICS.items()
        ]
    }


@router.get("/city/{city_name}")
async def get_logistics_score(city_name: str) -> LogisticsScoreResponse:
    """Get logistics and supply chain score for a city"""
    data = _get_city_data(city_name)
    return LogisticsScoreResponse(
        overall_score=data["overall_score"],
        delivery_density=data["delivery_density"],
        supplier_proximity=data["supplier_proximity"],
        port_highway_access=data["port_highway_access"],
        cold_chain_availability=data["cold_chain_availability"],
    )


@router.get("/city/{city_name}/breakdown")
async def get_logistics_breakdown(city_name: str):
    """Get detailed logistics breakdown for a city"""
    data = _get_city_data(city_name)
    return {
        "city": city_name.title(),
        "overall_score": data["overall_score"],
        "metrics": data["metrics"],
        "recommendation": data["recommendation"],
        "chart_data": [
            {"name": m["name"].replace("Last-Mile Density", "Last-Mile").replace(" Proximity", "").replace(" Access", "").replace(" Availability", "").replace("Cost vs Bangalore", "Cost Index"),
             "score": m["value"]}
            for m in data["metrics"]
        ],
    }

