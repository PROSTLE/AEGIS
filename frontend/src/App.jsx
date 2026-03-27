import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import LandingPage from './pages/LandingPage'
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
import IntelligencePage from './pages/IntelligencePage'
import CapitalPage from './pages/CapitalPage'
import VaultPage from './pages/VaultPage'
import CompetitionPage from './pages/CompetitionPage'
import CityPlannerPage from './pages/CityPlannerPage'
import WarRoomPage from './pages/WarRoomPage'
import './styles/index.css'
import './styles/pages.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Full-screen pages (no sidebar/navbar) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/advisor" element={<AdvisorPage />} />
        <Route path="/intelligence" element={<IntelligencePage />} />
        <Route path="/capital" element={<CapitalPage />} />
        <Route path="/vault" element={<VaultPage />} />

        {/* App pages wrapped in Layout (sidebar + navbar) — NEW features */}
        <Route path="/competition" element={<Layout><CompetitionPage /></Layout>} />
        <Route path="/city-planner" element={<Layout><CityPlannerPage /></Layout>} />
        <Route path="/war-room" element={<Layout><WarRoomPage /></Layout>} />

        {/* App pages wrapped in Layout (sidebar + navbar) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/heatmap" element={<Layout><HeatmapPage /></Layout>} />
        <Route path="/survival" element={<Layout><SurvivalPredictorPage /></Layout>} />
        <Route path="/logistics" element={<Layout><LogisticsPage /></Layout>} />
        <Route path="/workforce" element={<Layout><WorkforcePage /></Layout>} />
        <Route path="/location" element={<Layout><LocationPage /></Layout>} />
        <Route path="/activity" element={<Layout><ActivityPage /></Layout>} />
        <Route path="/demand" element={<Layout><DemandPage /></Layout>} />
        <Route path="/matchmaking" element={<Layout><MatchmakingPage /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App
