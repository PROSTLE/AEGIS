import React, { useState, useEffect } from 'react'
import { INDIAN_CITIES, SECTORS } from '../utils/constants'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { logisticsApi } from '../services/api'
import { useAppStore } from '../context/appStore'

const barColor = (score) => score >= 70 ? '#69f6b8' : score >= 50 ? '#fbbf24' : '#ff6b6b'

function LogisticsPage() {
  const store = useAppStore()
  const defaultCity = store.dashboardCity || 'Bangalore'
  const [city, setCity] = useState(defaultCity)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    logisticsApi.getBreakdown(city)
      .then(res => {
        if (!active) return
        
        // Transform the backend metrics back to the format the chart expects
        const frontendMetrics = res.metrics.map(m => {
          let icon = 'local_shipping'
          if (m.name.includes('Supplier')) icon = 'factory'
          if (m.name.includes('Highway')) icon = 'road'
          if (m.name.includes('Port')) icon = 'anchor'
          if (m.name.includes('Cold')) icon = 'ac_unit'
          if (m.name.includes('Cost')) icon = 'savings'
          return { ...m, icon }
        })
        
        const chartData = res.metrics.map(m => ({
          name: m.name.split(' ')[0], 
          score: m.value
        }))

        setData({
          score: res.overall_score,
          recommendation: res.recommendation,
          metrics: frontendMetrics,
          chartData: chartData
        })
        setLoading(false)
      })
      .catch(err => {
        console.error("Logistics API err:", err)
        setLoading(false)
      })
    return () => { active = false }
  }, [city])

  const scoreColor = data?.score >= 80 ? 'var(--secondary)' : data?.score >= 60 ? '#fbbf24' : 'var(--error)'

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>Logistics Stress Test</h1>
        <div className="page-subtitle">Evaluate operational viability of any Indian city for your startup sector</div>
      </div>

      {/* City Selector */}
      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em', marginRight: 4 }}>City:</span>
        <select 
          className="select" 
          value={city} 
          onChange={e => setCity(e.target.value)} 
          style={{ background: 'var(--bg-surface-container)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}
        >
          {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {!data || loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--on-surface-variant)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, animation: 'spin 1.5s linear infinite' }}>refresh</span>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', marginTop: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Routing Cargo Data...</p>
        </div>
      ) : (
        <>
      {/* Score + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Logistics Score</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '5rem', color: scoreColor, lineHeight: 1, letterSpacing: '-0.04em' }}>
            {data.score}
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--outline)', marginBottom: 20 }}>/100</div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--on-surface-variant)', margin: 0 }}>{data.recommendation}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>bar_chart</span>
            <span style={{ fontFamily: 'Manrope', fontWeight: 700 }}>Metrics Breakdown</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data.chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#666', fontSize: 11, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Space Grotesk' }} width={80} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontFamily: 'Space Grotesk' }} />
              <Bar dataKey="score" fill="#85adff" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {data.metrics.map((m) => {
          const col = m.value >= 70 ? 'var(--secondary)' : m.value >= 50 ? '#fbbf24' : 'var(--error)'
          return (
            <div key={m.name} style={{ padding: 20, borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface-container-low)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: col, marginBottom: 10, display: 'block' }}>{m.icon}</span>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '2rem', color: col, lineHeight: 1, letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--outline)', marginTop: 6 }}>{m.name}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'var(--on-surface-variant)', marginTop: 4, marginBottom: 10 }}>{m.unit}</div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${m.value}%`, background: col, borderRadius: 99 }} />
              </div>
            </div>
          )
        })}
      </div>
      </>
      )}
    </div>
  )
}

export default LogisticsPage
