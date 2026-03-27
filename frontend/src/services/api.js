/**
 * AEGIS Frontend API Service
 * Connects to FastAPI backend at http://localhost:8000
 * All modules use this layer — swap BASE_URL to production URL when deploying.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function get(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

async function post(path, body = {}, params = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

async function del(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

// ── Heatmap ──────────────────────────────────────────────────────────────────
export const heatmapApi = {
  getCities: (sector) => get('/api/heatmap/cities', { sector }),
  getCity: (cityName, sector) => get(`/api/heatmap/cities/${cityName}`, { sector }),
  getClusters: () => get('/api/heatmap/clusters'),
}

// ── Survival Predictor ────────────────────────────────────────────────────────
export const survivalApi = {
  predict: (city, sector, teamSize, fundingStage) =>
    post('/api/survival/predict', {
      city, startup_type: sector, idea: sector,
      team_size: teamSize, funding_stage: fundingStage
    }),
  getCitySurvival: (city, sector) => get(`/api/survival/city/${city}`, { sector }),
  getModelInfo: () => get('/api/survival/model/info'),
}

// ── Logistics ─────────────────────────────────────────────────────────────────
export const logisticsApi = {
  getScore: (city) => get(`/api/logistics/city/${city}`),
  getBreakdown: (city) => get(`/api/logistics/city/${city}/breakdown`),
  getAllCities: () => get('/api/logistics/cities'),
}

// ── Workforce ─────────────────────────────────────────────────────────────────
export const workforceApi = {
  get: (city, sector) => get(`/api/workforce/city/${city}`, { sector }),
  getBySector: (city, sector) => get(`/api/workforce/city/${city}/by-sector`, { sector }),
  getSectors: (city) => get(`/api/workforce/city/${city}/sectors`),
}

// ── Location ──────────────────────────────────────────────────────────────────
export const locationApi = {
  get: (city) => get(`/api/location/city/${city}`),
  getZones: (city) => get(`/api/location/city/${city}/zones`),
  getAllCities: () => get('/api/location/cities'),
}

// ── Activity ──────────────────────────────────────────────────────────────────
export const activityApi = {
  get: (city) => get(`/api/activity/city/${city}`),
  getCrowding: (city) => get(`/api/activity/city/${city}/crowding`),
  getAllCities: () => get('/api/activity/cities'),
}

// ── Demand ────────────────────────────────────────────────────────────────────
export const demandApi = {
  getForecast: (city, years = 5, idea = null) => get(`/api/demand/city/${city}/forecast`, { years, idea }),
  getSurvivalCurve: (city, idea = null) => get(`/api/demand/city/${city}/survival-curve`, { idea }),
  getFull: (city, idea = null) => get(`/api/demand/city/${city}/full`, { idea }),
}

// ── Matchmaking ───────────────────────────────────────────────────────────────
export const matchmakingApi = {
  match: (city, sector, funding_stage) =>
    get('/api/matchmaking/match', { city, sector, funding_stage }),
  getInvestor: (id) => get(`/api/matchmaking/investor/${id}`),
  getByCity: (city) => get(`/api/matchmaking/city/${city}/investors`),
  listAll: () => get('/api/matchmaking/investors'),
}

// ── AI Advisor ────────────────────────────────────────────────────────────────
export const advisorApi = {
  getLaunchReadiness: (city, startupIdea, startupType, teamSize = 3) =>
    post('/api/advisor/launch-readiness', {
      city, startup_idea: startupIdea,
      startup_type: startupType, team_size: teamSize
    }),
  analyze: (city, startupIdea, startupType) =>
    post('/api/advisor/analyze', {
      city, startup_idea: startupIdea, startup_type: startupType
    }),
}

// ── Idea Intelligence (NEW) ───────────────────────────────────────────────────
export const ideaApi = {
  analyze: (city, sector, idea, fundingStage = 'Seed', teamSize = 4) =>
    post('/api/ai/idea-analysis', {
      city, sector, startup_idea: idea, funding_stage: fundingStage, team_size: teamSize,
    }),
}


// ── Regulatory Pulse (NEW) ────────────────────────────────────────────────────
export const pulseApi = {
  getFeed: (tags) => get('/api/regulatory-pulse', { tags }),
  getByImpact: (impact) => get(`/api/regulatory-pulse/impact/${impact}`),
}

// ── Competition Radar (NEW) ───────────────────────────────────────────────────
export const competitionApi = {
  get: (city, sector) => get('/api/competition', { city, sector }),
  getCities: () => get('/api/competition/cities'),
}

// ── City Planner (NEW) ────────────────────────────────────────────────────────
export const cityPlannerApi = {
  get: (city) => get(`/api/city-planner/${city}`),
  getMigration: (city) => get(`/api/city-planner/${city}/migration`),
  getInfraGaps: (city) => get(`/api/city-planner/${city}/infra-gaps`),
}

// ── War Room Share (NEW) ──────────────────────────────────────────────────────
export const warRoomApi = {
  createLink: (reportName, expiresDays = 30, passwordHash = null) =>
    post('/api/share', {}, {
      report_name: reportName,
      expires_days: expiresDays,
      password_hash: passwordHash
    }),
  getShare: (shareId) => get(`/api/share/${shareId}`),
  revokeShare: (shareId) => del(`/api/share/${shareId}`),
  listShares: () => get('/api/share'),
}

// ── Health Check ──────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => get('/health'),
}

// Legacy compat (used by older components)
export const apiClient = {
  get: (endpoint) => get(endpoint),
  post: (endpoint, data) => post(endpoint, data),
}
