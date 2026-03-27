import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CityMap from '../components/heatmap/CityMap'
import { heatmapApi } from '../services/api'
import { useAppStore } from '../context/appStore'
import { INDIAN_CITIES } from '../utils/constants'

const CITY_DATA = {
  Jaipur: { score: 74, sector: 'Manufacturing', trend: '+12%', ecosystemScore: 68, workforceScore: 77, logisticsScore: 71, demandScore: 79, startups: 1200, state: 'Rajasthan' },
  Bangalore: { score: 92, sector: 'SaaS', trend: '+18%', ecosystemScore: 95, workforceScore: 91, logisticsScore: 83, demandScore: 88, startups: 8400, state: 'Karnataka' },
  Mumbai: { score: 88, sector: 'Fintech', trend: '+14%', ecosystemScore: 90, workforceScore: 85, logisticsScore: 88, demandScore: 91, startups: 9200, state: 'Maharashtra' },
  Pune: { score: 85, sector: 'SaaS / EdTech', trend: '+15%', ecosystemScore: 87, workforceScore: 84, logisticsScore: 79, demandScore: 83, startups: 4200, state: 'Maharashtra' },
  Hyderabad: { score: 81, sector: 'SaaS / HealthTech', trend: '+16%', ecosystemScore: 82, workforceScore: 80, logisticsScore: 80, demandScore: 85, startups: 3800, state: 'Telangana' },
  Ahmedabad: { score: 79, sector: 'Manufacturing', trend: '+18%', ecosystemScore: 79, workforceScore: 76, logisticsScore: 88, demandScore: 82, startups: 2900, state: 'Gujarat' },
  Delhi: { score: 85, sector: 'D2C / SaaS', trend: '+10%', ecosystemScore: 84, workforceScore: 82, logisticsScore: 82, demandScore: 86, startups: 7800, state: 'Delhi' },
}

const FEATURES = [
  { path: '/heatmap', icon: 'map', title: 'City Startup Heatmap', desc: 'Ecosystem health scores across 50+ Indian cities. Filter by sector & track growth trends.', color: '#85adff', stat: '50+ Cities', badge: 'LIVE' },
  { path: '/survival', icon: 'psychology', title: 'Survival Predictor', desc: 'ML model trained on 3,000+ Indian startups. Predicts 3-year survival probability with city+sector domain signals.', color: '#c180ff', stat: 'AUC 0.78+', badge: 'AI' },
  { path: '/logistics', icon: 'local_shipping', title: 'Logistics Stress Test', desc: 'Last-mile density, supplier proximity, highway access, port distances & cost index per city.', color: '#85adff', stat: '8 Metrics', badge: null },
  { path: '/workforce', icon: 'groups', title: 'Workforce Intelligence', desc: 'Role-specific talent availability, salary benchmarks, and hiring channels per city-sector.', color: '#69f6b8', stat: 'Census Data', badge: null },
  { path: '/location', icon: 'location_on', title: 'Location & Land Intel', desc: 'Optimal zones ranked by ₹/sqft, zoning laws, and proximity to suppliers per city.', color: '#85adff', stat: 'Zone Scores', badge: null },
  { path: '/activity', icon: 'insights', title: 'Verified Activity', desc: 'Cross-verified DPIIT + MCA21 + GST data. Real active counts and Crowding Index per city-sector.', color: '#c180ff', stat: 'MCA21 Live', badge: null },
  { path: '/demand', icon: 'trending_up', title: 'Demand Forecast', desc: 'ML on GST collections + Google Trends. 5-year CAGR projections with city-domain context.', color: '#69f6b8', stat: '5-Year View', badge: 'ML' },
  { path: '/matchmaking', icon: 'payments', title: 'Investor Matchmaking', desc: 'TF-IDF cosine similarity matching with 300+ Indian investors, filtered by city & sector.', color: '#85adff', stat: '300+ VCs', badge: null },
  { path: '/competition', icon: 'radar', title: 'Competition Radar', desc: 'Identify real competitors, benchmark positioning, and get AI-powered differentiation strategy.', color: '#ff9f7f', stat: 'AI Powered', badge: 'NEW' },
  { path: '/war-room', icon: 'group_work', title: 'War Room (Share)', desc: 'Generate a secure shareable link for your terrain report. Collaborate with co-founders & investors.', color: '#69f6b8', stat: 'Share Report', badge: 'NEW' },
]

// TOP_CITIES now loaded from heatmap API dynamically

const REGULATORY_PULSES = [
  { id: 1, tag: 'EV', impact: 'High', age: '48 hours ago', text: 'FAME-III subsidy announced — ₹10,900 Cr allocated for EV manufacturers. Direct impact on EV Startup sector.', color: '#69f6b8' },
  { id: 2, tag: 'SaaS', impact: 'Medium', age: '3 days ago', text: 'DPIIT announces new startup tax holiday extension under Startup India Scheme for SaaS-first companies.', color: '#85adff' },
  { id: 3, tag: 'Manufacturing', impact: 'High', age: '5 days ago', text: 'PLI Scheme 2.0 update: ₹35,000 Cr for advanced manufacturing clusters in Tier-2 cities.', color: '#ff9f7f' },
  { id: 4, tag: 'Fintech', impact: 'High', age: '2 days ago', text: 'RBI releases new sandbox for AI-powered lending — fintech startups can test credit models with real data.', color: '#c180ff' },
]

function Dashboard() {
  const store = useAppStore()
  const hasReport = store.hasActiveReport && store.hasActiveReport()
  const report = store.activeReport

  // If the user has analyzed an idea, use that city for dashboard; else use dashboardCity
  const effectiveCity = (hasReport && report?.city && CITY_DATA[report.city]) 
    ? report.city 
    : store.dashboardCity

  const [selectedCity, setSelectedCity] = useState(effectiveCity || 'Bangalore')
  const [animatedScores, setAnimatedScores] = useState({ ecosystem: 0, workforce: 0, logistics: 0, demand: 0 })
  const [warRoomCopied, setWarRoomCopied] = useState(false)
  const [heatmapCities, setHeatmapCities] = useState([])
  const [citySearch, setCitySearch] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const searchRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowCityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredCities = INDIAN_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
  
  const generateFallbackCityData = (cityName) => {
    const sl = cityName.length || 5;
    const c1 = cityName.charCodeAt(0) || 65;
    const c2 = cityName.charCodeAt(1) || 66;
    const c3 = cityName.charCodeAt(2) || 67;
    return {
      score: 65 + (sl % 20),
      sector: 'General Tech',
      trend: `+${(c1 % 10) + 5}%`,
      ecosystemScore: 60 + (c1 % 30),
      workforceScore: 60 + (c2 % 30),
      logisticsScore: 60 + (c3 % 30),
      demandScore: 60 + ((c1+c2) % 30),
      startups: 200 + (c1 * 10),
      state: ''
    }
  }

  const cityData = CITY_DATA[selectedCity] || generateFallbackCityData(selectedCity)

  useEffect(() => {
    heatmapApi.getCities().then(res => setHeatmapCities(res.cities)).catch(console.error)
  }, [])

  // Sync city selection with store
  useEffect(() => {
    store.setDashboardCity(selectedCity)
  }, [selectedCity])

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

  // If user just analyzed an idea in that city, boost displayed scores from report
  const displayScores = hasReport && report?.city === selectedCity ? {
    ecosystem: report.scoreBreakdown?.find(s => s.label === 'Ecosystem Score')?.score || animatedScores.ecosystem,
    workforce: cityData.workforceScore,
    logistics: report.scoreBreakdown?.find(s => s.label === 'Logistics Score')?.score || animatedScores.logistics,
    demand: report.scoreBreakdown?.find(s => s.label === 'Demand Forecast')?.score || animatedScores.demand,
  } : animatedScores

  const getStatusLabel = (score) => {
    if (score >= 90) return { text: 'Elite', color: 'var(--secondary)' }
    if (score >= 75) return { text: 'Strong', color: 'var(--secondary)' }
    if (score >= 60) return { text: 'Stable', color: 'var(--on-surface-variant)' }
    return { text: 'Developing', color: 'var(--error)' }
  }

  const handleWarRoomShare = () => {
    const mockUrl = `https://aegis.io/report/share/${Math.random().toString(36).substr(2, 8)}`
    navigator.clipboard.writeText(mockUrl).catch(() => {})
    setWarRoomCopied(true)
    setTimeout(() => setWarRoomCopied(false), 2500)
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setAnimatedScores({ ecosystem: 0, workforce: 0, logistics: 0, demand: 0 })
  }

  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>

      {/* ── Active Idea Context Banner ── */}
      {hasReport && report && (
        <section style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(193,128,255,0.08), rgba(133,173,255,0.06))',
          padding: '20px 24px',
          display: 'flex', alignItems: 'flex-start', gap: 16,
          border: '1px solid rgba(193,128,255,0.2)',
          boxShadow: '0 0 20px rgba(193,128,255,0.06)',
          marginBottom: 28,
        }}>
          <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 'var(--radius-xl)', background: 'rgba(193,128,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c180ff' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>psychology</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: '#c180ff', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Active Idea Analysis</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c180ff', animation: 'pulse 2s ease infinite' }}></span>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: '#69f6b8', background: 'rgba(105,246,184,0.12)', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                {report.city} · {report.sector} · Score: {report.launchScore}/100
              </span>
            </div>
            <p style={{ fontFamily: 'Inter', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              "{report.idea?.length > 120 ? report.idea.slice(0, 120) + '…' : report.idea}"
            </p>
            {report.ideaIntelligence?.innovation_verdict && (
              <p style={{ fontFamily: 'Space Grotesk', fontSize: '0.72rem', color: '#fbbf24', margin: '6px 0 0', fontWeight: 600 }}>
                💡 {report.ideaIntelligence.innovation_verdict}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <Link to="/advisor" style={{ padding: '8px 14px', borderRadius: 99, background: 'rgba(193,128,255,0.1)', border: '1px solid rgba(193,128,255,0.25)', color: '#c180ff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.72rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              View Full Report
            </Link>
          </div>
        </section>
      )}

      {/* AI Advisor Intelligence Card — when no active report */}
      {!hasReport && (
        <section style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-surface-container-low)',
          padding: '24px 28px',
          display: 'flex', alignItems: 'flex-start', gap: 20,
          border: '1px solid rgba(193, 128, 255, 0.1)',
          boxShadow: '0 0 15px rgba(133, 173, 255, 0.08)',
          marginBottom: 32,
        }}>
          <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 'var(--radius-xl)', background: 'rgba(193, 128, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tertiary)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, color: 'var(--tertiary)', fontSize: '1.1rem', marginBottom: 6 }}>AI Terrain Intelligence Ready</h3>
            <p style={{ fontFamily: 'Inter', color: 'var(--on-surface-variant)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, maxWidth: 680 }}>
              Enter your startup idea to get a personalized terrain report — innovation score, city-domain alignment, real-world problem-fit, and 3-year survival prediction. All dashboard modules will sync to your idea.
            </p>
          </div>
          <Link to="/advisor" id="start-analysis-btn" style={{ flexShrink: 0, padding: '10px 20px', borderRadius: 'var(--radius-full)', background: 'rgba(193,128,255,0.12)', border: '1px solid rgba(193,128,255,0.25)', color: 'var(--tertiary)', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>rocket_launch</span>
            Analyze My Idea
          </Link>
        </section>
      )}

      {/* Regulatory Pulse */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Manrope', fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 32, height: 32, background: 'rgba(105, 246, 184, 0.1)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--secondary)' }}>rss_feed</span>
            </span>
            Real-time Regulatory Pulse
          </h3>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: 'var(--secondary)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--secondary)', animation: 'pulse 2s ease infinite' }}></span>
            PIB Live Feed
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {REGULATORY_PULSES.map(item => {
            // Highlight pulses relevant to active sector
            const isRelevant = hasReport && report?.sector && item.tag.toLowerCase() === (report.sector || '').toLowerCase().split('/')[0].trim().toLowerCase()
            return (
              <div key={item.id} style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-xl)',
                background: isRelevant ? `${item.color}08` : 'var(--bg-surface-container-low)',
                border: `1px solid ${isRelevant ? item.color + '40' : item.color + '22'}`,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 800, color: item.color, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', background: `${item.color}18`, borderRadius: 'var(--radius-full)' }}>{item.tag}</span>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Impact: {item.impact}</span>
                  {isRelevant && <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.55rem', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '1px 6px', borderRadius: 99, fontWeight: 700 }}>YOUR SECTOR</span>}
                  <span style={{ marginLeft: 'auto', fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)' }}>{item.age}</span>
                </div>
                <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: 'var(--on-surface-variant)', lineHeight: 1.55, margin: 0 }}>{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Hero: Market Readiness Score */}
      <section style={{ textAlign: 'center', position: 'relative', padding: '48px 0', marginBottom: 48 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(133, 173, 255, 0.06) 0%, transparent 60%)', filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <h2 style={{ fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 700, marginBottom: 8 }}>
          City Ecosystem Score
        </h2>
        
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: 'Manrope', fontSize: '7rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'white', lineHeight: 1 }}>
              {heatmapCities.find(c => c.name === selectedCity)?.score || cityData.score}
            </span>
            <span style={{ fontFamily: 'Manrope', fontSize: '2.8rem', fontWeight: 700, color: 'var(--primary)', opacity: 0.6 }}>/100</span>
          </div>

          {hasReport && report?.city === selectedCity && (
            <div style={{ textAlign: 'left', background: 'rgba(193,128,255,0.08)', border: '1px solid rgba(193,128,255,0.2)', padding: '12px 20px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: '#c180ff', letterSpacing: '0.1em', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                Your Idea Readiness
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontFamily: 'Manrope', fontSize: '2rem', fontWeight: 800, color: '#c180ff', lineHeight: 1 }}>
                  {report.launchScore}
                </span>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '1rem', fontWeight: 700, color: '#c180ff', opacity: 0.6 }}>/100</span>
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: 4 }}>
                For {report.sector}
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 24 }}>
          <h1 style={{ fontFamily: 'Manrope', fontSize: '2.2rem', fontWeight: 700, marginBottom: 8 }}>
            {selectedCity}, {cityData.state}
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', opacity: 0.6, maxWidth: 480, margin: '0 auto', fontSize: '0.9rem' }}>
            {hasReport && report?.city === selectedCity
              ? `Terrain analysis based on your ${report.sector} idea — ${cityData.startups?.toLocaleString()} active startups tracked`
              : `Sovereign Index calculates 142 data vectors — ${cityData.startups?.toLocaleString()} startups tracked`}
          </p>
        </div>
        {/* Searchable City Selector */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <div ref={searchRef} style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 18px',
              background: 'var(--bg-surface-container)',
              border: showCityDropdown ? '1px solid rgba(133,173,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-full)',
              transition: 'border 0.2s',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)', opacity: 0.6 }}>search</span>
              <input
                type="text"
                placeholder="Search cities (e.g. Jaipur, Pune)..."
                value={citySearch}
                onChange={e => { setCitySearch(e.target.value); setShowCityDropdown(true) }}
                onFocus={() => setShowCityDropdown(true)}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: 'Inter', fontSize: '0.85rem', color: 'white',
                }}
              />
              {citySearch && (
                <button onClick={() => { setCitySearch(''); setShowCityDropdown(false) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)', display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </button>
              )}
            </div>
            {showCityDropdown && filteredCities.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
                background: 'var(--bg-surface-container-high)',
                border: '1px solid rgba(133,173,255,0.2)',
                borderRadius: 'var(--radius-lg)',
                maxHeight: 260, overflowY: 'auto', zIndex: 9999,
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              }}>
                {filteredCities.slice(0, 15).map(c => {
                  const hCity = heatmapCities.find(h => h.name === c)
                  return (
                    <button key={c} onClick={() => { handleCitySelect(c); setCitySearch(''); setShowCityDropdown(false) }}
                      style={{
                        width: '100%', padding: '10px 18px', background: selectedCity === c ? 'rgba(133,173,255,0.08)' : 'transparent',
                        border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', transition: 'background 0.15s', color: 'white',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(133,173,255,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.background = selectedCity === c ? 'rgba(133,173,255,0.08)' : 'transparent'}>
                      <span style={{ fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: selectedCity === c ? 700 : 400 }}>
                        {c}
                        {hCity?.state && <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--outline)', marginLeft: 8 }}>{hCity.state}</span>}
                      </span>
                      {hCity && <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.72rem', fontWeight: 700, color: hCity.score >= 80 ? 'var(--secondary)' : 'var(--primary)' }}>{hCity.score}/100</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
          <div style={{ padding: '8px 16px', background: 'var(--bg-surface-container)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--secondary)' }}>trending_up</span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', fontWeight: 700 }}>
              {cityData.trend || '+12%'} vs last Q · {(heatmapCities.find(h => h.name === selectedCity)?.startups || cityData.startups || 0).toLocaleString()} startups · {cityData.sector || 'General Tech'}
            </span>
          </div>
        </div>
      </section>

      {/* Top 4 Modules Grid */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {[
            { label: 'Global Ranking', title: 'Ecosystem Score', icon: 'hub', score: displayScores.ecosystem, color: 'var(--primary)', glow: 'rgba(133, 173, 255, 0.5)' },
            { label: 'Survival AI', title: 'Survival Prediction', icon: 'psychology', score: hasReport && report?.city === selectedCity ? (report.survival?.probability || displayScores.demand) : displayScores.demand, color: 'var(--tertiary)', glow: 'rgba(193, 128, 255, 0.5)' },
            { label: 'Network Flow', title: 'Logistics Score', icon: 'local_shipping', score: displayScores.logistics, color: 'var(--primary)', glow: 'rgba(133,173,255,0.4)', opacity: 0.6 },
            { label: 'Talent Density', title: 'Workforce Score', icon: 'groups', score: displayScores.workforce, color: 'var(--secondary)', glow: 'rgba(105, 246, 184, 0.5)' },
          ].map(m => (
            <div key={m.title} className="card" style={{ padding: 32, cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <span style={{ fontSize: '0.6rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{m.label}</span>
                  <h3 style={{ fontFamily: 'Manrope', fontSize: '1.4rem', fontWeight: 700, marginTop: 4 }}>{m.title}</h3>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: 28, color: m.color, opacity: 0.4 }}>{m.icon}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                <span style={{ fontFamily: 'Manrope', fontSize: '3.5rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{m.score}</span>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.85rem', fontWeight: 700, color: getStatusLabel(m.score).color, marginBottom: 6 }}>
                  {getStatusLabel(m.score).text}
                </span>
              </div>
              <div style={{ marginTop: 24, height: 4, width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: m.color, width: `${m.score}%`, boxShadow: `0 0 10px ${m.glow}`, transition: 'width 0.8s ease', borderRadius: 'var(--radius-full)', opacity: m.opacity || 1 }}></div>
              </div>
              {hasReport && report?.city === selectedCity && (
                <div style={{ marginTop: 10, fontFamily: 'Space Grotesk', fontSize: '0.58rem', color: '#c180ff', opacity: 0.7 }}>
                  ↑ Based on your idea analysis
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 32 }}>
          <Link to="/heatmap" id="view-all-features-btn" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 32px', background: 'rgba(38, 38, 38, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.3s ease', color: 'var(--on-surface-variant)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-container-highest)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(38, 38, 38, 0.5)'; e.currentTarget.style.color = 'var(--on-surface-variant)' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>View All Modules</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>arrow_forward</span>
            </button>
          </Link>
        </div>
      </section>

      {/* War Room + City Planner row */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* War Room Share Card */}
        <div style={{ padding: 28, borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface-container-low)', border: '1px solid rgba(105, 246, 184, 0.12)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, background: 'rgba(105,246,184,0.05)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'rgba(105, 246, 184, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--secondary)' }}>group_work</span>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1rem' }}>War Room</h3>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Collaborative Terrain Sharing</span>
            </div>
            <span style={{ marginLeft: 'auto', fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 800, color: 'var(--secondary)', padding: '2px 8px', background: 'rgba(105,246,184,0.1)', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>NEW</span>
          </div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: 20 }}>
            Generate a secure, shareable link for your terrain report. Share with co-founders and investors in seconds.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleWarRoomShare} id="war-room-share-btn" style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-lg)', background: warRoomCopied ? 'rgba(105,246,184,0.15)' : 'rgba(105,246,184,0.1)', border: `1px solid ${warRoomCopied ? 'rgba(105,246,184,0.4)' : 'rgba(105,246,184,0.2)'}`, color: 'var(--secondary)', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{warRoomCopied ? 'check_circle' : 'link'}</span>
              {warRoomCopied ? 'Link Copied!' : 'Generate & Share Link'}
            </button>
            <Link to="/war-room" style={{ padding: '12px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-container)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--on-surface-variant)', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
              Full View
            </Link>
          </div>
        </div>

        {/* City Planner Card */}
        <div style={{ padding: 28, borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface-container-low)', border: '1px solid rgba(133, 173, 255, 0.12)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, background: 'rgba(133,173,255,0.05)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'rgba(133, 173, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary)' }}>account_balance</span>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1rem' }}>City Planner Mode</h3>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reverse Pitch for Policymakers</span>
            </div>
            <span style={{ marginLeft: 'auto', fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary)', padding: '2px 8px', background: 'rgba(133,173,255,0.1)', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>NEW</span>
          </div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: 20 }}>
            Switch to a government official's perspective. See why startups are leaving your city and what infrastructure gaps need fixing.
          </p>
          <Link to="/city-planner" id="city-planner-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', borderRadius: 'var(--radius-lg)', background: 'rgba(133,173,255,0.1)', border: '1px solid rgba(133,173,255,0.2)', color: 'var(--primary)', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(133,173,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(133,173,255,0.1)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>map</span>
            Open City Planner Dashboard
          </Link>
        </div>
      </section>

      {/* Heatmap + Investor Interest */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 48 }}>
        <div style={{ background: 'var(--bg-surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 32, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'Manrope', fontSize: '1.25rem', fontWeight: 700 }}>Heatmap Distribution</h3>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}></span> Demand
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)' }}></span> Supply
              </span>
            </div>
          </div>
          <div style={{ height: 280, width: '100%', borderRadius: 'var(--radius-lg)', background: 'var(--bg-background)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(133,173,255,0.08), rgba(105,246,184,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CityMap city={selectedCity} allCities={heatmapCities} />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-background) 0%, transparent 40%)', pointerEvents: 'none', zIndex: 500 }}></div>
            <div style={{ position: 'absolute', bottom: 20, left: 20, pointerEvents: 'none', zIndex: 1000 }}>
              <p style={{ fontSize: '0.6rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Active Region</p>
              <p style={{ fontSize: '0.875rem', fontFamily: 'Inter', color: 'white', marginTop: 2, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                {hasReport && report?.city === selectedCity && report?.location?.recommended
                  ? report.location.recommended
                  : `Industrial Area Phase II, ${selectedCity} South`}
              </p>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 32, border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -48, top: -48, width: 192, height: 192, background: 'rgba(133, 173, 255, 0.08)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
          <h3 style={{ fontFamily: 'Manrope', fontSize: '1.25rem', fontWeight: 700, marginBottom: 24 }}>
            {hasReport && report?.city === selectedCity ? 'Matched Investors' : 'Investor Interest'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {hasReport && report?.city === selectedCity && (report.investors || []).length > 0
              ? (report.investors || []).slice(0, 3).map((inv, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 700, color: 'var(--on-surface)' }}>{inv.name}</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.68rem', color: 'var(--on-surface-variant)', marginTop: 2 }}>{inv.stage} · {inv.cheque}</div>
                  </div>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: inv.score >= 80 ? 'var(--secondary)' : 'var(--primary)', fontSize: '0.9rem' }}>{inv.score}%</span>
                </div>
              ))
              : [
                { label: 'Active VCs', value: '14', highlight: false },
                { label: 'Seed Deals (24h)', value: '3', highlight: true },
                { label: 'Average Ticket', value: '₹2.4 Cr', highlight: false },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: item.highlight ? 'var(--secondary)' : 'var(--on-surface)' }}>{item.value}</span>
                </div>
              ))
            }
          </div>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <p style={{ fontSize: '0.6rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>Top Sector</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(hasReport && report?.sector
                ? [report.sector, 'Fintech', 'D2C']
                : ['Fintech', 'Logistics', 'SaaS']
              ).map(s => (
                <span key={s} style={{ padding: '4px 12px', background: 'var(--bg-surface-container-highest)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontFamily: 'Space Grotesk' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Manrope', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 32, height: 32, background: 'rgba(133, 173, 255, 0.1)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>extension</span>
            </span>
            Intelligence Modules
          </h3>
          {hasReport && (
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.62rem', color: '#c180ff', background: 'rgba(193,128,255,0.08)', border: '1px solid rgba(193,128,255,0.15)', padding: '4px 12px', borderRadius: 99 }}>
              All synced to your {report?.city} · {report?.sector} idea
            </span>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {FEATURES.map((feature) => (
            <Link key={feature.path} to={feature.path} id={`feature-card-${feature.title.toLowerCase().replace(/[^a-z]/g, '-')}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%', cursor: 'pointer', padding: 24, border: feature.badge === 'NEW' ? `1px solid ${feature.color}22` : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, background: `${feature.color}18`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: feature.color }}>{feature.icon}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {feature.badge && (
                      <span style={{ fontSize: '0.6rem', fontFamily: 'Space Grotesk', fontWeight: 700, background: feature.badge === 'NEW' ? `${feature.color}20` : 'rgba(133, 173, 255, 0.1)', color: feature.badge === 'NEW' ? feature.color : 'var(--primary)', padding: '2px 8px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{feature.badge}</span>
                    )}
                    <span style={{ fontSize: '0.65rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: feature.color, background: `${feature.color}12`, padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{feature.stat}</span>
                  </div>
                </div>
                <h4 style={{ color: 'var(--on-surface)', fontFamily: 'Manrope', fontWeight: 700, marginBottom: 6 }}>{feature.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 4, color: feature.color, fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Space Grotesk' }}>
                  Explore
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Cities Leaderboard */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Manrope', fontSize: '1.25rem', fontWeight: 700 }}>Top Cities by Startup Potential</h3>
          <Link to="/heatmap" className="btn btn-secondary btn-sm" id="view-heatmap-btn">View Heatmap</Link>
        </div>
        <div style={{ background: 'var(--bg-surface-container-low)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                {['Rank', 'City', 'Score', 'Trend', 'Best Sector', 'Status'].map(h => (
                  <th key={h} style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.6rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapCities.slice(0, 10).map((city, i) => {
                const isAnalyzed = hasReport && report?.city === city.name
                const topSector = city.sector_scores ? Object.entries(city.sector_scores).sort((a,b) => b[1]-a[1])[0]?.[0] : 'Tech'
                const isHigh = city.score >= 75
                return (
                  <tr key={city.name}
                    style={{ borderBottom: i < 9 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none', transition: 'background 0.2s', cursor: 'pointer', background: isAnalyzed ? 'rgba(193,128,255,0.04)' : 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = isAnalyzed ? 'rgba(193,128,255,0.08)' : 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = isAnalyzed ? 'rgba(193,128,255,0.04)' : 'transparent'}
                    onClick={() => handleCitySelect(city.name)}>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ width: 24, height: 24, background: i < 3 ? 'var(--primary)' : 'var(--bg-surface-container-highest)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: i < 3 ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>{i + 1}</span>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--on-surface)', fontSize: '0.9rem' }}>
                      {city.name}
                      {isAnalyzed && <span style={{ marginLeft: 8, fontSize: '0.55rem', color: '#c180ff', background: 'rgba(193,128,255,0.1)', padding: '2px 6px', borderRadius: 99, fontFamily: 'Space Grotesk', fontWeight: 700 }}>YOUR IDEA</span>}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div>
                          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: city.score >= 80 ? 'var(--secondary)' : 'var(--primary)', fontSize: '1rem' }}>
                            {city.score}
                          </span>
                          <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', opacity: 0.5 }}>/100</span>
                        </div>
                        {isAnalyzed && (
                          <div style={{ fontSize: '0.62rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: '#c180ff' }}>
                            Your idea: {report.launchScore}/100
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Space Grotesk' }}>↑{city.trend === 'up' ? `${10 + (city.score % 10)}%` : `${5 + (city.score % 8)}%`}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '3px 10px', background: 'var(--bg-surface-container-highest)', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontFamily: 'Space Grotesk', textTransform: 'capitalize' }}>
                        {isAnalyzed ? report.sector : topSector}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isHigh ? 'var(--secondary)' : '#fbbf24', boxShadow: isHigh ? '0 0 8px var(--secondary)' : '0 0 8px #fbbf24' }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.08em', color: isHigh ? 'var(--secondary)' : '#fbbf24' }}>
                          {isHigh ? 'Go' : 'Moderate'}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ paddingTop: 24, borderTop: '1px solid rgba(255, 255, 255, 0.05)', opacity: 0.4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24 }}>
        <p style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', margin: 0 }}>AEGIS Sovereign Intelligence v3.0.0</p>
        <div style={{ display: 'flex', gap: 32 }}>
          {['Documentation', 'API Access', 'Terms of Service'].map(link => (
            <a key={link} href="#" style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
            >{link}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
