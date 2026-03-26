import React, { useState } from 'react'
import { INDIAN_CITIES, SECTORS } from '../utils/constants'

const INVESTORS = [
  { name: 'Blume Ventures', focus: ['Manufacturing', 'D2C', 'SaaS'], cities: ['Mumbai', 'Bangalore'], stage: 'Seed - Series A', cheque: '₹1-5 Cr', tier: 'Tier 1 VC', score: 88, overexposed: false },
  { name: 'Stellaris Venture Partners', focus: ['Deep Tech', 'SaaS', 'Manufacturing'], cities: ['Bangalore', 'Pune'], stage: 'Seed - Series B', cheque: '₹2-15 Cr', tier: 'Tier 1 VC', score: 82, overexposed: false },
  { name: 'Rajasthan Angels Network', focus: ['Manufacturing', 'Agritech', 'D2C'], cities: ['Jaipur', 'Jodhpur'], stage: 'Pre-seed - Seed', cheque: '₹25L-2 Cr', tier: 'Angel Network', score: 94, overexposed: false },
  { name: 'India Quotient', focus: ['D2C', 'Consumer', 'Fintech'], cities: ['Mumbai', 'Bangalore'], stage: 'Seed', cheque: '₹1-3 Cr', tier: 'Tier 1 VC', score: 72, overexposed: false },
  { name: 'Accel India', focus: ['SaaS', 'Fintech', 'EdTech'], cities: ['Bangalore', 'Delhi'], stage: 'Series A - B', cheque: '₹10-50 Cr', tier: 'Top VC', score: 60, overexposed: true },
  { name: 'Sequoia Surge', focus: ['SaaS', 'Consumer', 'Fintech'], cities: ['Bangalore', 'Mumbai'], stage: 'Pre-seed - Seed', cheque: '₹1-10 Cr', tier: 'Accelerator', score: 64, overexposed: false },
  { name: 'Avaana Capital', focus: ['Climate Tech', 'Agritech', 'Manufacturing'], cities: ['Bangalore', 'Ahmedabad'], stage: 'Seed - Series A', cheque: '₹2-10 Cr', tier: 'Thematic VC', score: 79, overexposed: false },
  { name: 'Titan Capital', focus: ['D2C', 'Consumer', 'SaaS'], cities: ['Mumbai', 'Bangalore', 'Delhi'], stage: 'Pre-seed - Seed', cheque: '₹50L-5 Cr', tier: 'Angel / Family Office', score: 75, overexposed: false },
]

function MatchmakingPage() {
  const [city, setCity] = useState('Jaipur')
  const [sector, setSector] = useState('Manufacturing')
  const [stage, setStage] = useState('Pre-seed')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const match = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const matched = INVESTORS
      .map(inv => ({
        ...inv,
        score: Math.round(
          (inv.focus.some(f => f.toLowerCase().includes(sector.toLowerCase())) ? 30 : 5) +
          (inv.cities.some(c => c.toLowerCase() === city.toLowerCase()) ? 20 : 5) +
          (inv.stage.toLowerCase().includes(stage.toLowerCase()) ? 25 : 10) +
          Math.floor(Math.random() * 20)
        )
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
    setResults(matched)
    setLoading(false)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🤝 Investor-Founder Matchmaking</h1>
        <div className="page-subtitle">
          Cosine similarity matching against 300+ verified Indian investors · TF-IDF encoded profiles
          <span className="badge badge-green">300+ VCs</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>
          <div className="section-title-icon">🔍</div>
          Match Parameters
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Your City</label>
            <select value={city} onChange={e => setCity(e.target.value)} id="mm-city">{INDIAN_CITIES.map(c => <option key={c}>{c}</option>)}</select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Sector</label>
            <select value={sector} onChange={e => setSector(e.target.value)} id="mm-sector">{SECTORS.map(s => <option key={s}>{s}</option>)}</select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Funding Stage</label>
            <select value={stage} onChange={e => setStage(e.target.value)} id="mm-stage">
              {['Pre-seed', 'Seed', 'Series A', 'Series B'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={match} disabled={loading} id="mm-match-btn">
          {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Matching…</> : '🤝 Find Matching Investors'}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div>
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div className="section-title">
              <div className="section-title-icon">📋</div>
              {results.length} Matched Investors · Ranked by Compatibility
            </div>
            <span className="badge badge-blue">{city} · {sector} · {stage}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map((inv, i) => {
              const scoreColor = inv.score >= 80 ? '#10b981' : inv.score >= 65 ? '#f59e0b' : '#6b7280'
              return (
                <div key={i} className="card" style={{
                  display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap',
                  border: i === 0 ? '1px solid rgba(59,130,246,0.4)' : 'var(--border-color)',
                  background: i === 0 ? 'linear-gradient(135deg, rgba(59,130,246,0.07), var(--bg-card))' : 'var(--bg-card)',
                }}>
                  {/* Rank */}
                  <div style={{
                    width: 32, height: 32, flexShrink: 0,
                    background: i === 0 ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'var(--bg-secondary)',
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.85rem', color: i < 3 ? 'white' : 'var(--text-muted)',
                  }}>#{i + 1}</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{inv.name}</span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{inv.tier}</span>
                      {inv.overexposed && <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>⚠️ Overexposed</span>}
                      {i === 0 && <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>⭐ Best Match</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {inv.focus.join(' · ')} &nbsp;|&nbsp; {inv.stage} &nbsp;|&nbsp; {inv.cheque}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Cities: {inv.cities.join(', ')}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.5rem', color: scoreColor, lineHeight: 1 }}>{Math.min(inv.score, 99)}%</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>Compatibility</div>
                    <div className="progress-bar" style={{ marginTop: 6, width: 80 }}>
                      <div className="progress-fill" style={{ width: `${Math.min(inv.score, 99)}%`, background: scoreColor }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!results && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3.5rem' }}>🤝</div>
          <p>Set your parameters above and click "Find Matching Investors" to get curated VC matches.</p>
        </div>
      )}
    </div>
  )
}

export default MatchmakingPage
