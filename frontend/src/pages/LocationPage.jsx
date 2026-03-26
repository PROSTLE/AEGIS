import React, { useState } from 'react'

const LOCATION_DATA = {
  Jaipur: {
    sector: 'Manufacturing',
    zones: [
      {
        name: 'Sitapura Industrial Area',
        score: 84,
        rent: 22,
        zoning: 'Industrial',
        highway: 'NH-48 (2km)',
        supplierProximity: 'High — MSME cluster nearby',
        talentAccess: 'Moderate — ITI colleges within 8km',
        pros: ['Direct NH-48 access', 'RIICO industrial plots available', 'Power substation on-site'],
        cons: ['Water supply intermittent', 'Limited food options for workers'],
        recommended: true,
      },
      {
        name: 'Boranada Industrial Zone',
        score: 76,
        rent: 18,
        zoning: 'Industrial',
        highway: 'NH-11 (5km)',
        supplierProximity: 'Moderate — textile suppliers nearby',
        talentAccess: 'High — proximity to ITI colleges',
        pros: ['Lower land cost', 'Good labour pool', 'Near textile base'],
        cons: ['Flood risk in monsoon', 'Older infrastructure'],
        recommended: false,
      },
      {
        name: 'Kukas Industrial Area',
        score: 71,
        rent: 25,
        zoning: 'Industrial / SEZ',
        highway: 'NH-48 (12km)',
        supplierProximity: 'Low — distance from MSME clusters',
        talentAccess: 'Moderate',
        pros: ['Modern infrastructure', 'Near Delhi-Mumbai corridor'],
        cons: ['Higher rent', 'Far from supplier clusters'],
        recommended: false,
      },
    ],
  },
  Ahmedabad: {
    sector: 'Manufacturing',
    zones: [
      {
        name: 'Vatva GIDC',
        score: 91,
        rent: 29,
        zoning: 'Industrial',
        highway: 'NH-48 (3km)',
        supplierProximity: 'Very High — chemical & textile clusters',
        talentAccess: 'High',
        pros: ['Established industrial estate', 'Near Mundra port corridor', 'Strong MSME network'],
        cons: ['High pollution zone', 'Rising property costs'],
        recommended: true,
      },
    ],
  },
}

function LocationPage() {
  const [city, setCity] = useState('Jaipur')
  const data = LOCATION_DATA[city] || LOCATION_DATA['Jaipur']

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📍 Location & Land Intelligence</h1>
        <div className="page-subtitle">Zone recommendations based on rent, zoning law, supplier proximity & talent access</div>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>City:</span>
        {Object.keys(LOCATION_DATA).map(c => (
          <button key={c} className={`btn btn-sm ${city === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCity(c)} id={`loc-city-${c.toLowerCase()}`}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.zones.map((zone, i) => (
          <div key={i} className="card" style={{
            border: zone.recommended ? '1px solid rgba(59,130,246,0.4)' : '1px solid var(--border-color)',
            background: zone.recommended ? 'linear-gradient(135deg, rgba(59,130,246,0.07), var(--bg-card))' : 'var(--bg-card)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{zone.name}</h3>
                  {zone.recommended && <span className="badge badge-blue">⭐ Top Pick</span>}
                  <span className="badge badge-cyan">{zone.zoning}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{zone.highway} · {zone.supplierProximity}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit', color: zone.score >= 80 ? '#10b981' : '#f59e0b' }}>{zone.score}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Zone Score</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Rent', value: `₹${zone.rent}/sqft/mo` },
                { label: 'Highway Access', value: zone.highway },
                { label: 'Talent Access', value: zone.talentAccess },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="grid-2">
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.05em' }}>Pros</div>
                {zone.pros.map((p, j) => (
                  <div key={j} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '3px 0', display: 'flex', gap: 6 }}>
                    <span style={{ color: '#10b981' }}>✓</span>{p}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.05em' }}>Cons</div>
                {zone.cons.map((c, j) => (
                  <div key={j} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '3px 0', display: 'flex', gap: 6 }}>
                    <span style={{ color: '#f59e0b' }}>!</span>{c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocationPage
