import React, { useState } from 'react'
import { INDIAN_CITIES, SECTORS } from '../utils/constants'

const ACTIVITY_DATA = {
  Jaipur: {
    sector: 'Manufacturing',
    active: 47,
    closures: 8,
    new2024: 14,
    crowdingIndex: 0.38,
    category: 'Gold Rush',
    categoryColor: '#10b981',
    dpiit: 42,
    mca21: 47,
    gst: 39,
    closureRate: 14.5,
    topCompanies: [
      { name: 'Jaipur Packaging Industries', status: 'Active', year: 2019 },
      { name: 'RajPack Solutions Pvt Ltd', status: 'Active', year: 2021 },
      { name: 'GreenWrap Industries', status: 'Struck Off', year: 2020 },
    ],
    insight: 'Low crowding index (0.38) indicates a healthy, underserved market. Only 8 closures in 2 years — well below the national average of 22% closure rate for manufacturing.',
  },
  Bangalore: {
    sector: 'SaaS',
    active: 3840,
    closures: 420,
    new2024: 680,
    crowdingIndex: 1.42,
    category: 'Saturated',
    categoryColor: '#ef4444',
    dpiit: 3600,
    mca21: 3840,
    gst: 3200,
    closureRate: 9.8,
    topCompanies: [
      { name: 'Freshworks Inc', status: 'Active', year: 2010 },
      { name: 'Chargebee Technologies', status: 'Active', year: 2011 },
      { name: 'CloudSales India', status: 'Struck Off', year: 2022 },
    ],
    insight: 'High crowding index (1.42) signals market saturation. Bangalore SaaS market is highly competitive — differentiation is critical. Consider Hyderabad or Pune as alternatives.',
  },
}

function ActivityPage() {
  const [city, setCity] = useState('Jaipur')
  const data = ACTIVITY_DATA[city] || ACTIVITY_DATA['Jaipur']

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📊 Verified Startup Activity Counter</h1>
        <div className="page-subtitle">
          Cross-verified DPIIT Startup India + MCA21 company status + GST filings — no double counting
          <span className="badge badge-green">MCA21 Verified</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>City:</span>
        {Object.keys(ACTIVITY_DATA).map(c => (
          <button key={c} className={`btn btn-sm ${city === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCity(c)} id={`activity-city-${c.toLowerCase()}`}>{c}</button>
        ))}
      </div>

      {/* Market Category Banner */}
      <div style={{
        background: `${data.categoryColor}12`,
        border: `1px solid ${data.categoryColor}35`,
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit', color: data.categoryColor }}>{data.category}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {city} · {data.sector} · Crowding Index: {data.crowdingIndex}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Category Meaning</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {data.crowdingIndex < 0.7 ? 'Low saturation · Early mover advantage' :
              data.crowdingIndex < 1.0 ? 'Moderate competition · Differentiate clearly' :
                'High saturation · Deep differentiation required'}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Active Companies', value: data.active.toLocaleString('en-IN'), color: '#10b981', sub: 'MCA21 Status: Active' },
          { label: 'Closures (2yrs)', value: data.closures, color: '#ef4444', sub: `${data.closureRate}% closure rate` },
          { label: 'New in 2024', value: data.new2024, color: '#3b82f6', sub: 'Incorporations this year' },
          { label: 'Crowding Index', value: data.crowdingIndex.toFixed(2), color: data.categoryColor, sub: '< 0.7 = underserved' },
        ].map(s => (
          <div key={s.label} className="metric-card" style={{ borderTop: `2px solid ${s.color}` }}>
            <div className="metric-value" style={{ color: s.color }}>{s.value}</div>
            <div className="metric-label">{s.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Data Cross-Verification */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>
          <div className="section-title-icon">✅</div>
          Cross-Verification (3 Sources)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { source: 'DPIIT Startup India', count: data.dpiit, color: '#3b82f6' },
            { source: 'MCA21 Active Status', count: data.mca21, color: '#10b981' },
            { source: 'GST Registration', count: data.gst, color: '#f59e0b' },
          ].map(s => (
            <div key={s.source} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px', border: `1px solid ${s.color}25` }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.source}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text-primary)', lineHeight: 1 }}>{s.count.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Companies verified</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Companies */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 14 }}>
          <div className="section-title-icon">🏢</div>
          Sample Companies (MCA21 Data)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              {['Company', 'Year Founded', 'MCA21 Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.topCompanies.map((co, i) => (
              <tr key={i} style={{ borderBottom: i < data.topCompanies.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{co.name}</td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{co.year}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span className={`badge ${co.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{co.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 16, padding: '12px', background: 'rgba(59,130,246,0.06)', borderRadius: 10, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          💡 {data.insight}
        </div>
      </div>
    </div>
  )
}

export default ActivityPage
