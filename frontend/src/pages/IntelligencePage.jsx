import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

const ECOSYSTEM_TREND = [
  { month: 'Jan', registrations: 3420, closures: 210, funding: 890 },
  { month: 'Feb', registrations: 3890, closures: 185, funding: 1120 },
  { month: 'Mar', registrations: 4150, closures: 240, funding: 980 },
  { month: 'Apr', registrations: 4680, closures: 198, funding: 1340 },
  { month: 'May', registrations: 5210, closures: 275, funding: 1560 },
  { month: 'Jun', registrations: 4920, closures: 310, funding: 1890 },
  { month: 'Jul', registrations: 5580, closures: 225, funding: 2100 },
  { month: 'Aug', registrations: 6100, closures: 290, funding: 1950 },
]

const SECTOR_DATA = [
  { sector: 'SaaS', startups: 12400, growth: 34, color: '#85adff' },
  { sector: 'Fintech', startups: 8900, growth: 28, color: '#c180ff' },
  { sector: 'D2C', startups: 7200, growth: 42, color: '#69f6b8' },
  { sector: 'Healthtech', startups: 5800, growth: 38, color: '#85adff' },
  { sector: 'Edtech', startups: 4300, growth: 15, color: '#fbbf24' },
  { sector: 'Agritech', startups: 3100, growth: 52, color: '#69f6b8' },
  { sector: 'Cleantech', startups: 2400, growth: 61, color: '#c180ff' },
  { sector: 'Deeptech', startups: 1800, growth: 47, color: '#85adff' },
]

const CITY_RANKINGS = [
  { city: 'Bangalore', score: 92, startups: 28400, specialty: 'SaaS & Deeptech' },
  { city: 'Mumbai', score: 88, startups: 21200, specialty: 'Fintech & D2C' },
  { city: 'Delhi NCR', score: 85, startups: 19800, specialty: 'Enterprise & E-com' },
  { city: 'Hyderabad', score: 78, startups: 8900, specialty: 'Pharma & AI' },
  { city: 'Chennai', score: 74, startups: 6200, specialty: 'SaaS & Auto' },
  { city: 'Pune', score: 72, startups: 7100, specialty: 'IT & Manufacturing' },
  { city: 'Jaipur', score: 68, startups: 3400, specialty: 'D2C & Handicrafts' },
  { city: 'Ahmedabad', score: 71, startups: 4100, specialty: 'Manufacturing' },
]

const PIE_DATA = [
  { name: 'Seed', value: 42, color: '#85adff' },
  { name: 'Pre-seed', value: 28, color: '#c180ff' },
  { name: 'Series A', value: 18, color: '#69f6b8' },
  { name: 'Series B+', value: 12, color: '#fbbf24' },
]

function IntelligencePage() {
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
              color: i === 0 ? 'var(--primary)' : 'var(--outline)',
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
        {/* Page Title */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'rgba(133, 173, 255, 0.1)', border: '1px solid rgba(133, 173, 255, 0.2)',
            marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px rgba(133,173,255,0.6)' }}></span>
            <span style={{ fontFamily: 'Space Grotesk', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Live Intelligence Feed</span>
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'white', marginBottom: 12 }}>
            Ecosystem <span style={{ color: 'var(--primary)' }}>Intelligence</span>
          </h1>
          <p style={{ fontFamily: 'Inter', color: 'var(--on-surface-variant)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
            Real-time analytics across India's startup ecosystem. Track registrations, funding, sectors, and city performance.
          </p>
        </div>

        {/* Key Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Active Startups', value: '45,200+', delta: '+12.4%', icon: 'rocket_launch', color: 'var(--primary)' },
            { label: 'Monthly Registrations', value: '6,100', delta: '+18.2%', icon: 'trending_up', color: 'var(--secondary)' },
            { label: 'Avg Funding Round', value: '₹2.8Cr', delta: '+9.1%', icon: 'payments', color: 'var(--tertiary)' },
            { label: 'Cities Tracked', value: '42', delta: '+6', icon: 'location_on', color: '#fbbf24' },
          ].map(m => (
            <div key={m.label} style={{
              padding: 24, borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-surface-container-low)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: m.color, fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)' }}>{m.delta}</span>
              </div>
              <div style={{ fontFamily: 'Manrope', fontSize: '1.8rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{m.value}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--outline)', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Registration Trends */}
          <div style={{
            padding: 28, borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-surface-container-low)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 4 }}>Registration & Closure Trends</h3>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--outline)' }}>Monthly · 2024</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                {[{c:'#85adff',l:'Registrations'},{c:'var(--error)',l:'Closures'}].map(i => (
                  <div key={i.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 3, borderRadius: 2, background: i.c }}></span>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)' }}>{i.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={ECOSYSTEM_TREND}>
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#85adff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#85adff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="registrations" stroke="#85adff" fill="url(#regGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="closures" stroke="var(--error)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stage Distribution */}
          <div style={{
            padding: 28, borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-surface-container-low)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 4 }}>Funding Stage Distribution</h3>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--outline)' }}>Active Startups</span>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 8 }}>
              {PIE_DATA.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }}></span>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sector Breakdown */}
        <div style={{
          padding: 28, borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-surface-container-low)',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 32,
        }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 24 }}>Sector Performance Index</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {SECTOR_DATA.map(s => (
              <div key={s.sector} style={{
                padding: 20, borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-surface-container)',
                border: '1px solid rgba(255,255,255,0.04)',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${s.color}40`}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'}
              >
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{s.sector}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', color: s.color }}>{s.startups.toLocaleString()}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--secondary)', marginTop: 4 }}>+{s.growth}% YoY</div>
                <div className="progress-bar" style={{ marginTop: 12, height: 3 }}>
                  <div className="progress-fill" style={{ width: `${s.growth}%`, background: s.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City Rankings */}
        <div style={{
          padding: 28, borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-surface-container-low)',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 64,
        }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 24 }}>City Ecosystem Rankings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CITY_RANKINGS.map((c, i) => (
              <div key={c.city} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 20px', borderRadius: 'var(--radius-lg)',
                background: i < 3 ? 'rgba(133, 173, 255, 0.04)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.2rem', color: i < 3 ? 'var(--primary)' : 'var(--outline)', width: 32 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1rem' }}>{c.city}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', color: 'var(--outline)' }}>{c.specialty}</div>
                </div>
                <div style={{ textAlign: 'right', marginRight: 16 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', color: 'var(--outline)' }}>{c.startups.toLocaleString()} startups</div>
                </div>
                <div style={{ width: 120 }}>
                  <div className="progress-bar" style={{ height: 4 }}>
                    <div className="progress-fill" style={{ width: `${c.score}%`, background: c.score >= 80 ? 'var(--secondary)' : c.score >= 70 ? 'var(--primary)' : '#fbbf24' }}></div>
                  </div>
                </div>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: c.score >= 80 ? 'var(--secondary)' : 'var(--primary)', width: 48, textAlign: 'right' }}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntelligencePage
