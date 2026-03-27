import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  const [showGuide, setShowGuide] = useState(true)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '32px',
    }}>
      {/* Top Header Bar */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(14, 14, 14, 0.8)', backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 32px', height: 72,
        boxShadow: '0 0 40px rgba(133, 173, 255, 0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            fontFamily: 'Manrope', fontSize: '1.2rem', fontWeight: 800,
            letterSpacing: '-0.02em', color: 'var(--primary)',
          }}>AEGIS</span>
        </div>
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[{l:'Intelligence',p:'/intelligence'},{l:'Terrain',p:'/advisor'},{l:'Capital',p:'/capital'},{l:'Vault',p:'/vault'}].map((item, i) => (
            <Link key={item.l} to={item.p} style={{
              fontFamily: 'Manrope', fontWeight: 700, textTransform: 'uppercase',
              fontSize: '0.8rem', letterSpacing: '0.04em',
              color: i === 1 ? 'var(--primary)' : 'var(--outline)',
              cursor: 'pointer', transition: 'color 0.3s', textDecoration: 'none',
            }}
              onMouseEnter={e => { if (i !== 1) e.currentTarget.style.color = 'var(--secondary)' }}
              onMouseLeave={e => { if (i !== 1) e.currentTarget.style.color = 'var(--outline)' }}
            >{item.l}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/dashboard" style={{
            padding: '8px 20px', borderRadius: 'var(--radius-full)',
            background: 'var(--primary)', color: 'var(--on-primary)',
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem',
            textDecoration: 'none', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>dashboard</span>
            Dashboard
          </Link>
        </div>
      </header>

      {/* Ambient Background Glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
          background: 'rgba(133, 173, 255, 0.05)', filter: 'blur(120px)', borderRadius: '50%',
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
          background: 'rgba(193, 128, 255, 0.05)', filter: 'blur(120px)', borderRadius: '50%',
        }}></div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, rgba(133, 173, 255, 0.08) 0%, rgba(14, 14, 14, 0) 70%)',
        }}></div>
      </div>

      {/* Main Content */}
      <main style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: 800,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        {/* Hero Headline */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{
            fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            letterSpacing: '-0.03em', color: 'white', lineHeight: 1.1,
            marginBottom: 24,
          }}>
            Don't Launch{' '}
            <span style={{ color: 'var(--primary)' }}>Blind.</span>
          </h1>
          <p style={{
            fontFamily: 'Inter', color: 'var(--on-surface-variant)',
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            maxWidth: 560, margin: '0 auto', lineHeight: 1.6,
          }}>
            AI-powered terrain intelligence for the Indian startup ecosystem.
          </p>
        </div>

        {/* AI Guide Tooltip */}
        {showGuide && (
          <div style={{ marginBottom: 48 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 16,
              padding: '16px 24px', borderRadius: 'var(--radius-xl)',
              background: 'rgba(38, 38, 38, 0.4)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(193, 128, 255, 0.2)',
              boxShadow: '0 0 30px rgba(193, 128, 255, 0.1)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(193, 128, 255, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 20, color: 'var(--tertiary)',
                  fontVariationSettings: "'FILL' 1",
                }}>smart_toy</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontFamily: 'Space Grotesk', color: 'var(--tertiary)',
                  fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                  fontWeight: 700, marginBottom: 2,
                }}>AI Guide</p>
                <p style={{
                  fontFamily: 'Inter', color: 'white', fontSize: '0.875rem', margin: 0,
                }}>Hey! Not sure where to start? Let's explore India's top startup cities first.</p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                style={{
                  marginLeft: 8, background: 'none', border: 'none',
                  cursor: 'pointer', padding: 4, flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{
                  fontSize: 16, color: 'var(--on-surface-variant)',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
                >close</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          gap: 24, width: '100%', maxWidth: 580,
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <Link to="/advisor" style={{ textDecoration: 'none', flex: 1, minWidth: 240 }}>
            <button style={{
              width: '100%', position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              color: 'var(--on-primary)', padding: '20px 40px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(133, 173, 255, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Analyze a Startup Plan
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            </button>
          </Link>

          <Link to="/dashboard" style={{ textDecoration: 'none', flex: 1, minWidth: 240 }}>
            <button style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              color: 'white', padding: '20px 40px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem',
              border: '1px solid var(--outline-variant)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'var(--outline-variant)' }}
            >
              Explore the Platform
            </button>
          </Link>
        </div>

        {/* Stats Footer */}
        <div style={{
          marginTop: 80, display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: 48,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{
              fontFamily: 'Space Grotesk', color: 'var(--primary)',
              fontWeight: 700, fontSize: '1.5rem', margin: 0,
            }}>45k+</p>
            <p style={{
              fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)',
              fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em',
              margin: 0, marginTop: 4,
            }}>Verified Startups</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'var(--secondary)', opacity: 0.75,
                  animation: 'pulse 2s ease infinite',
                }}></span>
                <span style={{
                  position: 'relative', display: 'inline-flex', borderRadius: '50%',
                  width: 8, height: 8, background: 'var(--secondary)',
                }}></span>
              </span>
              <p style={{
                fontFamily: 'Space Grotesk', color: 'var(--secondary)',
                fontWeight: 700, fontSize: '1.5rem', margin: 0,
              }}>Live</p>
            </div>
            <p style={{
              fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)',
              fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em',
              margin: 0, marginTop: 4,
            }}>Real-time Market Data</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{
              fontFamily: 'Space Grotesk', color: 'var(--tertiary)',
              fontWeight: 700, fontSize: '1.5rem', margin: 0,
            }}>98%</p>
            <p style={{
              fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)',
              fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em',
              margin: 0, marginTop: 4,
            }}>Predictive Accuracy</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'fixed', bottom: 0, width: '100%', padding: 32,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
      }}>
        <div style={{
          fontFamily: 'Space Grotesk', fontSize: '0.6rem',
          color: 'var(--on-surface-variant)', textTransform: 'uppercase',
          letterSpacing: '0.3em',
        }}>
          © 2024 Sovereign Intelligence Engine
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span className="material-symbols-outlined" style={{
            fontSize: 20, color: 'var(--on-surface-variant)',
            cursor: 'pointer', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
          >public</span>
          <span className="material-symbols-outlined" style={{
            fontSize: 20, color: 'var(--on-surface-variant)',
            cursor: 'pointer', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
          >hub</span>
          <span className="material-symbols-outlined" style={{
            fontSize: 20, color: 'var(--on-surface-variant)',
            cursor: 'pointer', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
          >database</span>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
