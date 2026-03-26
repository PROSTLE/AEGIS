import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { getScoreColor, SECTORS } from '../utils/constants'

const CITIES_DATA = [
  { name: 'Bangalore', score: 92, lat: 12.97, lng: 77.59, sector_scores: { fintech: 88, saas: 95, agritech: 72, d2c: 85, manufacturing: 65 }, trend: 'up', startups: 8400 },
  { name: 'Mumbai', score: 88, lat: 19.07, lng: 72.87, sector_scores: { fintech: 95, saas: 82, agritech: 55, d2c: 91, manufacturing: 60 }, trend: 'up', startups: 9200 },
  { name: 'Delhi', score: 85, lat: 28.61, lng: 77.20, sector_scores: { fintech: 82, saas: 80, agritech: 68, d2c: 88, manufacturing: 70 }, trend: 'stable', startups: 7800 },
  { name: 'Pune', score: 83, lat: 18.52, lng: 73.85, sector_scores: { fintech: 75, saas: 90, agritech: 60, d2c: 78, manufacturing: 82 }, trend: 'up', startups: 4200 },
  { name: 'Hyderabad', score: 81, lat: 17.38, lng: 78.48, sector_scores: { fintech: 78, saas: 86, agritech: 72, d2c: 74, manufacturing: 76 }, trend: 'up', startups: 3800 },
  { name: 'Ahmedabad', score: 79, lat: 23.02, lng: 72.57, sector_scores: { fintech: 70, saas: 65, agritech: 78, d2c: 80, manufacturing: 90 }, trend: 'up', startups: 2900 },
  { name: 'Chennai', score: 77, lat: 13.08, lng: 80.27, sector_scores: { fintech: 75, saas: 80, agritech: 65, d2c: 72, manufacturing: 85 }, trend: 'stable', startups: 2600 },
  { name: 'Jaipur', score: 74, lat: 26.91, lng: 75.78, sector_scores: { fintech: 62, saas: 58, agritech: 70, d2c: 76, manufacturing: 82 }, trend: 'up', startups: 1200 },
  { name: 'Kochi', score: 71, lat: 9.93, lng: 76.26, sector_scores: { fintech: 78, saas: 68, agritech: 65, d2c: 70, manufacturing: 60 }, trend: 'up', startups: 980 },
  { name: 'Indore', score: 69, lat: 22.71, lng: 75.85, sector_scores: { fintech: 60, saas: 62, agritech: 72, d2c: 70, manufacturing: 75 }, trend: 'up', startups: 850 },
  { name: 'Chandigarh', score: 68, lat: 30.74, lng: 76.78, sector_scores: { fintech: 65, saas: 60, agritech: 65, d2c: 68, manufacturing: 72 }, trend: 'stable', startups: 620 },
  { name: 'Coimbatore', score: 72, lat: 11.00, lng: 76.96, sector_scores: { fintech: 60, saas: 64, agritech: 75, d2c: 68, manufacturing: 88 }, trend: 'up', startups: 760 },
  { name: 'Kolkata', score: 67, lat: 22.57, lng: 88.36, sector_scores: { fintech: 70, saas: 65, agritech: 70, d2c: 72, manufacturing: 65 }, trend: 'stable', startups: 1800 },
  { name: 'Nagpur', score: 63, lat: 21.14, lng: 79.08, sector_scores: { fintech: 55, saas: 52, agritech: 75, d2c: 65, manufacturing: 70 }, trend: 'up', startups: 480 },
  { name: 'Vadodara', score: 65, lat: 22.30, lng: 73.20, sector_scores: { fintech: 58, saas: 55, agritech: 70, d2c: 65, manufacturing: 82 }, trend: 'stable', startups: 540 },
  { name: 'Surat', score: 70, lat: 21.17, lng: 72.83, sector_scores: { fintech: 62, saas: 58, agritech: 65, d2c: 78, manufacturing: 88 }, trend: 'up', startups: 720 },
  { name: 'Lucknow', score: 62, lat: 26.85, lng: 80.94, sector_scores: { fintech: 60, saas: 55, agritech: 68, d2c: 65, manufacturing: 62 }, trend: 'up', startups: 680 },
  { name: 'Bhopal', score: 58, lat: 23.25, lng: 77.40, sector_scores: { fintech: 50, saas: 48, agritech: 72, d2c: 60, manufacturing: 62 }, trend: 'stable', startups: 380 },
]

function HeatmapPage() {
  const svgRef = useRef(null)
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedCity, setSelectedCity] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, city: null })

  const getDisplayScore = (city) => {
    if (selectedSector === 'all') return city.score
    return city.sector_scores[selectedSector] || city.score
  }

  // Render city grid (visual heatmap without GeoJSON)
  const sortedCities = [...CITIES_DATA].sort((a, b) => getDisplayScore(b) - getDisplayScore(a))

  const getColor = (score) => {
    if (score >= 80) return '#10b981'
    if (score >= 65) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">🗺️ City Startup Heatmap</h1>
        <div className="page-subtitle">
          Ecosystem health scores (0–100) across 18+ Indian cities · Updated nightly
        </div>
      </div>

      {/* Sector Filter */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Filter by Sector:</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[{ value: 'all', label: 'All Sectors' }, ...SECTORS.slice(0, 5).map(s => ({ value: s.toLowerCase(), label: s }))].map(opt => (
              <button
                key={opt.value}
                onClick={() => setSelectedSector(opt.value)}
                className={`btn btn-sm ${selectedSector === opt.value ? 'btn-primary' : 'btn-secondary'}`}
                id={`heatmap-filter-${opt.value}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* City Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {sortedCities.map((city, i) => {
          const score = getDisplayScore(city)
          const color = getColor(score)
          const isSelected = selectedCity?.name === city.name
          return (
            <div
              key={city.name}
              onClick={() => setSelectedCity(isSelected ? null : city)}
              id={`city-card-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                background: isSelected ? `${color}20` : 'var(--bg-card)',
                border: `1px solid ${isSelected ? color : 'var(--border-color)'}`,
                borderRadius: 12,
                padding: '16px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none' } }}
            >
              {/* Color bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, boxShadow: `0 0 8px ${color}` }} />

              {/* Rank */}
              <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>#{i + 1}</div>

              <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Outfit', color, lineHeight: 1, marginBottom: 4 }}>{score}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{city.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{city.startups.toLocaleString('en-IN')} cos</span>
                {city.trend === 'up' && <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>↑</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { color: '#10b981', label: '≥80 : High Opportunity', sub: 'Underserved · Go' },
          { color: '#f59e0b', label: '65–79 : Moderate', sub: 'Growing · Proceed with care' },
          { color: '#ef4444', label: '<65 : Saturated / Early', sub: 'Validate first' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{l.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected City Detail */}
      {selectedCity && (
        <div className="card" style={{ border: `1px solid ${getColor(getDisplayScore(selectedCity))}40`, background: `linear-gradient(135deg, ${getColor(getDisplayScore(selectedCity))}08, var(--bg-card))` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem' }}>{selectedCity.name}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
                {selectedCity.startups.toLocaleString('en-IN')} active companies · {selectedCity.trend === 'up' ? '↑ Growing' : '→ Stable'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit', color: getColor(getDisplayScore(selectedCity)) }}>{getDisplayScore(selectedCity)}/100</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Overall Score</div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Sector Breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {Object.entries(selectedCity.sector_scores).map(([sector, score]) => (
              <div key={sector} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'capitalize' }}>{sector}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.88rem', color: getColor(score) }}>{score}</span>
                </div>
                <div className="progress-bar" style={{ height: 4 }}>
                  <div className="progress-fill" style={{ width: `${score}%`, background: getColor(score) }} />
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
