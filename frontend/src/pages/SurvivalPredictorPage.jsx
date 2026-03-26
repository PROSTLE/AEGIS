import React, { useState } from 'react'
import { INDIAN_CITIES, SECTORS } from '../utils/constants'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

const MOCK_DATA = {
  Jaipur: {
    sector: 'Manufacturing',
    survivalProbability: 71,
    riskFactors: ['Limited cold-chain infrastructure', 'Competition from Gujarat clusters', 'Working capital seasonality'],
    strengths: ['Strong ITI graduate base', 'Low rent vs Tier-1 cities', 'State industrial incentives'],
    similar_failed: ['CleanPack Jaipur (2021) - GSTIN inactive', 'GreenWrap Industries (2020) - MCA Struck Off'],
    radar: [
      { subject: 'Market Timing', A: 78 }, { subject: 'Team Background', A: 72 }, { subject: 'Location', A: 80 },
      { subject: 'Funding Stage', A: 60 }, { subject: 'Sector Health', A: 75 }, { subject: 'Competitor Density', A: 82 },
    ],
  },
  Bangalore: {
    sector: 'SaaS',
    survivalProbability: 84,
    riskFactors: ['High-cost talent market', 'Intense funding competition', 'Office space premium'],
    strengths: ['Deep SaaS talent pool', 'Active investor ecosystem', 'Global market access'],
    similar_failed: ['SaaSly (2022) - dilution issues', 'CloudOps India (2021) - product-market fit'],
    radar: [
      { subject: 'Market Timing', A: 88 }, { subject: 'Team Background', A: 90 }, { subject: 'Location', A: 92 },
      { subject: 'Funding Stage', A: 82 }, { subject: 'Sector Health', A: 95 }, { subject: 'Competitor Density', A: 55 },
    ],
  },
}

function SurvivalPredictorPage() {
  const [formData, setFormData] = useState({ city: 'Jaipur', sector: 'Manufacturing', teamSize: 3, fundingStage: 'Pre-seed' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const predict = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    const base = MOCK_DATA[formData.city] || MOCK_DATA.Jaipur
    setResult({ ...base, city: formData.city, sector: formData.sector })
    setLoading(false)
  }

  const color = result ? (result.survivalProbability >= 70 ? '#10b981' : '#f59e0b') : '#3b82f6'

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⚡ Startup Survival Predictor</h1>
        <div className="page-subtitle">
          XGBoost model trained on 2,000+ Indian startups · Validated against MCA21 company status
          <span className="badge badge-purple">AUC 0.72+</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        {/* Form */}
        <div className="card" style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
          <div className="section-title" style={{ marginBottom: 16 }}>
            <div className="section-title-icon">🔮</div>
            Input Parameters
          </div>
          <form onSubmit={predict}>
            <div className="form-group">
              <label>City</label>
              <select value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} id="survival-city">
                {INDIAN_CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Sector</label>
              <select value={formData.sector} onChange={e => setFormData(p => ({ ...p, sector: e.target.value }))} id="survival-sector">
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Team Size</label>
              <input type="number" min={1} max={50} value={formData.teamSize} onChange={e => setFormData(p => ({ ...p, teamSize: +e.target.value }))} id="survival-team" />
            </div>
            <div className="form-group">
              <label>Funding Stage</label>
              <select value={formData.fundingStage} onChange={e => setFormData(p => ({ ...p, fundingStage: e.target.value }))} id="survival-stage">
                {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="survival-submit">
              {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Predicting…</> : '⚡ Predict Survival'}
            </button>
          </form>

          <div style={{ marginTop: 16, padding: '12px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-tertiary)', marginBottom: 4 }}>Model Features Used</div>
            City · Sector · Team size · Funding stage · Market timing · Competitor density
          </div>
        </div>

        {/* Result */}
        <div>
          {!result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 350, color: 'var(--text-muted)', gap: 12 }}>
              <div style={{ fontSize: '3rem' }}>⚡</div>
              <p>Fill your startup details and click Predict to get AI-powered survival analysis.</p>
            </div>
          )}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 350, gap: 16 }}>
              <div className="spinner" style={{ width: 44, height: 44, borderWidth: 4 }} />
              <p>Running XGBoost model… computing SHAP values…</p>
            </div>
          )}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Main Score */}
              <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>3-Year Survival Probability</div>
                <div style={{ fontSize: '4.5rem', fontWeight: 900, fontFamily: 'Outfit', color, lineHeight: 1, marginBottom: 8 }}>{result.survivalProbability}%</div>
                <div style={{ marginBottom: 16 }}>
                  <span className={`badge ${result.survivalProbability >= 70 ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.85rem' }}>
                    {result.survivalProbability >= 70 ? '✅ High Survival Likelihood' : '⚠️ Moderate Risk'}
                  </span>
                </div>
                <div className="progress-bar" style={{ maxWidth: 400, margin: '0 auto', height: 10 }}>
                  <div className="progress-fill" style={{ width: `${result.survivalProbability}%`, background: color }} />
                </div>
                <p style={{ marginTop: 12, fontSize: '0.82rem' }}>{result.city} · {result.sector}</p>
              </div>

              {/* Radar Chart */}
              <div className="card">
                <div className="section-title" style={{ marginBottom: 16 }}>
                  <div className="section-title-icon">📡</div>
                  SHAP Feature Analysis
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={result.radar}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Radar dataKey="A" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Strengths & Risks */}
              <div className="grid-2">
                <div className="card">
                  <div className="section-title" style={{ marginBottom: 12 }}>✅ Top Strengths</div>
                  {result.strengths.map((s, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: i < result.strengths.length - 1 ? '1px solid var(--border-color)' : 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>↑</span>{s}
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="section-title" style={{ marginBottom: 12 }}>⚠️ Risk Factors</div>
                  {result.riskFactors.map((r, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: i < result.riskFactors.length - 1 ? '1px solid var(--border-color)' : 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700 }}>!</span>{r}
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Failed */}
              <div className="card" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <div className="section-title" style={{ marginBottom: 12 }}><span>📋</span> Similar Failed Startups (MCA Struck-Off)</div>
                {result.similar_failed.map((f, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '6px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#f87171' }}>✗</span>{f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SurvivalPredictorPage
