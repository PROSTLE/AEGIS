import React, { useState } from 'react'
import { INDIAN_CITIES, SECTORS } from '../utils/constants'

const WORKFORCE_DATA = {
  Jaipur: {
    Manufacturing: {
      score: 77, total: 12400, avgWage: 13800,
      roles: [
        { title: 'Packaging Engineers', density: 8.4, wage: 18500, hiring: 'Campus + Job Fairs' },
        { title: 'Machine Operators', density: 24.2, wage: 11200, hiring: 'ITI Colleges, NCVT Portal' },
        { title: 'Quality Inspectors', density: 12.8, wage: 13500, hiring: 'LinkedIn, Word-of-Mouth' },
        { title: 'Logistics Supervisors', density: 6.2, wage: 16000, hiring: 'Job Portals' },
      ],
      dataSource: 'Census 2011 · AISHE 2022 · NCVT MIS portal',
      insight: 'Jaipur has a strong ITI diploma workforce ideal for manufacturing. Average wages are 35% lower than Pune or Bangalore for similar roles.',
    },
    SaaS: {
      score: 55, total: 2800, avgWage: 42000,
      roles: [
        { title: 'Software Engineers', density: 3.2, wage: 45000, hiring: 'LinkedIn, Naukri' },
        { title: 'Data Scientists', density: 1.1, wage: 58000, hiring: 'Campus Placements' },
        { title: 'Product Managers', density: 0.8, wage: 62000, hiring: 'LinkedIn' },
      ],
      dataSource: 'AISHE 2022 · LinkedIn Insights',
      insight: 'Limited SaaS talent pool in Jaipur. Consider remote-first hiring or Jaipur + Hyderabad hybrid model.',
    },
  },
  Bangalore: {
    SaaS: {
      score: 95, total: 185000, avgWage: 72000,
      roles: [
        { title: 'Software Engineers', density: 42.5, wage: 78000, hiring: 'LinkedIn, Referrals' },
        { title: 'Data Scientists', density: 18.2, wage: 95000, hiring: 'Campus, LinkedIn' },
        { title: 'Product Managers', density: 12.4, wage: 110000, hiring: 'LinkedIn, Executive Search' },
      ],
      dataSource: 'AISHE 2022 · NASSCOM reports',
      insight: 'World-class tech talent pool. Competitive wages — plan for ₹70k-₹1.5L per month per engineer.',
    },
    Manufacturing: {
      score: 62, total: 22000, avgWage: 24000,
      roles: [
        { title: 'Machine Operators', density: 8.2, wage: 19000, hiring: 'Local Job Consultants' },
        { title: 'ITI Diploma Holders', density: 5.4, wage: 15000, hiring: 'ITI Colleges' },
      ],
      dataSource: 'Census 2011 · NCVT MIS',
      insight: 'Manufacturing talent is scarce and costly in Bangalore. Consider satellite factories in Tumkur or Mysore.',
    },
  },
}

function WorkforcePage() {
  const [city, setCity] = useState('Jaipur')
  const [sector, setSector] = useState('Manufacturing')
  const cityData = WORKFORCE_DATA[city]
  const data = cityData?.[sector] || WORKFORCE_DATA['Jaipur']['Manufacturing']

  const scoreColor = data.score >= 80 ? 'var(--secondary)' : data.score >= 60 ? 'var(--primary)' : '#fbbf24'

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>Workforce Intelligence</h1>
        <div className="page-subtitle">
          Role-specific talent density, salary benchmarks, and hiring channels per city & sector
        </div>
      </div>

      {/* Selectors */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 20px', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '0.6rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>City</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.keys(WORKFORCE_DATA).map(c => (
              <button key={c} className={`btn btn-sm ${city === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCity(c)} id={`wf-city-${c.toLowerCase()}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.6rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Sector</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.keys(WORKFORCE_DATA[city] || {}).map(s => (
              <button key={s} className={`btn btn-sm ${sector === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSector(s)} id={`wf-sector-${s.toLowerCase()}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Workforce Score', value: data.score, unit: '/100', color: scoreColor, icon: 'bar_chart' },
          { label: 'Skilled Workers', value: data.total.toLocaleString('en-IN'), unit: '', color: 'var(--primary)', icon: 'groups' },
          { label: 'Avg Base Wage', value: `₹${(data.avgWage / 1000).toFixed(1)}k`, unit: '/mo', color: 'var(--tertiary)', icon: 'payments' },
          { label: 'Data Source', value: 'Gov', unit: 'Verified', color: 'var(--secondary)', icon: 'verified' },
        ].map(s => (
          <div key={s.label} style={{ padding: 24, borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface-container-low)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            </div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.8rem', color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {s.value}<span style={{ fontSize: '0.8rem', color: 'var(--outline)', fontWeight: 500, marginLeft: 2 }}>{s.unit}</span>
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--outline)', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Role Table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>engineering</span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1rem' }}>Role Availability & Wages</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Role', 'Density/10k Pop', 'Avg Monthly Wage', 'Top Hiring Channel'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.6rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.roles.map((role, i) => (
              <tr key={i} style={{ borderBottom: i < data.roles.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <td style={{ padding: '14px 16px', fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.9rem' }}>{role.title}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'Space Grotesk', color: 'var(--secondary)', fontWeight: 700 }}>{role.density.toFixed(1)}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'Space Grotesk', color: 'var(--primary)', fontWeight: 700 }}>₹{role.wage.toLocaleString('en-IN')}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'Inter', color: 'var(--on-surface-variant)', fontSize: '0.82rem' }}>{role.hiring}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insight */}
      <div className="card" style={{ background: 'rgba(105,246,184,0.04)', border: '1px solid rgba(105,246,184,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--secondary)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700 }}>AI Workforce Insight</span>
        </div>
        <p style={{ margin: 0, fontFamily: 'Inter', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--on-surface-variant)' }}>{data.insight}</p>
        <div style={{ marginTop: 10, fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Source: {data.dataSource}</div>
      </div>
    </div>
  )
}

export default WorkforcePage
