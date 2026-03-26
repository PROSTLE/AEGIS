const API_BASE_URL = 'http://localhost:8000'

export const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    return response.json()
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

export const endpoints = {
  // Heatmap
  heatmapCities: '/api/heatmap/cities',
  heatmapCity: (city) => `/api/heatmap/cities/${city}`,

  // Survival
  survivalPredict: '/api/survival/predict',

  // Logistics
  logisticsCity: (city) => `/api/logistics/city/${city}`,

  // Workforce
  workforceCity: (city) => `/api/workforce/city/${city}`,

  // Location
  locationZones: (city) => `/api/location/city/${city}/zones`,

  // Activity
  activityCity: (city) => `/api/activity/city/${city}`,

  // Demand
  demandForecast: (city) => `/api/demand/city/${city}/forecast`,

  // Matchmaking
  matchInvestors: '/api/matchmaking/match',

  // Advisor
  launchReadiness: '/api/advisor/launch-readiness'
}
