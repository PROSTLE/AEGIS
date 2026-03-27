import React, { useState, useEffect } from 'react'
import { locationApi } from '../services/api'
import { useAppStore } from '../context/appStore'
import { INDIAN_CITIES } from '../utils/constants'

function LocationPage() {
  const store = useAppStore()
  const defaultCity = store.dashboardCity || 'Bangalore'
  const [city, setCity] = useState(defaultCity)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    locationApi.get(city)
      .then(res => {
        if (active) {
          setData(res)
          setLoading(false)
        }
      })
      .catch(err => {
        console.error("Location API err:", err)
        setLoading(false)
      })
    return () => { active = false }
  }, [city])

  const zoneColor = (score) => score >= 80 ? 'var(--secondary)' : score >= 65 ? '#fbbf24' : 'var(--error)'
  const zoneRaw = (score) => score >= 80 ? '#69f6b8' : score >= 65 ? '#fbbf24' : '#ff6b6b'

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>Location & Land Intelligence</h1>
        <div className="page-subtitle">Zone recommendations based on rent, zoning law, supplier proximity & talent access</div>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.15em', marginRight: 4 }}>City:</span>
        <select 
          className="select" 
          value={city} 
          onChange={e => setCity(e.target.value)} 
          style={{ background: 'var(--bg-surface-container)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}
        >
          {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {!data || loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--on-surface-variant)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, animation: 'spin 1.5s linear infinite' }}>radar</span>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', marginTop: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scanning Topography Data...</p>
        </div>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.zones.map((zone, i) => (
          <div key={i} className="card" style={{ border: zone.recommended ? `1px solid ${zoneRaw(zone.score)}30` : undefined, background: zone.recommended ? `rgba(133,173,255,0.04)` : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{zone.name}</h3>
                  {zone.recommended && (
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(133,173,255,0.12)', padding: '2px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>star</span>Top Pick
                    </span>
                  )}
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', background: 'var(--bg-surface-container-highest)', padding: '2px 10px', borderRadius: 99 }}>{zone.zoning}</span>
                </div>
                <p style={{ margin: 0, fontFamily: 'Inter', fontSize: '0.82rem', color: 'var(--on-surface-variant)' }}>{zone.highway} · {zone.supplierProximity}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '2.5rem', color: zoneColor(zone.score), lineHeight: 1, letterSpacing: '-0.04em' }}>{zone.score}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Zone Score</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Rent', value: `₹${zone.rent}/sqft/mo`, icon: 'home' },
                { label: 'Highway Access', value: zone.highway, icon: 'road' },
                { label: 'Talent Access', value: zone.talentAccess, icon: 'groups' },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-surface-container)', borderRadius: 'var(--radius-lg)', padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: 'Manrope', fontSize: '0.88rem', fontWeight: 700 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Strengths</div>
                {zone.pros.map((p, j) => (
                  <div key={j} style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: 'var(--on-surface-variant)', padding: '3px 0', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--secondary)', flexShrink: 0, marginTop: 1 }}>check_circle</span>{p}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Considerations</div>
                {zone.cons.map((c, j) => (
                  <div key={j} style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: 'var(--on-surface-variant)', padding: '3px 0', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fbbf24', flexShrink: 0, marginTop: 1 }}>warning</span>{c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}

export default LocationPage
