import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand (visible on mobile only) */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
          </div>
          <div className="brand-name">AEGIS</div>
        </Link>

        {/* Search Bar */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search cities (e.g. Jaipur, Pune)..."
            id="navbar-search-input"
          />
          <span className="search-icon material-symbols-outlined">search</span>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <Link to="/advisor" className="navbar-upgrade-btn" id="get-report-btn" style={{
            background: 'rgba(193, 128, 255, 0.12)',
            color: '#c180ff',
            border: '1px solid rgba(193, 128, 255, 0.25)',
            boxShadow: '0 0 15px rgba(193, 128, 255, 0.1)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
            AI Guide
          </Link>
          <div className="navbar-user-section">
            <div className="navbar-avatar">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
