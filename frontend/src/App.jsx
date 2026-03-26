import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import Dashboard from './pages/Dashboard'
import HeatmapPage from './pages/HeatmapPage'
import SurvivalPredictorPage from './pages/SurvivalPredictorPage'
import LogisticsPage from './pages/LogisticsPage'
import WorkforcePage from './pages/WorkforcePage'
import LocationPage from './pages/LocationPage'
import ActivityPage from './pages/ActivityPage'
import DemandPage from './pages/DemandPage'
import MatchmakingPage from './pages/MatchmakingPage'
import AdvisorPage from './pages/AdvisorPage'
import './styles/index.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/survival" element={<SurvivalPredictorPage />} />
          <Route path="/logistics" element={<LogisticsPage />} />
          <Route path="/workforce" element={<WorkforcePage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/demand" element={<DemandPage />} />
          <Route path="/matchmaking" element={<MatchmakingPage />} />
          <Route path="/advisor" element={<AdvisorPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

