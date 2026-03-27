import React, { useState, useEffect } from 'react'
import { INDIAN_CITIES, SECTORS } from '../utils/constants'
import { activityApi } from '../services/api'
import { useAppStore } from '../context/appStore'

function ActivityPage() {
  const store = useAppStore()
  const defaultCity = store.dashboardCity || 'Bangalore'
  const [city, setCity] = useState(defaultCity)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    activityApi.get(city)
      .then(res => {
        if (!active) return
        setData(res)
        setLoading(false)
      })
      .catch(err => {
        if (!active) return
        console.error("Activity API err:", err)
        setError(err.message)
        setLoading(false)
      })
    return () => { active = false }
  }, [city])

  const getCategoryColor = (ci) => {
    if (ci < 0.7) return 'var(--secondary)'
    if (ci < 1.0) return '#fbbf24'
    return 'var(--error)'
  }

  const getCategoryLabel = (ci) => {
    if (ci < 0.7) return 'Blue Ocean'
    if (ci < 1.0) return 'Growing'
    return 'Saturated'
  }

  if (loading) return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16, color: 'var(--outline)' }}>
      <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
      <p style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--on-surface-variant)' }}>Cross-verifying DPIIT × MCA21 × GST...</p>
    </div>
  )

  if (error || !data) return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16, color: 'var(--error)' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.3 }}>error</span>
      <p style={{ fontFamily: 'Inter', fontSize: '0.9rem' }}>Failed to load activity data for {city}.</p>
    </div>
  )

  const ci = data.crowding_index
  const categoryColor = getCategoryColor(ci)
  const category = data.category || getCategoryLabel(ci)
  const rawColor = ci < 0.7 ? '#69f6b8' : ci < 1.0 ? '#fbbf24' : '#ff6b6b'

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>Verified Activity Counter</h1>
        <div className="page-subtitle">
          Cross-verified DPIIT Startup India + MCA21 company status + GST filings — no double counting
          <span className="badge badge-green" style={{ marginLeft: 12 }}>MCA21 Verified</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em', marginRight: 4 }}>City:</span>
        <select
          className="select"
          value={city}
          onChange={e => setCity(e.target.value)}
          style={{ background: 'var(--bg-surface-container)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 'var(--radius-md)', minWidth: 180 }}
        >
          {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Market Category Banner */}
      <div style={{ padding: '20px 24px', marginBottom: 24, borderRadius: 'var(--radius-xl)', background: `${rawColor}0a`, border: `1px solid ${rawColor}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'Manrope', fontSize: '1.6rem', fontWeight: 800, color: categoryColor, letterSpacing: '-0.02em' }}>{category}</div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: 4 }}>
            {city} · {data.sector} · Crowding Index: <strong style={{ color: categoryColor }}>{ci?.toFixed(2)}</strong>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Category Meaning</div>
          <div style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
            {ci < 0.7 ? 'Low saturation · Early mover advantage' :
              ci < 1.0 ? 'Moderate competition · Differentiate clearly' :
                'High saturation · Deep differentiation required'}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Active Companies', value: (data.active_companies || 0).toLocaleString('en-IN'), sub: 'MCA21 Status: Active', color: 'var(--secondary)', icon: 'business' },
          { label: 'Closures (2yrs)', value: data.closures_2yr || 0, sub: `${data.closure_rate_pct || 0}% closure rate`, color: 'var(--error)', icon: 'trending_down' },
          { label: 'New in 2024', value: data.new_2024 || 0, sub: 'Incorporations this year', color: 'var(--primary)', icon: 'add_business' },
          { label: 'Crowding Index', value: ci?.toFixed(2) || '0.00', sub: '< 0.7 = underserved', color: categoryColor, icon: 'data_thresholding' },
        ].map(s => (
          <div key={s.label} style={{ padding: 24, borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface-container-low)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: s.color, fontVariationSettings: "'FILL' 1", marginBottom: 10, display: 'block' }}>{s.icon}</span>
            <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.8rem', color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--outline)', marginTop: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'var(--on-surface-variant)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Cross-Verification */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>verified</span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700 }}>Cross-Verification (3 Sources)</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { source: 'DPIIT Startup India', count: data.cross_verification?.dpiit || 0, color: 'var(--primary)' },
            { source: 'MCA21 Active Status', count: data.cross_verification?.mca21 || 0, color: 'var(--secondary)' },
            { source: 'GST Registration', count: data.cross_verification?.gst || 0, color: '#fbbf24' },
          ].map(s => (
            <div key={s.source} style={{ padding: '20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-container)', border: `1px solid ${s.color}20` }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{s.source}</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '2rem', color: 'white', lineHeight: 1 }}>{s.count.toLocaleString('en-IN')}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--outline)', marginTop: 4 }}>Companies verified</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Companies */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>corporate_fare</span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700 }}>Sample Companies (MCA21 Data)</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Company', 'Year Founded', 'MCA21 Status'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.6rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.top_companies || []).map((co, i) => (
              <tr key={i} style={{ borderBottom: i < (data.top_companies || []).length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <td style={{ padding: '14px 16px', fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.9rem' }}>{co.name}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>{co.year}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', fontWeight: 700, color: co.status === 'Active' ? 'var(--secondary)' : 'var(--error)', background: co.status === 'Active' ? 'rgba(105,246,184,0.1)' : 'rgba(255,107,107,0.1)', padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{co.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(133,173,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(133,173,255,0.1)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--primary)', verticalAlign: 'middle', marginRight: 6 }}>lightbulb</span>
          <span style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>{data.insight}</span>
        </div>
      </div>
    </div>
  )
}

export default ActivityPage
