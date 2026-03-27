import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to dynamically change the map view when city coordinates change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Genuine geographical coordinates for major Indian startup hubs based on online data mapping
const GENUINE_ZONES = {
  Bangalore: {
    supply: [ // IT Parks, Tech Hubs
      { name: "Koramangala", center: [12.9279, 77.6271], radius: 2500 },
      { name: "HSR Layout", center: [12.9121, 77.6446], radius: 2800 },
      { name: "Whitefield", center: [12.9698, 77.7500], radius: 4000 },
      { name: "Electronic City", center: [12.8399, 77.6770], radius: 3500 }
    ],
    demand: [ // Residential density, Universities, High Consumption
      { name: "Indiranagar", center: [12.9784, 77.6408], radius: 2200 },
      { name: "Jayanagar", center: [12.9299, 77.5826], radius: 3000 },
      { name: "Marathahalli", center: [12.9569, 77.7011], radius: 2500 }
    ]
  },
  Mumbai: {
    supply: [
      { name: "Powai (IIT Bombay)", center: [19.1176, 72.9060], radius: 2500 },
      { name: "BKC", center: [19.0607, 72.8644], radius: 2000 },
      { name: "MIDC Andheri", center: [19.1136, 72.8697], radius: 2500 }
    ],
    demand: [
      { name: "Bandra West", center: [19.0596, 72.8295], radius: 2000 },
      { name: "Navi Mumbai", center: [19.0330, 73.0297], radius: 4500 },
      { name: "Thane", center: [19.2183, 72.9781], radius: 3800 }
    ]
  },
  Delhi: {
    supply: [
      { name: "Cyber Hub Gurgaon", center: [28.4950, 77.0895], radius: 3500 },
      { name: "Noida Sector 62", center: [28.6208, 77.3639], radius: 3000 },
      { name: "Okhla", center: [28.5222, 77.2843], radius: 2500 }
    ],
    demand: [
      { name: "South Extension", center: [28.5684, 77.2195], radius: 2000 },
      { name: "Vasant Kunj", center: [28.5293, 77.1539], radius: 2800 },
      { name: "Dwarka", center: [28.5823, 77.0500], radius: 3500 }
    ]
  },
  Pune: {
    supply: [
      { name: "Hinjewadi", center: [18.5913, 73.7389], radius: 4000 },
      { name: "Magarpatta", center: [18.5158, 73.9272], radius: 2500 },
      { name: "Kharadi", center: [18.5515, 73.9348], radius: 2200 }
    ],
    demand: [
      { name: "Koregaon Park", center: [18.5362, 73.8969], radius: 1800 },
      { name: "Kothrud", center: [18.5074, 73.8077], radius: 3000 },
      { name: "Viman Nagar", center: [18.5670, 73.9142], radius: 2000 }
    ]
  },
  Hyderabad: {
    supply: [
      { name: "HITEC City", center: [17.4435, 78.3776], radius: 3000 },
      { name: "Gachibowli", center: [17.4401, 78.3489], radius: 3500 },
      { name: "Madhapur", center: [17.4483, 78.3915], radius: 2000 }
    ],
    demand: [
      { name: "Jubilee Hills", center: [17.4326, 78.4071], radius: 2500 },
      { name: "Banjara Hills", center: [17.4156, 78.4347], radius: 2200 },
      { name: "Kukatpally", center: [17.4849, 78.4069], radius: 3000 }
    ]
  },
  Ahmedabad: {
    supply: [
      { name: "GIFT City", center: [23.1610, 72.6841], radius: 3500 },
      { name: "SG Highway", center: [23.0336, 72.5050], radius: 3000 },
      { name: "Vatva GIDC", center: [22.9510, 72.6105], radius: 4000 }
    ],
    demand: [
      { name: "Prahlad Nagar", center: [23.0120, 72.5108], radius: 2000 },
      { name: "Navrangpura", center: [23.0360, 72.5484], radius: 2200 },
      { name: "Bopal", center: [23.0315, 72.4632], radius: 2500 }
    ]
  },
  Chennai: {
    supply: [
      { name: "Taramani/OMR", center: [12.9863, 80.2432], radius: 3500 },
      { name: "Guindy", center: [13.0067, 80.2206], radius: 2500 },
      { name: "Siruseri", center: [12.8286, 80.2185], radius: 3000 }
    ],
    demand: [
      { name: "Adyar", center: [13.0012, 80.2565], radius: 2000 },
      { name: "T Nagar", center: [13.0418, 80.2341], radius: 2200 },
      { name: "Velachery", center: [12.9815, 80.2180], radius: 2500 }
    ]
  },
  Jaipur: {
    supply: [
      { name: "Sitapura Industrial", center: [26.7606, 75.8340], radius: 4500 },
      { name: "Malviya Nagar", center: [26.8549, 75.8243], radius: 2500 },
      { name: "VKIA", center: [26.9691, 75.7831], radius: 3500 }
    ],
    demand: [
      { name: "Mansarovar", center: [26.8549, 75.7603], radius: 3500 },
      { name: "C-Scheme", center: [26.9075, 75.8041], radius: 1800 },
      { name: "Vaishali Nagar", center: [26.9069, 75.7423], radius: 2800 }
    ]
  },
  Kochi: {
    supply: [
      { name: "Kakkanad (Infopark)", center: [10.0159, 76.3419], radius: 3000 },
      { name: "Kalamassery", center: [10.0475, 76.3155], radius: 2500 }
    ],
    demand: [
      { name: "Edappally", center: [10.0261, 76.3125], radius: 2200 },
      { name: "Vyttila", center: [9.9669, 76.3188], radius: 2500 }
    ]
  },
  Coimbatore: {
    supply: [
      { name: "Peelamedu", center: [11.0264, 76.9961], radius: 2500 },
      { name: "Saravanampatti", center: [11.0827, 76.9930], radius: 3000 }
    ],
    demand: [
      { name: "RS Puram", center: [11.0094, 76.9472], radius: 2000 },
      { name: "Gandhipuram", center: [11.0183, 76.9654], radius: 2200 }
    ]
  }
};

export default function CityMap({ city, allCities }) {
  // Find coordinates from the fetched allCities list or fallback
  const cityData = allCities.find(c => c.name === city);
  
  // Default coordinates (e.g. Jaipur if not found)
  const lat = cityData?.lat || 26.9124;
  const lng = cityData?.lng || 75.7873;

  // Colors based on the legend
  const DEMAND_COLOR = '#85adff'; // var(--primary)
  const SUPPLY_COLOR = '#69f6b8'; // var(--secondary)

  // Get genuine zones or fallback to deterministic offset
  const genuineCity = GENUINE_ZONES[city];
  
  let demandZones = [];
  let supplyZones = [];

  if (genuineCity) {
    demandZones = genuineCity.demand;
    supplyZones = genuineCity.supply;
  } else {
    // Generate deterministic offsets for unknown cities based on city score
    const seed = (cityData?.score || 50) * 0.001;
    demandZones = [
      { name: "Demand Zone 1", center: [lat + seed, lng - seed * 1.5], radius: 3200 },
      { name: "Demand Zone 2", center: [lat - seed * 0.8, lng + seed * 1.8], radius: 2100 },
      { name: "Demand Zone 3", center: [lat - seed * 1.2, lng - seed], radius: 4500 },
    ];
    supplyZones = [
      { name: "Supply Zone A", center: [lat + seed * 1.4, lng + seed], radius: 2800 },
      { name: "Supply Zone B", center: [lat - seed * 0.5, lng - seed * 2], radius: 3600 },
      { name: "Supply Zone C", center: [lat + seed * 0.6, lng + seed * 2.5], radius: 1900 },
    ];
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer 
        center={[lat, lng]} 
        zoom={11} 
        zoomControl={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%', background: '#0a0a0a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />
        
        {/* Render Demand Zones */}
        {demandZones.map((zone, idx) => (
          <Circle
            key={`demand-${city}-${idx}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{ fillColor: DEMAND_COLOR, color: DEMAND_COLOR, fillOpacity: 0.25, weight: 1.5 }}
          >
            <Tooltip>{zone.name} (Demand)</Tooltip>
          </Circle>
        ))}

        {/* Render Supply Zones */}
        {supplyZones.map((zone, idx) => (
          <Circle
            key={`supply-${city}-${idx}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{ fillColor: SUPPLY_COLOR, color: SUPPLY_COLOR, fillOpacity: 0.25, weight: 1.5 }}
          >
             <Tooltip>{zone.name} (Supply)</Tooltip>
          </Circle>
        ))}

        <ChangeView center={[lat, lng]} zoom={11} />
      </MapContainer>
    </div>
  );
}
