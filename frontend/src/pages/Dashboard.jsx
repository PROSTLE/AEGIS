import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CITY_DATA = {
  Jaipur: { score: 74, sector: 'Manufacturing', trend: '+12%', ecosystemScore: 68, workforceScore: 77, logisticsScore: 71, demandScore: 79 },
  Bangalore: { score: 92, sector: 'SaaS', trend: '+8%', ecosystemScore: 95, workforceScore: 91, logisticsScore: 83, demandScore: 88 },
  Pune: { score: 85, sector: 'SaaS / EdTech', trend: '+15%', ecosystemScore: 87, workforceScore: 84, logisticsScore: 79, demandScore: 83 },
  Ahmedabad: { score: 81, sector: 'Manufacturing', trend: '+18%', ecosystemScore: 79, workforceScore: 76, logisticsScore: 88, demandScore: 82 },
  Coimbatore: { score: 72, sector: 'Manufacturing', trend: '+22%', ecosystemScore: 65, workforceScore: 80, logisticsScore: 74, demandScore: 77 },
}

const FEATURES = [
  {
    path: '/heatmap',
    icon: '🗺️',
    title: 'City Startup Heatmap',
    desc: 'Ecosystem health scores across 50+ Indian cities. Filter by sector & track growth trends.',
    color: '#3b82f6',
    stat: '50+ Cities',
    badge: 'LIVE',
  },
  {
    path: '/survival',
    icon: '⚡',
    title: 'Survival Predictor',
    desc: 'XGBoost AI trained on 2,000+ Indian startups. Predicts 3-year survival probability with SHAP explainability.',
    color: '#8b5cf6',
    stat: 'AUC 0.72+',
    badge: 'AI',
  },
  {
    path: '/logistics',
    icon: '🚚',
    title: 'Logistics Stress Test',
    desc: 'Last-mile density, supplier proximity, highway access, port distances & logistics cost index.',
    color: '#06b6d4',
    stat: '8 Metrics',
    badge: null,
  },
  {
    path: '/workforce',
    icon: '👥',
    title: 'Workforce Intelligence',
    desc: 'Role-specific talent availability, salary benchmarks, and top hiring channels per city & sector.',
    color: '#10b981',
    stat: 'Census Data',
    badge: null,
  },
  {
    path: '/location',
    icon: '📍',
    title: 'Location & Land Intel',
    desc: 'Optimal industrial zones ranked by ₹/sqft, zoning laws, and proximity to suppliers & highways.',
    color: '#f59e0b',
    stat: 'Zone Scores',
    badge: null,
  },
  {
    path: '/activity',
    icon: '📊',
    title: 'Verified Activity',
    desc: 'Cross-verified DPIIT + MCA21 + GST data. Get real active counts and market Crowding Index.',
    color: '#ef4444',
    stat: 'MCA21 Live',
    badge: null,
  },
  {
    path: '/demand',
    icon: '📈',
    title: 'Demand Forecast',
    desc: 'Prophet ML on GST collections + Google Trends. 5-year CAGR projections with survival curves.',
    color: '#ec4899',
    stat: '5-Year View',
    badge: 'ML',
  },
  {
    path: '/matchmaking',
    icon: '🤝',
    title: 'Investor Matchmaking',
    desc: 'TF-IDF cosine similarity matching with 300+ Indian investors from AngelList, LetsVenture & VCs.',
    color: '#14b8a6',
    stat: '300+ VCs',
    badge: null,
  },
  {
    path: '/advisor',
    icon: '🎯',
    title: 'AI Advisor',
    desc: 'RAG pipeline with Gemini 1.5 Flash. Full terrain report with Launch Readiness Score in 3 minutes.',
    color: '#6366f1',
    stat: 'Gemini AI',
    badge: 'NEW',
  },
]

const TOP_CITIES = [
  { name: 'Bangalore', score: 92, trend: '↑18%', sector: 'SaaS', status: 'high' },
  { name: 'Pune', score: 85, trend: '↑15%', sector: 'SaaS/EdTech', status: 'high' },
  { name: 'Ahmedabad', score: 81, trend: '↑18%', sector: 'Manufacturing', status: 'high' },
  { name: 'Jaipur', score: 74, trend: '↑12%', sector: 'Manufacturing', status: 'medium' },
  { name: 'Coimbatore', score: 72, trend: '↑22%', sector: 'MfgTech', status: 'medium' },
  { name: 'Kochi', score: 68, trend: '↑9%', sector: 'Fintech', status: 'medium' },
]

function ScoreRing({ score, size = 110 }) {
  const statusColor = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const circumference = 2 * Math.PI * 42
  const dash = (score / 100) * circumference

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke={statusColor}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${statusColor})`, transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 800, fontFamily: 'Outfit', color: statusColor, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.1, color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="metric-card" style={{ borderTop: `2px solid ${color}` }}>
      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{icon}</div>
      <div className="metric-value" style={{ color }}>{value}</div>
      <div className="metric-label">{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function Dashboard() {
  const [selectedCity, setSelectedCity] = useState('Jaipur')
  const [animatedScores, setAnimatedScores] = useState({ ecosystem: 0, workforce: 0, logistics: 0, demand: 0 })
  const cityData = CITY_DATA[selectedCity]

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores({
        ecosystem: cityData.ecosystemScore,
        workforce: cityData.workforceScore,
        logistics: cityData.logisticsScore,
        demand: cityData.demandScore,
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [selectedCity, cityData])

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(6,182,212,0.05) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20,
        padding: '32px 36px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative Orbs */}
        <div style={{
          position: 'absolute', top: -60, right: -40,
          width: 220, height: 220,
          background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: '40%',
          width: 160, height: 160,
          background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', position: 'relative' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span className="badge badge-blue">🇮🇳 India-First Platform</span>
              <span className="badge badge-green">● Live Data</span>
            </div>
            <h1 className="page-title" style={{ fontSize: '2.2rem', marginBottom: 10 }}>
              Don't Launch <span style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Blind.</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 500 }}>
              AEGIS predicts startup survival using verified Indian government data — so you know exactly where and why to launch.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/advisor" className="btn btn-primary" id="hero-get-report-btn">
                🎯 Generate Terrain Report
              </Link>
              <Link to="/heatmap" className="btn btn-secondary" id="hero-view-heatmap-btn">
                🗺️ View India Heatmap
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <ScoreRing score={cityData.score} size={130} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedCity}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Launch Readiness Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* City Selector & Quick Stats */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Quick City Preview:</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.keys(CITY_DATA).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`btn btn-sm ${selectedCity === city ? 'btn-primary' : 'btn-secondary'}`}
                id={`city-btn-${city.toLowerCase()}`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-4" style={{ gap: 16 }}>
          {[
            { icon: '🌐', label: 'Ecosystem Score', value: animatedScores.ecosystem, color: '#3b82f6', sub: `${selectedCity} · ${cityData.sector}` },
            { icon: '👥', label: 'Workforce Score', value: animatedScores.workforce, color: '#10b981', sub: 'Talent availability index' },
            { icon: '🚚', label: 'Logistics Score', value: animatedScores.logistics, color: '#06b6d4', sub: 'Supply chain viability' },
            { icon: '📈', label: 'Demand Score', value: animatedScores.demand, color: '#8b5cf6', sub: `CAGR: ${cityData.trend}` },
          ].map(s => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div className="section-title">
            <div className="section-title-icon">🧩</div>
            8 Intelligence Modules
          </div>
          <Link to="/advisor" className="btn btn-secondary btn-sm" id="view-all-features-btn">View All →</Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {FEATURES.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              id={`feature-card-${feature.title.toLowerCase().replace(/[^a-z]/g, '-')}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{ height: '100%', cursor: 'pointer', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 42, height: 42,
                    background: `${feature.color}20`,
                    border: `1px solid ${feature.color}40`,
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                  }}>
                    {feature.icon}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {feature.badge && (
                      <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{feature.badge}</span>
                    )}
                    <span style={{ fontSize: '0.7rem', color: feature.color, fontWeight: 700, background: `${feature.color}15`, padding: '2px 8px', borderRadius: 9999 }}>
                      {feature.stat}
                    </span>
                  </div>
                </div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: 6 }}>{feature.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{feature.desc}</p>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 4, color: feature.color, fontSize: '0.8rem', fontWeight: 600 }}>
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Cities Leaderboard */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title">
            <div className="section-title-icon">🏆</div>
            Top Cities by Startup Potential
          </div>
          <Link to="/heatmap" className="btn btn-secondary btn-sm" id="view-heatmap-btn">View Heatmap →</Link>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                {['Rank', 'City', 'Score', 'Trend', 'Best Sector', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_CITIES.map((city, i) => (
                <tr key={city.name} style={{
                  borderBottom: i < TOP_CITIES.length - 1 ? '1px solid var(--border-color)' : 'none',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      width: 24, height: 24,
                      background: i < 3 ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'var(--bg-secondary)',
                      borderRadius: 6,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: i < 3 ? 'white' : 'var(--text-muted)',
                    }}>
                      {i + 1}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{city.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: city.score >= 80 ? '#10b981' : city.score >= 60 ? '#f59e0b' : '#ef4444', fontSize: '1rem' }}>
                      {city.score}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/100</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>{city.trend}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{city.sector}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${city.status === 'high' ? 'badge-green' : 'badge-yellow'}`}>
                      {city.status === 'high' ? '● Go' : '● Moderate'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
        border: '1px solid rgba(59,130,246,0.25)',
        borderRadius: 16,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit', marginBottom: 6 }}>
            Ready to find your perfect city?
          </div>
          <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-secondary)' }}>
            Get a full terrain report with Launch Readiness Score in under 3 minutes.
          </p>
        </div>
        <Link to="/advisor" className="btn btn-primary btn-lg" id="cta-generate-btn">
          🎯 Generate Free Report
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
