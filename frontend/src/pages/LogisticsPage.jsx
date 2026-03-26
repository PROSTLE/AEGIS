import React, { useState } from 'react'
import { INDIAN_CITIES } from '../utils/constants'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const LOGISTICS_DATA = {
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
    recommendation: 'Excellent logistics hub for manufacturing. Proximate to Mundra Port for exports. MSME cluster density is highest after Surat.',
  },
}

const defaultData = LOGISTICS_DATA['Jaipur']

function LogisticsPage() {
  const [city, setCity] = useState('Jaipur')
  const data = LOGISTICS_DATA[city] || defaultData

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
          {Object.keys(LOGISTICS_DATA).concat(['Mumbai', 'Coimbatore']).map(c => (
            <button key={c} onClick={() => setCity(c)} className={`btn btn-sm ${city === c ? 'btn-primary' : 'btn-secondary'}`} id={`logistics-city-${c.toLowerCase()}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Overall Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
            {LOGISTICS_DATA[city]?.score || defaultData.score}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 8 }}>Logistics Score</div>
          <p style={{ marginTop: 12, fontSize: '0.82rem', lineHeight: 1.6 }}>{data.recommendation}</p>
        </div>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>
            <div className="section-title-icon">📊</div>
            Metrics Breakdown
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.chartData} layout="vertical">
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
        {data.metrics.map((m) => {
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
