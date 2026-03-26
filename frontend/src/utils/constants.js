export const INDIAN_CITIES = [
  'Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Coimbatore',
  'Kochi', 'Chandigarh', 'Indore', 'Nagpur', 'Vadodara'
]

export const SECTORS = [
  'Fintech',
  'Agritech',
  'D2C',
  'Manufacturing',
  'SaaS',
  'HealthTech',
  'EdTech',
  'AI/ML',
  'IoT',
  'Logistics'
]

export const FUNDING_STAGES = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C'
]

export const SCORE_COLOR_MAP = {
  high: '#10b981',    // Green
  medium: '#f59e0b',  // Yellow
  low: '#ef4444'      // Red
}

export const getScoreColor = (score) => {
  if (score >= 70) return SCORE_COLOR_MAP.high
  if (score >= 40) return SCORE_COLOR_MAP.medium
  return SCORE_COLOR_MAP.low
}

export const getScoreCategory = (score) => {
  if (score >= 70) return 'High Opportunity'
  if (score >= 40) return 'Moderate'
  return 'Saturated'
}
