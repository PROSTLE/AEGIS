import React, { useState } from 'react'

const SHARED_REPORTS = [
  { id: 'abc12x', report: 'Jaipur · Manufacturing', score: 74, shared: '2 days ago', views: 14, status: 'active', link: 'https://aegis.io/report/share/abc12x' },
  { id: 'qz78mn', report: 'Ahmedabad · SaaS', score: 81, shared: '5 days ago', views: 6, status: 'active', link: 'https://aegis.io/report/share/qz78mn' },
  { id: 'pxr34t', report: 'Bangalore · Deeptech', score: 89, shared: '8 days ago', views: 22, status: 'expired', link: 'https://aegis.io/report/share/pxr34t' },
]

const COLLABORATORS = [
  { name: 'Rishith M.', role: 'Co-founder', access: 'Full Access', avatar: 'R', color: '#85adff', lastSeen: '2 mins ago' },
  { name: 'Priya V.', role: 'Investor', access: 'View Only', avatar: 'P', color: '#c180ff', lastSeen: '1 day ago' },
  { name: 'Amit K.', role: 'Advisor', access: 'View Only', avatar: 'A', color: '#69f6b8', lastSeen: '4 days ago' },
]

function WarRoomPage() {
  const [generating, setGenerating] = useState(false)
  const [newLink, setNewLink] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [reportName, setReportName] = useState('Jaipur · Manufacturing')
  const [password, setPassword] = useState('')

  const generateLink = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1400))
    const id = Math.random().toString(36).substr(2, 8)
    setNewLink(`https://aegis.io/report/share/${id}`)
    setGenerating(false)
  }

  const copyLink = (link, id) => {
    navigator.clipboard.writeText(link).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'Manrope', fontWeight: 800 }}>War Room</h1>
        <div className="page-subtitle">
          Collaborative terrain sharing for co-founders and investors. Generate secure, password-protected report links.
          <span className="badge badge-green" style={{ marginLeft: 12 }}>Share &amp; Collaborate</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28 }}>
        <div>
          {/* Generate New Link */}
          <div className="card" style={{ marginBottom: 24, background: 'rgba(105,246,184,0.04)', border: '1px solid rgba(105,246,184,0.15)' }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--secondary)' }}>add_link</span>
              Generate New Share Link
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Report Name</label>
                <input type="text" value={reportName} onChange={e => setReportName(e.target.value)} id="war-room-report-name" placeholder="e.g. Jaipur · Manufacturing" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Password Protect (Optional)</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} id="war-room-password" placeholder="Leave blank for public link" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button className="btn btn-primary" onClick={generateLink} disabled={generating} id="war-room-generate-btn">
                {generating ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Generating…</> : '🔗 Generate Secure Link'}
              </button>
              {newLink && (
                <div style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center', padding: '10px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-container-low)', border: '1px solid rgba(105,246,184,0.2)' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: 'var(--secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{newLink}</span>
                  <button onClick={() => copyLink(newLink, 'new')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: copiedId === 'new' ? 'var(--secondary)' : 'var(--outline)' }}>{copiedId === 'new' ? 'check' : 'content_copy'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Existing Shared Reports */}
          <div>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 16 }}>Active Shared Links ({SHARED_REPORTS.filter(r => r.status === 'active').length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SHARED_REPORTS.map(r => (
                <div key={r.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, opacity: r.status === 'expired' ? 0.5 : 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: r.score >= 80 ? 'rgba(105,246,184,0.1)' : 'rgba(133,173,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: r.score >= 80 ? 'var(--secondary)' : 'var(--primary)' }}>{r.score}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 2 }}>{r.report}</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.7rem', color: 'var(--outline)' }}>Shared {r.shared} · {r.views} views</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--outline)', marginTop: 2, opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{r.link}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', fontWeight: 700, color: r.status === 'active' ? 'var(--secondary)' : '#ff6b6b', background: r.status === 'active' ? 'rgba(105,246,184,0.1)' : 'rgba(255,107,107,0.1)', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase' }}>{r.status}</span>
                    {r.status === 'active' && (
                      <button onClick={() => copyLink(r.link, r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: 8, display: 'flex', alignItems: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: copiedId === r.id ? 'var(--secondary)' : 'var(--outline)' }}>{copiedId === r.id ? 'check' : 'content_copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Collaborators Panel */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 20 }}>Team</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COLLABORATORS.map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk', fontWeight: 800, color: c.color, fontSize: '0.85rem', flexShrink: 0 }}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.65rem', color: 'var(--outline)' }}>{c.role} · {c.lastSeen}</div>
                  </div>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.6rem', color: 'var(--outline)', background: 'var(--bg-surface-container-high)', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>{c.access}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary btn-full" style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_add</span>
              Invite Collaborator
            </button>
          </div>

          <div className="card" style={{ background: 'rgba(133,173,255,0.04)', border: '1px solid rgba(133,173,255,0.1)' }}>
            <h4 style={{ fontFamily: 'Manrope', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>shield</span>
              Security Notes
            </h4>
            {['All links are password-protectable.', 'Reports expire after 30 days.', 'View-only access prevents data export.', 'Revoke access anytime from this panel.'].map((note, i) => (
              <div key={i} style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: 'var(--on-surface-variant)', padding: '6px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--primary)', marginTop: 1 }}>•</span>
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WarRoomPage
