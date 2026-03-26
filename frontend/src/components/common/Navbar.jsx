import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [time] = useState(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }))

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">⚡</div>
          <div>
            <div className="brand-name">AEGIS</div>
            <div className="brand-tagline">India Startup Intelligence</div>
          </div>
        </Link>

        {/* Center Badge */}
        <div className="navbar-center">
          <div className="navbar-badge">
            <span className="dot-live" style={{ width: 7, height: 7, display: 'inline-block' }}></span>
            Live Data · 50+ Indian Cities
          </div>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <div className="navbar-stat">
            <span className="navbar-stat-value">74/100</span>
            <span className="navbar-stat-label">Last Score</span>
          </div>
          <div className="navbar-divider"></div>
          <div className="navbar-stat">
            <span className="navbar-stat-value">{time} IST</span>
            <span className="navbar-stat-label">Local Time</span>
          </div>
          <div className="navbar-divider"></div>
          <Link to="/advisor" className="btn btn-primary btn-sm" id="get-report-btn">
            Get Report
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
