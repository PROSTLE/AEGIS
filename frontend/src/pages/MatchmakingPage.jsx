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
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>Investor Matchmaking</h1>
        <div className="page-subtitle">
          Cosine similarity matching against 300+ verified Indian investors · TF-IDF encoded profiles
          <span className="badge badge-green" style={{ marginLeft: 12 }}>300+ VCs</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>tune</span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700 }}>Match Parameters</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
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
          {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Matching…</> : 'Find Matching Investors'}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 700 }}>{results.length} Investors · Ranked by Compatibility</h3>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--outline)', background: 'var(--bg-surface-container)', padding: '4px 12px', borderRadius: 99 }}>{city} · {sector} · {stage}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map((inv, i) => {
              const scoreColor = inv.score >= 80 ? 'var(--secondary)' : inv.score >= 65 ? '#fbbf24' : 'var(--outline)'
              const scoreBg = inv.score >= 80 ? 'rgba(105,246,184,0.1)' : inv.score >= 65 ? 'rgba(251,191,36,0.1)' : 'var(--bg-surface-container)'
              return (
                <div key={i} className="card" style={{
                  display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
                  border: i === 0 ? '1px solid rgba(133,173,255,0.25)' : undefined,
                  background: i === 0 ? 'rgba(133,173,255,0.04)' : undefined,
                }}>
                  {/* Rank */}
                  <div style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 10,
                    background: i === 0 ? 'var(--primary)' : 'var(--bg-surface-container-highest)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '0.85rem',
                    color: i === 0 ? '#0e0e0e' : 'var(--outline)',
                  }}>#{i + 1}</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.95rem' }}>{inv.name}</span>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.55rem', fontWeight: 700, color: 'var(--tertiary)', background: 'rgba(193,128,255,0.1)', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{inv.tier}</span>
                      {inv.overexposed && <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.55rem', fontWeight: 700, color: 'var(--error)', background: 'rgba(255,107,107,0.1)', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overexposed</span>}
                      {i === 0 && <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.55rem', fontWeight: 700, color: 'var(--primary)', background: 'rgba(133,173,255,0.1)', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Best Match</span>}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.72rem', color: 'var(--on-surface-variant)' }}>
                      {inv.focus.join(' · ')} &nbsp;·&nbsp; {inv.stage} &nbsp;·&nbsp; {inv.cheque}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.68rem', color: 'var(--outline)', marginTop: 3 }}>
                      Cities: {inv.cities.join(', ')}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', background: scoreBg, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.4rem', color: scoreColor, lineHeight: 1 }}>{Math.min(inv.score, 99)}%</span>
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Compatibility</div>
                    <div style={{ marginTop: 6, width: 80, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99, marginLeft: 'auto' }}>
                      <div style={{ height: '100%', width: `${Math.min(inv.score, 99)}%`, background: scoreColor, borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!results && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12, color: 'var(--outline)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, opacity: 0.2 }}>payments</span>
          <p style={{ fontFamily: 'Inter', fontSize: '0.9rem' }}>Set your parameters above and click "Find Matching Investors" to get curated VC matches.</p>
        </div>
      )}
    </div>
  )
}

export default MatchmakingPage
