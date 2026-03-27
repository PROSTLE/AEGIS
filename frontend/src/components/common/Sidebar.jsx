import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/heatmap', icon: 'map', label: 'Heatmap' },
  { path: '/survival', icon: 'psychology', label: 'Survival AI' },
  { path: '/logistics', icon: 'local_shipping', label: 'Logistics' },
  { path: '/workforce', icon: 'groups', label: 'Workforce' },
  { path: '/location', icon: 'location_on', label: 'Location' },
  { path: '/activity', icon: 'insights', label: 'Activity' },
  { path: '/demand', icon: 'trending_up', label: 'Demand' },
  { path: '/matchmaking', icon: 'payments', label: 'Investors' },
  { path: '/competition', icon: 'radar', label: 'Competition' },
  { path: '/war-room', icon: 'group_work', label: 'War Room' },
  { path: '/city-planner', icon: 'account_balance', label: 'City Planner' },
]

function Sidebar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="sidebar">
      {/* Brand */}
      <Link to="/" className="sidebar-brand" style={{ textDecoration: 'none' }}>
        <div className="sidebar-brand-name">AEGIS</div>
        <div className="sidebar-brand-tagline">India Startup Terrain</div>
      </Link>

      {/* Navigation */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Main Modules</div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="sidebar-item-icon">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              </span>
              <span className="sidebar-item-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* AI Guide Button */}
      <div className="sidebar-ai-guide">
        <Link to="/advisor" className="sidebar-ai-guide-btn" id="nav-ai-advisor" style={{ textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>auto_awesome</span>
          AI Guide
        </Link>
      </div>

    </aside>
  )
}

export default Sidebar
