export const INDIAN_CITIES = [
  'Amaravati', 'Visakhapatnam', 'Itanagar', 'Naharlagun', 'Guwahati', 'Dibrugarh', 'Patna', 'Begusarai',
  'Raipur', 'Bhilai', 'Panaji', 'Vasco da Gama', 'Gandhinagar', 'Surat', 'Ahmedabad', 'Chandigarh',
  'Faridabad', 'Shimla', 'Baddi', 'Ranchi', 'Jamshedpur', 'Bangalore', 'Hubli', 'Thiruvananthapuram',
  'Kochi', 'Bhopal', 'Indore', 'Mumbai', 'Nagpur', 'Pune', 'Imphal', 'Churachandpur', 'Shillong', 'Tura',
  'Aizawl', 'Lunglei', 'Kohima', 'Dimapur', 'Bhubaneswar', 'Rourkela', 'Ludhiana', 'Jaipur', 'Jodhpur',
  'Gangtok', 'Namchi', 'Chennai', 'Coimbatore', 'Hyderabad', 'Warangal', 'Agartala', 'Dharmanagar',
  'Lucknow', 'Kanpur', 'Dehradun', 'Rudrapur', 'Kolkata', 'Haldia', 'Delhi'
].sort()

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
