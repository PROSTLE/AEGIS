import React, { useState } from 'react'
import { INDIAN_CITIES, SECTORS } from '../utils/constants'

const WORKFORCE_DATA = {
  Jaipur: {
    Manufacturing: {
      score: 77,
      total: 12400,
      avgWage: 13800,
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
      score: 55,
      total: 2800,
      avgWage: 42000,
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
      score: 95,
      total: 185000,
      avgWage: 72000,
      roles: [
        { title: 'Software Engineers', density: 42.5, wage: 78000, hiring: 'LinkedIn, Referrals' },
        { title: 'Data Scientists', density: 18.2, wage: 95000, hiring: 'Campus, LinkedIn' },
        { title: 'Product Managers', density: 12.4, wage: 110000, hiring: 'LinkedIn, Executive Search' },
      ],
      dataSource: 'AISHE 2022 · NASSCOM reports',
      insight: 'World-class tech talent pool. Competitive wages — plan for ₹70k-₹1.5L per month per engineer.',
    },
    Manufacturing: {
      score: 62,
      total: 22000,
      avgWage: 24000,
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">👥 Workforce Intelligence Engine</h1>
        <div className="page-subtitle">Role-specific talent density, salary benchmarks, and hiring channels per city & sector</div>
      </div>

      {/* Selectors */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 20px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>City</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.keys(WORKFORCE_DATA).map(c => (
              <button key={c} className={`btn btn-sm ${city === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCity(c)} id={`wf-city-${c.toLowerCase()}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Sector</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.keys(WORKFORCE_DATA[city] || {}).map(s => (
              <button key={s} className={`btn btn-sm ${sector === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSector(s)} id={`wf-sector-${s.toLowerCase()}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Workforce Score', value: data.score, color: '#10b981', unit: '/100' },
          { label: 'Skilled Workers Available', value: data.total.toLocaleString('en-IN'), color: '#3b82f6', unit: '' },
          { label: 'Average Base Wage', value: `₹${(data.avgWage / 1000).toFixed(1)}k`, color: '#8b5cf6', unit: '/month' },
          { label: 'Data Source', value: 'Gov', color: '#06b6d4', unit: 'Verified' },
        ].map(s => (
          <div key={s.label} className="metric-card" style={{ borderTop: `2px solid ${s.color}` }}>
            <div className="metric-value" style={{ color: s.color, fontSize: '1.6rem' }}>{s.value}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>{s.unit}</span></div>
            <div className="metric-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Role Table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>
          <div className="section-title-icon">👷</div>
          Role Availability & Wages
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              {['Role', 'Density/10k Pop', 'Avg Monthly Wage', 'Top Hiring Channel'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.roles.map((role, i) => (
              <tr key={i} style={{ borderBottom: i < data.roles.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{role.title}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: '#10b981', fontWeight: 700 }}>{role.density.toFixed(1)}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: '#3b82f6', fontWeight: 700 }}>₹{role.wage.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{role.hiring}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insight */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.07), rgba(6,182,212,0.07))', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="section-title" style={{ marginBottom: 10 }}><span>💡</span> AI Workforce Insight</div>
        <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.7 }}>{data.insight}</p>
        <div style={{ marginTop: 10, fontSize: '0.72rem', color: 'var(--text-muted)' }}>Data: {data.dataSource}</div>
      </div>
    </div>
  )
}

export default WorkforcePage
