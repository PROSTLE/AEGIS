import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { INDIAN_CITIES } from '../../utils/constants'

const menuItems = [
  { path: '/', icon: '🏠', label: 'Dashboard', badge: null },
  { path: '/heatmap', icon: '🗺️', label: 'Heatmap', badge: 'HOT' },
  { path: '/survival', icon: '⚡', label: 'Survival AI', badge: null },
  { path: '/logistics', icon: '🚚', label: 'Logistics', badge: null },
  { path: '/workforce', icon: '👥', label: 'Workforce', badge: null },
  { path: '/location', icon: '📍', label: 'Location', badge: null },
  { path: '/activity', icon: '📊', label: 'Activity', badge: null },
  { path: '/demand', icon: '📈', label: 'Demand', badge: null },
  { path: '/matchmaking', icon: '🤝', label: 'Investors', badge: null },
  { path: '/advisor', icon: '🎯', label: 'AI Advisor', badge: 'AI' },
]

function Sidebar() {
  const location = useLocation()
  const [selectedCity, setSelectedCity] = useState('Jaipur')

  const isActive = (path) => location.pathname === path

  return (
    <aside className="sidebar">
      {/* Main Navigation */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Navigation</div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
              {item.badge && (
                <span className="sidebar-item-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-divider"></div>

      {/* City Quick Select */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Active City</div>
        <div className="sidebar-city-selector">
          <label>Select City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            id="sidebar-city-select"
          >
            {INDIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-success)', fontWeight: 600 }}>● Active</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Score: 74/100</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Data Sources</div>
          <div>data.gov.in · MCA21 · DPIIT</div>
          <div>OpenStreetMap · AISHE</div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
