import React, { useState } from 'react'
import { SECTORS } from '../utils/constants'

const CITIES_DATA = [
  { name: 'Bangalore', score: 92, sector_scores: { fintech: 88, saas: 95, agritech: 72, d2c: 85, manufacturing: 65 }, trend: 'up', startups: 8400 },
  { name: 'Mumbai', score: 88, sector_scores: { fintech: 95, saas: 82, agritech: 55, d2c: 91, manufacturing: 60 }, trend: 'up', startups: 9200 },
  { name: 'Delhi', score: 85, sector_scores: { fintech: 82, saas: 80, agritech: 68, d2c: 88, manufacturing: 70 }, trend: 'stable', startups: 7800 },
  { name: 'Pune', score: 83, sector_scores: { fintech: 75, saas: 90, agritech: 60, d2c: 78, manufacturing: 82 }, trend: 'up', startups: 4200 },
  { name: 'Hyderabad', score: 81, sector_scores: { fintech: 78, saas: 86, agritech: 72, d2c: 74, manufacturing: 76 }, trend: 'up', startups: 3800 },
  { name: 'Ahmedabad', score: 79, sector_scores: { fintech: 70, saas: 65, agritech: 78, d2c: 80, manufacturing: 90 }, trend: 'up', startups: 2900 },
  { name: 'Chennai', score: 77, sector_scores: { fintech: 75, saas: 80, agritech: 65, d2c: 72, manufacturing: 85 }, trend: 'stable', startups: 2600 },
  { name: 'Jaipur', score: 74, sector_scores: { fintech: 62, saas: 58, agritech: 70, d2c: 76, manufacturing: 82 }, trend: 'up', startups: 1200 },
  { name: 'Kochi', score: 71, sector_scores: { fintech: 78, saas: 68, agritech: 65, d2c: 70, manufacturing: 60 }, trend: 'up', startups: 980 },
  { name: 'Indore', score: 69, sector_scores: { fintech: 60, saas: 62, agritech: 72, d2c: 70, manufacturing: 75 }, trend: 'up', startups: 850 },
  { name: 'Chandigarh', score: 68, sector_scores: { fintech: 65, saas: 60, agritech: 65, d2c: 68, manufacturing: 72 }, trend: 'stable', startups: 620 },
  { name: 'Coimbatore', score: 72, sector_scores: { fintech: 60, saas: 64, agritech: 75, d2c: 68, manufacturing: 88 }, trend: 'up', startups: 760 },
  { name: 'Kolkata', score: 67, sector_scores: { fintech: 70, saas: 65, agritech: 70, d2c: 72, manufacturing: 65 }, trend: 'stable', startups: 1800 },
  { name: 'Nagpur', score: 63, sector_scores: { fintech: 55, saas: 52, agritech: 75, d2c: 65, manufacturing: 70 }, trend: 'up', startups: 480 },
  { name: 'Vadodara', score: 65, sector_scores: { fintech: 58, saas: 55, agritech: 70, d2c: 65, manufacturing: 82 }, trend: 'stable', startups: 540 },
  { name: 'Surat', score: 70, sector_scores: { fintech: 62, saas: 58, agritech: 65, d2c: 78, manufacturing: 88 }, trend: 'up', startups: 720 },
  { name: 'Lucknow', score: 62, sector_scores: { fintech: 60, saas: 55, agritech: 68, d2c: 65, manufacturing: 62 }, trend: 'up', startups: 680 },
  { name: 'Bhopal', score: 58, sector_scores: { fintech: 50, saas: 48, agritech: 72, d2c: 60, manufacturing: 62 }, trend: 'stable', startups: 380 },
]

const scoreColor = (score) => score >= 80 ? 'var(--secondary)' : score >= 65 ? '#fbbf24' : 'var(--error)'
const scoreRaw = (score) => score >= 80 ? '#69f6b8' : score >= 65 ? '#fbbf24' : '#ff6b6b'

function HeatmapPage() {
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedCity, setSelectedCity] = useState(null)

  const getDisplayScore = (city) => {
    if (selectedSector === 'all') return city.score
    return city.sector_scores[selectedSector] || city.score
  }

  const sortedCities = [...CITIES_DATA].sort((a, b) => getDisplayScore(b) - getDisplayScore(a))

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>City Startup Heatmap</h1>
        <div className="page-subtitle">
          Ecosystem health scores (0–100) across 18+ Indian cities · Updated nightly
        </div>
      </div>

      {/* Sector Filter */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>Filter by Sector:</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[{ value: 'all', label: 'All Sectors' }, ...['fintech', 'saas', 'agritech', 'd2c', 'manufacturing'].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))].map(opt => (
              <button
                key={opt.value}
                onClick={() => setSelectedSector(opt.value)}
                className={`btn btn-sm ${selectedSector === opt.value ? 'btn-primary' : 'btn-secondary'}`}
                id={`heatmap-filter-${opt.value}`}
              >{opt.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { color: '#69f6b8', label: '≥80 · High Opportunity', sub: 'Underserved · Go' },
          { color: '#fbbf24', label: '65–79 · Moderate', sub: 'Growing · Proceed with care' },
          { color: '#ff6b6b', label: '<65 · Saturated / Early', sub: 'Validate first' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface)' }}>{l.label}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--outline)' }}>{l.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* City Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10, marginBottom: 24 }}>
        {sortedCities.map((city, i) => {
          const score = getDisplayScore(city)
          const col = scoreColor(score)
          const raw = scoreRaw(score)
          const isSelected = selectedCity?.name === city.name
          return (
            <div
              key={city.name}
              onClick={() => setSelectedCity(isSelected ? null : city)}
              id={`city-card-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                padding: '18px 14px',
                borderRadius: 'var(--radius-xl)',
                background: isSelected ? `${raw}10` : 'var(--bg-surface-container-low)',
                border: `1px solid ${isSelected ? raw + '40' : 'rgba(255,255,255,0.05)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = raw + '40'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none' } }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: raw, boxShadow: `0 0 8px ${raw}` }} />
              <div style={{ position: 'absolute', top: 10, right: 10, fontFamily: 'Space Grotesk', fontSize: '0.55rem', fontWeight: 700, color: 'var(--outline)' }}>#{i + 1}</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.8rem', color: col, lineHeight: 1, marginBottom: 4, letterSpacing: '-0.03em' }}>{score}</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.9rem', marginBottom: 5 }}>{city.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--outline)' }}>{city.startups.toLocaleString('en-IN')}</span>
                {city.trend === 'up' && <span className="material-symbols-outlined" style={{ fontSize: 12, color: 'var(--secondary)' }}>trending_up</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected City Detail */}
      {selectedCity && (
        <div className="card" style={{ border: `1px solid ${scoreRaw(getDisplayScore(selectedCity))}28`, background: `${scoreRaw(getDisplayScore(selectedCity))}05` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>{selectedCity.name}</h2>
              <p style={{ margin: '4px 0 0', fontFamily: 'Space Grotesk', fontSize: '0.72rem', color: 'var(--outline)' }}>
                {selectedCity.startups.toLocaleString('en-IN')} active companies · {selectedCity.trend === 'up' ? 'Growing' : 'Stable'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '2.5rem', color: scoreColor(getDisplayScore(selectedCity)), lineHeight: 1, letterSpacing: '-0.04em' }}>
                {getDisplayScore(selectedCity)}<span style={{ fontSize: '1rem', opacity: 0.4 }}>/100</span>
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall Score</div>
            </div>
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>Sector Breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {Object.entries(selectedCity.sector_scores).map(([sector, score]) => (
              <div key={sector} style={{ background: 'var(--bg-surface-container)', borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Manrope', fontSize: '0.82rem', fontWeight: 700, textTransform: 'capitalize' }}>{sector}</span>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.88rem', color: scoreColor(score) }}>{score}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${score}%`, background: scoreColor(score), borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeatmapPage
