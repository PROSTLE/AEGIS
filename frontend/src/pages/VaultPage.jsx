import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SAVED_REPORTS = [
  { id: 1, city: 'Jaipur', type: 'Manufacturing', idea: 'Sustainable packaging factory', score: 74, date: '2024-03-15', status: 'complete' },
  { id: 2, city: 'Ahmedabad', type: 'SaaS', idea: 'FinOps dashboard for SMBs', score: 81, date: '2024-03-12', status: 'complete' },
  { id: 3, city: 'Bangalore', type: 'Deeptech', idea: 'AI-powered drug discovery', score: 89, date: '2024-03-10', status: 'complete' },
  { id: 4, city: 'Pune', type: 'Edtech', idea: 'Vernacular STEM learning platform', score: 72, date: '2024-03-08', status: 'complete' },
  { id: 5, city: 'Mumbai', type: 'Fintech', idea: 'Micro-lending for street vendors', score: 68, date: '2024-03-05', status: 'complete' },
]

const BOOKMARKED_CITIES = [
  { city: 'Jaipur', score: 74, sector: 'Manufacturing', lastUpdated: '2 days ago', trend: '+3.1%' },
  { city: 'Ahmedabad', score: 81, sector: 'Logistics', lastUpdated: '1 day ago', trend: '+5.6%' },
  { city: 'Bangalore', score: 92, sector: 'SaaS', lastUpdated: '3 hours ago', trend: '+1.2%' },
  { city: 'Coimbatore', score: 76, sector: 'Manufacturing', lastUpdated: '5 days ago', trend: '+8.4%' },
]

const ACTIVITY_LOG = [
  { action: 'Generated terrain report', detail: 'Jaipur · Manufacturing', time: '2 hours ago', icon: 'description' },
  { action: 'Bookmarked city', detail: 'Ahmedabad added to watchlist', time: '4 hours ago', icon: 'bookmark' },
  { action: 'Investor match found', detail: 'Blume Ventures — 91% match', time: '1 day ago', icon: 'handshake' },
  { action: 'Score update', detail: 'Bangalore SaaS score increased +1.2%', time: '1 day ago', icon: 'trending_up' },
  { action: 'Generated terrain report', detail: 'Pune · Edtech', time: '3 days ago', icon: 'description' },
  { action: 'Export completed', detail: 'Full report PDF — Ahmedabad.pdf', time: '3 days ago', icon: 'download' },
]

function VaultPage() {
  const [activeTab, setActiveTab] = useState('reports')

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
              color: i === 3 ? 'var(--primary)' : 'var(--outline)',
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

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Title */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'rgba(105, 246, 184, 0.1)', border: '1px solid rgba(105, 246, 184, 0.2)',
            marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)', boxShadow: '0 0 8px rgba(105,246,184,0.6)' }}></span>
            <span style={{ fontFamily: 'Space Grotesk', color: 'var(--secondary)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Secure Storage</span>
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'white', marginBottom: 12 }}>
            Your <span style={{ color: 'var(--secondary)' }}>Vault</span>
          </h1>
          <p style={{ fontFamily: 'Inter', color: 'var(--on-surface-variant)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>
            Saved reports, bookmarked cities, and your activity history — all in one place.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
          {[{k:'reports',l:'Saved Reports',icon:'description'},{k:'cities',l:'Watchlist',icon:'bookmark'},{k:'activity',l:'Activity',icon:'history'}].map(tab => (
            <button key={tab.k} onClick={() => setActiveTab(tab.k)} style={{
              padding: '10px 24px', borderRadius: 'var(--radius-full)',
              background: activeTab === tab.k ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.k ? 'var(--on-primary)' : 'var(--on-surface-variant)',
              border: activeTab === tab.k ? 'none' : '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.l}
            </button>
          ))}
        </div>

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SAVED_REPORTS.map(r => (
              <div key={r.id} style={{
                padding: '20px 24px', borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-surface-container-low)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', gap: 20,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(133,173,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                  background: r.score >= 80 ? 'rgba(105, 246, 184, 0.1)' : r.score >= 70 ? 'rgba(133, 173, 255, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem',
                    color: r.score >= 80 ? 'var(--secondary)' : r.score >= 70 ? 'var(--primary)' : '#fbbf24',
                  }}>{r.score}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 4 }}>{r.idea}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', color: 'var(--outline)' }}>{r.city} · {r.type} · {r.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-full)',
                    background: 'rgba(133, 173, 255, 0.1)', border: '1px solid rgba(133, 173, 255, 0.2)',
                    color: 'var(--primary)', fontSize: '0.75rem', fontFamily: 'Space Grotesk',
                    fontWeight: 700, cursor: 'pointer',
                  }}>View</button>
                  <button style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-full)',
                    background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--on-surface-variant)', fontSize: '0.75rem', fontFamily: 'Space Grotesk',
                    fontWeight: 700, cursor: 'pointer',
                  }}>Export</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cities Tab */}
        {activeTab === 'cities' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {BOOKMARKED_CITIES.map(c => (
              <div key={c.city} style={{
                padding: 24, borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-surface-container-low)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.2rem' }}>{c.city}</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', color: 'var(--outline)', marginTop: 2 }}>{c.sector} · Updated {c.lastUpdated}</div>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#fbbf24', fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                  <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '2.5rem', color: c.score >= 80 ? 'var(--secondary)' : 'var(--primary)', lineHeight: 1 }}>{c.score}</span>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 700, marginBottom: 4 }}>{c.trend}</span>
                </div>
                <div className="progress-bar" style={{ marginTop: 16, height: 4 }}>
                  <div className="progress-fill" style={{ width: `${c.score}%`, background: c.score >= 80 ? 'var(--secondary)' : 'var(--primary)' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ACTIVITY_LOG.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px', borderRadius: 'var(--radius-lg)',
                background: i === 0 ? 'rgba(133, 173, 255, 0.04)' : 'transparent',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--bg-surface-container-high)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>{a.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '0.9rem' }}>{a.action}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: 'var(--outline)' }}>{a.detail}</div>
                </div>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', color: 'var(--outline)', flexShrink: 0 }}>{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VaultPage
