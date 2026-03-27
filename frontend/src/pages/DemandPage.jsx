import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { demandApi } from '../services/api'
import { INDIAN_CITIES } from '../utils/constants'
import { useAppStore } from '../context/appStore'

const survivalColors = ['var(--secondary)', 'var(--primary)', '#fbbf24', 'var(--error)']

function DemandPage() {
  const store = useAppStore()
  const defaultCity = store.dashboardCity || 'Bangalore'
  const [city, setCity] = useState(defaultCity)
  const [data, setData] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const fullData = await demandApi.getFull(city)
        setData(fullData)
      } catch (e) {
        console.error("Failed to load demand data", e)
      }
    }
    loadData()
  }, [city])

  if (!data) return <div className="page-container"><p style={{ color: 'white' }}>Loading Prophet ML engine...</p></div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>Demand Forecast</h1>
        <div className="page-subtitle">
          Prophet ML on GST collections · Kaplan-Meier survival curves · 5-year outlook
          <span className="badge badge-purple" style={{ marginLeft: 12 }}>Prophet + Kaplan-Meier</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: '5-Year CAGR', value: `${data.cagr_pct}%`, color: '#ec4899', icon: 'trending_up' },
          { label: 'Sector', value: data.sector.split('/')[0].trim(), color: 'var(--primary)', icon: 'factory' },
          { label: 'Policy Tailwind', value: 'Active', color: 'var(--secondary)', icon: 'policy' },
          { label: 'Seasonal Peak', value: 'Q4', color: '#fbbf24', icon: 'calendar_month' },
        ].map(s => (
          <div key={s.label} style={{ padding: 24, borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface-container-low)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: s.color, fontVariationSettings: "'FILL' 1", marginBottom: 10, display: 'block' }}>{s.icon}</span>
            <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.5rem', color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--outline)', marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* GST Forecast Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>bar_chart</span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700 }}>GST Collections Forecast (₹ Cr) · Prophet ML Model</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" tick={{ fill: '#666', fontSize: 12, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontFamily: 'Space Grotesk' }} formatter={(v) => v ? [`₹${v.toLocaleString('en-IN')} Cr`, ''] : ['Projected', '']} />
            <ReferenceLine x="2025" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" label={{ value: 'Forecast →', fill: '#555', fontSize: 11 }} />
            <Line type="monotone" dataKey="gst" stroke="#85adff" strokeWidth={2.5} dot={{ fill: '#85adff', r: 4 }} name="Actual GST" connectNulls={false} />
            <Line type="monotone" dataKey="trend" stroke="#c180ff" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Forecast" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 20 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.72rem', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 2, background: '#85adff', display: 'inline-block', borderRadius: 2 }}></span>Actual GST</span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.72rem', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 2, background: '#c180ff', display: 'inline-block', borderRadius: 2, opacity: 0.7 }}></span>Prophet Forecast</span>
          </div>
          <div style={{ background: 'rgba(193, 128, 255, 0.05)', border: '1px solid rgba(193, 128, 255, 0.15)', borderRadius: 8, padding: '10px 14px' }}>
            <p style={{ margin: 0, fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#c180ff', verticalAlign: 'middle', marginRight: 6 }}>info</span>
              The graph is mathematically sound based on past performance, but it should be viewed as a "best-case scenario" projection rather than a guarantee. It tells you where the trend is heading if nothing major changes in the Indian economy over the next three years.
            </p>
          </div>
        </div>
      </div>

      {/* Kaplan-Meier Survival Curve */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--tertiary)' }}>timeline</span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700 }}>Kaplan-Meier Survival Curve · Startup Lifespan</span>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { year: 'Year 1', prob: data.survival_curve.y1 },
            { year: 'Year 2', prob: data.survival_curve.y2 },
            { year: 'Year 3', prob: data.survival_curve.y3 },
            { year: 'Year 5', prob: data.survival_curve.y5 },
          ].map((s, i) => (
            <div key={s.year} style={{ flex: 1, minWidth: 120, background: 'var(--bg-surface-container)', borderRadius: 'var(--radius-xl)', padding: '20px 16px', textAlign: 'center', border: `1px solid ${survivalColors[i]}22` }}>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '2.2rem', color: survivalColors[i], lineHeight: 1 }}>{s.prob}%</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', fontWeight: 700, color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>Survival</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', marginBottom: 10 }}>at {s.year}</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${s.prob}%`, background: survivalColors[i], borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(133,173,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(133,173,255,0.1)' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: 'var(--on-surface-variant)', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: 'var(--on-surface)' }}>Policy signal:</strong> {data.policy}<br />
            <strong style={{ color: 'var(--on-surface)' }}>Seasonal insight:</strong> {data.seasonal}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DemandPage
