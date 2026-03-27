import React, { useState } from 'react'

const MISSING_INFRA = {
  Jaipur: [
    { metric: 'Cold Chain Density', gap: 62, impact: 'High', lostSector: 'AgriTech, Food & Bev', color: '#ff6b6b' },
    { metric: 'MSME Co-working Zones', gap: 45, impact: 'Medium', lostSector: 'D2C, Creative', color: '#fbbf24' },
    { metric: 'IT Park Availability', gap: 38, impact: 'High', lostSector: 'SaaS, Deeptech', color: '#ff6b6b' },
    { metric: 'Fiber Broadband Coverage', gap: 22, impact: 'Low', lostSector: 'EdTech, Fintech', color: '#85adff' },
  ],
  Bangalore: [
    { metric: 'Affordable Housing Belt', gap: 78, impact: 'High', lostSector: 'All Sectors (talent flight)', color: '#ff6b6b' },
    { metric: 'Tier-2 Overflow Infrastructure', gap: 55, impact: 'High', lostSector: 'Manufacturing', color: '#ff6b6b' },
    { metric: 'Water Supply for Industrial Units', gap: 40, impact: 'Medium', lostSector: 'Manufacturing, Biotech', color: '#fbbf24' },
  ],
}

const MIGRATION_DATA = {
  Jaipur: [
    { sector: 'SaaS', leaving: 68, reason: 'Talent scarcity and weak investor ecosystem' },
    { sector: 'Fintech', leaving: 54, reason: 'Regulatory access slower than Mumbai' },
    { sector: 'D2C', leaving: 31, reason: 'Premium fulfilment logistics gap' },
    { sector: 'Manufacturing', leaving: 12, reason: 'Strong local incentive schemes' },
  ],
  Bangalore: [
    { sector: 'Manufacturing', leaving: 82, reason: 'High real estate and power costs' },
    { sector: 'AgriTech', leaving: 71, reason: 'Distance from farmlands; poor last-mile' },
    { sector: 'D2C', leaving: 45, reason: 'Warehousing costs 3x vs Tier-2 cities' },
  ],
}

function CityPlannerPage() {
  const [city, setCity] = useState('Jaipur')
  const infra = MISSING_INFRA[city] || MISSING_INFRA.Jaipur
  const migration = MIGRATION_DATA[city] || MIGRATION_DATA.Jaipur

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(133,173,255,0.1)', border: '1px solid rgba(133,173,255,0.2)', fontFamily: 'Space Grotesk', fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Government / Policy View
          </div>
        </div>
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>City Planner Dashboard</h1>
        <div className="page-subtitle">
          Reverse pitch mode — understand why startups are leaving your city and what infrastructure gaps are blocking growth.
        </div>
      </div>

      {/* City Picker */}
      <div className="card" style={{ marginBottom: 28, padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Analyze City:</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.keys(MISSING_INFRA).map(c => (
            <button key={c} onClick={() => setCity(c)} className={`btn btn-sm ${city === c ? 'btn-primary' : 'btn-secondary'}`} id={`planner-city-${c.toLowerCase()}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Startups Left This Year', value: '1,240', delta: '↑18% vs last year', color: '#ff6b6b' },
          { label: 'Infrastructure Gaps', value: infra.length, delta: `${infra.filter(i => i.impact === 'High').length} critical`, color: '#fbbf24' },
          { label: 'Preferred Destination', value: 'Bangalore', delta: '62% of migration', color: '#85adff' },
        ].map(s => (
          <div key={s.label} style={{ padding: 24, borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface-container-low)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontFamily: 'Manrope', fontSize: '2rem', fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--outline)', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.72rem', color: 'var(--on-surface-variant)', marginTop: 8 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Migration Pressure */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 16 }}>Why Startups Are Leaving {city}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {migration.map(m => (
            <div key={m.sector} className="card" style={{ padding: '16px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 80, textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.8rem', color: m.leaving >= 60 ? '#ff6b6b' : m.leaving >= 40 ? '#fbbf24' : 'var(--secondary)', lineHeight: 1 }}>{m.leaving}%</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.55rem', textTransform: 'uppercase', color: 'var(--outline)', letterSpacing: '0.1em', marginTop: 2 }}>Leaving</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 4 }}>{m.sector}</div>
                <div style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>{m.reason}</div>
                <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${m.leaving}%`, background: m.leaving >= 60 ? '#ff6b6b' : m.leaving >= 40 ? '#fbbf24' : 'var(--secondary)', borderRadius: 4, transition: 'width 0.8s ease' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Gaps */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 16 }}>Critical Infrastructure Gaps</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {infra.map(g => (
            <div key={g.metric} style={{ padding: 24, borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface-container-low)', border: `1px solid ${g.color}22` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.95rem' }}>{g.metric}</span>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: g.color, background: `${g.color}18`, padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase' }}>Impact: {g.impact}</span>
              </div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '2rem', color: g.color, lineHeight: 1 }}>{g.gap}%</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--outline)', letterSpacing: '0.1em', marginTop: 2 }}>Deficit Score</div>
              <div style={{ marginTop: 12, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${g.gap}%`, background: g.color, borderRadius: 4 }}></div>
              </div>
              <div style={{ marginTop: 10, fontFamily: 'Inter', fontSize: '0.78rem', color: 'var(--on-surface-variant)' }}>Sectors lost: {g.lostSector}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy Recommendation */}
      <div className="card" style={{ background: 'rgba(133,173,255,0.04)', border: '1px solid rgba(133,173,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700 }}>AEGIS Policy Recommendation</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Generated for {city} local government</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            `Prioritize cold-chain infrastructure in Phase II industrial zones to stop ${city === 'Jaipur' ? 'AgriTech' : 'Manufacturing'} migration bleeding.`,
            `Introduce co-working MSME zone policy: offer 5-year tax holidays to attract SaaS and D2C founders.`,
            `Partner with National Highway Authority for last-mile logistics upgrade — boosts investor confidence by an estimated 23%.`,
            `Launch 'Startup City' fast-track GSTIN + DPIIT recognition portal — reduces time-to-operational from 45 to 9 days.`,
          ].map((rec, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: 'var(--bg-surface-container-low)', borderRadius: 'var(--radius-lg)' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: 'var(--primary)', flexShrink: 0, width: 20 }}>{i + 1}</span>
              <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.55, margin: 0 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CityPlannerPage
