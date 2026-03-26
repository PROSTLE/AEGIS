import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'

const DEMAND_DATA = {
  Jaipur: {
    sector: 'Manufacturing / Packaging',
    cagr: 28,
    horizon: 5,
    seasonal: 'Q4 peaks — festive season packaging demand',
    policy: 'PM-MITRA textile parks, PLI scheme for packaging',
    median_survival: { y1: 88, y2: 76, y3: 64, y5: 49 },
    forecast: [
      { year: '2023', gst: 1420, trend: 1420 }, { year: '2024', gst: 1680, trend: 1720 },
      { year: '2025', gst: 2050, trend: 2100 }, { year: '2026', gst: null, trend: 2580 },
      { year: '2027', gst: null, trend: 3200 }, { year: '2028', gst: null, trend: 3950 },
    ],
  },
  Bangalore: {
    sector: 'SaaS / Tech',
    cagr: 18,
    horizon: 5,
    seasonal: 'Q1 & Q3 enterprise sales cycles',
    policy: 'NASSCOM IT-BPM growth, India AI Mission',
    median_survival: { y1: 92, y2: 84, y3: 75, y5: 62 },
    forecast: [
      { year: '2023', gst: 8200, trend: 8200 }, { year: '2024', gst: 9400, trend: 9600 },
      { year: '2025', gst: 11200, trend: 11500 }, { year: '2026', gst: null, trend: 13800 },
      { year: '2027', gst: null, trend: 16400 }, { year: '2028', gst: null, trend: 19500 },
    ],
  },
}

function DemandPage() {
  const [city, setCity] = useState('Jaipur')
  const data = DEMAND_DATA[city]

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📈 Demand Forecast & Lifespan Prediction</h1>
        <div className="page-subtitle">
          Prophet ML on GST collections · Kaplan-Meier survival curves · 5-year outlook
          <span className="badge badge-purple">Prophet + Kaplan-Meier</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>City:</span>
        {Object.keys(DEMAND_DATA).map(c => (
          <button key={c} className={`btn btn-sm ${city === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCity(c)} id={`demand-city-${c.toLowerCase()}`}>{c}</button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: '5-Year CAGR', value: `${data.cagr}%`, color: '#ec4899', icon: '📈' },
          { label: 'Sector', value: data.sector, color: '#3b82f6', icon: '🏭' },
          { label: 'Policy Tailwind', value: 'Active', color: '#10b981', icon: '🎯' },
          { label: 'Seasonal Peak', value: 'Q4', color: '#f59e0b', icon: '📅' },
        ].map(s => (
          <div key={s.label} className="metric-card" style={{ borderTop: `2px solid ${s.color}` }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
            <div className="metric-value" style={{ color: s.color, fontSize: '1.4rem' }}>{s.value}</div>
            <div className="metric-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* GST / Demand Forecast Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>
          <div className="section-title-icon">📊</div>
          GST Collections Forecast (₹ Cr) · Prophet ML Model
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f9fafb' }} formatter={(v) => v ? [`₹${v.toLocaleString('en-IN')} Cr`, ''] : ['Projected', '']} />
            <ReferenceLine x="2025" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" label={{ value: 'Forecast →', fill: '#6b7280', fontSize: 11 }} />
            <Line type="monotone" dataKey="gst" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} name="Actual GST" connectNulls={false} />
            <Line type="monotone" dataKey="trend" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Forecast" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span><span style={{ color: '#3b82f6', fontWeight: 700 }}>━</span> Actual GST Collections</span>
          <span><span style={{ color: '#8b5cf6', fontWeight: 700 }}>╌</span> Prophet Forecast</span>
        </div>
      </div>

      {/* Kaplan-Meier Survival Curve */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>
          <div className="section-title-icon">📉</div>
          Kaplan-Meier Survival Curve · Startup Lifespan
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { year: 'Year 1', prob: data.median_survival.y1, color: '#10b981' },
            { year: 'Year 2', prob: data.median_survival.y2, color: '#3b82f6' },
            { year: 'Year 3', prob: data.median_survival.y3, color: '#f59e0b' },
            { year: 'Year 5', prob: data.median_survival.y5, color: '#ef4444' },
          ].map(s => (
            <div key={s.year} style={{ flex: 1, minWidth: 120, background: 'var(--bg-secondary)', borderRadius: 12, padding: '16px', textAlign: 'center', border: `1px solid ${s.color}30` }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit', color: s.color }}>{s.prob}%</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>Survival</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>at {s.year}</div>
              <div className="progress-bar" style={{ marginTop: 10 }}>
                <div className="progress-fill" style={{ width: `${s.prob}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: '12px', background: 'rgba(59,130,246,0.06)', borderRadius: 10, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Policy signal:</strong> {data.policy}
          <br />
          <strong style={{ color: 'var(--text-primary)' }}>Seasonal insight:</strong> {data.seasonal}
        </div>
      </div>
    </div>
  )
}

export default DemandPage
