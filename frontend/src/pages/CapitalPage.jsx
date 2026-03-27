import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts'

const FUNDING_TRENDS = [
  { quarter: 'Q1 23', seed: 340, seriesA: 180, seriesB: 95 },
  { quarter: 'Q2 23', seed: 410, seriesA: 210, seriesB: 120 },
  { quarter: 'Q3 23', seed: 380, seriesA: 250, seriesB: 105 },
  { quarter: 'Q4 23', seed: 520, seriesA: 290, seriesB: 140 },
  { quarter: 'Q1 24', seed: 480, seriesA: 320, seriesB: 165 },
  { quarter: 'Q2 24', seed: 610, seriesA: 380, seriesB: 190 },
  { quarter: 'Q3 24', seed: 570, seriesA: 410, seriesB: 220 },
  { quarter: 'Q4 24', seed: 690, seriesA: 450, seriesB: 260 },
]

const TOP_INVESTORS = [
  { name: 'Sequoia Capital', deals: 48, avgCheck: '₹15Cr', focus: 'SaaS, Fintech', stage: 'Series A-B', score: 95 },
  { name: 'Accel India', deals: 42, avgCheck: '₹12Cr', focus: 'Consumer, Enterprise', stage: 'Series A', score: 92 },
  { name: 'Blume Ventures', deals: 67, avgCheck: '₹3Cr', focus: 'Deep Tech, D2C', stage: 'Seed', score: 89 },
  { name: 'Stellaris VP', deals: 38, avgCheck: '₹8Cr', focus: 'B2B SaaS', stage: 'Seed-A', score: 87 },
  { name: 'Peak XV', deals: 35, avgCheck: '₹20Cr', focus: 'Consumer Tech', stage: 'Series A-B', score: 86 },
  { name: 'Elevation Capital', deals: 31, avgCheck: '₹18Cr', focus: 'Fintech, Consumer', stage: 'Series A', score: 84 },
  { name: 'India Quotient', deals: 54, avgCheck: '₹1.5Cr', focus: 'India-first startups', stage: 'Pre-seed', score: 82 },
  { name: 'Matrix Partners', deals: 29, avgCheck: '₹14Cr', focus: 'SaaS, Healthcare', stage: 'Series A', score: 80 },
]

const SECTOR_FLOW = [
  { month: 'Jan', SaaS: 120, Fintech: 85, D2C: 65, Healthtech: 40 },
  { month: 'Feb', SaaS: 140, Fintech: 95, D2C: 78, Healthtech: 52 },
  { month: 'Mar', SaaS: 110, Fintech: 110, D2C: 88, Healthtech: 48 },
  { month: 'Apr', SaaS: 165, Fintech: 120, D2C: 92, Healthtech: 55 },
  { month: 'May', SaaS: 190, Fintech: 105, D2C: 105, Healthtech: 62 },
  { month: 'Jun', SaaS: 210, Fintech: 140, D2C: 118, Healthtech: 70 },
]

function CapitalPage() {
  return (
    <div style={{
      minHeight: '100vh', padding: '32px',
      paddingTop: 104, position: 'relative',
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(14, 14, 14, 0.8)', backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 32px', height: 72,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Manrope', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--primary)' }}>AEGIS</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[{l:'Intelligence',p:'/intelligence'},{l:'Terrain',p:'/advisor'},{l:'Capital',p:'/capital'},{l:'Vault',p:'/vault'}].map((item, i) => (
            <Link key={item.l} to={item.p} style={{
              fontFamily: 'Manrope', fontWeight: 700, textTransform: 'uppercase',
              fontSize: '0.8rem', letterSpacing: '0.04em', textDecoration: 'none',
              color: i === 2 ? 'var(--primary)' : 'var(--outline)',
            }}>{item.l}</Link>
          ))}
        </div>
        <Link to="/dashboard" style={{
          padding: '8px 20px', borderRadius: 'var(--radius-full)',
          background: 'var(--primary)', color: 'var(--on-primary)',
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>dashboard</span>
          Dashboard
        </Link>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Title */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'rgba(193, 128, 255, 0.1)', border: '1px solid rgba(193, 128, 255, 0.2)',
            marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--tertiary)', boxShadow: '0 0 8px rgba(193,128,255,0.6)' }}></span>
            <span style={{ fontFamily: 'Space Grotesk', color: 'var(--tertiary)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Capital Intelligence</span>
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'white', marginBottom: 12 }}>
            Funding <span style={{ color: 'var(--tertiary)' }}>Landscape</span>
          </h1>
          <p style={{ fontFamily: 'Inter', color: 'var(--on-surface-variant)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
            Track venture capital flows, investor activity, and funding rounds across the Indian startup ecosystem.
          </p>
        </div>

        {/* Key Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Deployed', value: '₹42,800Cr', delta: '+23%', color: 'var(--tertiary)' },
            { label: 'Active VCs', value: '340+', delta: '+18 new', color: 'var(--primary)' },
            { label: 'Avg Round Size', value: '₹4.2Cr', delta: '+15%', color: 'var(--secondary)' },
            { label: 'Unicorns', value: '108', delta: '+12 YTD', color: '#fbbf24' },
          ].map(m => (
            <div key={m.label} style={{
              padding: 24, borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-surface-container-low)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ fontFamily: 'Manrope', fontSize: '1.8rem', fontWeight: 800, color: m.color, letterSpacing: '-0.03em' }}>{m.value}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--outline)', marginTop: 4 }}>{m.label}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)', marginTop: 8 }}>{m.delta}</div>
            </div>
          ))}
        </div>

        {/* Funding Trends Chart */}
        <div style={{
          padding: 28, borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-surface-container-low)',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 32,
        }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 4 }}>Funding Round Volume by Stage</h3>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--outline)' }}>Quarterly · Deals Count</span>
          <div style={{ marginTop: 24 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={FUNDING_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="quarter" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="seed" fill="#85adff" radius={[4, 4, 0, 0]} name="Seed" />
                <Bar dataKey="seriesA" fill="#c180ff" radius={[4, 4, 0, 0]} name="Series A" />
                <Bar dataKey="seriesB" fill="#69f6b8" radius={[4, 4, 0, 0]} name="Series B+" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Funding Flow */}
        <div style={{
          padding: 28, borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-surface-container-low)',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 32,
        }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 4 }}>Sector Funding Flow</h3>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--outline)' }}>Monthly · ₹Cr Deployed</span>
          <div style={{ marginTop: 24 }}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={SECTOR_FLOW}>
                <defs>
                  <linearGradient id="saasGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#85adff" stopOpacity={0.2} /><stop offset="95%" stopColor="#85adff" stopOpacity={0} /></linearGradient>
                  <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c180ff" stopOpacity={0.2} /><stop offset="95%" stopColor="#c180ff" stopOpacity={0} /></linearGradient>
                  <linearGradient id="d2cGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#69f6b8" stopOpacity={0.2} /><stop offset="95%" stopColor="#69f6b8" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="SaaS" stroke="#85adff" fill="url(#saasGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Fintech" stroke="#c180ff" fill="url(#finGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="D2C" stroke="#69f6b8" fill="url(#d2cGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Healthtech" stroke="#fbbf24" fill="transparent" strokeWidth={2} strokeDasharray="6 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Investors Table */}
        <div style={{
          padding: 28, borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-surface-container-low)',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 64,
        }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 24 }}>Top Investor Profiles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOP_INVESTORS.map((inv, i) => (
              <div key={inv.name} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 20px', borderRadius: 'var(--radius-lg)',
                background: i < 3 ? 'rgba(193, 128, 255, 0.04)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: i < 3 ? 'var(--tertiary)' : 'var(--outline)', width: 28 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 2 }}>{inv.name}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', color: 'var(--outline)' }}>{inv.focus} · {inv.stage}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: 'var(--primary)' }}>{inv.deals}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.55rem', color: 'var(--outline)', textTransform: 'uppercase' }}>Deals</div>
                </div>
                <div style={{ textAlign: 'center', marginLeft: 16 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: 'var(--secondary)' }}>{inv.avgCheck}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.55rem', color: 'var(--outline)', textTransform: 'uppercase' }}>Avg Check</div>
                </div>
                <div style={{ width: 48, textAlign: 'right' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: inv.score >= 90 ? 'var(--secondary)' : 'var(--primary)' }}>{inv.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CapitalPage
