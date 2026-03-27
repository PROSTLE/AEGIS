import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import '../../styles/layout.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <Navbar />
      <div className="layout-body">
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
