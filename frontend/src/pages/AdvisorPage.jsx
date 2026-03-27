import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../context/appStore'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Auto-detect helpers ──────────────────────────────────────────────────────
const CITY_ALIASES = {
  mumbai: 'Mumbai', bombay: 'Mumbai',
  bangalore: 'Bangalore', bengaluru: 'Bangalore', blr: 'Bangalore',
  delhi: 'Delhi', 'new delhi': 'Delhi', ncr: 'Delhi', gurugram: 'Delhi', noida: 'Delhi', gurgaon: 'Delhi',
  hyderabad: 'Hyderabad', hyd: 'Hyderabad',
  pune: 'Pune',
  ahmedabad: 'Ahmedabad', amd: 'Ahmedabad',
  chennai: 'Chennai', madras: 'Chennai',
  jaipur: 'Jaipur',
  kochi: 'Kochi', cochin: 'Kochi',
  indore: 'Indore',
  coimbatore: 'Coimbatore', cbe: 'Coimbatore',
  surat: 'Surat',
}
const SECTOR_KEYWORDS = {
  Fintech: ['fintech', 'payment', 'lending', 'neobank', 'insurance', 'insurtech', 'credit', 'loan', 'bfsi', 'banking', 'invest', 'wealth', 'upi', 'nopa', 'nbfc', 'gst invoic', 'gst filing'],
  SaaS: ['saas', 'software', 'platform', 'b2b', 'crm', 'erp', 'api', 'cloud', 'dashboard', 'automation', 'workflow', 'subscription', 'compliance'],
  Manufacturing: ['manufactur', 'factory', 'packag', 'production', 'fabricat', 'assembly', 'plant'],
  Agritech: ['agri', 'farm', 'crop', 'harvest', 'irrigation', 'kisan', 'mandi'],
  'D2C': ['d2c', 'direct to consumer', 'brand', 'e-commerce', 'ecommerce', 'dtc', 'consumer product'],
  EdTech: ['edtech', 'education', 'learning', 'course', 'student', 'tutor', 'upskill'],
  HealthTech: ['health', 'medtech', 'pharma', 'hospital', 'clinic', 'patient', 'doctor', 'medicine', 'diagnostic'],
  'Deep Tech': ['ai ', 'machine learning', 'deep learning', 'robotics', 'drone', 'semiconductor', 'quantum'],
  Logistics: ['logistics', 'supply chain', 'delivery', 'shipping', 'freight', 'last mile', 'cold chain', 'warehouse'],
  CleanTech: ['clean energy', 'solar', 'ev ', 'electric vehicle', 'climate', 'sustainability', 'renewab'],
}

function detectFromIdea(text) {
  const lower = text.toLowerCase()
  let city = null; let sector = null
  for (const [alias, name] of Object.entries(CITY_ALIASES)) {
    if (lower.includes(alias)) { city = name; break }
  }
  let bestSector = null; let bestScore = 0
  for (const [sec, kws] of Object.entries(SECTOR_KEYWORDS)) {
    const score = kws.filter(k => lower.includes(k)).length
    if (score > bestScore) { bestScore = score; bestSector = sec }
  }
  if (bestScore > 0) sector = bestSector
  return { city, sector }
}

async function fetchJSON(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${r.status}`)
  return r.json()
}
async function postJSON(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!r.ok) throw new Error(`${r.status}`)
  return r.json()
}

function ScoreCircle({ score }) {
  const color = score >= 70 ? '#69f6b8' : score >= 50 ? '#fbbf24' : '#ff6b6b'
  const label = score >= 70 ? 'Strong Launch Signal' : score >= 50 ? 'Proceed with Caution' : 'High Risk'
  const circumference = 2 * Math.PI * 58
  const dash = (score / 100) * circumference
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: 170, height: 170 }}>
        <svg width="170" height="170" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle cx="65" cy="65" r="58" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 12px ${color})`, transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2.8rem', fontWeight: 900, fontFamily: 'Manrope', color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>/ 100</span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color }}>Launch Readiness Score</div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{label}</div>
      </div>
    </div>
  )
}

function ScoreBar({ label, weight, score, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)' }}>wt: {weight}%</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Space Grotesk', color }}>{score}/100</span>
        </div>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 99, boxShadow: `0 0 10px ${color}60`, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

function Tag({ label, color = '#85adff' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, background: `${color}15`, border: `1px solid ${color}30`, fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {label}
    </span>
  )
}

function IdeaScoreCard({ label, score, color, icon }) {
  const pct = Math.min(100, Math.max(0, score))
  return (
    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}22`, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color }}>{icon}</span>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
        </div>
        <span style={{ fontFamily: 'Manrope', fontSize: '1.4rem', fontWeight: 800, color }}>{score}</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 99, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

const LOADING_STEPS = [
  'Fetching MCA21 startup registry data…',
  'Running city-sector survival ML model…',
  'Pulling logistics & zone intelligence…',
  'Scoring idea innovation & problem-fit…',
  'Matching investors via compatibility engine…',
  'Querying Gemini AI for terrain analysis…',
]

export default function AdvisorPage() {
  const store = useAppStore()
  const [idea, setIdea] = useState(store.startupIdea || '')
  const [detected, setDetected] = useState({ city: store.detectedCity, sector: store.detectedSector })
  const [loading, setLoading] = useState(false)
  const [loadStep, setLoadStep] = useState(0)
  const [report, setReport] = useState(store.activeReport || null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (idea.length > 5) {
      const det = detectFromIdea(idea)
      setDetected(det)
    } else {
      setDetected({ city: null, sector: null })
    }
  }, [idea])

  const valid = idea.trim().length >= 15 && detected.city && detected.sector

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valid) return
    setError(''); setLoading(true); setReport(null); setLoadStep(0)
    store.clearReport()

    const { city, sector } = detected
    const stepInterval = setInterval(() => setLoadStep(s => Math.min(s + 1, LOADING_STEPS.length - 1)), 2500)

    try {
      // Parallel fetch all city+sector data
      const [survival, logistics, activity, demand, location, matchmaking] = await Promise.all([
        fetchJSON(`${API}/api/survival/city/${encodeURIComponent(city)}?sector=${encodeURIComponent(sector)}`),
        fetchJSON(`${API}/api/logistics/city/${encodeURIComponent(city)}/breakdown`),
        fetchJSON(`${API}/api/activity/city/${encodeURIComponent(city)}`),
        fetchJSON(`${API}/api/demand/city/${encodeURIComponent(city)}/full`),
        fetchJSON(`${API}/api/location/city/${encodeURIComponent(city)}`),
        fetchJSON(`${API}/api/matchmaking/match?city=${encodeURIComponent(city)}&sector=${encodeURIComponent(sector)}&funding_stage=Seed`),
      ])

      const survivalScore  = Math.round(survival.survival_probability || 70)
      const logisticsScore = Math.round(logistics.overall_score || 70)
      const cagr           = demand.cagr_pct || 25
      const crowdingIdx    = activity.crowding_index || 0.8
      const demandScore    = Math.min(Math.round(cagr * 2.8), 100)
      const activityScore  = Math.max(0, Math.round(100 - ((crowdingIdx - 0.5) * 30)))

      // Get city ecosystem score from heatmap
      let ecosystemScore = 74
      try {
        const heatmapData = await fetchJSON(`${API}/api/heatmap/cities/${encodeURIComponent(city)}`)
        ecosystemScore = heatmapData.score || 74
      } catch (_) {}

      const launchScore = Math.round(
        ecosystemScore * 0.20 + survivalScore * 0.20 + logisticsScore * 0.15 +
        demandScore * 0.15 + activityScore * 0.10
      )

      const topZone = location.recommended_zone?.name || `${city} Commercial Zone`
      const zoneRent = location.recommended_zone?.rent || 80

      // Run idea intelligence analysis (innovation + problem-fit + city-domain)
      const [aiResult, ideaAnalysis] = await Promise.all([
        postJSON(`${API}/api/ai/narrative`, {
          city, sector, startup_idea: idea, funding_stage: 'Seed', team_size: 4,
          launch_readiness_score: launchScore, survival_probability: survivalScore,
          logistics_score: logisticsScore, cagr, active_companies: activity.active_companies || 100,
          crowding_index: crowdingIdx, top_zone: topZone, zone_rent: zoneRent,
        }),
        postJSON(`${API}/api/ai/idea-analysis`, {
          city, sector, startup_idea: idea, funding_stage: 'Seed', team_size: 4,
        }),
      ])

      const fullReport = {
        city, sector, idea, launchScore, aiSource: aiResult.source,
        narrative: aiResult.narrative,
        // Idea intelligence scores
        ideaIntelligence: {
          innovation_score: ideaAnalysis.innovation_score || 65,
          problem_fit_score: ideaAnalysis.problem_fit_score || 65,
          city_domain_score: ideaAnalysis.city_domain_score || 65,
          sector_timing_score: ideaAnalysis.sector_timing_score || 65,
          overall_viability: ideaAnalysis.overall_viability || 65,
          innovation_verdict: ideaAnalysis.innovation_verdict || '',
          real_problems_addressed: ideaAnalysis.real_problems_addressed || [],
          city_moat: ideaAnalysis.city_moat || '',
          city_domain_insight: ideaAnalysis.city_domain_insight || '',
          policy_tailwinds: ideaAnalysis.policy_tailwinds || [],
          risk_summary: ideaAnalysis.risk_summary || '',
          ai_narrative: ideaAnalysis.ai_narrative || '',
          ai_source: ideaAnalysis.ai_source || 'rule-based',
        },
        scoreBreakdown: [
          { label: 'Ecosystem Score',     weight: 20, score: ecosystemScore,   color: '#85adff' },
          { label: 'Survival Predictor',  weight: 20, score: survivalScore,    color: '#c180ff' },
          { label: 'Logistics Score',     weight: 15, score: logisticsScore,   color: '#85adff' },
          { label: 'Demand Forecast',     weight: 15, score: demandScore,      color: '#fbbf24' },
          { label: 'Activity / Crowding', weight: 10, score: activityScore,    color: '#69f6b8' },
          { label: 'Investor Fit',        weight: 5,  score: Math.min((matchmaking.matched?.length || 0) * 15, 95), color: '#85adff' },
        ],
        survival: { probability: survivalScore, strengths: survival.strengths || [], riskFactors: survival.risk_factors || [] },
        activity: { active: activity.active_companies, closures: activity.closures_2yr, crowdingIndex: crowdingIdx, category: activity.category },
        demand: { cagr, policy: demand.policy },
        location: { recommended: topZone, rent: zoneRent },
        logistics: { score: logisticsScore, recommendation: logistics.recommendation },
        investors: (matchmaking.matched || []).slice(0, 4).map(inv => ({
          name: inv.name, focus: (inv.focus || []).join(' · '), stage: inv.stage, cheque: inv.cheque,
          score: Math.min(inv.compatibility_score, 99),
        })),
      }

      setReport(fullReport)
      // 🔑 Save to global store — all other pages will see this
      store.setActiveReport(fullReport)
      store.setIdeaContext({ idea, city, sector })
    } catch (err) {
      setError(`Failed to generate report: ${err.message}. Ensure the backend is running at ${API}`)
    } finally {
      clearInterval(stepInterval)
      setLoading(false)
    }
  }

  const handleNewAnalysis = () => {
    setReport(null)
    store.clearReport()
  }

  // ── Input form ─────────────────────────────────────────────────────────────
  if (!report && !loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 48px', position: 'relative', overflow: 'hidden' }}>
      {/* BG glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'radial-gradient(at 20% 20%, rgba(133,173,255,0.06) 0, transparent 50%), radial-gradient(at 80% 80%, rgba(193,128,255,0.06) 0, transparent 50%)' }} />

      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(14,14,14,0.85)', backdropFilter: 'blur(24px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', height: 68 }}>
        <Link to="/" style={{ fontFamily: 'Manrope', fontSize: '1.1rem', fontWeight: 800, color: '#85adff', textDecoration: 'none', letterSpacing: '-0.02em' }}>AEGIS</Link>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['Intelligence', '/intelligence'], ['Terrain', '/advisor'], ['Capital', '/capital'], ['Vault', '/vault']].map(([l, p], i) => (
            <Link key={l} to={p} style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: i === 1 ? '#85adff' : 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
        <Link to="/dashboard" style={{ padding: '7px 18px', borderRadius: 99, background: '#85adff', color: '#0a0a0a', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>Dashboard</Link>
      </header>

      <main style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 780 }}>
        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, background: 'rgba(193,128,255,0.08)', border: '1px solid rgba(193,128,255,0.18)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c180ff', boxShadow: '0 0 8px rgba(193,128,255,0.7)' }} />
            <span style={{ fontFamily: 'Space Grotesk', color: '#c180ff', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Gemini AI · City-Domain Intelligence · ML Survival Model</span>
          </div>
        </div>

        <h1 style={{ fontFamily: 'Manrope', fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.04em', color: 'white', lineHeight: 1.08, marginBottom: 14, textAlign: 'center' }}>
          Map Your <span style={{ color: '#85adff' }}>Terrain</span>
        </h1>
        <p style={{ fontFamily: 'Inter', color: 'rgba(255,255,255,0.4)', fontSize: '1rem', textAlign: 'center', marginBottom: 44, lineHeight: 1.6 }}>
          Describe your startup idea — mention your <strong style={{ color: 'rgba(255,255,255,0.6)' }}>city</strong> and <strong style={{ color: 'rgba(255,255,255,0.6)' }}>what you're building</strong>. AEGIS detects the rest, scores your idea's innovation, problem-fit, and city-domain alignment.
        </p>

        {/* Card */}
        <div style={{ background: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(24px)', borderRadius: 28, border: '1px solid rgba(255,255,255,0.07)', padding: 'clamp(24px, 4vw, 44px)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
          <form onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div style={{ padding: '12px 18px', marginBottom: 24, background: 'rgba(255,107,107,0.07)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#ff6b6b', flexShrink: 0, marginTop: 2 }}>error</span>
                <span style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#ff6b6b', lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            {/* Textarea */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>
                Your Startup Idea <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <textarea
                id="advisor-idea-input"
                value={idea}
                onChange={e => setIdea(e.target.value)}
                placeholder={`Example: "Building a fintech app in Mumbai to help SMEs manage GST invoicing and working capital loans…"`}
                style={{
                  width: '100%', minHeight: 190, resize: 'none', outline: 'none',
                  background: 'rgba(0,0,0,0.35)', color: 'white', fontFamily: 'Inter',
                  fontSize: 'clamp(0.95rem, 2vw, 1.3rem)', lineHeight: 1.55,
                  padding: '24px 28px', borderRadius: 18, boxSizing: 'border-box',
                  border: `1.5px solid ${valid ? 'rgba(105,246,184,0.35)' : idea.length > 5 && !detected.city ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'border-color 0.25s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(133,173,255,0.4)'}
                onBlur={e => e.target.style.borderColor = valid ? 'rgba(105,246,184,0.35)' : 'rgba(255,255,255,0.08)'}
              />
              <span style={{ position: 'absolute', bottom: 16, right: 20, fontFamily: 'Space Grotesk', fontSize: '0.58rem', color: idea.length >= 15 ? '#69f6b8' : 'rgba(255,255,255,0.2)' }}>
                {idea.length} chars {idea.length >= 15 ? '✓' : `(min 15)`}
              </span>
            </div>

            {/* Detected tags row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 28, minHeight: 28, alignItems: 'center' }}>
              {detected.city || detected.sector ? (
                <>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Detected:</span>
                  {detected.city && <Tag label={`📍 ${detected.city}`} color="#85adff" />}
                  {detected.sector && <Tag label={`⚡ ${detected.sector}`} color="#69f6b8" />}
                  {!detected.city && idea.length > 10 && <Tag label="⚠ Mention a city" color="#fbbf24" />}
                </>
              ) : idea.length > 5 ? (
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>
                  Mention your <span style={{ color: '#85adff' }}>city</span> (Mumbai, Bangalore, Delhi…) and what you're building
                </span>
              ) : null}
            </div>

            {/* What you'll get */}
            {valid && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, padding: '12px 16px', background: 'rgba(105,246,184,0.04)', border: '1px solid rgba(105,246,184,0.12)', borderRadius: 12 }}>
                {['Innovation Score', 'Problem-Fit Score', 'City-Domain Fit', 'Survival Forecast', 'AI Narrative'].map(item => (
                  <span key={item} style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: '#69f6b8', background: 'rgba(105,246,184,0.08)', padding: '3px 8px', borderRadius: 99 }}>{item}</span>
                ))}
              </div>
            )}

            {/* Submit */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <button
                type="submit"
                disabled={!valid}
                id="advisor-submit-btn"
                style={{
                  width: '100%', padding: '18px 32px',
                  background: valid ? 'linear-gradient(135deg, #85adff, #6b8fe8)' : 'rgba(255,255,255,0.05)',
                  borderRadius: 99, border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
                  opacity: valid ? 1 : 0.35, transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: valid ? '0 16px 40px -12px rgba(133,173,255,0.5)' : 'none',
                }}
                onMouseEnter={e => { if (valid) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <span style={{ fontFamily: 'Manrope', fontWeight: 800, color: valid ? '#0a0a0a' : 'rgba(255,255,255,0.3)', fontSize: '1rem', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                  {valid ? `Generate Full Terrain Report — ${detected.city} · ${detected.sector}` : 'Add your city & idea to continue'}
                </span>
                {valid && <span className="material-symbols-outlined" style={{ color: '#0a0a0a', fontSize: 20 }}>arrow_forward</span>}
              </button>
              <p style={{ fontFamily: 'Space Grotesk', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.25em', margin: 0 }}>
                Powered by Gemini AI · MCA21 · DPIIT · NCVT · City-Domain Intelligence
              </p>
            </div>
          </form>
        </div>

        {/* Example pills */}
        <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {[
            'Fintech app in Mumbai for SME lending and working capital',
            'SaaS platform in Bangalore for B2B HR compliance automation',
            'AI-powered cold chain logistics in Delhi for pharma delivery',
            'D2C skincare brand in Pune targeting urban millennials',
            'HealthTech platform in Hyderabad for rural telemedicine access',
          ].map(ex => (
            <button key={ex} onClick={() => setIdea(ex)} style={{ padding: '6px 16px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(133,173,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(133,173,255,0.2)'; e.currentTarget.style.color = '#85adff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            >{ex}</button>
          ))}
        </div>
      </main>
    </div>
  )

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(133,173,255,0.15)', borderTopColor: '#85adff', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Manrope', fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: 20 }}>Generating Terrain Report…</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LOADING_STEPS.map((step, i) => (
            <div key={i} style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', color: i <= loadStep ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s' }}>
              {i < loadStep ? <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#69f6b8' }}>check_circle</span>
                : i === loadStep ? <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(133,173,255,0.3)', borderTopColor: '#85adff', animation: 'spin 0.8s linear infinite' }} />
                : <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />}
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const ii = report.ideaIntelligence || {}

  // ── Report ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-container" style={{ maxWidth: 1180 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Manrope', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 10 }}>Terrain Analysis Report</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#69f6b8', boxShadow: '0 0 8px #69f6b8', animation: 'pulse 2s ease infinite' }} />
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', fontWeight: 700, color: '#69f6b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{report.city} · {report.sector}</span>
            </div>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: '#c180ff', background: 'rgba(193,128,255,0.08)', border: '1px solid rgba(193,128,255,0.15)', padding: '2px 10px', borderRadius: 99 }}>
              ✦ {report.aiSource?.includes('gemini') ? 'Gemini AI' : 'Rule-Based AI'}
            </span>
          </div>
        </div>
        <button onClick={handleNewAnalysis} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.78rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_back</span>New Analysis
        </button>
      </div>

      {/* Idea Intelligence Banner */}
      {ii.innovation_verdict && (
        <div style={{ padding: '18px 22px', marginBottom: 24, background: 'linear-gradient(135deg, rgba(193,128,255,0.08), rgba(133,173,255,0.06))', border: '1px solid rgba(193,128,255,0.2)', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#c180ff' }}>lightbulb</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: '#c180ff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Idea Intelligence Verdict</div>
            <div style={{ fontFamily: 'Inter', fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{ii.innovation_verdict}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Manrope', fontSize: '1.8rem', fontWeight: 800, color: '#c180ff' }}>{ii.overall_viability}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall Viability</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 22, alignItems: 'start' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <ScoreCircle score={report.launchScore} />
          </div>

          {/* Idea Intelligence Scores */}
          {ii.innovation_score && (
            <div style={{ padding: 18, background: 'rgba(193,128,255,0.04)', border: '1px solid rgba(193,128,255,0.1)', borderRadius: 16 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.58rem', fontWeight: 700, color: '#c180ff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>Idea Intelligence</div>
              <IdeaScoreCard label="Innovation" score={ii.innovation_score} color="#c180ff" icon="auto_awesome" />
              <div style={{ marginTop: 10 }}>
                <IdeaScoreCard label="Problem-Fit" score={ii.problem_fit_score} color="#69f6b8" icon="task_alt" />
              </div>
              <div style={{ marginTop: 10 }}>
                <IdeaScoreCard label="City-Domain" score={ii.city_domain_score} color="#85adff" icon="location_city" />
              </div>
              <div style={{ marginTop: 10 }}>
                <IdeaScoreCard label="Sector Timing" score={ii.sector_timing_score} color="#fbbf24" icon="trending_up" />
              </div>
            </div>
          )}

          <div style={{ padding: 18, background: 'rgba(133,173,255,0.04)', border: '1px solid rgba(133,173,255,0.08)', borderRadius: 16 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>Score Weights</div>
            {[['Ecosystem', '20%'], ['Survival AI', '20%'], ['Logistics', '15%'], ['Demand', '15%'], ['Activity', '10%'], ['Investors', '5%']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.77rem', color: 'rgba(255,255,255,0.45)', padding: '3px 0' }}>
                <span>{k}</span><span style={{ fontWeight: 700, color: '#85adff' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 16px', background: 'rgba(105,246,184,0.04)', border: '1px solid rgba(105,246,184,0.08)', borderRadius: 16 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.58rem', fontWeight: 700, color: '#69f6b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Data Sources</div>
            {['MCA21 Company Registry', 'DPIIT Startup India DB', 'NCVT Workforce Portal', 'City-Domain Intelligence', 'Gemini AI Analysis', 'GST Analytics (GSTN)'].map(s => (
              <div key={s} style={{ fontFamily: 'Inter', fontSize: '0.73rem', color: 'rgba(255,255,255,0.4)', padding: '2px 0', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#69f6b8', flexShrink: 0, marginTop: 3 }}>check_circle</span>{s}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Score Breakdown */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#85adff' }}>leaderboard</span>
              <h3 style={{ fontFamily: 'Manrope', fontWeight: 700 }}>Score Breakdown</h3>
            </div>
            {report.scoreBreakdown.map(s => <ScoreBar key={s.label} {...s} />)}
          </div>

          {/* City-Domain Intelligence */}
          {ii.city_moat && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(133,173,255,0.05), rgba(133,173,255,0.02))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#85adff' }}>location_city</span>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 700 }}>City-Domain Intelligence — {report.city}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: '14px 16px', background: 'rgba(133,173,255,0.06)', borderRadius: 12 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.58rem', fontWeight: 700, color: '#85adff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>City Moat</div>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{ii.city_moat}</p>
                </div>
                <div style={{ padding: '14px 16px', background: 'rgba(105,246,184,0.06)', borderRadius: 12 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.58rem', fontWeight: 700, color: '#69f6b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Why This City</div>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{ii.city_domain_insight}</p>
                </div>
              </div>
              {(ii.policy_tailwinds || []).length > 0 && (
                <div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Policy Tailwinds</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(ii.policy_tailwinds || []).map((p, i) => (
                      <span key={i} style={{ fontFamily: 'Space Grotesk', fontSize: '0.68rem', color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '3px 10px', borderRadius: 99 }}>{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Real World Problems */}
          {(ii.real_problems_addressed || []).length > 0 && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(105,246,184,0.04), rgba(105,246,184,0.02))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#69f6b8' }}>public</span>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 700 }}>Real-World Problems Your Idea Addresses</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(ii.real_problems_addressed || []).map((prob, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: 'rgba(105,246,184,0.05)', borderRadius: 10, border: '1px solid rgba(105,246,184,0.1)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#69f6b8', flexShrink: 0, marginTop: 2 }}>crisis_alert</span>
                    <span style={{ fontFamily: 'Inter', fontSize: '0.83rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{prob}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Narrative */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(133,173,255,0.04), rgba(193,128,255,0.04))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#c180ff' }}>auto_awesome</span>
              <h3 style={{ fontFamily: 'Manrope', fontWeight: 700 }}>AI Terrain Analysis — {report.city} · {report.sector}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.9, color: 'rgba(255,255,255,0.6)', margin: 0, whiteSpace: 'pre-line' }}>{report.narrative}</p>
          </div>

          {/* Idea Intelligence Narrative */}
          {ii.ai_narrative && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(193,128,255,0.06), rgba(133,173,255,0.04))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#c180ff' }}>psychology</span>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 700 }}>Idea Intelligence Deep Dive</h3>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.9, color: 'rgba(255,255,255,0.6)', margin: 0, whiteSpace: 'pre-line' }}>{ii.ai_narrative}</p>
            </div>
          )}

          {/* Strengths & Risks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#69f6b8' }}>trending_up</span>
                <h4 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.92rem' }}>Top Strengths</h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(report.survival.strengths || []).map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', alignItems: 'flex-start' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#69f6b8', flexShrink: 0, marginTop: 2 }}>check_circle</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#fbbf24' }}>warning</span>
                <h4 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.92rem' }}>Key Risks</h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(report.survival.riskFactors || []).map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', alignItems: 'flex-start' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#fbbf24', flexShrink: 0, marginTop: 2 }}>report</span>{r}
                  </li>
                ))}
                {ii.risk_summary && (
                  <li style={{ display: 'flex', gap: 8, fontSize: '0.83rem', color: 'rgba(255,180,36,0.7)', alignItems: 'flex-start', marginTop: 4, padding: '8px', background: 'rgba(251,191,36,0.06)', borderRadius: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#fbbf24', flexShrink: 0, marginTop: 2 }}>priority_high</span>{ii.risk_summary}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {[
              { v: report.activity.active, l: 'Active Cos', sub: report.activity.category, c: '#69f6b8' },
              { v: `₹${report.location.rent}`, l: 'Rent/sqft', sub: report.location.recommended?.split('(')[0], c: '#85adff' },
              { v: `${report.demand.cagr}%`, l: '5-Yr CAGR', sub: 'Demand Forecast', c: '#fbbf24' },
              { v: `${Math.round(report.survival.probability)}%`, l: 'Survival', sub: '3-Year Probability', c: '#c180ff' },
            ].map(({ v, l, sub, c }) => (
              <div key={l} style={{ padding: '18px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.6rem', color: c, lineHeight: 1 }}>{v}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '6px 0 4px' }}>{l}</div>
                <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Investors */}
          {report.investors.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#69f6b8' }}>payments</span>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 700 }}>Matched Investors</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {report.investors.map((inv, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white', marginBottom: 3 }}>{inv.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{inv.focus} · {inv.stage} · {inv.cheque}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem', color: inv.score >= 80 ? '#69f6b8' : '#fbbf24' }}>{inv.score}%</div>
                      <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Match</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigate to dashboard with context */}
          <div style={{ padding: '18px 22px', background: 'rgba(133,173,255,0.05)', border: '1px solid rgba(133,173,255,0.15)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>Your analysis is live in the Dashboard</div>
              <div style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>All modules now show data tailored to your {report.city} · {report.sector} idea</div>
            </div>
            <Link to="/dashboard" style={{ padding: '10px 20px', borderRadius: 99, background: 'rgba(133,173,255,0.15)', border: '1px solid rgba(133,173,255,0.3)', color: '#85adff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>dashboard</span>
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
