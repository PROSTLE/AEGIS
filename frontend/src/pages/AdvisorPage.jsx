import React, { useState } from 'react'
import { INDIAN_CITIES, SECTORS } from '../utils/constants'

const DEMO_REPORT = {
  city: 'Jaipur',
  idea: 'Sustainable packaging factory',
  type: 'Manufacturing',
  launchReadinessScore: 74,
  scoreBreakdown: [
    { label: 'Ecosystem Score', weight: 20, score: 68, color: '#3b82f6' },
    { label: 'Survival Predictor', weight: 20, score: 72, color: '#8b5cf6' },
    { label: 'Logistics Score', weight: 15, score: 71, color: '#06b6d4' },
    { label: 'Workforce Score', weight: 15, score: 77, color: '#10b981' },
    { label: 'Demand Forecast', weight: 15, score: 79, color: '#ec4899' },
    { label: 'Activity / Crowding', weight: 10, score: 82, color: '#f59e0b' },
    { label: 'Investor Availability', weight: 5, score: 65, color: '#6366f1' },
  ],
  workforce: {
    total: 12400,
    avgWage: 13800,
    topRoles: ['Packaging Engineers', 'Machine Operators', 'Quality Inspectors', 'ITI Diploma Holders'],
    hiringChannels: ['ITI Colleges', 'NCVT MIS Portal', 'Local Job Fairs', 'Campus Placements'],
  },
  location: {
    recommended: 'Sitapura Industrial Area',
    rent: 22,
    highway: 'NH-48',
    score: 84,
    alternatives: ['Boranada Industrial Zone (₹18/sqft)', 'Kukas Industrial Area (₹25/sqft)'],
  },
  activity: {
    active: 47,
    closures: 8,
    crowdingIndex: 0.38,
    category: 'Gold Rush',
  },
  demand: {
    cagr: 28,
    horizon: 5,
    seasonal: 'Q4 peaks (packaging demand for festive season)',
    policy: 'PM-MITRA textile parks boost',
  },
  survival: {
    probability: 71,
    riskFactors: ['Limited cold chain in city', 'Competitive pricing from Gujarat clusters', 'Working capital seasonality'],
    strengths: ['Strong ITI workforce base', 'Low land cost vs Ahmedabad', 'NH-48 logistics advantage'],
  },
  investors: [
    { name: 'Blume Ventures', focus: 'Manufacturing / D2C', stage: 'Seed', cheque: '₹1-5Cr', score: 84 },
    { name: 'Stellaris VC', focus: 'Deep Tech / MfgTech', stage: 'Seed - Series A', cheque: '₹2-10Cr', score: 78 },
    { name: 'Rajasthan Angels', focus: 'Manufacturing', stage: 'Pre-seed', cheque: '₹25L-1Cr', score: 91 },
    { name: 'India Quotient', focus: 'Consumer / D2C', stage: 'Seed', cheque: '₹1-3Cr', score: 72 },
  ],
  alternatives: [
    { city: 'Ahmedabad', score: 81, reason: 'Larger packaging cluster, better investor access' },
    { city: 'Coimbatore', score: 76, reason: 'Strong manufacturing talent, lower costs' },
  ],
  narrative: `Jaipur shows strong potential for a sustainable packaging startup. The Sitapura Industrial Area offers excellent infrastructure at competitive rates (₹22/sqft) with direct NH-48 highway access. With only 47 active companies and a 8-closure rate, the market crowding index (0.38) signals an early-mover opportunity. The skilled ITI workforce of 12,400+ workers at an average wage of ₹13,800/month provides significant cost advantage versus Bangalore or Pune. The 5-year demand forecast shows 28% CAGR, driven by PM-MITRA textile parks and growing D2C sector packaging needs in North India.`,
}

function ScoreBar({ label, weight, score, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Weight: {weight}%</span>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color }}>{score}/100</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${score}%`, background: color, boxShadow: `0 0 8px ${color}50` }}
        />
      </div>
    </div>
  )
}

function ScoreCircle({ score }) {
  const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const label = score >= 70 ? 'Strong Launch Signal' : score >= 50 ? 'Proceed with Caution' : 'High Risk'
  const circumference = 2 * Math.PI * 58
  const dash = (score / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle
            cx="65" cy="65" r="58" fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 2,
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit', color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color }}>Launch Readiness Score</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  )
}

function AdvisorPage() {
  const [formData, setFormData] = useState({
    city: 'Jaipur',
    startupIdea: '',
    startupType: 'Manufacturing',
    teamSize: 3,
    fundingStage: 'Pre-seed',
  })
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [demoMode, setDemoMode] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setReport(null)
    // Simulate API call with delay
    await new Promise(r => setTimeout(r, 2500))
    const r = {
      ...DEMO_REPORT,
      city: formData.city,
      type: formData.startupType,
      idea: formData.startupIdea || 'Your startup idea',
    }
    setReport(r)
    setLoading(false)
    setDemoMode(false)
  }

  const loadDemo = () => {
    setFormData({ city: 'Jaipur', startupIdea: 'sustainable packaging factory', startupType: 'Manufacturing', teamSize: 3, fundingStage: 'Pre-seed' })
    setReport(DEMO_REPORT)
    setDemoMode(true)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">🎯 AI Advisor – Terrain Intelligence</h1>
        <div className="page-subtitle">
          <span>Powered by Gemini 1.5 Flash + RAG pipeline · Full report in ~3 minutes</span>
          <span className="badge badge-purple">RAG + LLM</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Form Panel */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <div className="section-title" style={{ marginBottom: 20 }}>
              <div className="section-title-icon">📝</div>
              Startup Profile
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Target City</label>
                <select
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  id="advisor-city-select"
                >
                  {INDIAN_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Startup Idea</label>
                <textarea
                  rows={3}
                  value={formData.startupIdea}
                  onChange={e => setFormData({ ...formData, startupIdea: e.target.value })}
                  placeholder="e.g., sustainable packaging factory targeting D2C brands"
                  id="advisor-idea-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label>Startup Type / Sector</label>
                <select
                  value={formData.startupType}
                  onChange={e => setFormData({ ...formData, startupType: e.target.value })}
                  id="advisor-type-select"
                >
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Team Size</label>
                  <input
                    type="number" min={1} max={100}
                    value={formData.teamSize}
                    onChange={e => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
                    id="advisor-team-input"
                  />
                </div>
                <div className="form-group">
                  <label>Funding Stage</label>
                  <select
                    value={formData.fundingStage}
                    onChange={e => setFormData({ ...formData, fundingStage: e.target.value })}
                    id="advisor-stage-select"
                  >
                    {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="btn btn-primary btn-full btn-lg"
                id="advisor-submit-btn"
                style={{ marginBottom: 10 }}
              >
                {loading ? (
                  <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing...</>
                ) : '🚀 Generate Terrain Report'}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-full btn-sm"
                onClick={loadDemo}
                id="advisor-demo-btn"
              >
                📋 Load Demo (Jaipur · Packaging)
              </button>
            </form>

            {/* Score Weights */}
            <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Score Weights</div>
              {[
                ['Ecosystem', '20%'], ['Survival AI', '20%'], ['Logistics', '15%'],
                ['Workforce', '15%'], ['Demand', '15%'], ['Activity', '10%'], ['Investors', '5%'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '3px 0' }}>
                  <span>{k}</span><span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Panel */}
        <div>
          {!report && !loading && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 400, gap: 16, color: 'var(--text-muted)', textAlign: 'center',
            }}>
              <div style={{ fontSize: '4rem' }}>🎯</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No Report Generated Yet</div>
              <p style={{ maxWidth: 320, margin: 0 }}>Fill in your startup details and click Generate, or try the demo to see a sample Jaipur report instantly.</p>
              <button className="btn btn-secondary" onClick={loadDemo} id="empty-demo-btn">📋 Try Demo Report</button>
            </div>
          )}

          {loading && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 400, gap: 20, color: 'var(--text-muted)',
            }}>
              <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Generating Terrain Report…</div>
                {['Fetching MCA21 data…', 'Computing workforce scores…', 'Running XGBoost survival model…', 'Querying Gemini 1.5 Flash…'].map((step, i) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '2px 0', animation: `fadeIn 0.5s ${i * 0.4}s both` }}>✓ {step}</div>
                ))}
              </div>
            </div>
          )}

          {report && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Score */}
              <div className="card" style={{ textAlign: 'center' }}>
                {demoMode && (
                  <div style={{ marginBottom: 12 }}>
                    <span className="badge badge-yellow">⚠️ Demo Mode — Jaipur · Sustainable Packaging · Manufacturing</span>
                  </div>
                )}
                <ScoreCircle score={report.launchReadinessScore} />
              </div>

              {/* Score Breakdown */}
              <div className="card">
                <div className="section-title" style={{ marginBottom: 18 }}>
                  <div className="section-title-icon">📊</div>
                  Score Breakdown
                </div>
                {report.scoreBreakdown.map(s => (
                  <ScoreBar key={s.label} {...s} />
                ))}
              </div>

              {/* Narrative */}
              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.07))' }}>
                <div className="section-title" style={{ marginBottom: 12 }}>
                  <div className="section-title-icon">🤖</div>
                  AI Analysis — {report.city} · {report.type}
                </div>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>
                  {report.narrative}
                </p>
              </div>

              {/* Strengths & Risks */}
              <div className="grid-2">
                <div className="card">
                  <div className="section-title" style={{ marginBottom: 14 }}>
                    <span>✅</span> Top Strengths
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {report.survival.strengths.map((s, i) => (
                      <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-success)', fontWeight: 700, flexShrink: 0 }}>↑</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card">
                  <div className="section-title" style={{ marginBottom: 14 }}>
                    <span>⚠️</span> Key Risks
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {report.survival.riskFactors.map((r, i) => (
                      <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-warning)', fontWeight: 700, flexShrink: 0 }}>!</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Metrics Row */}
              <div className="grid-4">
                <div className="metric-card" style={{ borderTop: '2px solid #10b981' }}>
                  <div className="metric-value" style={{ color: '#10b981' }}>{report.workforce.total.toLocaleString('en-IN')}</div>
                  <div className="metric-label">Skilled Workers</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Avg ₹{report.workforce.avgWage.toLocaleString('en-IN')}/mo</div>
                </div>
                <div className="metric-card" style={{ borderTop: '2px solid #06b6d4' }}>
                  <div className="metric-value" style={{ color: '#06b6d4' }}>₹{report.location.rent}</div>
                  <div className="metric-label">Rent / sqft</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{report.location.recommended}</div>
                </div>
                <div className="metric-card" style={{ borderTop: '2px solid #f59e0b' }}>
                  <div className="metric-value" style={{ color: '#f59e0b' }}>{report.activity.active}</div>
                  <div className="metric-label">Active Cos</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{report.activity.closures} closures · {report.activity.category}</div>
                </div>
                <div className="metric-card" style={{ borderTop: '2px solid #ec4899' }}>
                  <div className="metric-value" style={{ color: '#ec4899' }}>{report.demand.cagr}%</div>
                  <div className="metric-label">5-Year CAGR</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Demand Forecast</div>
                </div>
              </div>

              {/* Investors */}
              <div className="card">
                <div className="section-title" style={{ marginBottom: 14 }}>
                  <div className="section-title-icon">🤝</div>
                  Matching Investors — {report.city} · {report.type}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {report.investors.map((inv, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 10,
                      border: '1px solid var(--border-color)',
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 3 }}>{inv.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inv.focus} · {inv.stage} · {inv.cheque}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.1rem', color: inv.score >= 80 ? '#10b981' : '#f59e0b' }}>{inv.score}%</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Match</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Cities */}
              {report.alternatives && (
                <div className="card" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div className="section-title" style={{ marginBottom: 14 }}>
                    <span>💡</span> Better Alternative Cities (Score below 80)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {report.alternatives.map((c, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 14px', background: 'var(--bg-card)', borderRadius: 10,
                        border: '1px solid var(--border-color)',
                      }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.city}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 10 }}>{c.reason}</span>
                        </div>
                        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#10b981' }}>{c.score}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvisorPage
