import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { apiClient, endpoints } from '../services/api'

const LOGISTICS_DATA = {
  Bangalore: {
    score: 83,
    metrics: [
      { name: 'Last-Mile Density', value: 92, unit: 'Delhivery + Shadowfax + Dunzo' },
      { name: 'Supplier Proximity', value: 80, unit: 'Electronics & apparel MSMEs' },
      { name: 'Highway Access', value: 85, unit: 'NH-44 · NH-48 · NH-75' },
      { name: 'Port Distance', value: 52, unit: '340km to Chennai Port' },
      { name: 'Cold Chain', value: 75, unit: 'Strong pharma cold chain' },
      { name: 'Cost vs Bangalore', value: 100, unit: 'Benchmark city' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 92 }, { name: 'Supplier', score: 80 }, { name: 'Highway', score: 85 },
      { name: 'Port', score: 52 }, { name: 'Cold Chain', score: 75 }, { name: 'Cost Index', score: 100 },
    ],
    recommendation: "India's premier logistics hub for tech and D2C. Excellent last-mile network. Nearest port Chennai is 340km — plan air freight for time-sensitive exports. Cold chain well-developed for pharma/biotech.",
  },
  Mumbai: {
    score: 95,
    metrics: [
      { name: 'Last-Mile Density', value: 95, unit: 'Highest courier network density' },
      { name: 'Supplier Proximity', value: 90, unit: 'APMC + Dharavi clusters' },
      { name: 'Highway Access', value: 92, unit: 'NH-48 · NH-66 · NH-160' },
      { name: 'Port Distance', value: 98, unit: 'JNPT Port in city (~25km)' },
      { name: 'Cold Chain', value: 88, unit: 'Best cold chain in India' },
      { name: 'Cost vs Bangalore', value: 60, unit: '40% more expensive logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 95 }, { name: 'Supplier', score: 90 }, { name: 'Highway', score: 92 },
      { name: 'Port', score: 98 }, { name: 'Cold Chain', score: 88 }, { name: 'Cost Index', score: 60 },
    ],
    recommendation: "India's #1 logistics hub. JNPT handles 55% of India's container traffic. Excellent for exports. High costs due to real estate — consider Bhiwandi/Pune for warehousing.",
  },
  Delhi: {
    score: 82,
    metrics: [
      { name: 'Last-Mile Density', value: 90, unit: 'Amazon, Flipkart hubs nearby' },
      { name: 'Supplier Proximity', value: 85, unit: 'Karol Bagh + Okhla industrial' },
      { name: 'Highway Access', value: 88, unit: 'NH-44 · NH-48 · NH-9' },
      { name: 'Port Distance', value: 40, unit: '1400km to nearest coast' },
      { name: 'Cold Chain', value: 78, unit: 'APMC cold storage network' },
      { name: 'Cost vs Bangalore', value: 85, unit: '15% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 90 }, { name: 'Supplier', score: 85 }, { name: 'Highway', score: 88 },
      { name: 'Port', score: 40 }, { name: 'Cold Chain', score: 78 }, { name: 'Cost Index', score: 85 },
    ],
    recommendation: 'Best for North India distribution. Landlocked — high freight cost for coastal exports. Strong for D2C and pan-India distribution via NH-44 corridor. ICD Tughlakabad handles inland container movement.',
  },
  Pune: {
    score: 85,
    metrics: [
      { name: 'Last-Mile Density', value: 85, unit: 'Strong Flipkart/Amazon presence' },
      { name: 'Supplier Proximity', value: 88, unit: 'Auto + electronics MSMEs' },
      { name: 'Highway Access', value: 92, unit: 'NH-48 · NH-65 · NH-60' },
      { name: 'Port Distance', value: 78, unit: '170km to JNPT Mumbai' },
      { name: 'Cold Chain', value: 72, unit: 'Growing pharma network' },
      { name: 'Cost vs Bangalore', value: 90, unit: '10% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 85 }, { name: 'Supplier', score: 88 }, { name: 'Highway', score: 92 },
      { name: 'Port', score: 78 }, { name: 'Cold Chain', score: 72 }, { name: 'Cost Index', score: 90 },
    ],
    recommendation: 'Ideal mix of Mumbai port access and lower costs. NH-48 connects to JNPT in ~3 hours. Strong automotive supply chain. Growing pharma exports. Chakan MIDC is a top industrial zone.',
  },
  Hyderabad: {
    score: 78,
    metrics: [
      { name: 'Last-Mile Density', value: 82, unit: 'Ecom Express + DTDC strong' },
      { name: 'Supplier Proximity', value: 75, unit: 'Pharma + IT supply chain' },
      { name: 'Highway Access', value: 80, unit: 'NH-44 · NH-65 · NH-163' },
      { name: 'Port Distance', value: 55, unit: '600km to Kakinada / Vizag' },
      { name: 'Cold Chain', value: 70, unit: 'Pharma cold chain growing' },
      { name: 'Cost vs Bangalore', value: 88, unit: '12% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 82 }, { name: 'Supplier', score: 75 }, { name: 'Highway', score: 80 },
      { name: 'Port', score: 55 }, { name: 'Cold Chain', score: 70 }, { name: 'Cost Index', score: 88 },
    ],
    recommendation: 'Strong for pharma and biotech supply chains. Inland location increases export costs — Visakhapatnam port 600km. Excellent road connectivity via NH-44. HMDA logistics parks developing rapidly.',
  },
  Ahmedabad: {
    score: 88,
    metrics: [
      { name: 'Last-Mile Density', value: 88, unit: 'Strong courier network' },
      { name: 'Supplier Proximity', value: 92, unit: 'MSME clusters excellent' },
      { name: 'Highway Access', value: 90, unit: 'NH-48 · NH-27 · NH-8' },
      { name: 'Port Distance', value: 85, unit: '120km to Mundra Port' },
      { name: 'Cold Chain', value: 72, unit: 'Adequate infrastructure' },
      { name: 'Cost vs Bangalore', value: 85, unit: '30% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 88 }, { name: 'Supplier', score: 92 }, { name: 'Highway', score: 90 },
      { name: 'Port', score: 85 }, { name: 'Cold Chain', score: 72 }, { name: 'Cost Index', score: 85 },
    ],
    recommendation: 'Excellent logistics hub for manufacturing. Proximate to Mundra Port for exports. MSME cluster density is highest after Surat. Gujarat\'s road infrastructure is among the best in India.',
  },
  Chennai: {
    score: 87,
    metrics: [
      { name: 'Last-Mile Density', value: 85, unit: 'Good courier penetration' },
      { name: 'Supplier Proximity', value: 82, unit: 'Auto + electronics clusters' },
      { name: 'Highway Access', value: 90, unit: 'NH-44 · NH-48 · NH-532' },
      { name: 'Port Distance', value: 98, unit: 'Chennai Port in city' },
      { name: 'Cold Chain', value: 78, unit: 'Fish export cold chain strong' },
      { name: 'Cost vs Bangalore', value: 88, unit: '12% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 85 }, { name: 'Supplier', score: 82 }, { name: 'Highway', score: 90 },
      { name: 'Port', score: 98 }, { name: 'Cold Chain', score: 78 }, { name: 'Cost Index', score: 88 },
    ],
    recommendation: 'Major port city with excellent export connectivity. Chennai Port and Ennore Port handle automobiles and containers. Strong for manufacturing exports. Auto corridor via NH-48 is world-class.',
  },
  Kolkata: {
    score: 75,
    metrics: [
      { name: 'Last-Mile Density', value: 80, unit: 'Strong eastern India hub' },
      { name: 'Supplier Proximity', value: 72, unit: 'Textile + jute MSMEs' },
      { name: 'Highway Access', value: 78, unit: 'NH-12 · NH-16 · NH-112' },
      { name: 'Port Distance', value: 88, unit: 'Kolkata & Haldia Port in city' },
      { name: 'Cold Chain', value: 65, unit: 'Limited but improving' },
      { name: 'Cost vs Bangalore', value: 82, unit: '18% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 80 }, { name: 'Supplier', score: 72 }, { name: 'Highway', score: 78 },
      { name: 'Port', score: 88 }, { name: 'Cold Chain', score: 65 }, { name: 'Cost Index', score: 82 },
    ],
    recommendation: 'Gateway to Northeast India and Bangladesh. Kolkata Port connects to Southeast Asia. Aging infrastructure but improving under Smart City Mission. Strong for textile and jute exports.',
  },
  Jaipur: {
    score: 71,
    metrics: [
      { name: 'Last-Mile Density', value: 74, unit: 'Delhivery + Shadowfax' },
      { name: 'Supplier Proximity', value: 82, unit: 'MSME Clusters Nearby' },
      { name: 'Highway Access', value: 88, unit: 'NH-48 · NH-58' },
      { name: 'Port Distance', value: 42, unit: '285km to Mundra Port' },
      { name: 'Cold Chain', value: 38, unit: 'Limited availability' },
      { name: 'Cost vs Bangalore', value: 78, unit: '22% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 74 }, { name: 'Supplier', score: 82 }, { name: 'Highway', score: 88 },
      { name: 'Port', score: 42 }, { name: 'Cold Chain', score: 38 }, { name: 'Cost Index', score: 78 },
    ],
    recommendation: 'Strong for road-based logistics to North & West India via NH-48. Limited cold chain capability — plan for third-party cold storage. Mundra port access is 4-5 hours, suitable for exports.',
  },
  Coimbatore: {
    score: 74,
    metrics: [
      { name: 'Last-Mile Density', value: 72, unit: 'Delhivery + Xpressbees' },
      { name: 'Supplier Proximity', value: 85, unit: 'Textile + pump MSMEs dense' },
      { name: 'Highway Access', value: 78, unit: 'NH-47 · NH-544 · NH-83' },
      { name: 'Port Distance', value: 58, unit: '200km to Kochi / Tuticorin' },
      { name: 'Cold Chain', value: 68, unit: 'Agri cold chain adequate' },
      { name: 'Cost vs Bangalore', value: 82, unit: '18% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 72 }, { name: 'Supplier', score: 85 }, { name: 'Highway', score: 78 },
      { name: 'Port', score: 58 }, { name: 'Cold Chain', score: 68 }, { name: 'Cost Index', score: 82 },
    ],
    recommendation: 'Manufacturing powerhouse with excellent MSME supplier proximity. Nearest ports are Kochi (200km) and Tuticorin (180km). NH-544 connects efficiently. Strong for textile and pumps export.',
  },
  Kochi: {
    score: 80,
    metrics: [
      { name: 'Last-Mile Density', value: 75, unit: 'Decent regional coverage' },
      { name: 'Supplier Proximity', value: 70, unit: 'Spice & seafood clusters' },
      { name: 'Highway Access', value: 85, unit: 'NH-66 · NH-544 · NH-85' },
      { name: 'Port Distance', value: 98, unit: 'Kochi Port in city' },
      { name: 'Cold Chain', value: 82, unit: 'Seafood export cold chain' },
      { name: 'Cost vs Bangalore', value: 80, unit: '20% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 75 }, { name: 'Supplier', score: 70 }, { name: 'Highway', score: 85 },
      { name: 'Port', score: 98 }, { name: 'Cold Chain', score: 82 }, { name: 'Cost Index', score: 80 },
    ],
    recommendation: 'Strategic port city for seafood and spice exports. Vallarpadam terminal handles containers. Strong cold chain for perishables. NH-66 coastal highway ideal for South India distribution.',
  },
  Chandigarh: {
    score: 68,
    metrics: [
      { name: 'Last-Mile Density', value: 70, unit: 'Moderate regional coverage' },
      { name: 'Supplier Proximity', value: 65, unit: 'Limited MSME clusters' },
      { name: 'Highway Access', value: 82, unit: 'NH-44 · NH-5 · NH-7' },
      { name: 'Port Distance', value: 35, unit: '1200km+ to any coast' },
      { name: 'Cold Chain', value: 58, unit: 'Agri produce cold chain' },
      { name: 'Cost vs Bangalore', value: 80, unit: '20% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 70 }, { name: 'Supplier', score: 65 }, { name: 'Highway', score: 82 },
      { name: 'Port', score: 35 }, { name: 'Cold Chain', score: 58 }, { name: 'Cost Index', score: 80 },
    ],
    recommendation: 'Good for Punjab/Haryana/HP distribution. Deep inland — high sea freight costs. Proximity to Delhi (250km) partially offsets port distance. Agri produce supply chain is a strength.',
  },
  Indore: {
    score: 70,
    metrics: [
      { name: 'Last-Mile Density', value: 72, unit: 'Growing courier network' },
      { name: 'Supplier Proximity', value: 70, unit: 'Pharma + textile MSMEs' },
      { name: 'Highway Access', value: 75, unit: 'NH-52 · NH-347 · NH-52A' },
      { name: 'Port Distance', value: 45, unit: '800km to Mumbai / Mundra' },
      { name: 'Cold Chain', value: 62, unit: 'Soybean agri cold chain' },
      { name: 'Cost vs Bangalore', value: 85, unit: '15% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 72 }, { name: 'Supplier', score: 70 }, { name: 'Highway', score: 75 },
      { name: 'Port', score: 45 }, { name: 'Cold Chain', score: 62 }, { name: 'Cost Index', score: 85 },
    ],
    recommendation: 'Central India distribution hub. Good for pan-India reach but high port freight costs. MP government\'s logistics parks are improving infrastructure. Pharma cluster growing rapidly.',
  },
  Nagpur: {
    score: 72,
    metrics: [
      { name: 'Last-Mile Density', value: 70, unit: 'Ecom Express strong here' },
      { name: 'Supplier Proximity', value: 65, unit: 'Orange belt agri cluster' },
      { name: 'Highway Access', value: 90, unit: 'NH-44 · NH-7 · Zero Mile' },
      { name: 'Port Distance', value: 48, unit: '700km to Mumbai / Vizag' },
      { name: 'Cold Chain', value: 60, unit: 'Orange export cold chain' },
      { name: 'Cost vs Bangalore', value: 82, unit: '18% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 70 }, { name: 'Supplier', score: 65 }, { name: 'Highway', score: 90 },
      { name: 'Port', score: 48 }, { name: 'Cold Chain', score: 60 }, { name: 'Cost Index', score: 82 },
    ],
    recommendation: 'Zero Mile City — geographic centre of India makes it ideal for pan-India distribution. NH-44 crosses here. High trucking costs to ports offset by central location savings. Multimodal logistics hub potential.',
  },
  Vadodara: {
    score: 78,
    metrics: [
      { name: 'Last-Mile Density', value: 76, unit: 'Good Gujarat coverage' },
      { name: 'Supplier Proximity', value: 80, unit: 'Chemical + engineering MSMEs' },
      { name: 'Highway Access', value: 88, unit: 'NH-48 · Delhi-Mumbai corridor' },
      { name: 'Port Distance', value: 80, unit: '200km to Mundra / Hazira' },
      { name: 'Cold Chain', value: 65, unit: 'Adequate for pharma' },
      { name: 'Cost vs Bangalore', value: 88, unit: '12% cheaper logistics' },
    ],
    chartData: [
      { name: 'Last-Mile', score: 76 }, { name: 'Supplier', score: 80 }, { name: 'Highway', score: 88 },
      { name: 'Port', score: 80 }, { name: 'Cold Chain', score: 65 }, { name: 'Cost Index', score: 88 },
    ],
    recommendation: 'Strong chemicals and engineering supply chain. NH-48 Delhi-Mumbai Industrial Corridor passes through. Mundra Port 200km via expressway. Hazira port even closer at ~90km. Competitive logistics costs.',
  },
}

const CITY_LIST = Object.keys(LOGISTICS_DATA)

function LogisticsPage() {
  const [city, setCity] = useState('Jaipur')
  const [liveData, setLiveData] = useState(null)

  useEffect(() => {
    apiClient.get(endpoints.logisticsCity(city))
      .then(res => {
        if (res && res.overall_score !== undefined) setLiveData(res)
        else setLiveData(null)
      })
      .catch(() => setLiveData(null))
  }, [city])

  const staticData = LOGISTICS_DATA[city] || LOGISTICS_DATA['Jaipur']
  const displayScore = liveData ? Math.round(liveData.overall_score) : staticData.score

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🚚 Supply Chain & Logistics Stress Test</h1>
        <div className="page-subtitle">Evaluate operational viability of any Indian city for your startup sector</div>
      </div>

      {/* City Selector */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select City:</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CITY_LIST.map(c => (
            <button key={c} onClick={() => setCity(c)} className={`btn btn-sm ${city === c ? 'btn-primary' : 'btn-secondary'}`} id={`logistics-city-${c.toLowerCase()}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Overall Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
            {displayScore}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 8 }}>Logistics Score</div>
          <p style={{ marginTop: 12, fontSize: '0.82rem', lineHeight: 1.6 }}>{staticData.recommendation}</p>
        </div>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>
            <div className="section-title-icon">📊</div>
            Metrics Breakdown
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={staticData.chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f9fafb' }} />
              <Bar dataKey="score" fill="#06b6d4" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {staticData.metrics.map((m) => {
          const color = m.value >= 70 ? '#10b981' : m.value >= 50 ? '#f59e0b' : '#ef4444'
          return (
            <div key={m.name} className="metric-card" style={{ borderTop: `2px solid ${color}` }}>
              <div className="metric-value" style={{ color }}>{m.value}</div>
              <div className="metric-label">{m.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{m.unit}</div>
              <div className="progress-bar" style={{ marginTop: 10 }}>
                <div className="progress-fill" style={{ width: `${m.value}%`, background: color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LogisticsPage
