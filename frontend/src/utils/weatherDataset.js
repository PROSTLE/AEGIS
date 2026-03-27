export const CITY_WEATHER_DATA = {
  Bangalore: { temp: 24, humidity: 65, condition: 'Partly Cloudy' },
  Mumbai: { temp: 31, humidity: 78, condition: 'Humid' },
  Delhi: { temp: 35, humidity: 45, condition: 'Sunny' },
  Hyderabad: { temp: 32, humidity: 55, condition: 'Clear' },
  Pune: { temp: 28, humidity: 60, condition: 'Cloudy' },
  Chennai: { temp: 34, humidity: 75, condition: 'Sunny' },
  Kolkata: { temp: 33, humidity: 80, condition: 'Thunderstorm' },
  Jaipur: { temp: 38, humidity: 30, condition: 'Sunny' },
  Ahmedabad: { temp: 36, humidity: 40, condition: 'Clear' },
  Surat: { temp: 35, humidity: 65, condition: 'Cloudy' },
  Lucknow: { temp: 34, humidity: 50, condition: 'Clear' },
  Kanpur: { temp: 35, humidity: 48, condition: 'Sunny' },
  Nagpur: { temp: 37, humidity: 42, condition: 'Clear' },
  Indore: { temp: 32, humidity: 50, condition: 'Partly Cloudy' },
  Bhopal: { temp: 33, humidity: 52, condition: 'Cloudy' },
  Visakhapatnam: { temp: 31, humidity: 82, condition: 'Rainy' },
  Patna: { temp: 33, humidity: 60, condition: 'Haze' },
  Vadodara: { temp: 36, humidity: 45, condition: 'Clear' },
  Ludhiana: { temp: 34, humidity: 40, condition: 'Sunny' },
  Agra: { temp: 37, humidity: 35, condition: 'Clear' },
  Nashik: { temp: 29, humidity: 58, condition: 'Cloudy' },
  Ranchi: { temp: 30, humidity: 65, condition: 'Thunderstorm' },
  Guwahati: { temp: 29, humidity: 85, condition: 'Rainy' },
  Chandigarh: { temp: 32, humidity: 50, condition: 'Sunny' },
  Thiruvananthapuram: { temp: 30, humidity: 85, condition: 'Rainy' },
  Coimbatore: { temp: 31, humidity: 60, condition: 'Partly Cloudy' },
  Kochi: { temp: 30, humidity: 82, condition: 'Rainy' },
  Bhubaneswar: { temp: 34, humidity: 75, condition: 'Cloudy' },
  Dehradun: { temp: 28, humidity: 55, condition: 'Clear' },
  Panaji: { temp: 31, humidity: 78, condition: 'Partly Cloudy' },
  Shimla: { temp: 18, humidity: 65, condition: 'Mist' },
  Gangtok: { temp: 16, humidity: 70, condition: 'Cloudy' },
  Shillong: { temp: 19, humidity: 75, condition: 'Rainy' },
  Aizawl: { temp: 22, humidity: 80, condition: 'Cloudy' },
  Imphal: { temp: 24, humidity: 72, condition: 'Partly Cloudy' },
  Agartala: { temp: 32, humidity: 78, condition: 'Rainy' },
  Kohima: { temp: 20, humidity: 70, condition: 'Cloudy' },
  Itanagar: { temp: 23, humidity: 75, condition: 'Rainy' },
  Raipur: { temp: 36, humidity: 45, condition: 'Clear' },
  Jamshedpur: { temp: 35, humidity: 50, condition: 'Sunny' },
  Faridabad: { temp: 36, humidity: 42, condition: 'Clear' },
  Jodhpur: { temp: 39, humidity: 25, condition: 'Sunny' },
}

// Fallback for cities not explicitly listed
export const getCityWeather = (cityName) => {
  if (CITY_WEATHER_DATA[cityName]) {
    return CITY_WEATHER_DATA[cityName];
  }
  
  // Consistent pseudo-random fallback based on string length and char codes
  const seed = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const temp = 22 + (seed % 17); // 22 to 38
  const humidity = 30 + (seed % 55); // 30 to 84
  const conditions = ['Clear', 'Cloudy', 'Rainy', 'Sunny', 'Thunderstorm', 'Mist'];
  const condition = conditions[seed % conditions.length];
  
  return { temp, humidity, condition };
}
